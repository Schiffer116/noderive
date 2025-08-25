import { and, eq, isNull, sql } from "drizzle-orm";

import { directory, file } from "../db/schema.js";
import { utapi } from "./uploadthing.js";
import z from "zod";
import { protectedProcedure, router } from "../trpc.js";
import { TRPCError } from "@trpc/server";

const directoryOwnerProcedure = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .use(async ({ input, ctx, next }) => {
    const { id } = input;

    const directoryRecord = await ctx.db.query.directory.findFirst({
      columns: {
        id: true,
        ownerId: true,
        name: true,
      },
      where: eq(directory.id, id),
    });

    if (!directoryRecord) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Directory not found' });
    }
    if (directoryRecord.ownerId !== ctx.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' });
    }

    return next({
      ctx: {
        ...ctx,
        directory: directoryRecord,
      },
    });
  })

const directoryDescendantKeysProcedure = directoryOwnerProcedure
  .use(async ({ ctx, next }) => {
    const result = await ctx.db.execute<{ key: string }>(sql`
      WITH RECURSIVE dir_tree AS (
        SELECT id
        FROM directory
        WHERE id = ${ctx.directory.id}

        UNION ALL

        SELECT d.id
        FROM directory d
        INNER JOIN dir_tree dt ON d.parent_id = dt.id
      )
      SELECT f.key
      FROM file f
      INNER JOIN dir_tree dt ON f.parent_id = dt.id
    `);

    const keys = result.rows.map(r => r.key as string);
    return next({
      ctx: {
        directory: {
          ...ctx.directory,
          descendantKeys: keys,
        }
      }
    })
  });

const directoryRouter = router({
  getRoot: protectedProcedure
    .query(async ({ ctx }) => {
      const { userId } = ctx;
      const root = await ctx.db.query.directory.findFirst({
        columns: { id: true, },
        where: and(
          isNull(directory.parentId),
          eq(directory.ownerId, userId),
        )
      });

      if (!root) throw new TRPCError({ code: 'NOT_FOUND' });

      return root;
    }),

  getChildren: directoryOwnerProcedure
    .query(async ({ ctx }) => {
      const dirs = await ctx.db.query.directory.findMany({
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
        extras: {
          type: sql<'directory'>`'directory'`.as('type'),
        },
        where: eq(directory.parentId, ctx.directory.id),
      })

      const files = await ctx.db.query.file.findMany({
        columns: {
          id: true,
          name: true,
          size: true,
          createdAt: true,
        },
        extras: {
          type: sql<'file'>`'file'`.as('type'),
        },
        where: eq(file.parentId, ctx.directory.id),
      })

      type Directory = typeof dirs[number];
      type File = typeof files[number];
      type DriveItem = Directory | File;

      const children: DriveItem[] = [...dirs, ...files];
      return children;
    }),

  getPath: directoryOwnerProcedure
    .query(async ({ ctx }) => {
      const path = await ctx.db.execute<{ id: string, name: string }>(sql`
        WITH RECURSIVE path AS (
          SELECT id, name, parent_id FROM directory WHERE id = ${ctx.directory.id}
          UNION ALL
          SELECT d.id, d.name, d.parent_id
          FROM directory d
          INNER JOIN path p ON p.parent_id = d.id
        )
        SELECT id, name FROM path;
      `);

      return path.rows.reverse();
    }),

  createChild: directoryOwnerProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      const {
        directory: { id: parentId },
        userId: ownerId,
        db,
      } = ctx;

      await db.insert(directory).values({ name, parentId, ownerId });
      return { message: 'Directory created' };
    }),

  delete: directoryDescendantKeysProcedure
    .mutation(async ({ ctx }) => {
      const {
        directory: { id, descendantKeys },
        db
      } = ctx;

      try {
        await db.transaction(async (tx) => {
          const result = await Promise.all([
            utapi.deleteFiles(descendantKeys),
            tx.delete(directory).where(eq(directory.id, id)),
          ]);
          if (!result[0].success) {
            tx.rollback();
          }
        });
      } catch (e: any) {
        console.log(e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        });
      }

      return { message: 'Directory deleted' };
    }),

  rename: directoryOwnerProcedure
    .input(z.object({ newName: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { newName } = input;
      const {
        directory: { id },
        db,
      } = ctx;

      await db.update(directory).set({ name: newName }).where(eq(directory.id, id));
      return { message: 'Directory renamed' };
    }),
});

export default directoryRouter;

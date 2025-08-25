import { eq } from 'drizzle-orm';
import z from 'zod';
import { TRPCError } from '@trpc/server';

import { file } from '../db/schema.js';
import { utapi } from '../controllers/uploadthing.js';
import { protectedProcedure, router } from '../trpc.js';

const fileOwnerProcedure = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .use(async ({ input, ctx, next }) => {
    const { id } = input;

    const fileRecord = await ctx.db.query.file.findFirst({
      columns: {
        id: true,
        key: true,
        ownerId: true,
        name: true,
      },
      where: eq(file.id, id)
    });

    if (!fileRecord) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
    }
    if (fileRecord.ownerId !== ctx.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' });
    }

    return next({
      ctx: {
        ...ctx,
        file: fileRecord,
      },
    });
  })

const fileRouter = router({
  rename: fileOwnerProcedure
    .input(z.object({ newName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, newName } = input;
      if (ctx.file.name === newName) {
        return { message: 'File name not changed' };
      }

      await ctx.db.update(file).set({ name: newName }).where(eq(file.id, id));
      return { message: 'File renamed' };
    }),

  delete: fileOwnerProcedure
    .mutation(async ({ ctx }) => {
      const { id, key } = ctx.file;
      const { success } = await utapi.deleteFiles(key);
      if (!success) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }

      ctx.db.delete(file).where(eq(file.id, id));
      return { message: 'File deleted' };
    }),
});

export default fileRouter;

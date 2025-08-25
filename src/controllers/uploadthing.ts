import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { UploadThingError, UTApi } from "uploadthing/server";

import db from '../db/db.js';
import { directory, file } from '../db/schema.js';
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const uploadRouter = {
  fileUploader: f({
    blob: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .input(z.object({ parentId: z.string() }))
    .middleware(async ({ input, req }) => {
      const { userId } = getAuth(req);
      const { parentId } = input;

      const parentDir = await db.query.directory.findFirst({
        columns: {
          id: true,
          ownerId: true,
        },
        where: eq(directory.id, parentId),
      });

      if (!parentDir) {
        throw new UploadThingError("Parent directory not found");
      }
      if (parentDir.ownerId !== userId) {
        throw new UploadThingError("Forbidden");
      }

      return { ownerId: userId, parentId };
    })
    .onUploadComplete(async ({ metadata, file: newFile }: any) => {
      const { ownerId, parentId } = metadata;
      const { name, size, key } = newFile;
      await db.insert(file).values({ name, key, size, ownerId, parentId });
    })
} satisfies FileRouter;

export const utapi = new UTApi();

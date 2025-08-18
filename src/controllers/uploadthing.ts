import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

import db from '../db/db.js';
import { file } from '../db/schema.js';

const f = createUploadthing();

async function insertFile(name: string, parent: string, key: string) {
  await db.insert(file).values({ name, key, parent })
}

export const uploadRouter = {
  fileUploader: f({
    blob: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
  .input(z.object({ parent: z.string() }))
  .middleware(async ({ input }) => {
    return input;
  })
  .onUploadComplete(({ metadata, file }: any) => {
    const { parent } = metadata;
    insertFile(file.name, parent, file.key);
  })
} satisfies FileRouter;

export const utapi = new UTApi({});


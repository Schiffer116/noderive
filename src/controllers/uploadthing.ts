import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";

import db from '../db/db.js';
import { file } from '../db/schema.js';

const f = createUploadthing();

async function insertFile(name: string, parent: string, url: string) {
  await db.insert(file).values({ name, url, parent })
}

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
  .input(z.object({ parent: z.string() }))
  .middleware(async ({ input }) => {
    return { parent: input };
  })
  .onUploadComplete(({ metadata, file }: any) => {
    console.log("metadata: ", metadata);
    console.log("file: ", file);
    const { parent } = metadata;
    insertFile(file.name, parent, file.ufsUrl);
  })
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

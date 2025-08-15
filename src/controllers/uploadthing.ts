import { createUploadthing, type FileRouter } from "uploadthing/express";
import { z } from "zod";

import db from '../db/db.ts';
import { file } from '../db/schema.ts';

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
  .onUploadComplete(({ metadata, file,  }) => {
    console.log("AHAHAHAHAHAHAHAHAHAHA");
    const { parent } = metadata!;
    insertFile(file.name, parent, file.ufsUrl);
  })
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

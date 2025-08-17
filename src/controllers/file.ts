import { Router } from 'express';
import { eq } from 'drizzle-orm';

import db from '../db/db.js';
import { file } from '../db/schema.js';

const router = Router();

async function getFilesForUUID(uuid: string) {
  return await db.select({
      id: file.id,
      name: file.name,
      url: file.url
    })
    .from(file)
    .where(eq(file.parent, uuid));
}

async function renameFile(id: number, name: string) {
  await db.update(file).set({ name }).where(eq(file.id, id));
}

router.get('/file/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  res.json(await getFilesForUUID(uuid));
});

router.patch("/file", async (req, res) => {
  try {
    const { id, name } = req.body;
    renameFile(id, name);
    res.status(200).json({ message: 'Directory updated' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
    return;
  }
});


export default router;

import { Router } from 'express';
import { eq } from 'drizzle-orm';

import db from '../db/db.js';
import { file } from '../db/schema.js';
import { utapi } from '../controllers/uploadthing.js';

const router = Router();

router.get('/file/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  const files = await db.select({
      id: file.id,
      name: file.name,
      key: file.key
    })
    .from(file)
    .where(eq(file.parent, uuid));

  res.json(files);
});

router.patch("/file", async (req, res) => {
  try {
    const { id, name } = req.body;
    await db.update(file).set({ name }).where(eq(file.id, id));
    res.status(200).json({ message: 'File renamed' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/file", async (req, res) => {
  try {
    const { id, key } = req.body;
    await db.delete(file).where(eq(file.id, id));
    await utapi.deleteFiles(key);
    res.status(200).json({ message: 'File deleted' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;

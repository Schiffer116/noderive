import { Router } from 'express';
import { eq } from 'drizzle-orm';

import db from '../db/db.ts';
import { file } from '../db/schema.ts';

const router = Router();

router.get('/file/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  const children = await db.select({
      id: file.id,
      name: file.name,
      url: file.url
    })
    .from(file)
    .where(eq(file.parent, uuid));

  res.json(children);
});

router.patch("/file", async (req, res) => {
  try {
    const { id, name } = req.body;
    await db.update(file).set({ name }).where(eq(file.id, id));
    res.status(200).json({ message: 'Directory updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }
});


export default router;

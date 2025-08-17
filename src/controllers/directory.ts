import { Router } from "express";
import { eq } from "drizzle-orm";

import { directory } from "../db/schema.js";
import db from "../db/db.js";

const router = Router();

router.get('/directory/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  const children = await db.select({
    id: directory.id,
    name: directory.name,
  })
    .from(directory)
    .where(eq(directory.parent, uuid));

  res.json(children);
});

router.delete("/directory", async (req, res) => {
  try {
    const { id } = req.body;
    await db.delete(directory).where(eq(directory.id, id));
    res.status(200).json({ message: 'Directory deleted' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
    return;
  }
});

router.post("/directory", async (req, res) => {
  try {
    const { name, parent } = req.body;
    console.log(name, parent);
    await db.insert(directory).values({ name, parent });
    console.log("Created directory: " + name);
    res.status(200).json({ message: 'Directory created' });;
  } catch (e: any) {
    res.status(400).json({ error: e.message });
    return;
  }
});

router.patch("/directory", async (req, res) => {
  try {
    const { id, name } = req.body;
    await db.update(directory).set({ name }).where(eq(directory.id, id));
    res.status(200).json({ message: 'Directory updated' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
    return;
  }
});

export default router;

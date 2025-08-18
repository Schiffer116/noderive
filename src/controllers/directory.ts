import { Router } from "express";
import { eq, sql } from "drizzle-orm";

import { directory } from "../db/schema.js";
import db from "../db/db.js";
import { utapi } from "./uploadthing.js";

const router = Router();

router.get('/directory/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  const children = await db.select({
    id: directory.id,
    name: directory.name,
    createdAt: directory.createdAt,
  })
    .from(directory)
    .where(eq(directory.parent, uuid));

  res.json(children);
});

router.delete("/directory", async (req, res) => {
  try {
    const { id } = req.body;
    const keys = await getAllDescendantKeys(id);
    await Promise.all([
      db.delete(directory).where(eq(directory.id, id)),
      utapi.deleteFiles(keys),
    ])
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

async function getAllDescendantKeys(uuid: string) {
  const result = await db.execute(sql`
    WITH RECURSIVE dir_tree AS (
      SELECT id
      FROM directory
      WHERE id = ${uuid}

      UNION ALL

      SELECT d.id
      FROM directory d
      INNER JOIN dir_tree dt ON d.parent = dt.id
    )
    SELECT f.key
    FROM file f
    INNER JOIN dir_tree dt ON f.parent = dt.id
  `);

  return result.rows.map(r => r.key as string);
}

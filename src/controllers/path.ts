import { Router } from 'express';
import { sql } from 'drizzle-orm';

import db from '../db/db.js';

const router = Router();

router.get('/path/:directoryUUID', async (req, res) => {
  const uuid = req.params.directoryUUID
  const path = await db.execute<{ id: string, name: string }>(sql`
    WITH RECURSIVE path AS (
      SELECT id, name, parent FROM directory WHERE id = ${uuid}
      UNION ALL
      SELECT d.id, d.name, d.parent
      FROM directory d
      INNER JOIN path p ON p.parent = d.id
    )
    SELECT id, name FROM path;
  `);

  res.json(path.rows.reverse());
});

export default router;

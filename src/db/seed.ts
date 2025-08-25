import { account, directory } from './schema.js';
import { randomUUID } from 'crypto';
import { reset } from "drizzle-seed";

import db from './db.js';
import * as schema from './schema.js';

const main = async () => {
  await reset(db, schema);
  const [user] = await db.insert(account)
    .values({ id: "user_31VNa2L7xWS6lVvlQV4fUayKZQQ", username: 'Alice' })
    .returning();

  const rootId = "26fa4c76-28c6-489b-90cf-6b10f31a34cd";
  await db.insert(directory).values({
    id: rootId,
    name: 'Alice Drive',
    ownerId: user.id,
  });

  const subdirs = ['Documents', 'Photos', 'Music'].map((name) => ({
    id: randomUUID(),
    name,
    ownerId: user.id,
    parentId: rootId,
  }));

  await db.insert(directory).values(subdirs);
};

main()

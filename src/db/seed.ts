import { account, directory, drive, file } from './schema.js';
import { randomUUID } from 'crypto';
import { reset } from "drizzle-seed";

import db from './db.js';
import * as schema from './schema.js';

const main = async () => {
  await reset(db, schema);
  const [user] = await db.insert(account)
    .values({ name: 'Alice' })
    .returning();

  const rootId = randomUUID();
  await db.insert(directory).values({
    id: rootId,
    name: 'Alice Drive',
    parent: null,
  });

  await db.insert(drive).values({
    root: rootId,
    owner: user.id,
  });

  const subdirs = ['Documents', 'Photos', 'Music'].map((name) => ({
    id: randomUUID(),
    name,
    parent: rootId,
  }));

  await db.insert(directory).values(subdirs);

  await db.insert(file).values([
    {
      name: 'lion.jpeg',
      key: 'KnfNP1qD3yiEHab8oJCucxjQW0OGvIReqHXP25sLYrktynM1',
      parent: rootId,
    },
    {
      name: 'cat.jpg',
      key: 'KnfNP1qD3yiEpacTdLOWO5JGB4AVnIKdHuMPrUSFws6iCbcek',
      parent: rootId,
    },
  ]);

};

main()

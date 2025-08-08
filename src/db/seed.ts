import { drizzle } from 'drizzle-orm/node-postgres';
import { account, directory, drive, file } from './schema';
import { randomUUID } from 'crypto';

import db from './db';

const main = async () => {
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
      url: 'https://images.squarespace-cdn.com/content/v1/5b061f0e0dbda31446baccc0/1527893082224-1QNG73UB18IXT2MF3XNV/image-asset.jpeg?format=2500w',
      parent: rootId,
    },
    {
      name: 'cat.jpg',
      url: 'https://www.rover.com/blog/wp-content/uploads/2020/10/Domestic_Shorthair-1024x576.jpg',
      parent: rootId,
    },
  ]);

};

main()

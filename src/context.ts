import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getAuth } from '@clerk/express';
import db from './db/db.js';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const { userId } = getAuth(req);
  return { req, res, db, userId };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

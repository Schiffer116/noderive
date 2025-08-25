import {
  uuid,
  pgTable,
  text,
  integer,
  timestamp,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

export const account = pgTable("account", {
  id: text().primaryKey(),
  username: text().notNull(),
});

export const directory = pgTable("directory", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  ownerId: text().notNull().references(() => account.id),
  parentId: uuid().references((): AnyPgColumn => directory.id, { onDelete: "cascade" }),
});

export const file = pgTable("file", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  key: text().notNull(),
  size: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  ownerId: text().notNull().references(() => account.id),
  parentId: uuid().notNull().references(() => directory.id, { onDelete: "cascade" }),
});


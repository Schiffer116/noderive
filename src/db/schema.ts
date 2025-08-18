import {
  uuid,
  pgTable,
  serial,
  text,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

export const account = pgTable('account', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const directory = pgTable('directory', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parent: uuid('parent')
    .references((): AnyPgColumn => directory.id, { onDelete: 'cascade' }),
});

export const file = pgTable('file', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull(),
  parent: uuid('parent')
    .notNull()
    .references(() => directory.id, { onDelete: 'cascade' }),
});

export const drive = pgTable('drive', {
  id: serial('id').primaryKey(),
  root: uuid('root')
    .notNull()
    .references(() => directory.id, { onDelete: 'cascade' }),
  owner: integer('owner')
    .notNull()
    .references(() => account.id, { onDelete: 'cascade' }),
});

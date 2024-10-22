import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const facts = pgTable('facts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});
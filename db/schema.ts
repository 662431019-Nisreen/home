import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const expenses = sqliteTable('expenses', {
 id: text('id').primaryKey(), userId: text('user_id').notNull(), date: text('date').notNull(),
 title: text('title').notNull(), amount: integer('amount_satang').notNull(),
 category: text('category').notNull(), recipient: text('recipient').notNull().default(''),
 note: text('note').notNull().default(''), createdAt: text('created_at').notNull(),
}, table => [index('expenses_user_date').on(table.userId, table.date)]);

import {
  PgColumn,
  pgTable,
  PgTableWithColumns,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { Many, relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), //clerk id
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  imageUrl: text('image_url'),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  product_id: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

//Relations define how tables connect to each other. This  enables Drizzle's query API
//to automatically join related data when ysing `with : {relationName: true}` in a query

//User relations: A user can have many products and many comments
//many() means one user can have multiple related records

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}));

//Products Relations : a product belongs to one user and can have many comments
//`one()` means a single related record, `many()` means multiple related records

export const productsRelations = relations(products, ({ one }) => ({
  comments: many(comments),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));

//Comments Relations: A comment belongs to one user and one product
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.user_id], references: [users.id] }),
  product: one(products, {
    fields: [comments.product_id],
    references: [products.id],
  }),
}));

// Type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

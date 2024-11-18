import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

import user from "./user.js";

// todo: add intex on userId

const tasksTable = pgTable("task", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

export default tasksTable;

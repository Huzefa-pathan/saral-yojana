import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const schemes = pgTable("schemes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull().unique(),
  publishedDate: timestamp("published_date", { withTimezone: true }),
  source: text("source").notNull(),
  relevanceScore: integer("relevance_score").notNull().default(0),
  districtDetected: text("district_detected"),
  categoryDetected: text("category_detected"),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({
  fetchedAt: true,
});

export const selectSchemeSchema = createSelectSchema(schemes);

export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;

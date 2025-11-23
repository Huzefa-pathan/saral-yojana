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
  category: text("category").notNull(),
  district: text("district"),
  source: text("source").notNull().default("Central"),
  description: text("description").notNull(),
  fullDescription: text("full_description").notNull(),
  eligibility: text("eligibility").array().notNull().default(sql`ARRAY[]::text[]`),
  benefits: text("benefits").array().notNull().default(sql`ARRAY[]::text[]`),
  documentsRequired: text("documents_required").array().notNull().default(sql`ARRAY[]::text[]`),
  applyMode: text("apply_mode").notNull().default("online"),
  applyOnlineLink: text("apply_online_link"),
  applyOfflineInfo: text("apply_offline_info"),
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({});

export const selectSchemeSchema = createSelectSchema(schemes);

export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;

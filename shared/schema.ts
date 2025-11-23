import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, uuid } from "drizzle-orm/pg-core";
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
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  district: text("district"),
  source: text("source").notNull().default("central"),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  applyMode: text("apply_mode").notNull().default("online"),
  applyOnlineLink: text("apply_online_link"),
  applyOfflineInfo: text("apply_offline_info"),
});

export const schemeEligibility = pgTable("scheme_eligibility", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeId: varchar("scheme_id").notNull().references(() => schemes.id),
  text: text("text").notNull(),
});

export const schemeBenefits = pgTable("scheme_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeId: varchar("scheme_id").notNull().references(() => schemes.id),
  text: text("text").notNull(),
});

export const schemeDocuments = pgTable("scheme_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeId: varchar("scheme_id").notNull().references(() => schemes.id),
  text: text("text").notNull(),
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({
  id: true,
});

export const selectSchemeSchema = createSelectSchema(schemes);

export type InsertScheme = z.infer<typeof insertSchemeSchema> & { id: string };
export type Scheme = typeof schemes.$inferSelect;
export type SchemeEligibility = typeof schemeEligibility.$inferSelect;
export type SchemeBenefit = typeof schemeBenefits.$inferSelect;
export type SchemeDocument = typeof schemeDocuments.$inferSelect;

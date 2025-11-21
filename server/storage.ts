import { type User, type InsertUser, type Scheme, type InsertScheme } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, schemes } from "@shared/schema";
import { eq, ilike, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scheme operations
  upsertScheme(scheme: InsertScheme): Promise<Scheme>;
  listSchemes(params: {
    page?: number;
    size?: number;
    district?: string;
    category?: string;
    q?: string;
  }): Promise<{ schemes: Scheme[]; total: number }>;
  getSchemeById(id: string): Promise<Scheme | undefined>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertScheme(scheme: InsertScheme): Promise<Scheme> {
    const [upserted] = await db
      .insert(schemes)
      .values(scheme)
      .onConflictDoUpdate({
        target: schemes.link,
        set: {
          title: scheme.title,
          description: scheme.description,
          publishedDate: scheme.publishedDate,
          source: scheme.source,
          relevanceScore: scheme.relevanceScore,
          districtDetected: scheme.districtDetected,
          categoryDetected: scheme.categoryDetected,
          fetchedAt: sql`now()`,
        },
      })
      .returning();
    return upserted;
  }

  async listSchemes(params: {
    page?: number;
    size?: number;
    district?: string;
    category?: string;
    q?: string;
  }): Promise<{ schemes: Scheme[]; total: number }> {
    const { page = 1, size = 20, district, category, q } = params;
    const conditions = [];

    if (district) {
      conditions.push(eq(schemes.districtDetected, district));
    }

    if (category) {
      conditions.push(eq(schemes.categoryDetected, category));
    }

    if (q) {
      conditions.push(
        sql`(${schemes.title} ILIKE ${`%${q}%`} OR ${schemes.description} ILIKE ${`%${q}%`})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schemes)
      .where(whereClause);

    const total = Number(countResult.count);

    const offset = (page - 1) * size;
    const schemesList = await db
      .select()
      .from(schemes)
      .where(whereClause)
      .orderBy(desc(schemes.fetchedAt))
      .limit(size)
      .offset(offset);

    return { schemes: schemesList, total };
  }

  async getSchemeById(id: string): Promise<Scheme | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    return scheme;
  }
}

export const storage = new PostgresStorage();

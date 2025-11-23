import { type User, type InsertUser, type Scheme, type SchemeEligibility, type SchemeBenefit, type SchemeDocument } from "@shared/schema";
import { db } from "./db";
import { users, schemes, schemeEligibility, schemeBenefits, schemeDocuments } from "@shared/schema";
import { eq, ilike, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scheme operations with normalized data
  insertScheme(scheme: { id: string; title: string; category: string; district?: string | null; source: string; description: string; fullDescription?: string | null; applyMode: string; applyOnlineLink?: string | null; applyOfflineInfo?: string | null; eligibility: string[]; benefits: string[]; documents: string[] }): Promise<void>;
  listSchemes(params: {
    page?: number;
    size?: number;
    district?: string;
    category?: string;
    q?: string;
  }): Promise<{ schemes: Array<Scheme & { eligibility: SchemeEligibility[]; benefits: SchemeBenefit[]; documents: SchemeDocument[] }>; total: number }>;
  getSchemeById(id: string): Promise<(Scheme & { eligibility: SchemeEligibility[]; benefits: SchemeBenefit[]; documents: SchemeDocument[] }) | undefined>;
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

  async insertScheme(schemeData: { 
    id: string; 
    title: string; 
    category: string; 
    district?: string | null; 
    source: string; 
    description: string; 
    fullDescription?: string | null; 
    applyMode: string; 
    applyOnlineLink?: string | null; 
    applyOfflineInfo?: string | null; 
    eligibility: string[]; 
    benefits: string[]; 
    documents: string[] 
  }): Promise<void> {
    // Check if scheme exists
    const existing = await db.select().from(schemes).where(eq(schemes.id, schemeData.id));
    
    // If exists, skip (avoid duplicates)
    if (existing.length > 0) {
      return;
    }

    // Insert main scheme
    await db.insert(schemes).values({
      id: schemeData.id,
      title: schemeData.title,
      category: schemeData.category,
      district: schemeData.district || null,
      source: schemeData.source,
      description: schemeData.description,
      fullDescription: schemeData.fullDescription || schemeData.description,
      applyMode: schemeData.applyMode,
      applyOnlineLink: schemeData.applyOnlineLink || null,
      applyOfflineInfo: schemeData.applyOfflineInfo || null,
    });

    // Insert eligibility items
    if (schemeData.eligibility.length > 0) {
      await db.insert(schemeEligibility).values(
        schemeData.eligibility.map(text => ({
          schemeId: schemeData.id,
          text,
        }))
      );
    }

    // Insert benefits
    if (schemeData.benefits.length > 0) {
      await db.insert(schemeBenefits).values(
        schemeData.benefits.map(text => ({
          schemeId: schemeData.id,
          text,
        }))
      );
    }

    // Insert documents
    if (schemeData.documents.length > 0) {
      await db.insert(schemeDocuments).values(
        schemeData.documents.map(text => ({
          schemeId: schemeData.id,
          text,
        }))
      );
    }
  }

  async listSchemes(params: {
    page?: number;
    size?: number;
    district?: string;
    category?: string;
    q?: string;
  }): Promise<{ schemes: Array<Scheme & { eligibility: SchemeEligibility[]; benefits: SchemeBenefit[]; documents: SchemeDocument[] }>; total: number }> {
    const { page = 1, size = 20, district, category, q } = params;
    const conditions = [];

    if (district && district !== "all") {
      conditions.push(eq(schemes.district, district));
    }

    if (category) {
      conditions.push(eq(schemes.category, category));
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
      .orderBy(desc(schemes.id))
      .limit(size)
      .offset(offset);

    // Fetch related data for each scheme
    const schemesWithData = await Promise.all(
      schemesList.map(async (scheme) => {
        const eligibility = await db.select().from(schemeEligibility).where(eq(schemeEligibility.schemeId, scheme.id));
        const benefits = await db.select().from(schemeBenefits).where(eq(schemeBenefits.schemeId, scheme.id));
        const documents = await db.select().from(schemeDocuments).where(eq(schemeDocuments.schemeId, scheme.id));
        return { ...scheme, eligibility, benefits, documents };
      })
    );

    return { schemes: schemesWithData, total };
  }

  async getSchemeById(id: string): Promise<(Scheme & { eligibility: SchemeEligibility[]; benefits: SchemeBenefit[]; documents: SchemeDocument[] }) | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    
    if (!scheme) {
      return undefined;
    }

    const eligibility = await db.select().from(schemeEligibility).where(eq(schemeEligibility.schemeId, id));
    const benefits = await db.select().from(schemeBenefits).where(eq(schemeBenefits.schemeId, id));
    const documents = await db.select().from(schemeDocuments).where(eq(schemeDocuments.schemeId, id));

    return { ...scheme, eligibility, benefits, documents };
  }
}

export const storage = new PostgresStorage();

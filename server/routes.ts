import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { seedAllSchemes } from "./seedSchemes";
import { db } from "./db";
import { schemes, schemeEligibility, schemeBenefits, schemeDocuments } from "@shared/schema";
import { asc, eq } from "drizzle-orm";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

const ADMIN_TOKEN_EXPIRY = "4h";

type AdminSchemePayload = {
  id?: string;
  title: string;
  category: string;
  district?: string | null;
  source: "state" | "central";
  description: string;
  fullDescription?: string | null;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applyMode: string;
  applyOnlineLink?: string | null;
  applyOfflineInfo?: string | null;
};

function ensureAdminConfig(): string | undefined {
  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    return "Admin authentication is not configured";
  }
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
}

function parseSchemePayload(body: any): AdminSchemePayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload");
  }

  const sourceRaw = typeof body.source === "string" ? body.source.toLowerCase() : undefined;
  if (sourceRaw !== "state" && sourceRaw !== "central") {
    throw new Error("source must be 'state' or 'central'");
  }

  return {
    id: typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined,
    title: requireString(body.title, "title"),
    category: requireString(body.category, "category"),
    district: optionalString(body.district),
    source: sourceRaw,
    description: requireString(body.description, "description"),
    fullDescription: optionalString(body.fullDescription) ?? requireString(body.description, "description"),
    eligibility: toStringArray(body.eligibility),
    benefits: toStringArray(body.benefits),
    documents: toStringArray(body.documents ?? body.documentsRequired),
    applyMode: requireString(body.applyMode, "applyMode"),
    applyOnlineLink: optionalString(body.applyOnlineLink),
    applyOfflineInfo: optionalString(body.applyOfflineInfo),
  };
}

async function buildAdminSchemeResponse(id: string) {
  const record = await storage.getSchemeById(id);
  if (!record) {
    return undefined;
  }

  return {
    id: record.id,
    title: record.title,
    category: record.category,
    district: record.district,
    source: record.source,
    description: record.description,
    fullDescription: record.fullDescription,
    applyMode: record.applyMode,
    applyOnlineLink: record.applyOnlineLink,
    applyOfflineInfo: record.applyOfflineInfo,
    eligibility: record.eligibility.map((item) => item.text),
    benefits: record.benefits.map((item) => item.text),
    documents: record.documents.map((item) => item.text),
  };
}

export function verifyAdminJWT(req: Request, res: Response, next: NextFunction) {
  const configError = ensureAdminConfig();
  if (configError) {
    return res.status(500).json({ message: configError });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    jwt.verify(token, SESSION_SECRET as string);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // GET /api/schemes - List schemes with pagination and filters
  app.get("/api/schemes", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 20;
      const district = req.query.district as string | undefined;
      const category = req.query.category as string | undefined;
      const q = req.query.q as string | undefined;

      const result = await storage.listSchemes({
        page,
        size,
        district,
        category,
        q,
      });

      res.json({
        total: result.total,
        page,
        size,
        schemes: result.schemes,
      });
    } catch (error) {
      console.error("Error fetching schemes:", error);
      res.status(500).json({ error: "Failed to fetch schemes" });
    }
  });

  // GET /api/scheme/:id - Get single scheme by ID
  app.get("/api/scheme/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const scheme = await storage.getSchemeById(id);

      if (!scheme) {
        return res.status(404).json({ error: "Scheme not found" });
      }

      res.json(scheme);
    } catch (error) {
      console.error("Error fetching scheme:", error);
      res.status(500).json({ error: "Failed to fetch scheme" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const configError = ensureAdminConfig();
    if (configError) {
      return res.status(500).json({ message: configError });
    }

    const { password } = req.body as { password?: string };
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ role: "admin" }, SESSION_SECRET as string, {
      expiresIn: ADMIN_TOKEN_EXPIRY,
    });
    res.json({ token });
  });

  const adminRouter = express.Router();
  adminRouter.use(verifyAdminJWT);

  adminRouter.get("/schemes", async (_req, res) => {
    const list = await db
      .select({
        id: schemes.id,
        title: schemes.title,
        category: schemes.category,
        district: schemes.district,
        source: schemes.source,
      })
      .from(schemes)
      .orderBy(asc(schemes.title));

    res.json({ schemes: list });
  });

  adminRouter.get("/scheme/:id", async (req, res) => {
    const scheme = await buildAdminSchemeResponse(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    res.json(scheme);
  });

  adminRouter.post("/scheme", async (req, res) => {
    let payload: AdminSchemePayload;
    try {
      payload = parseSchemePayload(req.body);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid payload";
      return res.status(400).json({ message });
    }

    const schemeId = payload.id ?? randomUUID();

    try {
      await db.transaction(async (tx) => {
        const [existing] = await tx
          .select({ id: schemes.id })
          .from(schemes)
          .where(eq(schemes.id, schemeId));

        if (existing) {
          throw Object.assign(new Error("Scheme ID already exists"), { statusCode: 409 });
        }

        await tx.insert(schemes).values({
          id: schemeId,
          title: payload.title,
          category: payload.category,
          district: payload.district,
          source: payload.source,
          description: payload.description,
          fullDescription: payload.fullDescription ?? payload.description,
          applyMode: payload.applyMode,
          applyOnlineLink: payload.applyOnlineLink,
          applyOfflineInfo: payload.applyOfflineInfo,
        });

        if (payload.eligibility.length > 0) {
          await tx.insert(schemeEligibility).values(
            payload.eligibility.map((text) => ({
              schemeId,
              text,
            }))
          );
        }

        if (payload.benefits.length > 0) {
          await tx.insert(schemeBenefits).values(
            payload.benefits.map((text) => ({
              schemeId,
              text,
            }))
          );
        }

        if (payload.documents.length > 0) {
          await tx.insert(schemeDocuments).values(
            payload.documents.map((text) => ({
              schemeId,
              text,
            }))
          );
        }
      });

      const scheme = await buildAdminSchemeResponse(schemeId);
      res.status(201).json(scheme);
    } catch (error: any) {
      const status = error?.statusCode || 500;
      const message = error instanceof Error ? error.message : "Failed to create scheme";
      res.status(status).json({ message });
    }
  });

  adminRouter.put("/scheme/:id", async (req, res) => {
    const { id } = req.params;
    let payload: AdminSchemePayload;

    try {
      payload = parseSchemePayload({ ...req.body, id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid payload";
      return res.status(400).json({ message });
    }

    try {
      const updated = await db.transaction(async (tx) => {
        const [existing] = await tx
          .select({ id: schemes.id })
          .from(schemes)
          .where(eq(schemes.id, id));

        if (!existing) {
          return false;
        }

        await tx
          .update(schemes)
          .set({
            title: payload.title,
            category: payload.category,
            district: payload.district,
            source: payload.source,
            description: payload.description,
            fullDescription: payload.fullDescription ?? payload.description,
            applyMode: payload.applyMode,
            applyOnlineLink: payload.applyOnlineLink,
            applyOfflineInfo: payload.applyOfflineInfo,
          })
          .where(eq(schemes.id, id));

        await tx.delete(schemeEligibility).where(eq(schemeEligibility.schemeId, id));
        await tx.delete(schemeBenefits).where(eq(schemeBenefits.schemeId, id));
        await tx.delete(schemeDocuments).where(eq(schemeDocuments.schemeId, id));

        if (payload.eligibility.length > 0) {
          await tx.insert(schemeEligibility).values(
            payload.eligibility.map((text) => ({
              schemeId: id,
              text,
            }))
          );
        }

        if (payload.benefits.length > 0) {
          await tx.insert(schemeBenefits).values(
            payload.benefits.map((text) => ({
              schemeId: id,
              text,
            }))
          );
        }

        if (payload.documents.length > 0) {
          await tx.insert(schemeDocuments).values(
            payload.documents.map((text) => ({
              schemeId: id,
              text,
            }))
          );
        }

        return true;
      });

      if (!updated) {
        return res.status(404).json({ message: "Scheme not found" });
      }

      const scheme = await buildAdminSchemeResponse(id);
      res.json(scheme);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update scheme";
      res.status(500).json({ message });
    }
  });

  adminRouter.delete("/scheme/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await db.transaction(async (tx) => {
        const [existing] = await tx
          .select({ id: schemes.id })
          .from(schemes)
          .where(eq(schemes.id, id));

        if (!existing) {
          return false;
        }

        await tx.delete(schemeEligibility).where(eq(schemeEligibility.schemeId, id));
        await tx.delete(schemeBenefits).where(eq(schemeBenefits.schemeId, id));
        await tx.delete(schemeDocuments).where(eq(schemeDocuments.schemeId, id));
        await tx.delete(schemes).where(eq(schemes.id, id));

        return true;
      });

      if (!deleted) {
        return res.status(404).json({ message: "Scheme not found" });
      }

      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete scheme";
      res.status(500).json({ message });
    }
  });

  app.use("/api/admin", adminRouter);

  const httpServer = createServer(app);

  // Seed database with local schemes on startup
  console.log("[Server] Seeding database with all schemes...");
  await seedAllSchemes();

  return httpServer;
}

import express, { type Express, type Response } from "express";
import { adminLogin, adminLogout, authenticateAdmin, checkAuthStatus } from "./auth";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { trackEvent, getAnalytics } from "./analytics";
import { seedAllSchemes } from "./seedSchemes";
import type { SchemeApplyMode, SchemeSource } from "@shared/schema";

type AdminSchemePayload = {
  id?: string;
  title: string;
  category: string;
  district?: string | null;
  source: SchemeSource;
  description: string;
  fullDescription?: string | null;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applyMode: SchemeApplyMode;
  applyOnlineLink?: string | null;
  applyOfflineInfo?: string | null;
};

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
  const applyMode = parseApplyMode(body.applyMode);

  return {
    id: typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined,
    title: requireString(body.title, "title"),
    category: requireString(body.category, "category"),
    district: optionalString(body.district),
    source: sourceRaw as SchemeSource,
    description: requireString(body.description, "description"),
    fullDescription: optionalString(body.fullDescription) ?? requireString(body.description, "description"),
    eligibility: toStringArray(body.eligibility),
    benefits: toStringArray(body.benefits),
    documents: toStringArray(body.documents ?? body.documentsRequired),
    applyMode,
    applyOnlineLink: optionalString(body.applyOnlineLink),
    applyOfflineInfo: optionalString(body.applyOfflineInfo),
  };
}

function parseApplyMode(value: unknown): SchemeApplyMode {
  if (typeof value !== "string") {
    throw new Error("applyMode must be provided");
  }
  const normalized = value.toLowerCase();
  if (normalized !== "online" && normalized !== "offline" && normalized !== "both") {
    throw new Error("applyMode must be 'online', 'offline', or 'both'");
  }
  return normalized as SchemeApplyMode;
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
    eligibility: [...record.eligibility],
    benefits: [...record.benefits],
    documents: [...record.documents],
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // GET /api/schemes - List schemes with pagination and filters
  app.get("/api/schemes", async (req, res) => {
    // Track page view for schemes page
    trackEvent("pageView");
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const size = req.query.size ? parseInt(req.query.size as string) : 20;
      const district = req.query.district as string | undefined;
      const category = req.query.category as string | undefined;
      const q = req.query.q as string | undefined;
      
      if (q) {
        trackEvent("schemeSearch");
      }

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

  // GET /api/reviews - List all reviews
  app.get("/api/reviews", async (_req, res) => {
    try {
      const reviews = await storage.listReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // POST /api/reviews - Submit a new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const { username, message } = req.body;
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }
      const review = await storage.addReview(username, message);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // GET /api/scheme/:id - Get single scheme by ID
  app.get("/api/scheme/:id", async (req, res) => {
    // Track page view for scheme details page
    trackEvent("pageView");
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

  app.post("/api/admin/login", adminLogin);
  app.post("/api/admin/logout", adminLogout);
  app.get("/api/admin/check", authenticateAdmin, checkAuthStatus);

  const adminRouter = express.Router();
  adminRouter.use(authenticateAdmin);
  
  adminRouter.get("/analytics", async (_req, res) => {
    try {
      const analytics = await getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  adminRouter.get("/schemes", async (_req, res) => {
    const result = await storage.listSchemes({
      page: 1,
      size: Number.MAX_SAFE_INTEGER,
    });

    const list = result.schemes
      .map((scheme) => ({
        id: scheme.id,
        title: scheme.title,
        category: scheme.category,
        district: scheme.district,
        source: scheme.source,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

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
      await storage.createScheme({
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
        eligibility: payload.eligibility,
        benefits: payload.benefits,
        documents: payload.documents,
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
      const updated = await storage.updateScheme(id, {
        title: payload.title,
        category: payload.category,
        district: payload.district,
        source: payload.source,
        description: payload.description,
        fullDescription: payload.fullDescription ?? payload.description,
        applyMode: payload.applyMode,
        applyOnlineLink: payload.applyOnlineLink,
        applyOfflineInfo: payload.applyOfflineInfo,
        eligibility: payload.eligibility,
        benefits: payload.benefits,
        documents: payload.documents,
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
      const deleted = await storage.deleteScheme(id);

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

  // Track initial site visit
  trackEvent("visit");

  // Seed database with local schemes on startup
  console.log("[Server] Seeding database with all schemes...");
  await seedAllSchemes();

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedLocalSchemes } from "./localSchemes";

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

  const httpServer = createServer(app);

  // Seed database with local schemes on startup
  console.log("[Server] Seeding database with local schemes...");
  await seedLocalSchemes();

  return httpServer;
}

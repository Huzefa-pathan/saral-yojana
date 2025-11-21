import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchAndUpsertAllFeeds } from "./rssFetcher";
import { seedDatabase } from "./seedData";

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

  // POST /api/fetch-now - Manual RSS fetch (protected with token)
  app.post("/api/fetch-now", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const adminToken = process.env.ADMIN_API_TOKEN;

      if (!adminToken || token !== adminToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Trigger fetch in background
      fetchAndUpsertAllFeeds().catch((error) => {
        console.error("Background RSS fetch error:", error);
      });

      res.json({ message: "RSS fetch started" });
    } catch (error) {
      console.error("Error triggering RSS fetch:", error);
      res.status(500).json({ error: "Failed to trigger RSS fetch" });
    }
  });

  const httpServer = createServer(app);

  // Seed database with sample data on startup
  console.log("[Server] Seeding database with sample schemes...");
  await seedDatabase();

  // Auto-refresh every 2 hours (RSS feeds - currently having connectivity issues)
  const TWO_HOURS = 1000 * 60 * 60 * 2;
  
  // Initial RSS fetch attempt on startup (will fail gracefully if feeds are unavailable)
  console.log("[Server] Attempting initial RSS fetch...");
  fetchAndUpsertAllFeeds().catch((error) => {
    console.error("[Server] RSS feeds unavailable:", error.message);
  });

  // Schedule periodic RSS fetches (will fail gracefully if feeds are unavailable)
  setInterval(() => {
    console.log("[Server] Attempting scheduled RSS fetch...");
    fetchAndUpsertAllFeeds().catch((error) => {
      console.error("[Server] RSS feeds unavailable:", error.message);
    });
  }, TWO_HOURS);

  return httpServer;
}

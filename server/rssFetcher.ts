import Parser from "rss-parser";
import { createHash } from "crypto";
import { storage } from "./storage";
import { type InsertScheme } from "@shared/schema";
import { detectDistrict } from "@shared/districts";

const parser = new Parser();

const RSS_FEEDS = [
  { url: "https://www.india.gov.in/rss/schemes.xml", source: "IndiaGov" },
  { url: "https://pib.gov.in/RssFeed.aspx?ModId=6&Category=agriculture", source: "PIB" },
  { url: "https://www.mygov.in/feeds/schemes.xml", source: "MyGov" },
];

const AGRICULTURE_KEYWORDS = [
  "farmer", "agriculture", "crop", "farming", "kisan", "krishi", 
  "irrigation", "seed", "fertilizer", "pesticide", "agricultural"
];

const CATEGORIES = {
  "farmers": ["farmer", "agriculture", "crop", "farming", "kisan", "krishi", "irrigation"],
  "students": ["student", "education", "scholarship", "school", "college", "university", "study"],
  "women-child": ["women", "woman", "child", "maternity", "girl", "mother", "pregnancy"],
  "health": ["health", "medical", "hospital", "insurance", "ayushman", "medicine", "doctor"],
  "housing": ["housing", "house", "shelter", "awas", "home", "construction"],
  "skill-dev": ["skill", "training", "employment", "job", "vocational", "employment"],
  "social-security": ["pension", "disability", "senior citizen", "social security", "welfare"],
  "tribal": ["tribal", "adivasi", "schedule tribe", "st community"]
};

function detectCategory(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
}

function calculateRelevanceScore(
  title: string,
  description: string,
  source: string,
  district: string | null
): number {
  let score = 0;
  const text = `${title} ${description}`.toLowerCase();

  // +5 if contains "Maharashtra"
  if (text.includes("maharashtra")) {
    score += 5;
  }

  // +4 if any district detected
  if (district) {
    score += 4;
  }

  // +3 if contains agriculture keywords
  for (const keyword of AGRICULTURE_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 3;
      break;
    }
  }

  // +2 if PIB agriculture feed
  if (source === "PIB") {
    score += 2;
  }

  return score;
}

function generateSchemeId(link: string): string {
  return createHash("sha256").update(link).digest("hex").substring(0, 16);
}

export async function fetchAndUpsertAllFeeds(): Promise<void> {
  console.log("[RSS Fetcher] Starting to fetch all feeds...");
  
  for (const { url, source } of RSS_FEEDS) {
    try {
      console.log(`[RSS Fetcher] Fetching from ${source}: ${url}`);
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        if (!item.link || !item.title) {
          continue;
        }

        const title = item.title;
        const description = item.contentSnippet || item.content || "";
        const link = item.link;
        const publishedDate = item.pubDate ? new Date(item.pubDate) : null;

        const district = detectDistrict(`${title} ${description}`);
        const category = detectCategory(`${title} ${description}`);
        const relevanceScore = calculateRelevanceScore(title, description, source, district);

        // Only store if relevance score >= 5
        if (relevanceScore >= 5) {
          const schemeData: InsertScheme = {
            id: generateSchemeId(link),
            title,
            description,
            link,
            publishedDate,
            source,
            relevanceScore,
            districtDetected: district,
            categoryDetected: category,
          };

          await storage.upsertScheme(schemeData);
          console.log(`[RSS Fetcher] Upserted: ${title} (score: ${relevanceScore})`);
        }
      }

      console.log(`[RSS Fetcher] Completed fetching from ${source}`);
    } catch (error) {
      console.error(`[RSS Fetcher] Error fetching from ${source}:`, error);
    }
  }

  console.log("[RSS Fetcher] All feeds processed successfully");
}

import Parser from "rss-parser";
import { createHash } from "crypto";
import { storage } from "./storage";
import { type InsertScheme } from "@shared/schema";
import { detectDistrict } from "@shared/districts";

const parser = new Parser();

const RSS_FEEDS = [
  { url: "https://services.india.gov.in/feed/rss?cat_id=14&ln=en", source: "ServicesIndia" },
  { url: "https://services.india.gov.in/feed/rss?cat_id=11&ln=en", source: "ServicesIndia" },
  { url: "https://services.india.gov.in/feed/rss?cat_id=2&ln=en", source: "ServicesIndia" },
  { url: "https://services.india.gov.in/feed/rss?cat_id=6&ln=en", source: "ServicesIndia" },
];

const SCHEME_KEYWORDS = [
  "scheme", "yojana", "yojna", "mission", "assistance", "subsidy", 
  "benefit", "grant", "welfare", "support", "fund"
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

function isScheme(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return SCHEME_KEYWORDS.some(keyword => text.includes(keyword));
}

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

async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<any> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const feed = await parser.parseURL(url);
      return feed;
    } catch (error) {
      lastError = error;
      console.log(`[RSS Fetcher] Attempt ${attempt}/${maxRetries} failed for ${url}, retrying in 2s...`);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  throw lastError;
}

export async function fetchAndUpsertAllFeeds(): Promise<void> {
  console.log("[RSS Fetcher] Starting to fetch all feeds...");
  
  for (const { url, source } of RSS_FEEDS) {
    try {
      console.log(`[RSS Fetcher] Fetching from ${source}: ${url}`);
      const feed = await fetchWithRetry(url);

      for (const item of feed.items) {
        if (!item.link || !item.title) {
          continue;
        }

        const title = item.title;
        const description = item.contentSnippet || item.content || "";
        const link = item.link;
        const publishedDate = item.pubDate ? new Date(item.pubDate) : null;

        // Filter for scheme-only items
        if (!isScheme(title, description)) {
          continue;
        }

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

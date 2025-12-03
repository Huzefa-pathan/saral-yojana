import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "..", "data");
const schemesPath = path.join(dataDir, "schemes.json");
const reviewsPath = path.join(dataDir, "reviews.json");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function loadSchemes<T = unknown>(): Promise<T[]> {
  await ensureDataDir();

  try {
    const data = await fs.readFile(schemesPath, "utf8");
    return JSON.parse(data) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(schemesPath, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

export async function saveSchemes<T = unknown>(schemes: T[]): Promise<void> {
  await ensureDataDir();
  const tempPath = `${schemesPath}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  const serialized = JSON.stringify(schemes, null, 2);

  await fs.writeFile(tempPath, serialized, "utf8");
  await fs.rename(tempPath, schemesPath);
}

export interface Review {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

export async function loadReviews(): Promise<Review[]> {
  await ensureDataDir();

  try {
    const data = await fs.readFile(reviewsPath, "utf8");
    return JSON.parse(data) as Review[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(reviewsPath, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await ensureDataDir();
  const tempPath = `${reviewsPath}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  const serialized = JSON.stringify(reviews, null, 2);

  await fs.writeFile(tempPath, serialized, "utf8");
  await fs.rename(tempPath, reviewsPath);
}


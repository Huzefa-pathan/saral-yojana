import { randomUUID } from "crypto";
import type { Scheme, SchemeFilters, SchemeInput } from "@shared/schema";
import { loadSchemes, saveSchemes, loadReviews, saveReviews, type Review } from "./jsonStorage";

type SchemeRecord = Scheme;

interface SchemeListResult {
  schemes: SchemeRecord[];
  total: number;
}

class JsonSchemeStorage {
  async listReviews(): Promise<Review[]> {
    const reviews = await loadReviews();
    return reviews.sort((a, b) => b.timestamp - a.timestamp);
  }

  async addReview(username: string, message: string): Promise<Review> {
    const reviews = await loadReviews();
    const newReview: Review = {
      id: randomUUID(),
      username: username.trim() || "Anonymous",
      message: message.trim(),
      timestamp: Date.now(),
    };
    reviews.push(newReview);
    await saveReviews(reviews);
    return newReview;
  }
  async listSchemes(filters: SchemeFilters): Promise<SchemeListResult> {
    const { page = 1, size = 20 } = filters;
    const schemes = await this.readAll();
    const filtered = schemes
      .filter((scheme) => this.matchesFilters(scheme, filters))
      .sort((a, b) => b.id.localeCompare(a.id));
    const total = filtered.length;
    const start = (Math.max(page, 1) - 1) * size;
    const pageItems = filtered.slice(start, start + size);

    return {
      schemes: pageItems.map((scheme) => this.cloneScheme(scheme)),
      total,
    };
  }

  async getSchemeById(id: string): Promise<SchemeRecord | undefined> {
    const schemes = await this.readAll();
    const match = schemes.find((scheme) => scheme.id === id);
    return match ? this.cloneScheme(match) : undefined;
  }

  async createScheme(data: SchemeInput & { id?: string }): Promise<SchemeRecord> {
    const schemes = await this.readAll();
    const id = data.id ?? randomUUID();

    if (schemes.some((scheme) => scheme.id === id)) {
      const error = new Error("Scheme ID already exists");
      (error as any).statusCode = 409;
      throw error;
    }

    const record = this.normalizeScheme({ ...data, id });
    schemes.push(record);
    await saveSchemes(schemes);
    return this.cloneScheme(record);
  }

  async updateScheme(id: string, data: SchemeInput): Promise<SchemeRecord | undefined> {
    const schemes = await this.readAll();
    const index = schemes.findIndex((scheme) => scheme.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated = this.normalizeScheme({ ...schemes[index], ...data, id });
    schemes[index] = updated;
    await saveSchemes(schemes);
    return this.cloneScheme(updated);
  }

  async deleteScheme(id: string): Promise<boolean> {
    const schemes = await this.readAll();
    const next = schemes.filter((scheme) => scheme.id !== id);

    if (next.length === schemes.length) {
      return false;
    }

    await saveSchemes(next);
    return true;
  }

  async upsertScheme(data: SchemeInput & { id: string }): Promise<SchemeRecord> {
    const existing = await this.getSchemeById(data.id);
    if (existing) {
      return (await this.updateScheme(data.id, data)) as SchemeRecord;
    }
    return this.createScheme(data);
  }

  async insertScheme(data: unknown): Promise<void> {
    // Used exclusively by the seeding script, which provides fully populated records.
    await this.upsertScheme(data as SchemeInput & { id: string });
  }

  private async readAll(): Promise<SchemeRecord[]> {
    const data = await loadSchemes<SchemeRecord>();
    return data.map((scheme) => this.normalizeScheme(scheme));
  }

  private matchesFilters(scheme: SchemeRecord, filters: SchemeFilters): boolean {
    const { district, category, q } = filters;
    if (district && district !== "all" && (scheme.district ?? "").toLowerCase() !== district.toLowerCase()) {
      return false;
    }
    if (category && scheme.category !== category) {
      return false;
    }
    if (q) {
      const needle = q.toLowerCase();
      const haystack = [
        scheme.title,
        scheme.description,
        scheme.fullDescription ?? "",
        scheme.category,
        scheme.source,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) {
        return false;
      }
    }
    return true;
  }

  private normalizeScheme(scheme: SchemeInput & { id: string }): SchemeRecord {
    return {
      id: scheme.id,
      title: scheme.title,
      category: scheme.category,
      district: scheme.district ?? null,
      source: scheme.source,
      description: scheme.description,
      fullDescription: scheme.fullDescription ?? scheme.description,
      applyMode: scheme.applyMode ?? "online",
      applyOnlineLink: scheme.applyOnlineLink ?? null,
      applyOfflineInfo: scheme.applyOfflineInfo ?? null,
      eligibility: this.normalizeStringArray(scheme.eligibility),
      benefits: this.normalizeStringArray(scheme.benefits),
      documents: this.normalizeStringArray((scheme as any).documents ?? (scheme as any).documentsRequired),
    };
  }

  private normalizeStringArray(value?: string[]): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((entry) => entry?.trim()).filter((entry): entry is string => Boolean(entry));
  }

  private cloneScheme(scheme: SchemeRecord): SchemeRecord {
    return JSON.parse(JSON.stringify(scheme));
  }
}

export const storage = new JsonSchemeStorage();

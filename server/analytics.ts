import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANALYTICS_FILE = path.join(__dirname, "../analytics.json");

interface AnalyticsData {
  totalSiteVisits: number;
  totalPageViews: number;
  totalSchemeSearches: number;
}

let analyticsData: AnalyticsData = {
  totalSiteVisits: 0,
  totalPageViews: 0,
  totalSchemeSearches: 0,
};

async function readAnalytics(): Promise<AnalyticsData> {
  try {
    const content = await fs.readFile(ANALYTICS_FILE, "utf-8");
    analyticsData = JSON.parse(content);
    return analyticsData;
  } catch (error) {
    console.error("Error reading analytics file, initializing with default:", error);
    await writeAnalytics(analyticsData);
    return analyticsData;
  }
}

async function writeAnalytics(data: AnalyticsData): Promise<void> {
  try {
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing analytics file:", error);
  }
}

// Initialize on module load
readAnalytics();

export const trackEvent = async (event: "visit" | "pageView" | "schemeSearch") => {
  // Ensure data is up-to-date before modification
  await readAnalytics(); 

  switch (event) {
    case "visit":
      analyticsData.totalSiteVisits += 1;
      break;
    case "pageView":
      analyticsData.totalPageViews += 1;
      break;
    case "schemeSearch":
      analyticsData.totalSchemeSearches += 1;
      break;
  }

  await writeAnalytics(analyticsData);
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  return readAnalytics();
};

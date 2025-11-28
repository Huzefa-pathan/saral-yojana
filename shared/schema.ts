export type SchemeSource = "state" | "central";
export type SchemeApplyMode = "online" | "offline" | "both";

export interface Scheme {
  id: string;
  title: string;
  category: string;
  district?: string | null;
  source: SchemeSource;
  description: string;
  fullDescription?: string | null;
  applyMode: SchemeApplyMode;
  applyOnlineLink?: string | null;
  applyOfflineInfo?: string | null;
  eligibility: string[];
  benefits: string[];
  documents: string[];
}

export type SchemeInput = Omit<Scheme, "id"> & { id?: string };

export interface SchemeFilters {
  page?: number;
  size?: number;
  district?: string;
  category?: string;
  q?: string;
}

import { Scheme } from "@/lib/data";

export interface SchemesResponse {
  total: number;
  page: number;
  size: number;
  schemes: Scheme[];
}

export async function fetchSchemes(params: {
  page?: number;
  size?: number;
  district?: string;
  category?: string;
  q?: string;
}): Promise<SchemesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.district) queryParams.append("district", params.district);
  if (params.category) queryParams.append("category", params.category);
  if (params.q) queryParams.append("q", params.q);

  const response = await fetch(`/api/schemes?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch schemes");
  }

  return response.json();
}

export async function fetchSchemeById(id: string): Promise<Scheme> {
  const response = await fetch(`/api/scheme/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch scheme");
  }

  return response.json();
}
export async function adminLogin(credentials: { username: string; password: string }) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json();
}

export async function adminLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  username?: string;
}

export async function checkAdminStatus(): Promise<AuthStatusResponse> {
  const res = await fetch("/api/admin/check");
  
  if (!res.ok) {
    return { isAuthenticated: false };
  }

  return res.json();
}

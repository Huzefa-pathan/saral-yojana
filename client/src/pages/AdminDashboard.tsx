import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SchemeSummary = {
  id: string;
  title: string;
  category: string;
  district: string | null;
  source: string;
};

type SchemeDetail = SchemeSummary & {
  description: string;
  fullDescription: string | null;
  applyMode: string;
  applyOnlineLink?: string | null;
  applyOfflineInfo?: string | null;
  eligibility: string[];
  benefits: string[];
  documents: string[];
};

interface AnalyticsData {
  totalSiteVisits: number;
  totalPageViews: number;
  totalSchemeSearches: number;
}

type FormState = {
  id?: string;
  title: string;
  category: string;
  district: string;
  source: "state" | "central";
  description: string;
  fullDescription: string;
  eligibility: string[];
  benefits: string[];
  documentsRequired: string[];
  applyMode: "online" | "offline" | "both";
  applyOnlineLink: string;
  applyOfflineInfo: string;
};

const emptyForm: FormState = {
  title: "",
  category: "",
  district: "",
  source: "state",
  description: "",
  fullDescription: "",
  eligibility: [],
  benefits: [],
  documentsRequired: [],
  applyMode: "online",
  applyOnlineLink: "",
  applyOfflineInfo: "",
};

type ListField = "eligibility" | "benefits" | "documentsRequired";

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [dashboardError, setDashboardError] = useState("");
  const [loadingSchemes, setLoadingSchemes] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/admin/check");
      if (response.ok) {
        setIsAuthenticated(true);
        void fetchSchemes();
        void fetchAnalytics();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    }
  }

  async function fetchAnalytics() {
    if (!isAuthenticated) return;
    setLoadingAnalytics(true);
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.status === 401) {
        handleLogout();
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }
      const data = (await response.json()) as AnalyticsData;
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setDashboardError("Unable to load analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  }

  async function fetchSchemes() {
    if (!isAuthenticated) return;
    setLoadingSchemes(true);
    setDashboardError("");

    try {
      const response = await fetch("/api/admin/schemes", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Failed to load schemes");
      }

      const data = (await response.json()) as { schemes: SchemeSummary[] };

      console.log("SCHEMES RECEIVED FROM API:", data.schemes);

      setSchemes(data.schemes);
    } catch (error) {
      console.error("Admin FETCHSCHEMES ERROR:", error);
      setDashboardError("Unable to load schemes");
    } finally {
      setLoadingSchemes(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsAuthenticated(false);
    setFormMode(null);
    setSchemes([]);
    setAnalytics(null);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
      fetchSchemes();
      fetchAnalytics();
    } catch (error) {
      setLoginError("Login failed");
    }
  }

  async function startEdit(id: string) {
    if (!isAuthenticated) return;
    setFormMode("edit");
    setFormLoading(true);
    setFormError("");

    try {
      const response = await fetch(`/api/admin/scheme/${id}`, { cache: "no-store" });
      const scheme = await response.json();
      setFormState({
        id: scheme.id,
        title: scheme.title ?? "",
        category: scheme.category ?? "",
        district: scheme.district ?? "",
        source: scheme.source || "state",
        description: scheme.description ?? "",
        fullDescription: scheme.fullDescription ?? scheme.description ?? "",
        eligibility: [...(scheme.eligibility ?? [])],
        benefits: [...(scheme.benefits ?? [])],
        documentsRequired: [...(scheme.documents ?? [])],
        applyMode: scheme.applyMode ?? "online",
        applyOnlineLink: scheme.applyOnlineLink ?? "",
        applyOfflineInfo: scheme.applyOfflineInfo ?? "",
      });
    } catch (error) {
      setFormError("Unable to fetch scheme");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!isAuthenticated) return;
    const confirmed = window.confirm("Are you sure you want to delete this scheme?");
    if (!confirmed) return;

    try {
      await fetch(`/api/admin/scheme/${id}`, { method: "DELETE" });
      fetchSchemes();
    } catch (error) {
      setDashboardError("Failed to delete scheme");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-lg border bg-background p-8 shadow"
        >
          <h1 className="text-2xl font-semibold text-foreground">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the admin panel.
          </p>

          <label className="mt-6 block text-sm font-medium text-foreground">
            Username
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2"
              placeholder="Enter username"
              required
            />
          </label>

          <label className="mt-6 block text-sm font-medium text-foreground">
            Password
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
              placeholder="Enter password"
              required
            />
          </label>

          {loginError && <p className="mt-3 text-sm text-red-500">{loginError}</p>}

          <Button type="submit" className="mt-6 w-full">
            Login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { fetchSchemes(); fetchAnalytics(); }}>
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="grid gap-4 md:grid-cols-3">
          <AnalyticsCard title="Total Site Visits" value={analytics?.totalSiteVisits} loading={loadingAnalytics} />
          <AnalyticsCard title="Total Page Views" value={analytics?.totalPageViews} loading={loadingAnalytics} />
          <AnalyticsCard title="Scheme Searches" value={analytics?.totalSchemeSearches} loading={loadingAnalytics} />
        </div>

        {/* SCHEME LIST */}
        <div className="rounded-lg border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">All Schemes</h2>
            <span className="text-sm text-muted-foreground">
              {schemes.length} schemes found
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 text-left text-sm text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                  <th className="px-3 py-2 font-medium">District</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme) => (
                  <tr key={scheme.id} className="border-t text-sm">
                    <td className="px-3 py-3 font-medium text-foreground">{scheme.title}</td>
                    <td className="px-3 py-3">{scheme.category}</td>
                    <td className="px-3 py-3 capitalize">{scheme.source}</td>
                    <td className="px-3 py-3">{scheme.district || "—"}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(scheme.id)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(scheme.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {schemes.length === 0 && !loadingSchemes && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No schemes found.
                    </td>
                  </tr>
                )}
                
                {loadingSchemes && (
                  <tr>
                    <td colSpan={5} className="px-3 py6 text-center text-sm text-muted-foreground">
                      Loading schemes...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number | undefined;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-1 text-2xl font-bold text-foreground">
        {loading ? "..." : value?.toLocaleString() ?? "N/A"}
      </div>
    </div>
  );
}

export default Admin;

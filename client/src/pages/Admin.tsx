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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
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

  const isAuthenticated = Boolean(token);

  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) return;
    void fetchSchemes();
  }, [token]);

  async function fetchSchemes() {
    if (!token) return;
    setLoadingSchemes(true);
    setDashboardError("");

    try {
      const response = await fetch("/api/admin/schemes", {
        headers: authHeaders,
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load schemes");
      }

      const data = (await response.json()) as { schemes: SchemeSummary[] };
      setSchemes(data.schemes);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Unable to load schemes");
    } finally {
      setLoadingSchemes(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setToken(null);
    setFormMode(null);
    setSchemes([]);
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
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }

      const data = (await response.json()) as { token: string };
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    }
  }

  function startCreate() {
    setFormMode("create");
    setFormState(emptyForm);
    setFormError("");
  }

  async function startEdit(id: string) {
    if (!token) return;
    setFormMode("edit");
    setFormLoading(true);
    setFormError("");

    try {
      const response = await fetch(`/api/admin/scheme/${id}`, {
        headers: authHeaders,
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load scheme");
      }

      const scheme = (await response.json()) as SchemeDetail;

      setFormState({
        id: scheme.id,
        title: scheme.title ?? "",
        category: scheme.category ?? "",
        district: scheme.district ?? "",
        source: scheme.source === "central" ? "central" : "state",
        description: scheme.description ?? "",
        fullDescription: scheme.fullDescription ?? scheme.description ?? "",
        eligibility: [...(scheme.eligibility ?? [])],
        benefits: [...(scheme.benefits ?? [])],
        documentsRequired: [...(scheme.documents ?? [])],
        applyMode: (scheme.applyMode as FormState["applyMode"]) || "online",
        applyOnlineLink: scheme.applyOnlineLink ?? "",
        applyOfflineInfo: scheme.applyOfflineInfo ?? "",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to fetch scheme");
    } finally {
      setFormLoading(false);
    }
  }

  function updateField<T extends keyof FormState>(field: T, value: FormState[T]) {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateArrayField(field: ListField, index: number, value: string) {
    setFormState((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  }

  function addArrayItem(field: ListField) {
    setFormState((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  }

  function removeArrayItem(field: ListField, index: number) {
    setFormState((prev) => {
      const next = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: next };
    });
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!token || !formMode) return;

    setSaving(true);
    setFormError("");

    const payload = {
      id: formState.id,
      title: formState.title,
      category: formState.category,
      district: formState.district || null,
      source: formState.source,
      description: formState.description,
      fullDescription: formState.fullDescription,
      eligibility: formState.eligibility.filter(Boolean),
      benefits: formState.benefits.filter(Boolean),
      documentsRequired: formState.documentsRequired.filter(Boolean),
      applyMode: formState.applyMode,
      applyOnlineLink: formState.applyOnlineLink || null,
      applyOfflineInfo: formState.applyOfflineInfo || null,
    };

    const method = formMode === "edit" ? "PUT" : "POST";
    const url =
      formMode === "edit" && formState.id
        ? `/api/admin/scheme/${formState.id}`
        : "/api/admin/scheme";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save scheme");
      }

      await fetchSchemes();
      setFormMode(null);
      setFormState(emptyForm);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save scheme");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    const confirmed = window.confirm("Delete this scheme? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/scheme/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete scheme");
      }

      await fetchSchemes();
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Failed to delete scheme");
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
            Enter the admin password to manage schemes.
          </p>
          <label className="mt-6 block text-sm font-medium text-foreground">
            Password
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
              placeholder="********"
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage schemes, eligibility, benefits, and documents.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={fetchSchemes} disabled={loadingSchemes}>
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
            <Button onClick={startCreate}>Add Scheme</Button>
          </div>
        </div>

        {dashboardError && <p className="text-sm text-red-500">{dashboardError}</p>}

        {formMode ? (
          <form
            onSubmit={handleSave}
            className="rounded-lg border bg-background p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {formMode === "edit" ? "Edit Scheme" : "Add Scheme"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the details and save to update the database.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormMode(null);
                    setFormState(emptyForm);
                    setFormError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Scheme"}
                </Button>
              </div>
            </div>

            {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
            {formLoading && (
              <p className="mt-4 text-sm text-muted-foreground">Loading scheme...</p>
            )}

            {!formLoading && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Field label="Title">
                  <Input
                    value={formState.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    required
                  />
                </Field>

                <Field label="Category">
                  <Input
                    value={formState.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    required
                  />
                </Field>

                <Field label="District">
                  <Input
                    value={formState.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    placeholder="Optional"
                  />
                </Field>

                <Field label="Source">
                  <select
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={formState.source}
                    onChange={(event) =>
                      updateField("source", event.target.value as FormState["source"])
                    }
                  >
                    <option value="state">State</option>
                    <option value="central">Central</option>
                  </select>
                </Field>

                <Field label="Apply Mode">
                  <select
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    value={formState.applyMode}
                    onChange={(event) =>
                      updateField("applyMode", event.target.value as FormState["applyMode"])
                    }
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both</option>
                  </select>
                </Field>

                <Field label="Apply Online Link">
                  <Input
                    value={formState.applyOnlineLink}
                    onChange={(event) => updateField("applyOnlineLink", event.target.value)}
                    placeholder="https://example.com"
                  />
                </Field>

                <Field label="Apply Offline Info" className="md:col-span-2">
                  <Textarea
                    value={formState.applyOfflineInfo}
                    onChange={(event) => updateField("applyOfflineInfo", event.target.value)}
                    placeholder="Explain how to apply offline"
                  />
                </Field>

                <Field label="Short Description" className="md:col-span-2">
                  <Textarea
                    value={formState.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    required
                    rows={3}
                  />
                </Field>

                <Field label="Full Description" className="md:col-span-2">
                  <Textarea
                    value={formState.fullDescription}
                    onChange={(event) => updateField("fullDescription", event.target.value)}
                    required
                    rows={5}
                  />
                </Field>

                <ListEditor
                  title="Eligibility"
                  items={formState.eligibility}
                  onAdd={() => addArrayItem("eligibility")}
                  onChange={(index, value) => updateArrayField("eligibility", index, value)}
                  onRemove={(index) => removeArrayItem("eligibility", index)}
                />

                <ListEditor
                  title="Benefits"
                  items={formState.benefits}
                  onAdd={() => addArrayItem("benefits")}
                  onChange={(index, value) => updateArrayField("benefits", index, value)}
                  onRemove={(index) => removeArrayItem("benefits", index)}
                />

                <ListEditor
                  title="Documents Required"
                  items={formState.documentsRequired}
                  onAdd={() => addArrayItem("documentsRequired")}
                  onChange={(index, value) =>
                    updateArrayField("documentsRequired", index, value)
                  }
                  onRemove={(index) => removeArrayItem("documentsRequired", index)}
                />
              </div>
            )}
          </form>
        ) : (
          <div className="rounded-lg border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Schemes</h2>
              <span className="text-sm text-muted-foreground">
                {schemes.length} total scheme{schemes.length === 1 ? "" : "s"}
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
                      <td className="px-3 py-3 capitalize">{scheme.category}</td>
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
                      <td
                        colSpan={5}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        No schemes yet. Click &quot;Add Scheme&quot; to create one.
                      </td>
                    </tr>
                  )}
                  {loadingSchemes && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-6 text-center text-sm text-muted-foreground"
                      >
                        Loading schemes...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-foreground ${className}`}>
      {label}
      {children}
    </label>
  );
}

function ListEditor({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
          Add
        </Button>
      </div>
      <div className="mt-3 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet. Add one to get started.</p>
        )}
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={`${title} item`}
            />
            <Button type="button" variant="outline" onClick={() => onRemove(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;


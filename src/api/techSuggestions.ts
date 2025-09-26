const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function toQuery(params: Record<string, unknown>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  return qs.toString();
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {}
    throw new Error(message);
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export type Suggestion = {
  id: string;
  name: string;
  version: string;
  category: string;
  color: string;
  status: "PENDING" | "APPROVED";
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export async function createSuggestion(payload: {
  name: string;
  version?: string;
  category: string;
  color?: string;
}): Promise<Suggestion> {
  const res = await fetch(`${API_URL}/tech-suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    mode: "cors",
    credentials: "omit",
  });
  return handle<Suggestion>(res);
}

export async function listSuggestions(q: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "PENDING" | "APPROVED";
} = {}): Promise<Paginated<Suggestion>> {
  const safe = {
    page: typeof q.page === 'number' && q.page >= 1 ? q.page : 1,
    pageSize: typeof q.pageSize === 'number' && q.pageSize >= 1 ? q.pageSize : 10,
    search: q.search ?? '',
    status: q.status ?? undefined,
  };
  const qs = toQuery(safe);
  const res = await fetch(`${API_URL}/tech-suggestions?${qs}`, {
    headers: { ...authHeaders() },
    mode: "cors",
    credentials: "omit",
  });
  return handle<Paginated<Suggestion>>(res);
}

export async function approveSuggestion(id: string): Promise<{ approved: true; technology: any }> {
  const res = await fetch(`${API_URL}/tech-suggestions/${id}/approve`, {
    method: "POST",
    headers: { ...authHeaders() },
    mode: "cors",
    credentials: "omit",
  });
  return handle(res);
}

export async function deleteSuggestion(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/tech-suggestions/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    mode: "cors",
    credentials: "omit",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message ?? `Error ${res.status}`);
  }
}

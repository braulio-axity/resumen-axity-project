// src/api/technologies.ts
import type {
  Technology,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
  TechnologyQuery,
  PaginatedResponse,
} from "@/types/technology";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** ------------ Auth: token provider configurable ------------ */
let _tokenProvider: (() => string | null | undefined) | null = null;

/**
 * Llama esto una vez (por ejemplo, desde tu AuthContext) para proveer el token actual.
 * Ej: configureApiAuth(() => auth.token)
 */
export function configureApiAuth(getter: () => string | null | undefined) {
  _tokenProvider = getter;
}

function getAccessToken(): string | null {
  // Si se configuró un provider, úsalo; si no, toma de localStorage.
  return (_tokenProvider ? _tokenProvider() : localStorage.getItem("token")) ?? null;
}

/** SIEMPRE devolvemos objeto plano para evitar el union con Headers */
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
/** ----------------------------------------------------------- */

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
      message = (data?.message as string) ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  // Algunos endpoints del Nest pueden no devolver body (DELETE). Evitamos error.
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

/* ===================== shape=map (para SkillsStep) ===================== */

export type TechnologiesMap = Record<string, { category: string; color: string }>;
export type TechnologiesMapResponse = {
  data: TechnologiesMap;
  page: number;
  pageSize: number;
  total: number;
};

// Cache en memoria por pestaña
const cache = {
  map: { etag: null as string | null, data: null as TechnologiesMapResponse | null },
  list: {
    etag: null as string | null,
    key: "" as string,
    data: null as PaginatedResponse<Technology> | null,
  },
};

export function invalidateTechnologiesCache() {
  cache.map.etag = null;
  cache.map.data = null;
  cache.list.etag = null;
  cache.list.data = null;
  cache.list.key = "";
}

/**
 * Obtiene el catálogo como { [name]: { category, color } }
 * Solo hace red (304 Not Modified) si cambió (usa ETag).
 */
export async function getTechnologiesMap(opts?: { force?: boolean }): Promise<TechnologiesMapResponse> {
  const url = `${API_URL}/technologies?shape=map&page=1&pageSize=2000`;

  // Usamos objeto plano para headers (compatible con HeadersInit)
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...authHeaders(),
  };

  if (cache.map.etag && !opts?.force) {
    (headers as Record<string, string>)["If-None-Match"] = cache.map.etag!;
  }

  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    headers,
  });

  if (res.status === 304 && cache.map.data) {
    return cache.map.data;
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error("No autorizado (401). Revisa tu token.");
    throw new Error(`Error al obtener tecnologías (map): ${res.status}`);
  }

  const data = await handle<TechnologiesMapResponse>(res);
  cache.map.etag = res.headers.get("etag");
  cache.map.data = data;
  return data;
}

/* ===================== List / Detail / CRUD ===================== */

export async function listTechnologies(
  query: TechnologyQuery = {},
  opts?: { force?: boolean }
): Promise<PaginatedResponse<Technology>> {
  const qs = toQuery({ shape: "array", page: 1, pageSize: 20, ...query });
  const url = `${API_URL}/technologies?${qs}`;

  const headers: HeadersInit = {
    ...authHeaders(),
  };

  // cache por ETag para listas
  if (cache.list.key === url && cache.list.etag && !opts?.force) {
    (headers as Record<string, string>)["If-None-Match"] = cache.list.etag!;
  }

  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    headers,
  });

  if (res.status === 304 && cache.list.data) {
    return cache.list.data;
  }

  const data = await handle<PaginatedResponse<Technology>>(res);
  cache.list.key = url;
  cache.list.etag = res.headers.get("etag");
  cache.list.data = data;
  return data;
}

export async function getTechnology(id: string): Promise<Technology> {
  const res = await fetch(`${API_URL}/technologies/${id}`, {
    mode: "cors",
    credentials: "omit",
    headers: {
      ...authHeaders(),
    },
  });
  return handle<Technology>(res);
}

export async function createTechnology(
  payload: CreateTechnologyPayload
): Promise<Technology> {
  const res = await fetch(`${API_URL}/technologies`, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  invalidateTechnologiesCache();
  return handle<Technology>(res);
}

export async function updateTechnology(
  id: string,
  payload: UpdateTechnologyPayload
): Promise<Technology> {
  const body: Record<string, unknown> = { ...payload };
  if (Object.prototype.hasOwnProperty.call(body, "version") && body.version === null) {
    body.version = "";
  }
  if (Object.prototype.hasOwnProperty.call(body, "color") && body.color === null) {
    body.color = "";
  }

  const res = await fetch(`${API_URL}/technologies/${id}`, {
    method: "PUT",
    mode: "cors",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  invalidateTechnologiesCache();
  return handle<Technology>(res);
}

export async function deleteTechnology(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/technologies/${id}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "omit",
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message ?? `Error ${res.status}`);
  }

  invalidateTechnologiesCache();
}

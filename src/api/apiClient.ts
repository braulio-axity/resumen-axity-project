const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let _tokenProvider: (() => string | null | undefined) | null = null;

export function configureApiAuth(getter: () => string | null | undefined) {
  _tokenProvider = getter;
}

function getToken(): string | null {
  return _tokenProvider?.() ?? localStorage.getItem("token");
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toQuery(params: Record<string, unknown>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  return qs.toString();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message ?? msg;
    } catch {}
    throw new Error(msg);
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
  headers?: HeadersInit;
  auth?: boolean;
  useETag?: {
    key: string;
    cache: Map<string, { etag: string; data: unknown }>;
  };
  force?: boolean;
};

export async function apiRequest<T>(
  path: string,
  opts: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    headers = {},
    auth = true,
    useETag,
    force = false,
  } = opts;

  let url = `${API_URL}${path}`;
  if (query) {
    const qs = toQuery(query);
    if (qs) url += `?${qs}`;
  }

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(auth ? getAuthHeaders() : {}),
    ...headers,
  };

  if (useETag && !force) {
    const cached = useETag.cache.get(useETag.key);
    if (cached) {
      (finalHeaders as Record<string, string>)["If-None-Match"] = cached.etag;
    }
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    mode: "cors",
    credentials: "omit",
  });

  if (res.status === 304 && useETag) {
    const cached = useETag.cache.get(useETag.key);
    return cached?.data as T;
  }

  const data = await handleResponse<T>(res);

  if (useETag) {
    const etag = res.headers.get("etag");
    if (etag) useETag.cache.set(useETag.key, { etag, data });
  }

  return data;
}

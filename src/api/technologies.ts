import { apiRequest } from "./apiClient";
import type {
  Technology,
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
  TechnologyQuery,
  PaginatedResponse
} from "@/types/technology";

const mapCache = new Map<string, { etag: string; data: any }>();
const listCache = new Map<string, { etag: string; data: any }>();

export function invalidateTechnologiesCache() {
  mapCache.clear();
  listCache.clear();
}

export async function getTechnologiesMap(opts?: { force?: boolean }) {
  return apiRequest("/technologies", {
    query: { shape: "map", page: 1, pageSize: 2000 },
    useETag: { key: "map", cache: mapCache },
    force: opts?.force,
  });
}

export function listTechnologies(query: TechnologyQuery = {}, opts?: { force?: boolean }) {
  const qs = { shape: "array", page: 1, pageSize: 20, ...query };
  const key = `/technologies?${JSON.stringify(qs)}`;
  
  return apiRequest<PaginatedResponse<Technology>>("/technologies", {
    query: qs,
    useETag: { key, cache: listCache },
    force: opts?.force,
  });
}

export function getTechnology(id: string) {
  return apiRequest<Technology>(`/technologies/${id}`);
}

export function createTechnology(payload: CreateTechnologyPayload) {
  invalidateTechnologiesCache();
  return apiRequest<Technology>("/technologies", {
    method: "POST",
    body: payload,
  });
}

export function updateTechnology(id: string, payload: UpdateTechnologyPayload) {
  invalidateTechnologiesCache();
  return apiRequest<Technology>(`/technologies/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteTechnology(id: string) {
  invalidateTechnologiesCache();
  return apiRequest<void>(`/technologies/${id}`, {
    method: "DELETE",
  });
}

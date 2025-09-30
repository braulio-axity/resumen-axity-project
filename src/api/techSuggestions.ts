// src/api/techSuggestions.ts
import { apiRequest } from "./apiClient";

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

export function createSuggestion(payload: {
  name: string;
  version?: string;
  category: string;
  color?: string;
}) {
  return apiRequest<Suggestion>("/tech-suggestions", {
    method: "POST",
    body: payload,
  });
}

export function listSuggestions(q: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "PENDING" | "APPROVED";
} = {}) {
  const query = {
    page: typeof q.page === "number" && q.page >= 1 ? q.page : 1,
    pageSize: typeof q.pageSize === "number" && q.pageSize >= 1 ? q.pageSize : 10,
    search: q.search ?? "",
    status: q.status ?? undefined,
  };

  return apiRequest<Paginated<Suggestion>>("/tech-suggestions", {
    query,
  });
}

export function approveSuggestion(id: string) {
  return apiRequest<{ approved: true; technology: any }>(`/tech-suggestions/${id}/approve`, {
    method: "POST",
  });
}

export function deleteSuggestion(id: string) {
  return apiRequest<void>(`/tech-suggestions/${id}`, {
    method: "DELETE",
  });
}

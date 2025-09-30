// src/api/cvExperiences.ts
import { apiRequest } from "./apiClient";

export type ExpTech = { name: string; version?: string };
export type ExpProject = { id?: string; name: string; role: string; responsibilities: string; technologies: ExpTech[] };

export type ExperienceView = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  challenges: string;
  achievements: string;
  technologies: ExpTech[];
  projects: ExpProject[];
};

export type CreateExperiencePayload = Omit<ExperienceView, "id" | "projects"> & {
  projects: Omit<ExpProject, "id">[];
};

export function listCvExperiences() {
  return apiRequest<ExperienceView[]>("/cv/me/experiences");
}

export function createCvExperience(payload: CreateExperiencePayload) {
  return apiRequest<ExperienceView>("/cv/me/experiences", {
    method: "POST",
    body: payload,
  });
}

export function updateCvExperience(id: string, payload: CreateExperiencePayload) {
  return apiRequest<ExperienceView>(`/cv/me/experiences/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCvExperience(id: string) {
  return apiRequest<{ deleted: true }>(`/cv/me/experiences/${id}`, {
    method: "DELETE",
  });
}

// src/api/cvSkills.ts
import { apiRequest } from "./apiClient";

export type CvSkillView = {
  id: string;
  level: string;
  skill: {
    id: string;
    name: string;
    version: string;
  };
};

export function listCvSkills() {
  return apiRequest<CvSkillView[]>("/cv/me/skills");
}

export function addCvSkill(payload: { name: string; version?: string; level: string }) {
  return apiRequest<CvSkillView>("/cv/me/skills", {
    method: "POST",
    body: payload,
  });
}

export function updateCvSkill(cvSkillId: string, level: string) {
  return apiRequest<CvSkillView>(`/cv/me/skills/${cvSkillId}`, {
    method: "PATCH",
    body: { level },
  });
}

export function deleteCvSkill(cvSkillId: string) {
  return apiRequest<{ deleted: true }>(`/cv/me/skills/${cvSkillId}`, {
    method: "DELETE",
  });
}

export function bulkReplaceCvSkills(skills: { name: string; version?: string; level: string }[]) {
  return apiRequest<CvSkillView[]>("/cv/me/skills/bulk-replace", {
    method: "POST",
    body: { skills },
  });
}

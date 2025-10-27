import { apiRequest } from "./apiClient";
export type UiEducationStatus = '' | 'terminado' | 'en-curso' | 'incompleto';

export interface UiEducationItem {
  id?: string;
  institution: string;
  degree: string;
  field?: string;
  year?: string;
  achievements?: string;
  status: UiEducationStatus;
  isInternational?: boolean;
  hasApostille?: boolean;
}

type ApiEducationStatus = 'terminado' | 'en_curso' | 'incompleto';

export interface ApiEducationItem {
  id: string;
  cvId: string;
  institution: string;
  degree: string;
  field: string | null;
  year: string | null;
  achievements: string | null;
  status: ApiEducationStatus;
  isInternational: boolean;
  hasApostille: boolean;
}

/** ===== Mapeos UI <-> API ===== */

const statusUiToApi = (s: UiEducationStatus): ApiEducationStatus => {
  if (!s || s.length === 0) return 'incompleto';
  if (s === 'en-curso') return 'en_curso';
  return s as ApiEducationStatus;
};

const statusApiToUi = (s: ApiEducationStatus): UiEducationStatus => {
  if (s === 'en_curso') return 'en-curso';
  return s;
};

const uiToApiPayload = (e: UiEducationItem) => ({
  institution: e.institution,
  degree: e.degree,
  field: e.field ?? undefined,
  year: e.year && e.year.length === 4 ? e.year : undefined,
  achievements: e.achievements ?? undefined,
  status: statusUiToApi(e.status),
  isInternational: e.isInternational ?? false,
  hasApostille: e.hasApostille ?? false,
});

const apiToUi = (e: ApiEducationItem): UiEducationItem => ({
  id: e.id,
  institution: e.institution,
  degree: e.degree,
  field: e.field ?? undefined,
  year: e.year ?? undefined,
  achievements: e.achievements ?? undefined,
  status: statusApiToUi(e.status),
  isInternational: e.isInternational,
  hasApostille: e.hasApostille,
});

// GET /me/education
export async function getEducation(): Promise<UiEducationItem[]> {
  const data = await apiRequest<ApiEducationItem[]>(`/me/education`, { method: 'GET' });
  return data.map(apiToUi);
}

// POST /me/education  (crear)
export async function createEducation(payload: UiEducationItem): Promise<UiEducationItem> {
  const body = uiToApiPayload(payload);
  const data = await apiRequest<ApiEducationItem>(`/me/education`, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
  return apiToUi(data);
}

// PATCH /me/education/:id  (editar)
export async function updateEducation(
  id: string,
  partial: Partial<UiEducationItem> & { __clearYear?: boolean },
): Promise<UiEducationItem> {
  const base = uiToApiPayload(partial as UiEducationItem);

  if (partial.__clearYear) {
    (base as any).year = '';
  } else if (partial.year !== undefined) {
    if (!(partial.year && partial.year.length === 4)) {
      delete (base as any).year;
    }
  }

  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(base)) {
    if (v !== undefined) clean[k] = v;
  }

  const data = await apiRequest<ApiEducationItem>(`/me/education/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(clean),
    headers: { 'Content-Type': 'application/json' },
  });
  return apiToUi(data);
}

// DELETE /me/education/:id
export async function deleteEducation(id: string): Promise<void> {
  await apiRequest<void>(`/me/education/${id}`, { method: 'DELETE' });
}

// POST /me/education/replace-all
export async function replaceAllEducation(list: UiEducationItem[]): Promise<UiEducationItem[]> {
  const body = list.map(uiToApiPayload);
  const data = await apiRequest<ApiEducationItem[]>(`/me/education/replace-all`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return data.map(apiToUi);
}

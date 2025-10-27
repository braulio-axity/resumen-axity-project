import { apiRequest } from "./apiClient";

export interface UiCertificationItem {
  id?: string;
  name: string;
  issuer: string;
  year?: string;
  credentialId?: string;
}

export interface ApiCertificationItem {
  id: string;
  cvId: string;
  name: string;
  issuer: string;
  year: string | null;
  credentialId: string | null;
  createdAt: string;
  updatedAt: string;
}

const uiToApiPayload = (c: UiCertificationItem) => ({
  name: c.name,
  issuer: c.issuer,
  year: c.year && c.year.length === 4 ? c.year : undefined,
  credentialId: c.credentialId ?? undefined,
});

const apiToUi = (c: ApiCertificationItem): UiCertificationItem => ({
  id: c.id,
  name: c.name,
  issuer: c.issuer,
  year: c.year ?? undefined,
  credentialId: c.credentialId ?? undefined,
});

// GET 
export async function getCertifications(): Promise<UiCertificationItem[]> {
  const data = await apiRequest<ApiCertificationItem[]>(`/me/certifications`, {
    method: 'GET',
  });
  return data.map(apiToUi);
}

// POST
export async function createCertification(payload: UiCertificationItem): Promise<UiCertificationItem> {
  const data = await apiRequest<ApiCertificationItem>(`/me/certifications`, {
    method: 'POST',
    body: uiToApiPayload(payload),
    headers: { 'Content-Type': 'application/json' },
  });
  return apiToUi(data);
}

// PATCH
export async function updateCertification(
  id: string,
  partial: Partial<UiCertificationItem>,
): Promise<UiCertificationItem> {
  const body = { ...uiToApiPayload({ ...partial } as UiCertificationItem) };
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined) clean[k] = v;
  }

  const data = await apiRequest<ApiCertificationItem>(`/me/certifications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(clean),
    headers: { 'Content-Type': 'application/json' },
  });
  return apiToUi(data);
}

// DELETE
export async function deleteCertification(id: string): Promise<void> {
  await apiRequest<void>(`/me/certifications/${id}`, { method: 'DELETE' });
}

// POST
export async function replaceAllCertifications(list: UiCertificationItem[]): Promise<UiCertificationItem[]> {
  const body = list.map(uiToApiPayload);
  const data = await apiRequest<ApiCertificationItem[]>(`/me/certifications/replace-all`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return data.map(apiToUi);
}

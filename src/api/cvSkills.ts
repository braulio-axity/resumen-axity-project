const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}
function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
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
  try { return (await res.json()) as T; } catch { return undefined as unknown as T; }
}

export type CvSkillView = {
  id: string;
  level: string;
  skill: { id: string; name: string; version: string };
};

export async function listCvSkills(): Promise<CvSkillView[]> {
  const res = await fetch(`${API_URL}/cv/me/skills`, {
    headers: { ...authHeaders() },
    mode: "cors",
    credentials: "omit",
  });
  return handle<CvSkillView[]>(res);
}

export async function addCvSkill(payload: { name: string; version?: string; level: string }): Promise<CvSkillView> {
  const res = await fetch(`${API_URL}/cv/me/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    mode: "cors",
    credentials: "omit",
  });
  return handle<CvSkillView>(res);
}

export async function updateCvSkill(cvSkillId: string, level: string): Promise<CvSkillView> {
  const res = await fetch(`${API_URL}/cv/me/skills/${cvSkillId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ level }),
    mode: "cors",
    credentials: "omit",
  });
  return handle<CvSkillView>(res);
}

export async function deleteCvSkill(cvSkillId: string): Promise<{ deleted: true }> {
  const res = await fetch(`${API_URL}/cv/me/skills/${cvSkillId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    mode: "cors",
    credentials: "omit",
  });
  return handle<{ deleted: true }>(res);
}

export async function bulkReplaceCvSkills(skills: { name: string; version?: string; level: string }[]) {
  const res = await fetch(`${API_URL}/cv/me/skills/bulk-replace`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ skills }),
    mode: "cors",
    credentials: "omit",
  });
  return handle<CvSkillView[]>(res);
}

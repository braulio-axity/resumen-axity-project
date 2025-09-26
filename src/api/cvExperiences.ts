const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Error ${res.status}`; try { const d = await res.json(); msg = d?.message ?? msg; } catch { }
        throw new Error(msg);
    }
    try { return await res.json() as T; } catch { return undefined as unknown as T; }
}

export type ExpTech = { name: string; version?: string };
export type ExpProject = { id?: string; name: string; role: string; responsibilities: string; technologies: ExpTech[] };

export type ExperienceView = {
    id: string;
    company: string;
    position: string;
    startDate: string; // "YYYY-MM"
    endDate: string;   // "" o "YYYY-MM"
    current: boolean;
    challenges: string;
    achievements: string;
    technologies: ExpTech[];
    projects: ExpProject[];
};

export type CreateExperiencePayload = Omit<ExperienceView, 'id' | 'projects'> & { projects: Omit<ExpProject, 'id'>[] }


function authHeaders(): Record<string, string> {
    const t = localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
}

function jsonHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json' };
}

// Para componer sin perder tipos:
function mergeHeaders(...parts: Array<Record<string, string>>): HeadersInit {
    return Object.assign({}, ...parts);
}

export async function listCvExperiences() {
    const res = await fetch(`${API_URL}/cv/me/experiences`, {
        headers: mergeHeaders(authHeaders()),
    });
    return handle<ExperienceView[]>(res);
}

export async function createCvExperience(payload: CreateExperiencePayload) {
    const res = await fetch(`${API_URL}/cv/me/experiences`, {
        method: 'POST',
        headers: mergeHeaders(jsonHeaders(), authHeaders()),
        body: JSON.stringify(payload),
    });
    return handle<ExperienceView>(res);
}


export async function updateCvExperience(
    id: string,
    payload: CreateExperiencePayload
): Promise<ExperienceView> {
    const res = await fetch(`${API_URL}/cv/me/experiences/${id}`, {
        method: 'PATCH',
        headers: mergeHeaders(jsonHeaders(), authHeaders()),
        body: JSON.stringify(payload),
    });
    return handle<ExperienceView>(res); // ← uno solo
}

export async function deleteCvExperience(id: string) {
    const res = await fetch(`${API_URL}/cv/me/experiences/${id}`, {
        method: 'DELETE',
        headers: mergeHeaders(authHeaders()),
    });
    return handle<{ deleted: true }>(res);
}

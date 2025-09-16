export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function loginWithEmail(email: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // opcional si luego usas cookies httpOnly
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "No se pudo iniciar sesión");
  }
  return res.json() as Promise<{ access_token: string; user: { email: string } }>;
}

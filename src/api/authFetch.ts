import { useAuth } from "@/context/AuthContext";

export function useAuthFetch() {
  const { getValidToken, logout } = useAuth();

  return async (input: RequestInfo, init: RequestInit = {}) => {
    const token = getValidToken();
    const headers = new Headers(init.headers ?? {});
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(input, { ...init, headers, credentials: "include" });

    if (res.status === 401 || res.status === 403) {
      logout();
    }
    return res;
  };
}

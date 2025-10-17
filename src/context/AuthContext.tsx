import type { ConsultantLevel } from "@/types/app";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  level?: ConsultantLevel;
  role?: string; // "ADMIN" | "COLLAB"
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Decodifica el payload del JWT (sin verificar firma; solo para hidratar UI). */
function decodeJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión e hidratar usuario/rol desde el token si hace falta
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserRaw = localStorage.getItem("user");

    if (storedToken) {
      let nextUser: User | null = storedUserRaw ? JSON.parse(storedUserRaw) : null;

      // Si falta info crítica (role/email) la tomamos del JWT (Nest firma: { sub, role, email })
      const payload = decodeJwt<{ email?: string; role?: string }>(storedToken);
      if (!nextUser || !nextUser.role || !nextUser.email) {
        nextUser = {
          ...nextUser,
          email: nextUser?.email ?? payload?.email ?? "",
          role: nextUser?.role ?? payload?.role,
        };
        localStorage.setItem("user", JSON.stringify(nextUser));
      }

      setToken(storedToken);
      setUser(nextUser);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || "Credenciales inválidas");
    }

    const data: { access_token: string; user?: User } = await res.json();

    localStorage.setItem("token", data.access_token);

    // Preferimos el user del backend; si no viene, usamos el payload del JWT
    let nextUser: User | null = data.user ?? null;
    if (!nextUser) {
      const payload = decodeJwt<{ email?: string; role?: string }>(data.access_token);
      nextUser = { email: payload?.email ?? email, role: payload?.role };
    }

    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
    setToken(data.access_token);
  };

  const logout = () => {
    localStorage.clear()
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      user,
      loading,
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};

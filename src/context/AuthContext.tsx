import type { ConsultantLevel } from "@/types/app";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { configureApiAuth } from "@/api/technologies"; // <- para inyectar el token en tus APIs

type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  level?: ConsultantLevel;
  role?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Devuelve el token si es válido (no expirado), si no, null */
  getValidToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** -------- Helpers JWT -------- */
function parseJwt(token: string): any | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const payload = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function isJwtExpired(token: string, skewMs = 30000): boolean {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true; // si no tiene exp, considéralo inválido
  const expMs = payload.exp * 1000;
  return Date.now() > expMs - skewMs;
}
/** -------------------------------- */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false); // verificación con backend

  // Restaura sesión y valida
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken && !isJwtExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      verifyTokenWithAPI(storedToken)
        .then((serverUser) => {
          // si tu /auth/me devuelve el user, úsalo para poblar
          if (serverUser && serverUser.email) {
            setUser((prev) => ({ ...prev, ...serverUser }));
            localStorage.setItem("user", JSON.stringify({ ...(storedUser ? JSON.parse(storedUser) : {}), ...serverUser }));
          }
          setVerified(true);
        })
        .catch(() => {
          // token inválido o rechazado por backend
          hardLogout();
        })
        .finally(() => setLoading(false));
    } else {
      // no token o expirado
      hardLogout();
      setLoading(false);
    }
  }, []);

  // Inyecta token válido a tu capa API (technologies.ts)
  useEffect(() => {
    configureApiAuth(() => (token && !isJwtExpired(token) ? token : null));
  }, [token]);

  async function verifyTokenWithAPI(currentToken: string): Promise<User | null> {
    // Ajusta la ruta si tu backend usa /auth/profile u otra
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${currentToken}` },
      mode: "cors",                  // explícito
      credentials: "omit",
    });
    if (!res.ok) throw new Error(`Token inválido (${res.status})`);
    try {
      const data = await res.json();
      // modela lo que devuelva tu endpoint
      return (data?.user ?? data) as User;
    } catch {
      return null;
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      credentials: "omit",
      body: JSON.stringify({ email, password }),
    });
    console.log('first login check', res)

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || "Credenciales inválidas");
    }

    const data: { access_token: string; user?: User } = await res.json();
    const newToken = data.access_token;
    console.log('second login check', newToken)

    if (!newToken || isJwtExpired(newToken)) {
      throw new Error("El token recibido es inválido o está expirado");
    }

    // Verifica contra API y normaliza user
    let profile: User | null = null;
    try {
      profile = await verifyTokenWithAPI(newToken);
    } catch {
      // Si falla la verificación del token recién emitido, fuerza logout
      throw new Error("No se pudo validar la sesión con el servidor");
    }

    const finalUser: User = profile ?? data.user ?? { email };
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(finalUser));
    setToken(newToken);
    setUser(finalUser);
    setVerified(true);
  };

  const hardLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setVerified(false);
  };

  const logout = () => {
    hardLogout();
  };

  const getValidToken = () => {
    if (token && !isJwtExpired(token)) return token;
    return null;
  };

  const isAuthenticated = !!getValidToken() && verified;

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      getValidToken,
    }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};

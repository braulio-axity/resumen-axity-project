import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listTechnologies } from "@/api/technologies";
import type { Technology } from "@/types/technology";

type MapByName = Record<string, { category: string; color: string }>;

type TechCtx = {
  items: Technology[];
  mapByName: MapByName;
  loading: boolean;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

const TechnologiesCtx = createContext<TechCtx | null>(null);

const LS_KEY = "technologies_cache_v1";

function buildMap(items: Technology[]): MapByName {
  const m: MapByName = {};
  for (const t of items) m[t.name] = { category: t.category, color: t.color ?? "" };
  return m;
}

export const TechnologiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items: Technology[]; ts: number };
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
      }
    } catch {
        /* ignore */
    } finally {
        /* ignore */    
    }
  }, []);

  useEffect(() => {
    const checkSession = localStorage.getItem('token');
    if (checkSession) return void refresh();
  }, []);

  const refresh = async (_opts?: { force?: boolean }) => {
    try {
      setLoading(true);
      const res = await listTechnologies({ page: 1, pageSize: 1000, shape: "array" as any });
      const newItems = res.data ?? [];
      setItems((prev) => {
        const same =
          prev.length === newItems.length &&
          prev.every((p, i) =>
            p.id === newItems[i].id &&
            p.name === newItems[i].name &&
            (p.version ?? "") === (newItems[i].version ?? "") &&
            p.category === newItems[i].category &&
            (p.color ?? "") === (newItems[i].color ?? "")
          );
        if (!same) {
          try {
            localStorage.setItem(LS_KEY, JSON.stringify({ items: newItems, ts: Date.now() }));
          } catch { /* ignore */ }
          return newItems;
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };

  const mapByName = useMemo(() => buildMap(items), [items]);

  const value: TechCtx = useMemo(
    () => ({ items, mapByName, loading, refresh }),
    [items, mapByName, loading]
  );

  return <TechnologiesCtx.Provider value={value}>{children}</TechnologiesCtx.Provider>;
};

export const useTechnologiesContext = (): TechCtx => {
  const ctx = useContext(TechnologiesCtx);
  if (!ctx) throw new Error("useTechnologiesContext must be used inside TechnologiesProvider");
  return ctx;
};

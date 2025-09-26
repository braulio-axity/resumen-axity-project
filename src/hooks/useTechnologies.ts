import { useCallback, useMemo, useRef, useState } from "react";
import {
  listTechnologies as apiList,
  createTechnology as apiCreate,
  updateTechnology as apiUpdate,
  deleteTechnology as apiDelete,
} from "@/api/technologies";
import type { Technology, TechnologyQuery } from "@/types/technology";

/**
 * Hook de estado global para tecnologías.
 * - Mantiene lista/total/loading
 * - Mantiene lastQuery para refrescar con mismos filtros
 * - Expone mapa por nombre para catálogos rápidos
 */
export function useTechnologies() {
  const [items, setItems] = useState<Technology[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Guardamos la última query aplicada para ser usada en refresh posteriores
  const lastQueryRef = useRef<TechnologyQuery>({ page: 1, pageSize: 2000, shape: "array" });

  const buildMap = useCallback((list: Technology[]) => {
    const map: Record<string, { category: string; color: string }> = {};
    for (const t of list) {
      map[t.name] = { category: t.category, color: t.color ?? "" };
    }
    return map;
  }, []);

  const mapByName = useMemo(() => buildMap(items), [items, buildMap]);

  const list = useCallback(
    async (query?: TechnologyQuery) => {
      const q: TechnologyQuery = {
        shape: "array",
        page: 1,
        pageSize: 2000,
        ...(lastQueryRef.current || {}),
        ...(query || {}),
      };
      lastQueryRef.current = q;

      setLoading(true);
      try {
        const res = await apiList(q);
        setItems(res.data);
        setTotal(res.total);
        return { data: res.data, total: res.total };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(async (query?: TechnologyQuery) => {
    await list(query);
  }, [list]);

  const create = useCallback(
    async (payload: { name: string; category: string; version?: string; color?: string }) => {
      await apiCreate(payload);
      await refresh(lastQueryRef.current);
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, payload: Partial<Omit<Technology, "id">>) => {
      await apiUpdate(id, payload);
      await refresh(lastQueryRef.current);
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await apiDelete(id);
      const { page = 1, pageSize = 2000, ...rest } = lastQueryRef.current || {};
      const nextPage = items.length <= 1 && page > 1 ? page - 1 : page;
      await refresh({ page: nextPage, pageSize, ...rest });
    },
    [items.length, refresh]
  );

  return {
    items,
    total,
    loading,
    lastQuery: lastQueryRef.current,
    mapByName,
    refresh,
    list,
    create,
    update,
    remove,
  };
}

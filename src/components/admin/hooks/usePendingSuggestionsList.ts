import { useEffect, useState, useCallback } from 'react';
import { listSuggestions, type Suggestion } from '@/api/techSuggestions';

export function usePendingSuggestionsList(initialPageSize = 10) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSuggestions({ page, pageSize, search, status: 'PENDING' });
      setItems(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
    search,
    loading,
    error,
    setPage,
    setPageSize,
    setSearch,
    refresh,
    setItems,
  };
}
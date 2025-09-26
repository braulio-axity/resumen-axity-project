import { useState } from 'react';
import { usePendingSuggestionsList } from './hooks/usePendingSuggestionsList';
import { useSuggestionActions } from './hooks/useSuggestionsActions';

export default function AdminSuggestionsTab() {
  const {
    items, page, pageSize, total, totalPages, search, loading, error,
    setPage, setPageSize, setSearch, refresh
  } = usePendingSuggestionsList(10);

  const { approve, remove, busyId } = useSuggestionActions({
    refreshList: refresh
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const onApprove = async (id: string) => {
    try {
      await approve(id);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Error al aprobar');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  return (
    <div className="p-4">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Sugerencias pendientes</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Buscar por nombre…"
            className="border rounded-md px-3 py-2 text-sm"
          />
          <select
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value) || 10); }}
            className="border rounded-md px-2 py-2 text-sm"
            aria-label="Elementos por página"
          >
            {[5,10,20,50].map(n => <option key={n} value={n}>{n}/página</option>)}
          </select>
        </div>
      </header>

      {(error || localError) && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || localError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="px-3 py-2">Tecnología</th>
              <th className="px-3 py-2">Versión</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Color</th>
              <th className="px-3 py-2">Solicitada por</th>
              <th className="px-3 py-2">Creada</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">
                  No hay sugerencias pendientes 🎉
                </td>
              </tr>
            )}

            {items.map(s => (
              <tr key={s.id} className="bg-white shadow-sm rounded">
                <td className="px-3 py-2 font-medium">{s.name}</td>
                <td className="px-3 py-2">{s.version || '—'}</td>
                <td className="px-3 py-2">{s.category}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full border"
                      style={{ backgroundColor: s.color || '#e5e7eb' }}
                      aria-label={`Color ${s.color || 'N/A'}`}
                      title={s.color || 'N/A'}
                    />
                    {s.color || '—'}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm">{s.requestedBy}</td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      className="rounded-md bg-emerald-600 px-3 py-1 text-white text-sm disabled:opacity-50"
                      onClick={() => onApprove(s.id)}
                      disabled={busyId === s.id}
                      title="Aprobar sugerencia"
                    >
                      {busyId === s.id ? 'Aprobando…' : 'Aprobar'}
                    </button>
                    <button
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                      onClick={() => onDelete(s.id)}
                      disabled={busyId === s.id}
                      title="Eliminar sugerencia"
                    >
                      {busyId === s.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="py-6 text-center text-sm text-gray-500">Cargando…</div>
        )}
      </div>

      {/* Paginación */}
      {items.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Página {page} de {totalPages} — {total} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Anterior
            </button>
            <button
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
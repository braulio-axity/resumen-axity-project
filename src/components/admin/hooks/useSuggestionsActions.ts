import { useState } from 'react';
import { approveSuggestion, deleteSuggestion } from '@/api/techSuggestions';
import { useTechnologiesContext } from '@/context/TechnologiesContext';

type Refreshers = {
  refreshList: () => Promise<void> | void;
};

export function useSuggestionActions({ refreshList }: Refreshers) {
  const { refresh: refreshTechnologies } = useTechnologiesContext();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const approve = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      await approveSuggestion(id);
      await Promise.all([
        Promise.resolve(refreshList()),
        Promise.resolve(refreshTechnologies()),
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al aprobar');
      throw e;
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      await deleteSuggestion(id);
      await Promise.all([Promise.resolve(refreshList())]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
      throw e;
    } finally {
      setBusyId(null);
    }
  };

  return { approve, remove, busyId, error };
}
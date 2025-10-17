import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  delay?: number;
  onSave?: (data: any) => void;
  onLoad?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
}

export function useAutoSave({
  key,
  data,
  delay = 2000,
  onSave,
  onLoad,
  onError
}: UseAutoSaveOptions) {
  const [saveState, setSaveState] = useState<AutoSaveState>({ status: 'idle' });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);

  // Función para guardar en localStorage
  const saveToStorage = useCallback(async (dataToSave: any) => {
    try {
      setSaveState({ status: 'saving' });
      
      // Simular delay mínimo para UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const serializedData = JSON.stringify(dataToSave);
      localStorage.setItem(key, serializedData);
      
      const now = new Date();
      setSaveState({ status: 'saved', lastSaved: now });
      
      onSave?.(dataToSave);
      
      // Auto-reset to idle after 3 seconds
      setTimeout(() => {
        setSaveState(prev => prev.status === 'saved' ? { ...prev, status: 'idle' } : prev);
      }, 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar';
      setSaveState({ status: 'error', error: errorMessage });
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      
      toast.error('Error al guardar automáticamente', {
        description: 'Los cambios no se han guardado. Intenta de nuevo.',
        icon: '⚠️'
      });
    }
  }, [key, onSave, onError]);

  // Función para cargar desde localStorage
  const loadFromStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        onLoad?.(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.warn('Error loading data from localStorage:', error);
      localStorage.removeItem(key);
    }
    return null;
  }, [key, onLoad]);

  // Función para limpiar datos guardados
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setSaveState({ status: 'idle' });
      toast.success('Datos guardados eliminados', {
        icon: '🗑️'
      });
    } catch (error) {
      console.warn('Error clearing saved data:', error);
    }
  }, [key]);

  // Función para forzar guardado inmediato
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveToStorage(data);
  }, [data, saveToStorage]);

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    if (isInitialLoadRef.current) {
      const savedData = loadFromStorage();
      if (savedData) {
        toast.success('Datos recuperados automáticamente', {
          description: 'Se han cargado tus cambios guardados anteriormente.',
          icon: '💾'
        });
      }
      isInitialLoadRef.current = false;
    }
  }, [loadFromStorage]);

  // Efecto para auto guardar cuando cambian los datos
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    const currentDataString = JSON.stringify(data);
    
    // Solo guardar si los datos han cambiado
    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set nuevo timeout
      timeoutRef.current = setTimeout(() => {
        saveToStorage(data);
      }, delay);
      
      // Indicar que hay cambios pendientes
      if (saveState.status === 'saved' || saveState.status === 'idle') {
        setSaveState(prev => ({ ...prev, status: 'idle' }));
      }
    }
  }, [data, delay, saveToStorage, saveState.status]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Guardar antes de cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Guardar síncronamente
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
          console.warn('Error saving on page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key, data]);

  return {
    saveState,
    forceSave,
    clearSavedData,
    loadFromStorage
  };
}
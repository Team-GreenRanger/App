import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const [data, setData] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`localStorage getItem error for key "${key}":`, error);
      return defaultValue;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveData = useCallback(async (value: T): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('localStorage is not available');
      }
      
      localStorage.setItem(key, JSON.stringify(value));
      setData(value);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error(`localStorage setItem error for key "${key}":`, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const removeData = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('localStorage is not available');
      }
      
      localStorage.removeItem(key);
      setData(defaultValue);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(errorMessage);
      console.error(`localStorage removeItem error for key "${key}":`, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  const updateData = useCallback(async (updater: (prev: T | undefined) => T): Promise<boolean> => {
    const newValue = updater(data);
    return saveData(newValue);
  }, [data, saveData]);

  const reloadData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = localStorage.getItem(key);
      setData(item ? JSON.parse(item) : defaultValue);
      setError(null);
    } catch (error) {
      console.error(`localStorage reload error for key "${key}":`, error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류');
      setData(defaultValue);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
          setData(newValue);
        } catch (error) {
          console.error(`localStorage storage event error for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return {
    data,
    isLoading,
    error,
    save: saveData,
    remove: removeData,
    update: updateData,
    reload: reloadData
  };
};

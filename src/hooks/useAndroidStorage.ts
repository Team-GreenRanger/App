import { useState, useEffect, useCallback } from 'react';
import AndroidApi from '../api/AndroidApi';
import { StorageResult } from '../types/android-bridge.types';

export const useAndroidStorage = <T>(key: string, defaultValue?: T) => {
  const [data, setData] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AndroidApi.getFromStorage<T>(key, defaultValue);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || '데이터 로드 실패');
        setData(defaultValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  const saveData = useCallback(async (value: T): Promise<boolean> => {
    try {
      const result = await AndroidApi.saveToStorage(key, value);
      if (result.success) {
        setData(value);
        setError(null);
        return true;
      } else {
        setError(result.error || '데이터 저장 실패');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      return false;
    }
  }, [key]);

  const removeData = useCallback(async (): Promise<boolean> => {
    try {
      const result = await AndroidApi.removeFromStorage(key);
      if (result.success) {
        setData(defaultValue);
        setError(null);
        return true;
      } else {
        setError(result.error || '데이터 삭제 실패');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      return false;
    }
  }, [key, defaultValue]);

  const updateData = useCallback(async (updater: (prev: T | undefined) => T): Promise<boolean> => {
    const newValue = updater(data);
    return saveData(newValue);
  }, [data, saveData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    save: saveData,
    remove: removeData,
    update: updateData,
    reload: loadData
  };
};
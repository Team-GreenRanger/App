import { useState, useCallback } from 'react';
import { aiApi } from '../api';
import { EcoTipResponse } from '../types';

interface UseEcoTipReturn {
  ecoTip: EcoTipResponse | null;
  isLoading: boolean;
  error: string | null;
  generateEcoTip: () => Promise<void>;
  clearError: () => void;
}

export const useEcoTip = (): UseEcoTipReturn => {
  const [ecoTip, setEcoTip] = useState<EcoTipResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEcoTip = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiApi.generateEcoTip();
      setEcoTip(response);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '에코 팁을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ecoTip,
    isLoading,
    error,
    generateEcoTip,
    clearError,
  };
};

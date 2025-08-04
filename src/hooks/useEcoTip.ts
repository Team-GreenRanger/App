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

// 로컬 스토리지에서 오늘 날짜의 에코 팁을 가져오는 함수
const getTodaysEcoTip = (): EcoTipResponse | null => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cachedTipString = localStorage.getItem('daily_eco_tip');
    
    if (cachedTipString) {
      const cachedTip = JSON.parse(cachedTipString);
      const cachedDate = new Date(cachedTip.timestamp).toISOString().split('T')[0];
      
      // 오늘 날짜와 캐시된 날짜가 같으면 캐시된 데이터 반환
      if (cachedDate === today) {
        return cachedTip;
      }
    }
  } catch (error) {
    console.error('Error reading cached eco tip:', error);
  }
  
  return null;
};

// 로컬 스토리지에 오늘의 에코 팁을 저장하는 함수
const saveTodaysEcoTip = (tip: EcoTipResponse): void => {
  try {
    localStorage.setItem('daily_eco_tip', JSON.stringify(tip));
  } catch (error) {
    console.error('Error saving eco tip to cache:', error);
  }
};

export const useEcoTip = (): UseEcoTipReturn => {
  const [ecoTip, setEcoTip] = useState<EcoTipResponse | null>(() => getTodaysEcoTip());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEcoTip = useCallback(async () => {
    // 이미 오늘의 팁이 있다면 API 호출하지 않음
    const cachedTip = getTodaysEcoTip();
    if (cachedTip) {
      setEcoTip(cachedTip);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiApi.generateEcoTip();
      setEcoTip(response);
      saveTodaysEcoTip(response); // 캐시에 저장
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

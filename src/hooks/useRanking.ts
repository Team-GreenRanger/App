import { useState, useCallback, useEffect } from 'react';
import { rankingApi } from '../api';
import {
  LeaderboardData,
  RankingResponse,
  RankingStats,
  UserRankingStats,
  RankingType,
  RankingPeriod,
  RankingScope,
} from '../types';

interface UseRankingReturn {
  leaderboardData: LeaderboardData | null;
  rankingStats: RankingStats | null;
  userRankingStats: UserRankingStats | null;
  isLoading: boolean;
  error: string | null;
  loadLeaderboard: () => Promise<void>;
  loadRankings: (params?: {
    type?: RankingType;
    period?: RankingPeriod;
    scope?: RankingScope;
    limit?: number;
    offset?: number;
  }) => Promise<RankingResponse | null>;
  loadUserRanking: (params?: {
    period?: RankingPeriod;
    scope?: RankingScope;
  }) => Promise<void>;
  loadRankingStats: () => Promise<void>;
  clearError: () => void;
}

export const useRanking = (): UseRankingReturn => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [rankingStats, setRankingStats] = useState<RankingStats | null>(null);
  const [userRankingStats, setUserRankingStats] = useState<UserRankingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await rankingApi.getLeaderboard();
      setLeaderboardData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load leaderboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRankings = useCallback(async (params?: {
    type?: RankingType;
    period?: RankingPeriod;
    scope?: RankingScope;
    limit?: number;
    offset?: number;
  }): Promise<RankingResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await rankingApi.getRankings(params);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load rankings.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserRanking = useCallback(async (params?: {
    period?: RankingPeriod;
    scope?: RankingScope;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await rankingApi.getCurrentUserRanking(params);
      setUserRankingStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load user ranking.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRankingStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await rankingApi.getRankingStats();
      setRankingStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load ranking stats.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    leaderboardData,
    rankingStats,
    userRankingStats,
    isLoading,
    error,
    loadLeaderboard,
    loadRankings,
    loadUserRanking,
    loadRankingStats,
    clearError,
  };
};

import { useState, useCallback, useEffect } from 'react';
import { missionApi } from '../api';
import {
  Mission,
  UserMission,
  MissionStatus,
  UserMissionStatus,
  AssignMissionRequest,
  SubmitMissionRequest,
  SubmitMissionResponse,
} from '../types';

interface UseMissionsReturn {
  missions: Mission[];
  userMissions: UserMission[];
  dailyMissions: UserMission[];
  isLoading: boolean;
  error: string | null;
  loadMissions: (status?: MissionStatus, type?: string) => Promise<void>;
  loadUserMissions: (status?: UserMissionStatus) => Promise<void>;
  loadDailyMissions: () => Promise<void>;
  assignMission: (request: AssignMissionRequest) => Promise<UserMission | null>;
  submitMission: (userMissionId: string, request: SubmitMissionRequest) => Promise<SubmitMissionResponse | null>;
  clearError: () => void;
}

export const useMissions = (): UseMissionsReturn => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [dailyMissions, setDailyMissions] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMissions = useCallback(async (status?: MissionStatus, type?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await missionApi.getMissions(status, type);
      setMissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '미션을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserMissions = useCallback(async (status?: UserMissionStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await missionApi.getUserMissions(status);
      setUserMissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '사용자 미션을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDailyMissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await missionApi.getDailyMissions();
      setDailyMissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '일일 미션을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignMission = useCallback(async (request: AssignMissionRequest): Promise<UserMission | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const userMission = await missionApi.assignMission(request);
      
      // 기존 사용자 미션 목록 업데이트
      setUserMissions(prev => [...prev, userMission]);
      
      return userMission;
    } catch (err: any) {
      // 409 Conflict: 이미 완료된 미션
      if (err.response?.status === 409) {
        setError('이 미션은 이미 완료되었습니다.');
      } else {
        setError(err.response?.data?.message || err.message || '미션 할당 중 오류가 발생했습니다.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitMission = useCallback(async (userMissionId: string, request: SubmitMissionRequest): Promise<SubmitMissionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUserMission = await missionApi.submitMission(userMissionId, request);
      
      // 사용자 미션 목록 업데이트
      setUserMissions(prev => 
        prev.map(um => um.id === userMissionId ? updatedUserMission : um)
      );
      
      // 일일 미션 목록도 있다면 업데이트
      setDailyMissions(prev => 
        prev.map(um => um.id === userMissionId ? updatedUserMission : um)
      );
      
      return updatedUserMission;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || '미션 제출 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 초기 로드
  useEffect(() => {
    loadDailyMissions();
  }, [loadDailyMissions]);

  return {
    missions,
    userMissions,
    dailyMissions,
    isLoading,
    error,
    loadMissions,
    loadUserMissions,
    loadDailyMissions,
    assignMission,
    submitMission,
    clearError,
  };
};

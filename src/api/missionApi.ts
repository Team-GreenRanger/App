import { privateApi } from './index';
import {
  Mission,
  UserMission,
  MissionStatus,
  UserMissionStatus,
  AssignMissionRequest,
  SubmitMissionRequest,
  SubmitMissionResponse,
  VerifyMissionRequest,
  MissionListResponse,
  UserMissionListResponse,
  MissionDetailsResponse,
  DailyMissionsResponse,
} from '../types';

class MissionApiService {
  async getMissions(status?: MissionStatus, type?: string): Promise<Mission[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    
    const response = await privateApi.get<Mission[]>(`/missions?${params.toString()}`);
    return response.data;
  }

  async getMissionById(id: string): Promise<Mission> {
    const response = await privateApi.get<Mission>(`/missions/${id}`);
    return response.data;
  }

  async assignMission(request: AssignMissionRequest): Promise<UserMission> {
    const response = await privateApi.post<UserMission>('/missions/assign', request);
    return response.data;
  }

  async getDailyMissions(): Promise<UserMission[]> {
    const response = await privateApi.get<UserMission[]>('/missions/user/daily-missions');
    return response.data;
  }

  async getUserMissions(status?: UserMissionStatus): Promise<UserMission[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await privateApi.get<UserMission[]>(`/missions/user/missions?${params.toString()}`);
    return response.data;
  }

  async submitMission(userMissionId: string, request: SubmitMissionRequest): Promise<SubmitMissionResponse> {
    const response = await privateApi.patch<SubmitMissionResponse>(`/missions/user-missions/${userMissionId}/submit`, request);
    return response.data;
  }

  async verifyMission(userMissionId: string, request: VerifyMissionRequest): Promise<UserMission> {
    const response = await privateApi.patch<UserMission>(`/missions/user-missions/${userMissionId}/verify`, request);
    return response.data;
  }

  // 미션과 사용자 미션 정보를 함께 가져오는 헬퍼 메서드
  async getMissionWithUserProgress(missionId: string): Promise<{ mission: Mission; userMission?: UserMission }> {
    const [mission, userMissions] = await Promise.all([
      this.getMissionById(missionId),
      this.getUserMissions()
    ]);

    const userMission = userMissions.find(um => um.missionId === missionId);

    return { mission, userMission };
  }

  // 활성 미션만 가져오기
  async getActiveMissions(): Promise<Mission[]> {
    return this.getMissions(MissionStatus.ACTIVE);
  }

  // 완료된 사용자 미션만 가져오기
  async getCompletedUserMissions(): Promise<UserMission[]> {
    return this.getUserMissions(UserMissionStatus.COMPLETED);
  }

  // 진행 중인 사용자 미션만 가져오기
  async getActiveUserMissions(): Promise<UserMission[]> {
    const missions = await this.getUserMissions();
    return missions.filter(mission => 
      mission.status === UserMissionStatus.ASSIGNED || 
      mission.status === UserMissionStatus.IN_PROGRESS ||
      mission.status === UserMissionStatus.SUBMITTED
    );
  }
}

export const missionApi = new MissionApiService();
export default missionApi;

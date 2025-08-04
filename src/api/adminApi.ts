import { privateApi } from './index';

export interface CreateRewardRequest {
  name: string;
  description: string;
  type: 'DISCOUNT_COUPON' | 'GIFT_CARD' | 'ECO_PRODUCT' | 'EXPERIENCE';
  cost: number;
  imageUrl?: string;
  barcodeImageUrl?: string;
  originalPrice?: number;
  partnerName?: string;
  partnerLogoUrl?: string;
  termsAndConditions?: string;
  validityDays?: number;
  totalQuantity?: number;
  expiryDate?: string;
}

export interface UpdateRewardRequest {
  name?: string;
  description?: string;
  cost?: number;
  imageUrl?: string;
  totalQuantity?: number;
  status?: 'AVAILABLE' | 'DISCONTINUED' | 'OUT_OF_STOCK';
  expiryDate?: string;
}

export interface VerifyMissionRequest {
  decision: 'approved' | 'rejected';
  verificationNote?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMissions: number;
  totalRewards: number;
  pendingVerifications: number;
}

class AdminApiService {
  // 리워드 관리
  async createReward(request: CreateRewardRequest) {
    const response = await privateApi.post('/rewards/admin/create', request);
    return response.data;
  }

  async updateReward(id: string, request: UpdateRewardRequest) {
    const response = await privateApi.put(`/rewards/admin/${id}`, request);
    return response.data;
  }

  async deleteReward(id: string) {
    const response = await privateApi.delete(`/rewards/admin/${id}`);
    return response.data;
  }

  // 미션 검증
  async verifyMission(userMissionId: string, request: VerifyMissionRequest) {
    const response = await privateApi.patch(`/missions/user-missions/${userMissionId}/verify`, request);
    return response.data;
  }

  // 검증 대기 중인 미션들 조회 (일반 API 활용)
  async getPendingMissions() {
    const response = await privateApi.get('/missions/user/missions?status=SUBMITTED');
    return response.data;
  }

  // 모든 리워드 조회 (일반 API 활용)
  async getAllRewards() {
    const response = await privateApi.get('/rewards?limit=100');
    return response.data;
  }

  // 통계 조회 (현재는 더미 데이터, 나중에 실제 API로 대체 가능)
  async getAdminStats(): Promise<AdminStats> {
    // 실제로는 여러 API를 호출해서 통계를 계산해야 합니다
    return {
      totalUsers: 1250,
      totalMissions: 45,
      totalRewards: 23,
      pendingVerifications: 8
    };
  }
}

export const adminApi = new AdminApiService();
export default adminApi;

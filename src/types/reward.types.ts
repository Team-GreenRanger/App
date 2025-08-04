// 리워드 상태 타입 (통합 버전)
export type RewardStatus =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "EXPIRED"
  | "OUT_OF_STOCK"
  | "DISCONTINUED";

// 리워드 유형 타입 (통합 버전)
export type RewardType =
  | "DISCOUNT_COUPON"
  | "GIFT_CARD"
  | "PHYSICAL_ITEM"
  | "DIGITAL_ITEM"
  | "ECO_PRODUCT"
  | "EXPERIENCE"
  | "DONATION";

// 사용자 리워드 상태 타입 (스웨거 기준)
export type UserRewardStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DELIVERED"
  | "EXPIRED"
  | "CANCELLED";

// 리워드 기본 정보 타입
export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  cost: number;
  imageUrl: string;
  availableQuantity: number;
  status: RewardStatus;
  expiryDate: string; // ISO 8601 날짜 문자열
  createdAt: string; // ISO 8601 날짜 문자열
}

// 사용자 리워드 타입 (스웨거 기준)
export interface UserReward {
  creditCost: number;
  status: UserRewardStatus;
  redemptionCode: string;
  deliveryAddress: string;
  trackingNumber: string;
  redeemedAt: string; // ISO 8601 날짜 문자열
  expiresAt: string; // ISO 8601 날짜 문자열
  reward: {
    id: string;
    name: string;
    description: string;
    type: RewardType;
    cost: number;
    imageUrl: string;
    availableQuantity: number;
    status: RewardStatus;
    expiryDate: string; // ISO 8601 날짜 문자열
    createdAt: string; // ISO 8601 날짜 문자열
  };
}

// 리워드 목록 응답 타입 (일반 리워드 API용)
export interface RewardResponse {
  rewards: Reward[];
  total: number;
  hasNext: boolean;
}

// 사용자 리워드 목록 응답 타입 (스웨거 기준)
export interface UserRewardsResponse {
  userRewards: UserReward[];
  total: number;
  hasNext: boolean;
}

// 사용자 리워드 API 요청 파라미터 타입 (스웨거 기준)
export interface UserRewardsParams {
  status?: UserRewardStatus;
  limit?: number;
  offset?: number;
}

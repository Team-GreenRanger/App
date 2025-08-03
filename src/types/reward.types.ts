// Reward 타입 정의 (Swagger 문서 기준)
export type RewardType =
  | "DISCOUNT_COUPON"
  | "GIFT_CARD"
  | "ECO_PRODUCT"
  | "EXPERIENCE"
  | "DONATION";
export type RewardStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";

// Reward 인터페이스
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

// API 쿼리 파라미터 인터페이스
export interface RewardQueryParams {
  type?: RewardType;
  status?: RewardStatus;
  maxCost?: number;
  limit?: number;
  offset?: number;
}

// 전체 응답 인터페이스
export interface RewardResponse {
  rewards: Reward[];
  total: number;
  hasNext: boolean;
}

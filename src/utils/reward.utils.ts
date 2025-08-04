import { privateApi } from "../api";
import {
  UserRewardsResponse,
  UserRewardsParams,
  RewardResponse,
} from "../types";

export const getRewards = async (): Promise<RewardResponse> => {
  try {
    const response = await privateApi.get<RewardResponse>("/rewards");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch rewards:", error);
    throw new Error("리워드를 불러오는데 실패했습니다.");
  }
};

export const getUserRewards = async (
  params?: UserRewardsParams
): Promise<UserRewardsResponse> => {
  try {
    const response = await privateApi.get<UserRewardsResponse>(
      "/rewards/user/my-rewards",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user rewards:", error);
    throw new Error("내 리워드를 불러오는데 실패했습니다.");
  }
};

// 특정 상태의 사용자 리워드만 가져오는 함수
export const getUserRewardsByStatus = async (
  status: UserRewardsParams["status"],
  limit?: number,
  offset?: number
): Promise<UserRewardsResponse> => {
  return getUserRewards({ status, limit, offset });
};

// 페이지네이션을 위한 함수
export const getUserRewardsPaginated = async (
  limit: number = 10,
  offset: number = 0,
  status?: UserRewardsParams["status"]
): Promise<UserRewardsResponse> => {
  return getUserRewards({ limit, offset, status });
};

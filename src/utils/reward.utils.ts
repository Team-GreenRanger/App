import { privateApi } from "../api";
import { RewardResponse } from "../types";

export const getRewards = async (): Promise<RewardResponse> => {
  try {
    const response = await privateApi.get<RewardResponse>("/rewards");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch rewards:", error);
    throw new Error("리워드를 불러오는데 실패했습니다.");
  }
};

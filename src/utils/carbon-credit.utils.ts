import { privateApi } from "../api";
import { CarbonCreditBalance, TransactionResponse } from "../types";

export const getCarbonCreditBalance =
  async (): Promise<CarbonCreditBalance> => {
    try {
      const response = await privateApi.get<CarbonCreditBalance>(
        "/carbon-credits/balance"
      );
      return response.data;
    } catch (error) {
      console.error("카본 크레딧 조회 실패:", error);
      return {
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  };

export const getCarbonCreditTransactions =
  async (): Promise<TransactionResponse> => {
    try {
      const response = await privateApi.get<TransactionResponse>(
        "/carbon-credits/transactions"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch carbon credit transactions:", error);
      throw new Error("거래 내역을 불러오는데 실패했습니다.");
    }
  };

export interface CarbonCreditBalance {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

// Transaction 타입 정의 (Swagger 문서 기준)
export type TransactionType = "EARNED" | "SPENT" | "REFUNDED";
export type TransactionStatus = "PENDING";

// Transaction 인터페이스
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  sourceType: string;
  sourceId: string;
  status: TransactionStatus;
  createdAt: string; // ISO 8601 날짜 문자열
  updatedAt: string; // ISO 8601 날짜 문자열
}

// 전체 응답 인터페이스
export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  hasNext: boolean;
}

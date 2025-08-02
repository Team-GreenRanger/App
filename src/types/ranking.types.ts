export type RankingType = 'CARBON_CREDITS' | 'MISSIONS_COMPLETED' | 'CO2_REDUCTION';
export type RankingPeriod = 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export interface RankingUser {
  rank: number;
  userId: string;
  userName: string;
  profileImageUrl?: string;
  score: number;
  level: number;
  isCurrentUser: boolean;
}

export interface RankingResponse {
  rankings: RankingUser[];
  total: number;
  type: RankingType;
  period: RankingPeriod;
  hasNext: boolean;
}

export interface UserRankingStats {
  currentRank: number;
  currentScore: number;
  previousRank: number;
  rankChange: number;
  scoreToNextRank: number;
  nextRankPosition: number;
}

export interface LeaderboardData {
  weekly: RankingResponse;
  monthly: RankingResponse;
  allTime: RankingResponse;
  currentUserStats: UserRankingStats;
}

export interface RankingStats {
  totalUsers: number;
  currentUser: UserRankingStats;
  topCarbonCreditUsers: string[];
  topMissionUsers: string[];
  topCo2ReductionUsers: string[];
}

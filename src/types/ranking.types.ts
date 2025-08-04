export type RankingType = 'CARBON_CREDITS' | 'MISSIONS_COMPLETED' | 'CO2_REDUCTION';
export type RankingPeriod = 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
export type RankingScope = 'LOCAL' | 'GLOBAL';

export interface RankingUser {
  rank: number;
  userId: string;
  userName: string;
  profileImageUrl?: string;
  score: number;
  isCurrentUser: boolean;
}

export interface RankingResponse {
  rankings: RankingUser[];
  total: number;
  type: RankingType;
  period: RankingPeriod;
  scope: RankingScope;
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
  localWeekly: RankingResponse;
  localMonthly: RankingResponse;
  localAllTime: RankingResponse;
  globalWeekly: RankingResponse;
  globalMonthly: RankingResponse;
  globalAllTime: RankingResponse;
  currentUserStats: UserRankingStats;
}

export interface RankingStats {
  totalUsers: number;
  currentUser: UserRankingStats;
  topCarbonCreditUsers: RankingUser[];
  topMissionUsers: RankingUser[];
  topCo2ReductionUsers: RankingUser[];
}

import { privateApi } from './privateApi';
import {
  LeaderboardData,
  RankingResponse,
  RankingStats,
  UserRankingStats,
  RankingType,
  RankingPeriod,
  RankingScope,
} from '../types';

interface GetRankingsParams {
  type?: RankingType;
  period?: RankingPeriod;
  scope?: RankingScope;
  limit?: number;
  offset?: number;
}

interface GetUserRankingParams {
  period?: RankingPeriod;
  scope?: RankingScope;
}

class RankingApi {
  private readonly basePath = '/rankings';

  async getLeaderboard(): Promise<LeaderboardData> {
    const response = await privateApi.get<LeaderboardData>(`${this.basePath}/leaderboard`);
    return response.data;
  }

  async getRankings(params?: GetRankingsParams): Promise<RankingResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.period) queryParams.append('period', params.period);
    if (params?.scope) queryParams.append('scope', params.scope);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    const response = await privateApi.get<RankingResponse>(url);
    return response.data;
  }

  async getCurrentUserRanking(params?: GetUserRankingParams): Promise<UserRankingStats> {
    const queryParams = new URLSearchParams();
    
    if (params?.period) queryParams.append('period', params.period);
    if (params?.scope) queryParams.append('scope', params.scope);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${this.basePath}/my-stats?${queryString}` 
      : `${this.basePath}/my-stats`;
    
    const response = await privateApi.get<UserRankingStats>(url);
    return response.data;
  }

  async getRankingStats(): Promise<RankingStats> {
    const response = await privateApi.get<RankingStats>(`${this.basePath}/stats`);
    return response.data;
  }
}

const rankingApi = new RankingApi();
export default rankingApi;

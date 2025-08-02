import React, { useEffect, useState } from 'react';
import { useAndroidApi } from '../hooks/useAndroidApi';
import { privateApi } from '../api';
import Tabs from '../components/Tabs';
import { RankingHeaderCard, RankingItem, ToastModal } from '../components';
import { LeaderboardData, UserRankingStats, RankingUser } from '../types';

const RankingPage: React.FC = () => {
  const { updateBottomNavigation, vibrate, showToast } = useAndroidApi();
  const [activeTab, setActiveTab] = useState('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    isVisible: false,
    type: 'info' as 'info' | 'warning' | 'error' | 'confirm',
    title: '',
    message: '',
  });

  const tabs = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'allTime', label: 'All Time' }
  ];

  useEffect(() => {
    updateBottomNavigation('ranking');
    loadLeaderboardData();
  }, [updateBottomNavigation]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await privateApi.get<LeaderboardData>('/rankings/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('리더보드 데이터 로드 실패:', error);
      showModal('error', '오류', '랭킹 데이터를 로드하지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (type: 'info' | 'warning' | 'error' | 'confirm', title: string, message: string) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const getCurrentRankings = (): RankingUser[] => {
    if (!leaderboardData) return [];
    
    switch (activeTab) {
      case 'weekly':
        return leaderboardData.weekly.rankings;
      case 'monthly':
        return leaderboardData.monthly.rankings;
      case 'allTime':
        return leaderboardData.allTime.rankings;
      default:
        return [];
    }
  };

  const getCurrentUserStats = (): UserRankingStats | null => {
    return leaderboardData?.currentUserStats || null;
  };

  const getCurrentUserRank = (): number => {
    const stats = getCurrentUserStats();
    return stats?.currentRank || 0;
  };

  const getCurrentUserScore = (): number => {
    const stats = getCurrentUserStats();
    return stats?.currentScore || 0;
  };

  const handleRankingItemClick = (user: RankingUser) => {
    vibrate({ duration: 100 });
    if (user.isCurrentUser) {
      showToast({ message: '내 순위입니다!' });
    } else {
      showToast({ message: `${user.userName}님의 순위입니다.` });
    }
  };

  const handleLoadMore = async () => {
    try {
      showToast({ message: '더 많은 랭킹을 불러옵니다!' });
    } catch (error) {
      console.error('추가 랭킹 로드 실패:', error);
    }
  };

  const getRankChangeText = () => {
    const stats = getCurrentUserStats();
    if (!stats) return '';
    
    const change = stats.rankChange;
    if (change > 0) {
      return `↑ ${change}`;
    } else if (change < 0) {
      return `↓ ${Math.abs(change)}`;
    }
    return '—';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">랭킹 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ranking</h1>
        
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <RankingHeaderCard 
          rank={getCurrentUserRank()}
          points={getCurrentUserScore()}
        />

        {getCurrentUserStats() && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                순위 변동: <span className={`font-medium ${
                  getCurrentUserStats()!.rankChange > 0 ? 'text-green-600' : 
                  getCurrentUserStats()!.rankChange < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getRankChangeText()}
                </span>
              </div>
              <div className="text-gray-600">
                다음 순위까지: <span className="font-medium text-blue-600">
                  {getCurrentUserStats()!.scoreToNextRank} 점
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-1">
          {getCurrentRankings().map((user) => (
            <div 
              key={user.userId}
              onClick={() => handleRankingItemClick(user)}
              className="cursor-pointer"
            >
              <RankingItem
                rank={user.rank}
                name={user.userName}
                points={user.score}
                isCurrentUser={user.isCurrentUser}
                avatar={user.profileImageUrl}
              />
            </div>
          ))}
        </div>

        {getCurrentRankings().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">랭킹 데이터가 없습니다.</p>
          </div>
        )}

        {leaderboardData && getCurrentRankings().length > 0 && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleLoadMore}
              className="text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              더 보기
            </button>
          </div>
        )}
      </div>

      <ToastModal
        isVisible={modal.isVisible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={hideModal}
      />
    </div>
  );
};

export default RankingPage;

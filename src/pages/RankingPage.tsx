import React, { useEffect, useState } from "react";
import { useAndroidApi, useRanking } from "../hooks";
import Tabs from "../components/Tabs";
import { RankingHeaderCard, RankingItem, ToastModal } from "../components";
import {
  UserRankingStats,
  RankingUser,
  RankingScope,
} from "../types";

const RankingPage = () => {
  const { updateBottomNavigation, vibrate, showToast } = useAndroidApi();
  const { leaderboardData, isLoading, error, loadLeaderboard } = useRanking();
  const [activeScopeTab, setActiveScopeTab] = useState<RankingScope>("GLOBAL");
  const [modal, setModal] = useState({
    isVisible: false,
    type: "info" as "info" | "warning" | "error" | "confirm",
    title: "",
    message: "",
  });

  const scopeTabs = [
    { id: "GLOBAL", label: "Global" },
    { id: "LOCAL", label: "Local" },
  ];

  useEffect(() => {
    updateBottomNavigation("ranking");
    loadLeaderboard();
  }, [updateBottomNavigation, loadLeaderboard]);

  useEffect(() => {
    if (error) {
      showModal("error", "Error", error);
    }
  }, [error]);

  const showModal = (
    type: "info" | "warning" | "error" | "confirm",
    title: string,
    message: string
  ) => {
    setModal({ isVisible: true, type, title, message });
  };

  const hideModal = () => {
    setModal({ ...modal, isVisible: false });
  };

  const getCurrentRankings = (): RankingUser[] => {
    if (!leaderboardData) return [];

    const scope = activeScopeTab.toLowerCase() as 'local' | 'global';
    const period = 'monthly';
    
    const key = `${scope}${period.charAt(0).toUpperCase() + period.slice(1)}` as keyof typeof leaderboardData;
    
    const rankingData = leaderboardData[key];
    return rankingData && typeof rankingData === 'object' && 'rankings' in rankingData 
      ? rankingData.rankings 
      : [];
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
      showToast({ message: "This is my rank!" });
    } else {
      showToast({ message: `This is ${user.userName}'s rank.` });
    }
  };

  const handleLoadMore = async () => {
    try {
      showToast({ message: "Loading more rankings!" });
    } catch (error) {
      console.error("Failed to load more rankings:", error);
    }
  };

  const getRankChangeText = () => {
    const stats = getCurrentUserStats();
    if (!stats) return "";

    const change = stats.rankChange;
    if (change > 0) {
      return `↑ ${change}`;
    } else if (change < 0) {
      return `↓ ${Math.abs(change)}`;
    }
    return "—";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Monthly Ranking</h1>
        <p className="text-sm text-gray-500 mb-4">Rankings reset on the 1st of each month</p>

        <div className="mb-4">
          <Tabs 
            tabs={scopeTabs} 
            activeTab={activeScopeTab} 
            onTabChange={(tab) => setActiveScopeTab(tab as RankingScope)} 
          />
        </div>

        {isLoading ? (
          <div className="skeleton rounded-2xl h-32 mb-4"></div>
        ) : (
          <RankingHeaderCard
            rank={getCurrentUserRank()}
            points={getCurrentUserScore()}
          />
        )}

        {isLoading ? (
          <div className="skeleton rounded-xl h-20 mt-4"></div>
        ) : getCurrentUserStats() && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                Rank Change:{" "}
                <span
                  className={`font-medium ${
                    getCurrentUserStats()!.rankChange > 0
                      ? "text-green-600"
                      : getCurrentUserStats()!.rankChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {getRankChangeText()}
                </span>
              </div>
              <div className="text-gray-600">
                To Next Rank:{" "}
                <span className="font-medium text-blue-600">
                  {getCurrentUserStats()!.scoreToNextRank} points
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {activeScopeTab === 'LOCAL' ? '🏠 Local Rankings' : '🌍 Global Rankings'} • This Month
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-20">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <div className="flex items-center">
                  <div className="skeleton w-8 h-8 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="skeleton h-5 rounded w-24 mb-1"></div>
                        <div className="skeleton h-4 rounded w-16"></div>
                      </div>
                      <div className="text-right">
                        <div className="skeleton h-5 rounded w-20 mb-1"></div>
                        <div className="skeleton h-3 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
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
                <p className="text-gray-500">No ranking data available for this month.</p>
                <p className="text-gray-400 text-sm mt-2">
                  {activeScopeTab === 'LOCAL' 
                    ? 'No users from your country have earned points this month.' 
                    : 'No global ranking data available for this month.'}
                </p>
              </div>
            )}

            {leaderboardData && getCurrentRankings().length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  className="text-green-600 font-medium hover:text-green-700 transition-colors px-6 py-3 rounded-xl hover:bg-green-50"
                >
                  Load More
                </button>
              </div>
            )}
          </>
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserProfileHeader,
  CarbonCreditCard,
  EcoTipCard,
  LearnMoreCard,
  NotificationCenter,
} from "../components";
import { useAndroidApi } from "../hooks";
import { privateApi } from "../api";
import { UserProfile, UserStatistics } from "../types";
import { HiSparkles, HiGlobeAlt } from "react-icons/hi";
import AiButton from "../components/AiButton";

const HomePage: React.FC = () => {
  const { updateBottomNavigation, showToast } = useAndroidApi();
  const navigate = useNavigate();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateBottomNavigation("home");
    loadUserData();
  }, [updateBottomNavigation]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        privateApi.get<UserProfile>("/users/profile"),
        privateApi.get<UserStatistics>("/users/statistics"),
      ]);

      setProfile(profileResponse.data);
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error("홈페이지 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarbonCreditClick = () => {
    navigate("/my/credit");
  };

  const handleStartLearning = () => {
    showToast({ message: "학습 프로그램을 시작합니다!" });
  };

  const handleNotificationClick = () => {
    setIsNotificationVisible(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationVisible(false);
  };

  const getTreesPlanted = () => {
    if (!statistics) return 0;
    return Math.floor(statistics.totalMissionsCompleted / 5);
  };

  const getWeeklyTreesPlanted = () => {
    return Math.floor(getTreesPlanted() * 0.3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <UserProfileHeader
        name={profile?.name || "Guest"}
        profileImageUrl={profile?.profileImageUrl}
        onNotificationClick={handleNotificationClick}
      />

      <NotificationCenter
        isVisible={isNotificationVisible}
        onClose={handleCloseNotification}
      />

      <div className="px-4 pb-20">
        <div className="mb-6">
          <CarbonCreditCard
            points={statistics?.currentCarbonCredits || 0}
            onClick={handleCarbonCreditClick}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome {profile?.name || "Guest"}!
          </h2>
          <p className="text-gray-600">
            You planted {getWeeklyTreesPlanted()} trees this week
          </p>
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-green-600 font-medium">
                Level {statistics?.currentLevel || 1}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-blue-600 font-medium">
                {statistics?.totalCo2Reduction || 0}kg CO₂ saved
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-purple-600 font-medium">
                #{statistics?.globalRanking || 999} rank
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <EcoTipCard
            title="Today's Eco Tips"
            description="Unplug Electronic devices when not in use. Unplugging unused electronics can save about 50 kg of CO₂ annually and reduced your energy bill!"
            icon={<HiSparkles className="w-6 h-6 text-blue-600" />}
          />

          <LearnMoreCard
            title="Let's learn more!"
            description="Learn how to prevent climate change and stay prepared for extreme weather conditions."
            buttonText="Start Learning"
            icon={<HiGlobeAlt className="w-6 h-6 text-green-600" />}
            onButtonClick={handleStartLearning}
          />
        </div>
      </div>
      <AiButton />
    </div>
  );
};

export default HomePage;

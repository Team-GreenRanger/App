import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserProfileHeader,
  CarbonCreditCard,
  EcoTipCard,
  LearnMoreCard,
  AiButton,
} from "../components";
import { useAndroidApi } from "../hooks";
import { privateApi } from "../api";
import { UserProfile, UserStatistics, EcoTip } from "../types";
import { HiSparkles, HiGlobeAlt } from "react-icons/hi";

const HomePage = () => {
  const { updateBottomNavigation, showToast } = useAndroidApi();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [ecoTip, setEcoTip] = useState<EcoTip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateBottomNavigation("home");
    loadUserData();
  }, [updateBottomNavigation]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, statsResponse, ecoTipResponse] =
        await Promise.all([
          privateApi.get<UserProfile>("/users/profile"),
          privateApi.get<UserStatistics>("/users/statistics"),
          privateApi.get<EcoTip>("/ai/eco-tip"),
        ]);

      setProfile(profileResponse.data);
      setStatistics(statsResponse.data);
      setEcoTip(ecoTipResponse.data);
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
    navigate("/education");
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
          <p className="text-gray-600 mb-4">
            You planted {getWeeklyTreesPlanted()} trees this week
          </p>

          {/* 캡슐 형태의 통계 표시 */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-blue-700 font-semibold text-sm">
                {statistics?.totalCo2Reduction || 0}kg CO₂ saved
              </span>
            </div>

            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-purple-700 font-semibold text-sm">
                #{statistics?.globalRanking || 999} rank
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <EcoTipCard
            title="Today's Eco Tips"
            description={ecoTip?.tip || "Loading eco tip..."}
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

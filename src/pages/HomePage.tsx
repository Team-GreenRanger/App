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
import { userCache } from "../utils";

const HomePage = () => {
  const { updateBottomNavigation, showToast } = useAndroidApi();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [ecoTip, setEcoTip] = useState<EcoTip | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  useEffect(() => {
    updateBottomNavigation("home");
    loadUserData();
  }, [updateBottomNavigation]);

  const loadUserData = async () => {
    // 캐시된 사용자 데이터가 있으면 먼저 표시
    const cachedUser = userCache.get();
    if (cachedUser) {
      setProfile(
        (prev) =>
          ({
            ...prev,
            name: cachedUser.name,
            email: cachedUser.email || "",
            profileImageUrl: cachedUser.profileImageUrl,
            isVerified: false,
            status: "ACTIVE",
            createdAt: "",
          } as UserProfile)
      );
      setIsLoadingProfile(false);
    }

    try {
      const [profileResponse, statsResponse, ecoTipResponse] =
        await Promise.all([
          privateApi.get<UserProfile>("/users/profile"),
          privateApi.get<UserStatistics>("/users/statistics"),
          privateApi.get<EcoTip>("/ai/eco-tip"),
        ]);

      setProfile(profileResponse.data);
      setStatistics(statsResponse.data);
      setEcoTip(ecoTipResponse.data);

      // 사용자 정보 캐싱
      userCache.set({
        name: profileResponse.data.name,
        email: profileResponse.data.email,
        profileImageUrl: profileResponse.data.profileImageUrl,
      });
    } catch (error) {
      console.error("Failed to load homepage data:", error);
    } finally {
      setIsLoadingProfile(false);
      setIsLoadingStats(false);
      setIsLoadingTip(false);
    }
  };

  const handleCarbonCreditClick = () => {
    navigate("/my/credit");
  };

  const handleStartLearning = () => {
    showToast({ message: "Starting learning program!" });
    navigate("/education");
  };

  const getTreesPlanted = () => {
    if (!statistics) return 0;
    return Math.floor(statistics.totalMissionsCompleted / 5);
  };

  const getWeeklyTreesPlanted = () => {
    return Math.floor(getTreesPlanted() * 0.3);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <UserProfileHeader
        name={profile?.name || "Guest"}
        profileImageUrl={profile?.profileImageUrl}
      />

      <div className="px-4 pb-20">
        <div className="mb-6">
          {isLoadingStats ? (
            <div className="skeleton rounded-2xl h-24"></div>
          ) : (
            <CarbonCreditCard
              points={statistics?.currentCarbonCredits || 0}
              onClick={handleCarbonCreditClick}
            />
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome {profile?.name || "Guest"}!
          </h2>
          {isLoadingStats ? (
            <div className="skeleton rounded w-48 h-4 mb-4"></div>
          ) : (
            <p className="text-gray-600 mb-4">
              You planted {getWeeklyTreesPlanted()} trees this week
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {isLoadingStats ? (
              <>
                <div className="skeleton rounded-full h-8 w-32"></div>
                <div className="skeleton rounded-full h-8 w-24"></div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-300 to-blue-400 rounded-full ">
                  {" "}
                  <span className="text-white font-semibold text-sm">
                    {statistics?.totalCo2Reduction || 0}kg CO₂ saved
                  </span>
                </div>

                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400 to-green-300 rounded-full ">
                  {" "}
                  <span className="text-white font-semibold text-sm">
                    {statistics?.totalMissionsCompleted || 0} mission completed
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isLoadingTip ? (
            <div className="skeleton rounded-2xl h-32"></div>
          ) : (
            <EcoTipCard
              title="Today's Eco Tips"
              description={ecoTip?.tip || "Loading eco tip..."}
              icon={<HiSparkles className="w-6 h-6 text-blue-600" />}
            />
          )}

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

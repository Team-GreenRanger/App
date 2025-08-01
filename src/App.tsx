/// <reference types="vite/client" />

import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DevNavbar } from "./components";
import { useAndroidApi } from "./hooks";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import MissionsPage from "./pages/MissionsPage";
import MyPage from "./pages/MyPage";
import RankingPage from "./pages/RankingPage";
import MyCarbonCreditPage from "./pages/MyCarbonCreditPage";
import RewardShopPage from "./pages/RewardShopPage";
import MyRewardsPage from "./pages/MyRewardsPage";
import CreditUsageHistoryPage from "./pages/CreditUsageHistoryPage";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import AiChatPage from "./pages/AiChatPage";
import AiWelcome from "./components/AiWelcomeSection";
import AiWelcomeSection from "./components/AiWelcomeSection";
import EducationPage from "./pages/EducationPage";
import LearnClimateChange from "./pages/LearnClimateChange";

const App: React.FC = () => {
  const { log, isAvailable } = useAndroidApi();
  const isDevelopment = import.meta.env.MODE === "development";

  useEffect(() => {
    log("React 앱이 시작되었습니다.");

    if (isAvailable) {
      log("안드로이드 브리지가 사용 가능합니다.");
    } else {
      console.log("웹 브라우저 환경에서 실행 중입니다.");
    }
  }, [log, isAvailable]);

  return (
    <Router>
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative">
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/ai-chat" element={<AiChatPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/my/credit" element={<MyCarbonCreditPage />} />
          <Route path="/my/credit/reward-shop" element={<RewardShopPage />} />
          <Route path="/my/credit/my-rewards" element={<MyRewardsPage />} />
          <Route
            path="/my/credit/usage-history"
            element={<CreditUsageHistoryPage />}
          />
          <Route path="/education" element={<EducationPage />} />
          <Route
            path="/education/climate-change"
            element={<LearnClimateChange />}
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {isDevelopment && <DevNavbar />}
      </div>
    </Router>
  );
};

export default App;

/// <reference types="vite/client" />

import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { DevNavbar } from "./components";
import { useAndroidApi } from "./hooks";
import { isLoggedIn } from "./utils/auth.utils";
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
import LearnExtremeWeather from "./pages/LearnExtremeWeather";
import LearningPage from "./pages/LearningPage";
import CameraPage from "./pages/CameraPage";
import MissionCompletePage from "./pages/MissionCompletePage";

const AuthRedirect: React.FC = () => {
  const loggedIn = isLoggedIn();
  return <Navigate to={loggedIn ? "/home" : "/welcome"} replace />;
};

const NavigationController: React.FC = () => {
  const location = useLocation();
  const {
    updateBottomNavigation,
    hideBottomNavigation,
    showBottomNavigation,
    isAvailable,
    log,
  } = useAndroidApi();

  useEffect(() => {
    if (!isAvailable) return;

    const path = location.pathname;
    log(`경로 변경: ${path}`);

    // 네비게이션을 숨겸야 하는 페이지들
    const hiddenNavPages = ['/welcome', '/login', '/signup', '/onboarding','/camera'];
    
    if (hiddenNavPages.includes(path)) {
      hideBottomNavigation();
    } else {
      // 메인 페이지에서는 네비게이션 표시 및 업데이트
      showBottomNavigation();

      // 페이지 ID 매핑
      const pageMap: { [key: string]: string } = {
        "/home": "home",
        "/ranking": "ranking",
        "/missions": "missions",
        "/map": "map",
        "/my": "my",
      };

      const pageId = pageMap[path];
      if (pageId) {
        updateBottomNavigation(pageId);
      }
    }
  }, [
    location.pathname,
    isAvailable,
    updateBottomNavigation,
    hideBottomNavigation,
    showBottomNavigation,
    log,
  ]);

  return null;
};

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
        <NavigationController />
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/ai-chat" element={<AiChatPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/mission-complete" element={<MissionCompletePage />} />
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
          <Route
            path="/education/extreme-weather"
            element={<LearnExtremeWeather />}
          />
          <Route path="/education/learnig-page" element={<LearningPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* {isDevelopment && <DevNavbar />} */}
      </div>
    </Router>
  );
};

export default App;

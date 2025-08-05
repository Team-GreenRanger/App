/// <reference types="vite/client" />

import React, { useEffect, useState } from "react";
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
import LearningPageViewer from "./pages/LearningPageViewer";

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
  const [shouldShowReactNav, setShouldShowReactNav] = useState(false);

  // 네비게이션을 숨겨야 하는 페이지 패턴들 체크
  const shouldHideNavigation = (path: string): boolean => {
    const hiddenNavPages = [
      "/welcome",
      "/login",
      "/signup",
      "/onboarding",
      "/camera",
      "/mission-complete",
      "/ai-chat",
    ];

    // 정확한 경로 매칭
    if (hiddenNavPages.includes(path)) return true;

    // 패턴 매칭 - 특정 경로로 시작하는 것들
    const hiddenNavPatterns = [
      "/auth/",
      "/onboarding/",
      "/camera/",
      "/ai-chat/",
      "/welcome/"
    ];

    return hiddenNavPatterns.some(pattern => path.startsWith(pattern));
  };

  useEffect(() => {
    const handleNavigation = async () => {
      const path = location.pathname;
      log(`경로 변경: ${path}`);

      const hideNav = shouldHideNavigation(path);

      if (isAvailable) {
        // 안드로이드 API 사용 가능한 경우
        try {
          if (hideNav) {
            const hideResult = await hideBottomNavigation();
            if (!hideResult) {
              log('안드로이드 네비게이션 숨기기 실패');
            }
            setShouldShowReactNav(false);
          } else {
            const showResult = await showBottomNavigation();
            if (!showResult) {
              log('안드로이드 네비게이션 표시 실패');
              setShouldShowReactNav(true); // 안드로이드 실패 시 React fallback 사용
              return;
            }
            setShouldShowReactNav(false);

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
              const updateResult = await updateBottomNavigation(pageId);
              if (!updateResult) {
                log(`안드로이드 네비게이션 업데이트 실패: ${pageId}`);
              }
            }
          }
        } catch (error) {
          console.warn('안드로이드 네비게이션 API 에러, React fallback 사용:', error);
          log(`안드로이드 네비게이션 예외 발생: ${error}`);
          // 안드로이드 API 에러 시 React fallback 사용
          setShouldShowReactNav(!hideNav);
        }
      } else {
        // 안드로이드 API 사용 불가능한 경우 React fallback 사용
        setShouldShowReactNav(!hideNav);
      }
    };

    handleNavigation();
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
    // 모바일 확대/축소 방지 메타 태그 설정
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no');

    log("React app started.");

    if (isAvailable) {
      log("Android bridge is available.");
    } else {
      console.log("Running in web browser environment.");
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
          <Route path="/camera/:missionId" element={<CameraPage />} />
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
            element={<LearningPageViewer categoryId="climate-change" />}
          />
          <Route
            path="/education/extreme-weather"
            element={<LearningPageViewer categoryId="extreme-weather" />}
          />
          <Route
            path="/education/climate-change/:topicId"
            element={<LearningPageViewer categoryId="climate-change" />}
          />
          <Route
            path="/education/extreme-weather/:topicId"
            element={<LearningPageViewer categoryId="extreme-weather" />}
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* 개발 모드이거나 안드로이드 API 사용 불가능한 경우 DevNavbar 표시 */}
        {(isDevelopment || !isAvailable) && <DevNavbar />}
      </div>
    </Router>
  );
};

export default App;

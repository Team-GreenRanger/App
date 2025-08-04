import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiStar, HiClipboardCheck, HiMap, HiUser } from 'react-icons/hi';
import { useAndroidApi } from '../hooks';

const DevNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAvailable } = useAndroidApi();

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

  const navItems = [
    {
      id: 'home',
      path: '/home',
      label: 'home',
      icon: <HiHome className="w-5 h-5" />
    },
    {
      id: 'ranking',
      path: '/ranking',
      label: 'ranking',
      icon: <HiStar className="w-5 h-5" />
    },
    {
      id: 'missions',
      path: '/missions',
      label: 'missions',
      icon: <HiClipboardCheck className="w-5 h-5" />
    },
    {
      id: 'map',
      path: '/map',
      label: 'map',
      icon: <HiMap className="w-5 h-5" />
    },
    {
      id: 'my',
      path: '/my',
      label: 'my',
      icon: <HiUser className="w-5 h-5" />
    }
  ];

  const currentPath = location.pathname;

  // 네비게이션을 숨겨야 하는 페이지인지 체크
  if (shouldHideNavigation(currentPath)) {
    return null;
  }

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isDevelopment = import.meta.env.MODE === "development";

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center py-3 px-4 transition-colors ${
                isActive
                  ? 'text-green-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`mb-1 ${
                isActive ? 'text-green-600' : 'text-gray-400'
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-green-600' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className={`text-white text-center py-1 ${
        isDevelopment ? 'bg-orange-500' : !isAvailable ? 'bg-blue-500' : 'bg-green-500'
      }`}>
        <span className="text-xs font-medium">
          {isDevelopment 
            ? '🔧 DEV MODE' 
            : !isAvailable 
            ? '📱 REACT NAV' 
            : '🔄 FALLBACK'
          }
        </span>
      </div>
    </div>
  );
};

export default DevNavbar;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiStar, HiClipboardCheck, HiMap, HiUser } from 'react-icons/hi';
import { useAndroidApi } from '../hooks';

const DevNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAvailable } = useAndroidApi();

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

    if (hiddenNavPages.includes(path)) return true;

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
      label: 'Home',
      icon: <HiHome className="w-5 h-5" />
    },
    {
      id: 'ranking',
      path: '/ranking',
      label: 'Ranking',
      icon: <HiStar className="w-5 h-5" />
    },
    {
      id: 'missions',
      path: '/missions',
      label: 'Missions',
      icon: <HiClipboardCheck className="w-5 h-5" />
    },
    {
      id: 'map',
      path: '/map',
      label: 'Map',
      icon: <HiMap className="w-5 h-5" />
    },
    {
      id: 'my',
      path: '/my',
      label: 'My',
      icon: <HiUser className="w-5 h-5" />
    }
  ];

  const currentPath = location.pathname;

  if (shouldHideNavigation(currentPath)) {
    return null;
  }

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isDevelopment = import.meta.env.MODE === "development";

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      <div className="bg-white border-t border-gray-100 backdrop-blur-lg bg-white/95">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`mb-1 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {(isDevelopment || !isAvailable) && (
          <div className={`text-white text-center py-1 text-xs ${
            isDevelopment ? 'bg-orange-500' : !isAvailable ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            <span className="font-medium">
              {isDevelopment 
                ? '🔧 DEV MODE' 
                : !isAvailable 
                ? '📱 WEB NAV' 
                : '🔄 FALLBACK'
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevNavbar;
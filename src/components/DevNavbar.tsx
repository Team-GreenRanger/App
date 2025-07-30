import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHome, HiStar, HiClipboardCheck, HiMap, HiUser } from 'react-icons/hi';

const DevNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavClick = (path: string) => {
    navigate(path);
  };

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
      <div className="bg-orange-500 text-white text-center py-1">
        <span className="text-xs font-medium">🔧 DEV MODE</span>
      </div>
    </div>
  );
};

export default DevNavbar;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DevNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      path: '/home',
      label: 'home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'ranking',
      path: '/ranking',
      label: 'ranking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'missions',
      path: '/missions',
      label: 'missions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      id: 'map',
      path: '/map',
      label: 'map',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      id: 'my',
      path: '/my',
      label: 'my',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const currentPath = location.pathname;

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <div className={`mb-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="bg-red-500 text-white text-center py-1">
        <span className="text-xs font-medium">🔧 DEVELOPMENT MODE</span>
      </div>
    </div>
  );
};

export default DevNavbar;
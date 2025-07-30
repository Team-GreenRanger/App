import React from 'react';
import { HiUser, HiBell } from 'react-icons/hi';

interface UserProfileHeaderProps {
  name: string;
  showNotification?: boolean;
  onNotificationClick?: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  name, 
  showNotification = true,
  onNotificationClick
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <HiUser className="w-6 h-6 text-gray-400" />
        </div>
        <span className="text-lg font-semibold text-gray-900">{name}</span>
      </div>
      {showNotification && (
        <button 
          onClick={onNotificationClick}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <HiBell className="w-6 h-6 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default UserProfileHeader;
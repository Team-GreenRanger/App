import React from 'react';

interface UserProfileHeaderProps {
  name: string;
  showNotification?: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  name, 
  showNotification = true 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-gray-800">{name}</span>
      </div>
      {showNotification && (
        <div className="p-2">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
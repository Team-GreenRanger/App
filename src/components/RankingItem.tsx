import React from 'react';
import { HiUser } from 'react-icons/hi';

interface RankingItemProps {
  rank: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
  avatar?: string;
}

const RankingItem: React.FC<RankingItemProps> = ({ 
  rank, 
  name, 
  points,
  isCurrentUser = false,
  avatar 
}) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg mb-2 border transition-colors ${
      isCurrentUser 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-100 hover:bg-gray-50'
    }`}>
      <div className="flex items-center space-x-3">
        <span className={`w-6 text-center font-bold text-sm ${
          isCurrentUser ? 'text-green-600' : 'text-gray-600'
        }`}>
          {rank}
        </span>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
            ) : (
              <HiUser className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${
              isCurrentUser ? 'text-green-900' : 'text-gray-900'
            }`}>
              {name}
            </span>
            {isCurrentUser && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                You
              </span>
            )}
          </div>
        </div>
      </div>
      <span className={`font-semibold ${
        isCurrentUser ? 'text-green-600' : 'text-gray-700'
      }`}>
        {points.toLocaleString()}
      </span>
    </div>
  );
};

export default RankingItem;
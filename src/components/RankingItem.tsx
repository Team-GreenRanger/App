import React from 'react';

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
    <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
      isCurrentUser 
        ? 'bg-green-200 border-2 border-green-400' 
        : 'bg-green-50'
    }`}>
      <div className="flex items-center space-x-3">
        <span className="w-6 text-center font-semibold text-gray-700">
          {rank}
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="font-medium text-gray-800">{name}</span>
          {isCurrentUser && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
              You
            </span>
          )}
        </div>
      </div>
      <span className="font-semibold text-gray-700">
        {points.toLocaleString()}
      </span>
    </div>
  );
};

export default RankingItem;
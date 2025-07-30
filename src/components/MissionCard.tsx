import React from 'react';
import { HiCamera } from 'react-icons/hi';

interface MissionCardProps {
  title: string;
  description: string;
  co2Amount: string;
  current: number;
  total: number;
  isCompleted?: boolean;
  onCameraClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  co2Amount,
  current,
  total,
  isCompleted = false,
  onCameraClick
}) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {title}
            </h3>
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-2">
              {co2Amount}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 min-w-[30px]">
              {current} / {total}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-green-400'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={onCameraClick}
          className="bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-lg p-3 flex items-center justify-center min-w-[56px] h-14"
        >
          <HiCamera className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MissionCard;
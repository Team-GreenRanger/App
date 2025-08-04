import React from 'react';
import { HiCamera } from 'react-icons/hi';
import { DifficultyLevel, UserMissionStatus } from '../types';

interface MissionCardProps {
  title: string;
  description: string;
  co2Amount: string;
  creditReward: number;
  difficulty: DifficultyLevel;
  current: number;
  total: number;
  progressPercentage: number;
  remainingSubmissions: number;
  isCompleted?: boolean;
  status: UserMissionStatus;
  onCameraClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  co2Amount,
  creditReward,
  difficulty,
  current,
  total,
  progressPercentage,
  remainingSubmissions,
  isCompleted = false,
  status,
  onCameraClick
}) => {
  // 난이도 색상 매핑
  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case DifficultyLevel.EASY:
        return 'bg-green-100 text-green-700';
      case DifficultyLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-700';
      case DifficultyLevel.HARD:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 상태 표시 색상
  const getStatusColor = (status: UserMissionStatus) => {
    switch (status) {
      case UserMissionStatus.COMPLETED:
        return 'bg-green-500';
      case UserMissionStatus.VERIFIED:
        return 'bg-blue-500';
      case UserMissionStatus.SUBMITTED:
        return 'bg-orange-500';
      case UserMissionStatus.IN_PROGRESS:
        return 'bg-blue-400';
      case UserMissionStatus.REJECTED:
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // 상태 텍스트
  const getStatusText = (status: UserMissionStatus) => {
    switch (status) {
      case UserMissionStatus.ASSIGNED:
        return '할당됨';
      case UserMissionStatus.IN_PROGRESS:
        return '진행중';
      case UserMissionStatus.SUBMITTED:
        return '검증 대기';
      case UserMissionStatus.VERIFIED:
        return '검증 완료';
      case UserMissionStatus.REJECTED:
        return '거부됨';
      case UserMissionStatus.COMPLETED:
        return '완료됨';
      default:
        return '알 수 없음';
    }
  };

  const canSubmit = status === UserMissionStatus.ASSIGNED || 
                   status === UserMissionStatus.IN_PROGRESS || 
                   status === UserMissionStatus.REJECTED;
  
  return (
    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-100 shadow-sm">
      {/* 헤더 영역 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
          
          {/* 상태와 보상 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
              <span className="text-xs text-gray-600">
                {getStatusText(status)}
              </span>
            </div>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-xs font-medium text-green-600">
              💰 {creditReward} Credits
            </span>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-xs font-medium text-blue-600">
              🌱 {co2Amount}
            </span>
          </div>
        </div>
      </div>
      
      {/* 설명 */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* 진행 상황 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              진행 상황: {current} / {total}
            </span>
            <span className="text-xs text-gray-500">
              ({progressPercentage}%)
            </span>
          </div>
          {remainingSubmissions > 0 && !isCompleted && (
            <span className="text-xs text-orange-600 font-medium">
              {remainingSubmissions}회 더 필요
            </span>
          )}
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'bg-green-400'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      
      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {isCompleted ? (
            <span className="text-green-600 font-medium">✅ 미션 완료!</span>
          ) : status === UserMissionStatus.SUBMITTED ? (
            <span className="text-orange-600 font-medium">⏳ 검증 대기 중</span>
          ) : status === UserMissionStatus.REJECTED ? (
            <span className="text-red-600 font-medium">❌ 다시 제출하세요</span>
          ) : (
            <span>📸 사진을 찍어 미션을 완료하세요</span>
          )}
        </div>
        
        {canSubmit && (
          <button
            onClick={onCameraClick}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium
              transition-all active:scale-95
              ${status === UserMissionStatus.REJECTED
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            <HiCamera className="w-4 h-4" />
            {status === UserMissionStatus.REJECTED ? '다시 제출' : '사진 찍기'}
          </button>
        )}
        
        {isCompleted && (
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            완료됨
          </div>
        )}
        
        {status === UserMissionStatus.SUBMITTED && (
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
            검증 중
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCard;
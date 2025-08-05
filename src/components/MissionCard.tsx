import React from "react";
import { HiCamera } from "react-icons/hi";
import { UserMission } from "../types";
import { CheckCircle } from "lucide-react";

interface MissionCardProps {
  userMission: UserMission;
  onCameraClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  userMission,
  onCameraClick,
}) => {
  const { isActive, isDone, progressPercentage, remainingSubmissions, mission, currentProgress } = userMission;
  
  // 진행률 계산
  const actualProgressPercentage = progressPercentage ?? 0;
  const actualRemainingSubmissions = remainingSubmissions ?? 0;
  const totalSubmissions = mission.requiredSubmissions;
  const completedSubmissions = currentProgress;
  
  // 미션 완료 여부 (requiredSubmissions 달성 시)
  const isFullyCompleted = completedSubmissions >= totalSubmissions;

  return (
    <div className={`bg-white rounded-lg p-4 mb-3 border transition-all ${
      isFullyCompleted 
        ? 'border-green-200 bg-green-50/30' 
        : 'border-gray-100 hover:border-gray-200'
    } shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-base">{mission.title}</h3>
                {isFullyCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  mission.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                  mission.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mission.difficulty}
                </span>
                <span className="text-xs text-gray-500">
                  {mission.creditReward} credits
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap ml-2">
              {mission.co2ReductionAmount}kg CO2
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {mission.description}
          </p>

          {/* 핵심: 개별 미션 진행률 표시 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">
                  {completedSubmissions} / {totalSubmissions}
                </span>
                <span className="text-sm text-gray-500">완료</span>
              </div>
              <span className={`text-sm font-medium ${
                isFullyCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {Math.round(actualProgressPercentage)}%
              </span>
            </div>
            
            {/* 진행률 바 */}
            <div className="bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  isFullyCompleted ? "bg-green-500" : "bg-blue-400"
                }`}
                style={{ width: `${Math.min(actualProgressPercentage, 100)}%` }}
              />
            </div>
            
            {/* 상태별 메시지 */}
            {isFullyCompleted ? (
              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                미션 완료! {mission.creditReward} 크레딧 획득
              </div>
            ) : actualRemainingSubmissions > 0 ? (
              <div className="text-sm text-gray-600">
                {actualRemainingSubmissions}회 더 제출하면 완료!
              </div>
            ) : (
              <div className="text-sm text-orange-600">
                검증 대기 중...
              </div>
            )}
          </div>
        </div>

        {/* 카메라 버튼 / 완료 표시 */}
        {isFullyCompleted ? (
          <div className="rounded-lg p-3 flex items-center justify-center min-w-[56px] h-14 bg-green-100 border-2 border-green-300">
            <span className="text-green-700 font-semibold text-sm">완료</span>
          </div>
        ) : (
          <button
            onClick={onCameraClick}
            className="bg-green-500 hover:bg-green-600 active:scale-95 rounded-lg p-3 flex items-center justify-center min-w-[56px] h-14 transition-all"
          >
            <HiCamera className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCard;

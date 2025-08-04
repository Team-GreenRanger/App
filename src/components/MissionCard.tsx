import React from "react";
import { HiCamera } from "react-icons/hi";
import { DifficultyLevel } from "../types";

// API 응답 구조에 맞춘 Mission 타입
interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: DifficultyLevel;
  co2ReductionAmount: string;
  creditReward: number;
  requiredSubmissions: number;
  imageUrl: string;
  instructions: string[];
  verificationCriteria: string[];
  status: string;
  createdAt: string;
}

// API 응답 구조에 맞춘 MissionData 타입
interface MissionData {
  isActive: boolean;
  isDone: boolean;
  progressPercentage: number | null;
  remainingSubmissions: number | null;
  mission: Mission;
}

interface MissionCardProps {
  missionData: MissionData;
  onCameraClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  missionData,
  onCameraClick,
}) => {
  const { isActive, isDone, progressPercentage, remainingSubmissions, mission } = missionData;
  
  // 진행률 계산 (기본값 0 설정)
  const actualProgressPercentage = progressPercentage ?? 0;
  const actualRemainingSubmissions = remainingSubmissions ?? mission.requiredSubmissions;

  return (
    <div className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 text-base">{mission.title}</h3>
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

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 min-w-[30px]">
                {mission.requiredSubmissions - actualRemainingSubmissions} / {mission.requiredSubmissions}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isDone ? "bg-green-500" : "bg-green-400"
                  }`}
                  style={{ width: `${Math.min(actualProgressPercentage, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round(actualProgressPercentage)}%
              </span>
            </div>
            
            {actualRemainingSubmissions > 0 && (
              <div className="text-xs text-gray-500">
                {actualRemainingSubmissions} submission{actualRemainingSubmissions !== 1 ? 's' : ''} remaining
              </div>
            )}
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

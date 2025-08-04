import React from "react";
import { useNavigate } from "react-router-dom";
import confetti from "../assets/images/Conffeti.svg";

interface MissionCompleteProps {
  isFullyComplete?: boolean;
  points?: number;
  missionTitle?: string;
  remainingSubmissions?: number;
  currentProgress?: number;
  targetProgress?: number;
}

const MissionComplete = ({ 
  isFullyComplete, 
  points, 
  missionTitle, 
  remainingSubmissions = 0,
  currentProgress = 0,
  targetProgress = 1 
}: MissionCompleteProps) => {
  const navigate = useNavigate();

  const handleGoToMissions = () => {
    navigate("/missions");
  };
  return (
    <div className="flex flex-col items-center justify-center px-8">
      <div className="mb-8">
        <div className="text-8xl mb-4">
          <img src={confetti} alt="Confetti" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isFullyComplete ? "Mission Complete!" : "Well done!"}
        </h1>
        
        {missionTitle && (
          <p className="text-lg font-medium text-gray-700 mb-4">{missionTitle}</p>
        )}

        {isFullyComplete ? (
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">You completed your mission!</p>
            <p className="text-sm text-gray-500">
              {currentProgress} / {targetProgress} submissions completed
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">
              Your submission has been verified!
            </p>
            <p className="text-sm text-gray-500">
              {currentProgress} / {targetProgress} submissions completed
            </p>
            {remainingSubmissions > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {remainingSubmissions} more submission{remainingSubmissions > 1 ? 's' : ''} needed to complete the mission
              </p>
            )}
          </div>
        )}
      </div>

      {/* 포인트 표시 (완전 완료시만) */}
      {isFullyComplete && points && (
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-green-500">+{points} points</p>
          <p className="text-sm text-gray-500 mt-2">Carbon credits earned!</p>
        </div>
      )}
      
      {/* 진행률 표시 */}
      {!isFullyComplete && (
        <div className="w-full max-w-xs mb-8">
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentProgress / targetProgress) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Progress: {Math.round((currentProgress / targetProgress) * 100)}%
          </p>
        </div>
      )}
      
      {/* 미션으로 이동 버튼 */}
      <div className="w-full max-w-xs">
        <button
          onClick={handleGoToMissions}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Back to Missions
        </button>
      </div>
    </div>
  );
};

export default MissionComplete;

import React from "react";
import confetti from "../assets/images/Conffeti.svg";

interface MissionCompleteProps {
  isFullyComplete?: boolean;
  points?: number;
}

const MissionComplete = ({ isFullyComplete, points }: MissionCompleteProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-8">
      <div className="mb-8">
        <div className="text-8xl mb-4">
          <img src={confetti} />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Well done!</h1>

        {isFullyComplete ? (
          <div className="space-y-2">
            <p className="text-gray-600 text-lg">You completed your mission</p>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">
            Your mission has been verified
            <br />
            Keep going to earn carbon credits
          </p>
        )}
      </div>

      {/* 포인트 표시 (개별 미션 완료시만) */}
      {isFullyComplete && (
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-green-500">+{points} points</p>
        </div>
      )}
    </div>
  );
};

export default MissionComplete;

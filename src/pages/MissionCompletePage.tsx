import React from "react";
import MissionComplete from "../components/MissionComplete";
import MissionNotVerified from "../components/MissionNotVerified";

interface MissionCompletePageProps {
  isFullyComplete?: boolean;
  points?: number;
  isVerified: boolean;
}

const MissionCompletePage = ({
  isFullyComplete = false,
  isVerified = true,
  points = 50,
}: MissionCompletePageProps) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center">
        {isVerified ? (
          <MissionComplete isFullyComplete={isFullyComplete} points={points} />
        ) : (
          <MissionNotVerified />
        )}
      </div>
    </div>
  );
};

export default MissionCompletePage;

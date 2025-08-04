import { useLocation } from "react-router-dom";
import MissionComplete from "../components/MissionComplete";
import MissionNotVerified from "../components/MissionNotVerified";

const MissionCompletePage = () => {
  const location = useLocation();
  const { missionTitle, isApproved } = location.state || {};

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center">
        {isApproved ? (
          <MissionComplete 
            isFullyComplete={true} 
            points={50}
            missionTitle={missionTitle}
          />
        ) : (
          <MissionNotVerified missionTitle={missionTitle} />
        )}
      </div>
    </div>
  );
};

export default MissionCompletePage;

import { useNavigate } from "react-router-dom";
import no_sign from "../assets/images/no-sign.svg";

interface MissionNotVerifiedProps {
  missionTitle?: string;
  remainingSubmissions?: number;
  isRejected?: boolean; // 검증 실패 정보
}

const MissionNotVerified = ({ missionTitle, remainingSubmissions = 0, isRejected = false }: MissionNotVerifiedProps) => {
  const navigate = useNavigate();

  const handleGoToMissions = () => {
    navigate("/missions");
  };

  const handleRetry = () => {
    navigate(-1); // 이전 페이지(카메라)로 돌아가기
  };

  return (
    <div className="flex flex-col items-center justify-center px-8">
      <div className="mb-8">
        <div className="text-8xl mb-4">
          <img src={no_sign} alt="No sign" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verification failed
        </h1>
        
        {missionTitle && (
          <p className="text-lg font-medium text-gray-700 mb-4">{missionTitle}</p>
        )}
        
        <div className="space-y-2">
          <p className="text-gray-600 text-lg">
            {isRejected ? (
              // 검증 실패시 메시지
              <>
                The AI couldn't verify your mission.
                <br />
                Please try again with a clearer photo!
              </>
            ) : (
              // 일반적인 메시지
              <>
                Looks like the AI needs clearer proof.
                <br />
                Try again with a better photo!
              </>
            )}
          </p>
          
          {remainingSubmissions > 0 && (
            <p className="text-sm text-blue-600 font-medium mt-4">
              {remainingSubmissions} more submission{remainingSubmissions > 1 ? 's' : ''} needed to complete this mission
            </p>
          )}
        </div>
      </div>
      
      {/* 버튼들 */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleRetry}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
        
        <button
          onClick={handleGoToMissions}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Back to Missions
        </button>
      </div>
    </div>
  );
};

export default MissionNotVerified;

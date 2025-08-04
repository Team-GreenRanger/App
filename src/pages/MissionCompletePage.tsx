import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MissionComplete from "../components/MissionComplete";
import MissionNotVerified from "../components/MissionNotVerified";
import { MissionSubmissionLoading } from "../components";

interface MissionCompleteState {
  missionTitle?: string;
  isApproved?: boolean;
  isFullyCompleted?: boolean;
  remainingSubmissions?: number;
  points?: number;
  currentProgress?: number;
  targetProgress?: number;
  isRejected?: boolean; // 검증 실패 정보 추가
}

const MissionCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const state = location.state as MissionCompleteState || {};
  const { 
    missionTitle, 
    isApproved = false, 
    isFullyCompleted = false,
    remainingSubmissions = 0,
    points = 50,
    currentProgress = 0,
    targetProgress = 1,
    isRejected = false // 검증 실패 정보
  } = state;

  // 페이지 로드시 잠시 로딩 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2초간 로딩 표시

    return () => clearTimeout(timer);
  }, []);

  // 진행률 기반 완료 여부 판단
  const isReallyFullyCompleted = isFullyCompleted || (currentProgress >= targetProgress);
  const actualRemainingSubmissions = remainingSubmissions || Math.max(0, targetProgress - currentProgress);

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <MissionSubmissionLoading 
            stage="verifying" 
            progress={100}
            message="미션 결과를 처리하고 있습니다..."
            compact={true}
          />
        ) : (
          isApproved ? (
            <MissionComplete 
              isFullyComplete={isReallyFullyCompleted}
              points={isReallyFullyCompleted ? points : undefined}
              missionTitle={missionTitle}
              remainingSubmissions={actualRemainingSubmissions}
              currentProgress={currentProgress}
              targetProgress={targetProgress}
            />
          ) : (
            <MissionNotVerified 
              missionTitle={missionTitle} 
              remainingSubmissions={actualRemainingSubmissions}
              isRejected={isRejected}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MissionCompletePage;

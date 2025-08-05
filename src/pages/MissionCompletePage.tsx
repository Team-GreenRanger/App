import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MissionComplete from "../components/MissionComplete";
import MissionNotVerified from "../components/MissionNotVerified";
import { MissionSubmissionLoading } from "../components";
import { useImageUpload, useMissions } from "../hooks";

interface MissionCompleteState {
  missionTitle?: string;
  isApproved?: boolean;
  isFullyCompleted?: boolean;
  remainingSubmissions?: number;
  points?: number;
  currentProgress?: number;
  targetProgress?: number;
  isRejected?: boolean;
  isProcessing?: boolean;
  imageFile?: File;
  missionId?: string;
  userMissionId?: string;
}

const MissionCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [missionResult, setMissionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { uploadMissionImages } = useImageUpload();
  const { submitMission, assignMission } = useMissions();
  
  const state = location.state as MissionCompleteState || {};
  const { 
    missionTitle, 
    isApproved = false, 
    isFullyCompleted = false,
    remainingSubmissions = 0,
    points = 50,
    currentProgress = 0,
    targetProgress = 1,
    isRejected = false,
    isProcessing = false,
    imageFile,
    missionId,
    userMissionId
  } = state;

  // 이미지 업로드 및 미션 처리
  useEffect(() => {
    const processMission = async () => {
      if (!isProcessing || !imageFile || !missionId) {
        // 기존 로직 (완료된 미션 결과 표시)
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
      }

      try {
        // 이미지 업로드
        const uploadResult = await uploadMissionImages([imageFile]);
        
        if (!uploadResult) {
          throw new Error("이미지 업로드에 실패했습니다.");
        }

        let targetUserMissionId = userMissionId;
        
        // userMissionId가 없으면 미션 할당
        if (!targetUserMissionId) {
          const assignedMission = await assignMission({ missionId });
          
          if (!assignedMission || !assignedMission.id) {
            throw new Error("미션 할당에 실패했습니다.");
          }
          
          targetUserMissionId = assignedMission.id;
        }
        
        // 미션 제출
        const result = await submitMission(targetUserMissionId, {
          imageUrls: uploadResult.files.map(f => f.url)
        });
        
        if (result) {
          setMissionResult(result);
        } else {
          throw new Error("미션 제출에 실패했습니다.");
        }
      } catch (err: any) {
        console.error('Mission processing error:', err);
        
        // 409 Conflict: 이미 완료된 미션
        if (err.response?.status === 409) {
          setError('이 미션은 이미 완료되었습니다. 다른 미션을 선택해주세요.');
        } else {
          setError(err.message || '미션 처리 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    processMission();
  }, [isProcessing, imageFile, missionId, userMissionId]);

  // 에러가 있으면 에러 표시
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">미션 처리 실패</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 처리된 결과가 있으면 그것을 사용, 없으면 기존 props 사용
  const finalResult = missionResult || {
    verifiedAt: isApproved ? new Date() : null,
    status: isApproved ? 'VERIFIED' : 'REJECTED',
    isFullyCompleted,
    remainingSubmissions,
    points,
    currentProgress,
    targetProgress
  };

  const isVerified = finalResult.verifiedAt !== null;
  const isResultRejected = finalResult.status === 'REJECTED';
  const isResultApproved = isVerified && !isResultRejected;
  
  // 🔥 핵심 수정: 서버 응답에서 올바른 값들 사용
  let isResultFullyCompleted, actualRemainingSubmissions, actualCurrentProgress, actualTargetProgress, actualPoints;
  
  if (missionResult) {
    // 서버에서 처리된 결과 사용
    isResultFullyCompleted = missionResult.isFullyCompleted;
    actualRemainingSubmissions = missionResult.remainingSubmissions;
    actualCurrentProgress = missionResult.currentProgress;
    actualTargetProgress = missionResult.mission?.requiredSubmissions || 1;
    actualPoints = missionResult.points || 0; // 서버에서 이미 완료되었을 때만 points 설정
  } else {
    // 기존 props 사용 (fallback)
    isResultFullyCompleted = isFullyCompleted;
    actualRemainingSubmissions = remainingSubmissions;
    actualCurrentProgress = currentProgress;
    actualTargetProgress = targetProgress;
    actualPoints = isFullyCompleted ? points : 0;
  }
  
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <MissionSubmissionLoading 
            stage="verifying" 
            progress={100}
            message="미션을 처리하고 있습니다..."
            compact={true}
          />
        ) : (
          isResultApproved ? (
            <MissionComplete 
              isFullyComplete={isResultFullyCompleted}
              points={actualPoints}
              missionTitle={missionTitle}
              remainingSubmissions={actualRemainingSubmissions}
              currentProgress={actualCurrentProgress}
              targetProgress={actualTargetProgress}
            />
          ) : (
            <MissionNotVerified 
              missionTitle={missionTitle} 
              remainingSubmissions={actualRemainingSubmissions}
              isRejected={isResultRejected}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MissionCompletePage;

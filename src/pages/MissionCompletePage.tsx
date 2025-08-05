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

  const state = (location.state as MissionCompleteState) || {};
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
    userMissionId,
  } = state;

  useEffect(() => {
    const processMission = async () => {
      if (!isProcessing || !imageFile || !missionId) {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
      }

      try {
        const uploadResult = await uploadMissionImages([imageFile]);

        if (!uploadResult) {
          throw new Error("Failed to upload image.");
        }

        let targetUserMissionId = userMissionId;

        if (!targetUserMissionId) {
          const assignedMission = await assignMission({ missionId });

          if (!assignedMission || !assignedMission.id) {
            throw new Error("Failed to assign mission.");
          }

          targetUserMissionId = assignedMission.id;
        }

        const result = await submitMission(targetUserMissionId, {
          imageUrls: uploadResult.files.map((f) => f.url),
        });

        if (result) {
          setMissionResult(result);
        } else {
          throw new Error("Failed to submit mission.");
        }
      } catch (err: any) {
        console.error("Mission processing error:", err);

        if (err.response?.status === 409) {
          setError(
            "This mission has already been completed. Please choose another mission."
          );
        } else {
          setError(
            err.message || "An error occurred while processing the mission."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    processMission();
  }, [isProcessing, imageFile, missionId, userMissionId]);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">
            Mission Submission Failed
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const finalResult = missionResult || {
    verifiedAt: isApproved ? new Date() : null,
    status: isApproved ? "VERIFIED" : "REJECTED",
    isFullyCompleted,
    remainingSubmissions,
    points,
    currentProgress,
    targetProgress,
  };

  const isVerified = finalResult.verifiedAt !== null;
  const isResultRejected = finalResult.status === "REJECTED";
  const isResultApproved = isVerified && !isResultRejected;

  let isResultFullyCompleted,
    actualRemainingSubmissions,
    actualCurrentProgress,
    actualTargetProgress,
    actualPoints;

  if (missionResult) {
    isResultFullyCompleted = missionResult.isFullyCompleted;
    actualRemainingSubmissions = missionResult.remainingSubmissions;
    actualCurrentProgress = missionResult.currentProgress;
    actualTargetProgress = missionResult.mission?.requiredSubmissions || 1;
    actualPoints = missionResult.points || 0;
  } else {
    isResultFullyCompleted = isFullyCompleted;
    actualRemainingSubmissions = remainingSubmissions;
    actualCurrentProgress = currentProgress;
    actualTargetProgress = targetProgress;
    actualPoints = isFullyCompleted ? points : 0;
  }

  return (
    <div
      className="w-full max-w-md mx-auto min-h-screen flex flex-col"
      style={{ backgroundColor: isLoading ? "#D7ECFE" : "white" }}
    >
      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <MissionSubmissionLoading
            stage="verifying"
            progress={100}
            message="Processing your mission..."
            compact={true}
          />
        ) : isResultApproved ? (
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
        )}
      </div>
    </div>
  );
};

export default MissionCompletePage;

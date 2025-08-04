import React, { useEffect, useState } from "react";
import { useAndroidApi, useMissions } from "../hooks";
import { Tabs, MissionCard } from "../components";
import { useNavigate } from "react-router-dom";
import { UserMissionStatus, Mission, UserMission } from "../types";
import { AlertCircle } from "lucide-react";

interface MissionWithProgress {
  mission: Mission;
  userMission?: UserMission;
  isCompleted: boolean;
  progress: number;
}

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const { userMissions, missions, isLoading, error, loadUserMissions, loadMissions } = useMissions();
  const [activeTab, setActiveTab] = useState("active");
  const [missionsWithProgress, setMissionsWithProgress] = useState<MissionWithProgress[]>([]);
  const navigate = useNavigate();

  const tabs = [
    { id: "active", label: "Active" },
    { id: "done", label: "Done" },
  ];

  // 미션 데이터와 사용자 미션 데이터를 결합
  useEffect(() => {
    const combinedMissions: MissionWithProgress[] = [];
    
    // 사용자가 할당받은 미션들을 기준으로 데이터 결합
    userMissions.forEach(userMission => {
      const mission = missions.find(m => m.id === userMission.missionId);
      if (mission) {
        const isCompleted = userMission.status === UserMissionStatus.COMPLETED;
        const progress = (userMission.currentProgress / userMission.targetProgress) * 100;
        
        combinedMissions.push({
          mission,
          userMission,
          isCompleted,
          progress
        });
      }
    });
    
    setMissionsWithProgress(combinedMissions);
  }, [userMissions, missions]);

  useEffect(() => {
    updateBottomNavigation("missions");
    // 미션 데이터 로드
    loadUserMissions();
    loadMissions();
  }, [updateBottomNavigation, loadUserMissions, loadMissions]);

  const handleCameraClick = (missionWithProgress: MissionWithProgress) => {
    vibrate({ duration: 100 });
    showToast({ message: "Camera opened for mission verification!" });
    
    // 미션 ID와 사용자 미션 ID를 함께 전달
    navigate("/camera", {
      state: {
        missionId: missionWithProgress.mission.id,
        userMissionId: missionWithProgress.userMission?.id,
        missionTitle: missionWithProgress.mission.title
      }
    });
  };

  const activeMissions = missionsWithProgress.filter(m => !m.isCompleted);
  const doneMissions = missionsWithProgress.filter(m => m.isCompleted);
  const currentMissions = activeTab === "active" ? activeMissions : doneMissions;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Missions</h1>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="px-4 pb-20 pt-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading missions...</p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {currentMissions.map((missionWithProgress) => (
                <MissionCard
                  key={missionWithProgress.userMission?.id || missionWithProgress.mission.id}
                  title={missionWithProgress.mission.title}
                  description={missionWithProgress.mission.description}
                  co2Amount={`${missionWithProgress.mission.co2ReductionAmount}kg CO2`}
                  current={missionWithProgress.userMission?.currentProgress || 0}
                  total={missionWithProgress.userMission?.targetProgress || 1}
                  isCompleted={missionWithProgress.isCompleted}
                  onCameraClick={() => handleCameraClick(missionWithProgress)}
                />
              ))}
            </div>

            {currentMissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {activeTab === "active"
                    ? "No active missions"
                    : "No completed missions"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;

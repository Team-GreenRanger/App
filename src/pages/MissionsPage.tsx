import React, { useEffect, useState } from "react";
import { useAndroidApi, useMissions } from "../hooks";
import { Tabs, MissionCard } from "../components";
import { useNavigate } from "react-router-dom";
import { UserMission } from "../types";
import { AlertCircle } from "lucide-react";

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const { userMissions, isLoading, error, loadUserMissions, loadDailyMissions } = useMissions();
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  const tabs = [
    { id: "active", label: "Active" },
    { id: "done", label: "Done" },
  ];

  useEffect(() => {
    updateBottomNavigation("missions");
    // 사용자 미션과 일일 미션 로드
    loadUserMissions();
    loadDailyMissions();
  }, [updateBottomNavigation, loadUserMissions, loadDailyMissions]);

  const handleCameraClick = (userMission: UserMission) => {
    vibrate({ duration: 100 });
    showToast({ message: "Camera opened for mission verification!" });
    
    // URL 파라미터로 missionId 전달
    navigate(`/camera/${userMission.missionId}`, {
      state: {
        userMissionId: userMission.id,
        missionTitle: userMission.mission?.title || "알 수 없는 미션"
      }
    });
  };

  // isActive와 isDone 사용해서 미션 구분
  const activeMissions = userMissions.filter(um => um.isActive);
  const doneMissions = userMissions.filter(um => um.isDone);
  
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
              {currentMissions.map((userMission, index) => (
                <MissionCard
                  key={userMission.id || index}
                  title={userMission.mission?.title || "알 수 없는 미션"}
                  description={userMission.mission?.description || ""}
                  co2Amount={`${userMission.mission?.co2ReductionAmount || 0}kg CO2`}
                  current={userMission.currentProgress}
                  total={userMission.targetProgress}
                  isCompleted={userMission.isDone}
                  onCameraClick={() => handleCameraClick(userMission)}
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

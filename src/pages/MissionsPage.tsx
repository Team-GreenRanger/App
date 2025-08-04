import React, { useEffect, useState } from "react";
import { useAndroidApi } from "../hooks";
import { Tabs, MissionCard } from "../components";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { missionApi } from "../api/missionApi";

// 실제 API 응답 구조에 맞춘 타입 정의
interface Mission {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  co2ReductionAmount: string;
  creditReward: number;
  requiredSubmissions: number;
  imageUrl: string;
  instructions: string[];
  verificationCriteria: string[];
  status: string;
  createdAt: string;
}

interface MissionData {
  isActive: boolean;
  isDone: boolean;
  progressPercentage: number | null;
  remainingSubmissions: number | null;
  mission: Mission;
}

interface ApiResponse {
  missions: MissionData[];
  summary: {
    totalMissions: number;
    completedMissions: number;
    activeMissions: number;
    pendingMissions: number;
    completionRate: number;
  };
}

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  // API 데이터 로드 함수
  const loadMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 실제 API 호출
      const response = await missionApi.getUserMissions();
      
      // API 응답이 제공해주신 구조라고 가정
      // response가 { missions: [], summary: {} } 구조인지 확인
      let missions: MissionData[];
      
      if (Array.isArray(response)) {
        // response가 배열이면 그대로 사용
        missions = response;
      } else if (response && Array.isArray(response.missions)) {
        // response가 { missions: [], summary: {} } 구조면 missions 배열 사용
        missions = response.missions;
      } else {
        // 예상치 못한 구조
        throw new Error('예상치 못한 API 응답 구조');
      }
      
      setMissions(missions);
    } catch (err) {
      setError('미션 데이터를 불러오는데 실패했습니다.');
      console.error('Mission loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "active", label: "Active" },
    { id: "done", label: "Done" },
  ];

  useEffect(() => {
    updateBottomNavigation("missions");
    loadMissions();
  }, [updateBottomNavigation]);

  const handleCameraClick = (missionData: MissionData) => {
    vibrate({ duration: 100 });
    showToast({ message: "카메라가 열렸습니다!" });
    
    // URL 파라미터로 missionId 전달
    navigate(`/camera/${missionData.mission.id}`, {
      state: {
        missionId: missionData.mission.id,
        missionTitle: missionData.mission.title,
        remainingSubmissions: missionData.remainingSubmissions
      }
    });
  };

  // isActive와 isDone 사용해서 미션 구분
  const activeMissions = missions.filter(m => m.isActive && !m.isDone);
  const doneMissions = missions.filter(m => m.isDone);
  
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
            <div className="flex-1">
              <p className="text-sm">{error}</p>
              <button 
                onClick={loadMissions}
                className="text-xs text-red-600 underline mt-1"
              >
                다시 시도
              </button>
            </div>
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
              {currentMissions.map((missionData, index) => (
                <MissionCard
                  key={missionData.mission.id || index}
                  missionData={missionData}
                  onCameraClick={() => handleCameraClick(missionData)}
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

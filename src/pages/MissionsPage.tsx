import React, { useEffect, useState } from "react";
import { useAndroidApi } from "../hooks";
import { Tabs, MissionCard } from "../components";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { missionApi } from "../api/missionApi";
import { UserMission } from "../types";

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  // API 데이터 로드 함수 - Daily Missions 사용으로 변경
  const loadMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🚀 Daily Missions API 호출 시작...'); // 디버깅
      
      // Daily Missions API 사용 - 자동으로 미션 할당
      const missions = await missionApi.getDailyMissions();
      
      console.log('🎉 Daily Missions API 성공:', missions); // 디버깅
      console.log('📊 받은 미션 수:', missions.length);
      
      // 미션 데이터 검증
      missions.forEach((mission, index) => {
        console.log(`미션 ${index + 1}:`, {
          id: mission.id,
          title: mission.mission?.title || '제목 없음',
          status: mission.status,
          isActive: mission.isActive,
          isDone: mission.isDone,
          currentProgress: mission.currentProgress,
          requiredSubmissions: mission.mission?.requiredSubmissions || 'N/A'
        });
      });
      
      setMissions(missions);
    } catch (err: any) {
      console.error('❌ Daily Missions API 실패:', err);
      console.error('❌ 에러 메시지:', err.message);
      console.error('❌ 에러 응답:', err.response?.data);
      console.error('❌ 에러 상태 코드:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (err.response?.status === 404) {
        setError('미션 서비스를 찾을 수 없습니다.');
      } else if (err.message?.includes('No active missions')) {
        setError('현재 사용 가능한 미션이 없습니다. 관리자에게 문의해주세요.');
      } else {
        setError(`미션 데이터를 불러오는데 실패했습니다: ${err.message}`);
      }
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

  const handleCameraClick = (userMission: UserMission) => {
    vibrate({ duration: 100 });
    showToast({ message: "카메라가 열렸습니다!" });
    
    // URL 파라미터로 missionId 전달
    navigate(`/camera/${userMission.mission.id}`, {
      state: {
        missionId: userMission.mission.id,
        missionTitle: userMission.mission.title,
        remainingSubmissions: userMission.remainingSubmissions
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
        
        {/* 간단한 카운트 정보만 표시 */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span>Active: {activeMissions.length}</span>
          <span>•</span>
          <span>Completed: {doneMissions.length}</span>
        </div>
        
        {/* Daily Missions 새로고침만 제공 */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => loadMissions()}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Daily Missions 새로고침
          </button>
        </div>

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
              {currentMissions.map((userMission, index) => (
                <MissionCard
                  key={userMission.id || index}
                  userMission={userMission}
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

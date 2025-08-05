import React, { useEffect, useState, useRef } from "react";
import { useAndroidApi } from "../hooks";
import { MissionCard } from "../components";
import { useNavigate } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";
import { missionApi } from "../api/missionApi";
import { UserMission } from "../types";

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const loadMissions = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      console.log('🚀 Daily Missions API call started...');
      
      const missions = await missionApi.getDailyMissions();
      
      console.log('🎉 Daily Missions API success:', missions);
      console.log('📊 Received missions count:', missions.length);
      
      setMissions(missions);
      
      if (showRefreshingState) {
        showToast({ message: "Missions refreshed!" });
      }
    } catch (err: any) {
      console.error('❌ Daily Missions API failed:', err);
      
      if (err.response?.status === 401) {
        setError('Login required. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Mission service not found.');
      } else if (err.message?.includes('No active missions')) {
        setError('No missions available. Please contact administrator.');
      } else {
        setError(`Failed to load mission data: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || !scrollRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0 && scrollRef.current.scrollTop === 0) {
      e.preventDefault();
      const distance = Math.min(diff * 0.5, 100);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !isRefreshing) {
      loadMissions(true);
      vibrate({ duration: 50 });
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  useEffect(() => {
    updateBottomNavigation("missions");
    loadMissions();
  }, [updateBottomNavigation]);

  const handleCameraClick = (userMission: UserMission) => {
    vibrate({ duration: 100 });
    showToast({ message: "Camera opened!" });
    
    navigate(`/camera/${userMission.mission.id}`, {
      state: {
        missionId: userMission.mission.id,
        missionTitle: userMission.mission.title,
        remainingSubmissions: userMission.remainingSubmissions
      }
    });
  };

  // 완료된 미션을 위로, 미완료 미션을 아래로 정렬
  const sortedMissions = missions.sort((a, b) => {
    if (a.isDone && !b.isDone) return -1; // 완료된 것이 위로
    if (!a.isDone && b.isDone) return 1;  // 미완료된 것이 아래로
    return 0; // 같은 상태면 순서 유지
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Missions</h1>
      </div>

      <div 
        ref={scrollRef}
        className="px-6 pb-20 pt-4 pull-to-refresh overflow-y-auto"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {(pullDistance > 0 || isRefreshing) && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw 
              className={`w-5 h-5 text-green-500 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${pullDistance * 3}deg)`
              }}
            />
            <span className="ml-2 text-sm text-gray-600">
              {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => loadMissions(true)}
                className="text-xs text-red-600 underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="skeleton h-6 rounded w-48 mb-2"></div>
                    <div className="skeleton h-4 rounded w-full mb-2"></div>
                    <div className="skeleton h-4 rounded w-3/4"></div>
                  </div>
                  <div className="skeleton w-12 h-12 rounded-xl ml-4"></div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="skeleton h-4 rounded w-16 mb-1"></div>
                    <div className="skeleton h-4 rounded w-12"></div>
                  </div>
                  <div className="text-right">
                    <div className="skeleton h-4 rounded w-20 mb-1"></div>
                    <div className="skeleton w-6 h-6 rounded"></div>
                  </div>
                </div>

                <div className="skeleton w-full h-2 rounded-full mb-4"></div>

                <div className="flex gap-3">
                  <div className="skeleton flex-1 h-12 rounded-xl"></div>
                  <div className="skeleton w-12 h-12 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {sortedMissions.map((userMission, index) => (
                <MissionCard
                  key={userMission.id || index}
                  userMission={userMission}
                  onCameraClick={() => handleCameraClick(userMission)}
                />
              ))}
            </div>

            {sortedMissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No missions available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;
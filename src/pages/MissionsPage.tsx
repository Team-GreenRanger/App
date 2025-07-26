import React, { useEffect, useState } from 'react';
import { useAndroidApi } from '../hooks/useAndroidApi';

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly';
  icon: string;
}

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showNotification, vibrate, showToast } = useAndroidApi();
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: '전자기기 플러그 뽑기',
      description: '사용하지 않는 전자기기의 플러그를 뽑아보세요',
      points: 50,
      completed: false,
      category: 'daily',
      icon: '🔌'
    },
    {
      id: 2,
      title: '대중교통 이용하기',
      description: '오늘 대중교통을 이용해서 이동해보세요',
      points: 100,
      completed: true,
      category: 'daily',
      icon: '🚌'
    },
    {
      id: 3,
      title: '재활용품 분리수거',
      description: '재활용품을 올바르게 분리수거해보세요',
      points: 75,
      completed: false,
      category: 'daily',
      icon: '♻️'
    },
    {
      id: 4,
      title: '나무 심기',
      description: '이번 주에 나무를 심거나 식물을 키워보세요',
      points: 200,
      completed: true,
      category: 'weekly',
      icon: '🌱'
    },
    {
      id: 5,
      title: '친환경 제품 구매',
      description: '친환경 인증 제품을 구매해보세요',
      points: 150,
      completed: false,
      category: 'weekly',
      icon: '🛒'
    }
  ]);

  useEffect(() => {
    updateBottomNavigation('missions');
  }, [updateBottomNavigation]);

  const handleMissionComplete = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      setMissions(prev => 
        prev.map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        )
      );
      
      vibrate({ duration: 200 });
      showNotification({
        title: '미션 완료!',
        message: `${mission.title} 미션을 완료했습니다! +${mission.points} 포인트`
      });
      showToast({ 
        message: `🎉 미션 완료! +${mission.points} 포인트 획득` 
      });
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'daily': return '일일 미션';
      case 'weekly': return '주간 미션';
      case 'monthly': return '월간 미션';
      default: return '미션';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedMissions = missions.filter(m => m.completed).length;
  const totalPoints = missions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🎯 미션</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completedMissions}</p>
            <p className="text-sm text-gray-600">완료된 미션</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalPoints}</p>
            <p className="text-sm text-gray-600">획득 포인트</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24">
        <div className="space-y-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`bg-white rounded-lg p-4 border-2 transition-all ${
                mission.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{mission.icon}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(mission.category)}`}>
                      {getCategoryName(mission.category)}
                    </span>
                  </div>
                  
                  <h3 className={`font-semibold mb-1 ${mission.completed ? 'text-green-700' : 'text-gray-800'}`}>
                    {mission.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {mission.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      +{mission.points} 포인트
                    </span>
                    
                    {mission.completed ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">완료</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMissionComplete(mission.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        완료하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => showToast({ message: '새로운 미션이 곧 추가됩니다!' })}
            className="text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            더 많은 미션 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
import React, { useEffect, useState } from 'react';
import { useAndroidApi } from '../hooks/useAndroidApi';
import Tabs from '../components/Tabs';
import { RankingHeaderCard, RankingItem } from '../components';

interface RankingUser {
  id: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

const RankingPage: React.FC = () => {
  const { updateBottomNavigation, vibrate, showToast } = useAndroidApi();
  const [activeTab, setActiveTab] = useState('local');

  const tabs = [
    { id: 'local', label: 'Local' },
    { id: 'global', label: 'Global' }
  ];

  const localRankings: RankingUser[] = [
    { id: 1, name: 'ttohee Kim', points: 4400, isCurrentUser: true },
    { id: 2, name: 'Becky Bartell', points: 4000 },
    { id: 3, name: 'Marsha Fisher', points: 3980 },
    { id: 4, name: 'Michael Jackson', points: 3950 },
    { id: 5, name: 'John Wick', points: 3900 },
    { id: 6, name: 'Juanita Cormier', points: 3800 },
    { id: 7, name: 'Tamara Schmidt', points: 3650 }
  ];

  const globalRankings: RankingUser[] = [
    { id: 1, name: 'Sarah Johnson', points: 8500 },
    { id: 2, name: 'Mike Chen', points: 7800 },
    { id: 3, name: 'Emma Wilson', points: 7200 },
    { id: 4, name: 'ttohee Kim', points: 4400, isCurrentUser: true },
    { id: 5, name: 'David Brown', points: 4200 },
    { id: 6, name: 'Lisa Garcia', points: 4100 },
    { id: 7, name: 'Tom Anderson', points: 3950 }
  ];

  useEffect(() => {
    updateBottomNavigation('ranking');
  }, [updateBottomNavigation]);

  const getCurrentUserRank = () => {
    const rankings = activeTab === 'local' ? localRankings : globalRankings;
    const currentUser = rankings.find(user => user.isCurrentUser);
    return currentUser ? rankings.indexOf(currentUser) + 1 : 1;
  };

  const handleRankingItemClick = (user: RankingUser) => {
    vibrate({ duration: 100 });
    if (user.isCurrentUser) {
      showToast({ message: '내 순위입니다!' });
    } else {
      showToast({ message: `${user.name}님의 순위입니다.` });
    }
  };

  const currentRankings = activeTab === 'local' ? localRankings : globalRankings;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ranking</h1>
        
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <RankingHeaderCard 
          rank={getCurrentUserRank()}
          points={4400}
        />
      </div>

      <div className="px-4 pb-24">
        <div className="space-y-1">
          {currentRankings.map((user, index) => (
            <div 
              key={user.id}
              onClick={() => handleRankingItemClick(user)}
              className="cursor-pointer"
            >
              <RankingItem
                rank={index + 1}
                name={user.name}
                points={user.points}
                isCurrentUser={user.isCurrentUser}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => showToast({ message: '더 많은 랭킹을 불러옵니다!' })}
            className="text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            더 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
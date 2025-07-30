import React, { useEffect, useState } from 'react';
import { useAndroidApi } from '../hooks/useAndroidApi';
import { Tabs, MissionCard } from '../components';

interface Mission {
  id: number;
  title: string;
  description: string;
  co2Amount: string;
  current: number;
  total: number;
  isCompleted: boolean;
}

const MissionsPage: React.FC = () => {
  const { updateBottomNavigation, showToast, vibrate } = useAndroidApi();
  const [activeTab, setActiveTab] = useState('active');

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'done', label: 'Done' }
  ];

  const allMissions: Mission[] = [
    {
      id: 1,
      title: 'Turn off unused lights',
      description: 'Turn off lights when not in use and submit with photo',
      co2Amount: '5.2kg Co2',
      current: 0,
      total: 5,
      isCompleted: false
    },
    {
      id: 2,
      title: 'Turn off unused lights',
      description: 'Turn off lights when not in use and submit with photo',
      co2Amount: '5.2kg Co2',
      current: 3,
      total: 5,
      isCompleted: false
    },
    {
      id: 3,
      title: 'Turn off unused lights',
      description: 'Turn off lights when not in use and submit with photo',
      co2Amount: '5.2kg Co2',
      current: 0,
      total: 5,
      isCompleted: false
    },
    {
      id: 4,
      title: 'Turn off unused lights',
      description: 'Turn off lights when not in use and submit with photo',
      co2Amount: '5.2kg Co2',
      current: 0,
      total: 5,
      isCompleted: false
    },
    {
      id: 5,
      title: 'Use public transportation',
      description: 'Take bus or train instead of driving and submit with photo',
      co2Amount: '8.1kg Co2',
      current: 5,
      total: 5,
      isCompleted: true
    },
    {
      id: 6,
      title: 'Recycle plastic bottles',
      description: 'Properly separate and recycle plastic bottles',
      co2Amount: '3.4kg Co2',
      current: 5,
      total: 5,
      isCompleted: true
    }
  ];

  useEffect(() => {
    updateBottomNavigation('missions');
  }, [updateBottomNavigation]);

  const handleCameraClick = (missionId: number) => {
    vibrate({ duration: 100 });
    showToast({ message: 'Camera opened for mission verification!' });
  };

  const activeMissions = allMissions.filter(mission => !mission.isCompleted);
  const doneMissions = allMissions.filter(mission => mission.isCompleted);
  const currentMissions = activeTab === 'active' ? activeMissions : doneMissions;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Missions</h1>
        
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="px-4 pb-20 pt-4">
        <div className="space-y-0">
          {currentMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              co2Amount={mission.co2Amount}
              current={mission.current}
              total={mission.total}
              isCompleted={mission.isCompleted}
              onCameraClick={() => handleCameraClick(mission.id)}
            />
          ))}
        </div>
        
        {currentMissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTab === 'active' ? 'No active missions' : 'No completed missions'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;
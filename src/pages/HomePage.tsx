import React, { useEffect } from 'react';
import { UserProfileHeader, CarbonCreditCard, EcoTipCard, LearnMoreCard } from '../components';
import { useAndroidApi } from '../hooks';

const HomePage: React.FC = () => {
  const { updateBottomNavigation, showToast } = useAndroidApi();

  useEffect(() => {
    updateBottomNavigation('home');
  }, [updateBottomNavigation]);

  const handleCarbonCreditClick = () => {
    showToast({ message: '카본 크레딧 상세 페이지로 이동합니다!' });
  };

  const handleStartLearning = () => {
    showToast({ message: '학습 프로그램을 시작합니다!' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfileHeader name="ttohee Kim" />
      
      <div className="px-4 pb-24">
        <div className="mb-6">
          <CarbonCreditCard 
            points={4400} 
            onClick={handleCarbonCreditClick}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Welcome ttohee Kim!
          </h2>
          <p className="text-gray-600">
            You planted 2 Trees this week
          </p>
        </div>

        <div className="space-y-4">
          <EcoTipCard
            title="Today's Eco Tips"
            description="Unplug Electronic devices when not in use. Unplugging unused electronics can save about 50 kg of CO₂ annually and reduced your energy bill!"
            icon="💡"
          />

          <LearnMoreCard
            title="Let's learn more!"
            description="Learn how to prevent climate change and stay prepared for extreme weather conditions."
            buttonText="Start Learning"
            icon="📚"
            onButtonClick={handleStartLearning}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
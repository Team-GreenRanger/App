import React, { useEffect, useState } from 'react';
import { StatCard, CarbonCreditCard } from '../components';
import { useAndroidApi, useAndroidStorage } from '../hooks';


interface UserProfile {
  name: string;
  email: string;
  level: number;
  points: number;
  co2Saved: number;
  carbonCredits: number;
}

const MyPage: React.FC = () => {
  const { 
    updateBottomNavigation, 
    copyToClipboard, 
    getFromClipboard, 
    share,
    setBrightness,
    getSystemInfo
  } = useAndroidApi();
  
  const { 
    data: userProfile, 
    save: saveProfile, 
    isLoading: profileLoading 
  } = useAndroidStorage<UserProfile>('userProfile', {
    name: 'ttohee Kim',
    email: 'ttohee@gmail.com',
    level: 1,
    points: 4400,
    co2Saved: 127.5,
    carbonCredits: 1250
  });

  const [clipboardText, setClipboardText] = useState('');
  const [brightness, setBrightnessLevel] = useState(128);

  useEffect(() => {
    updateBottomNavigation('my');
    loadSystemInfo();
  }, [updateBottomNavigation]);

  const loadSystemInfo = async () => {
    const systemInfo = await getSystemInfo();
    if (systemInfo) {
      setBrightnessLevel(systemInfo.brightness);
    }
  };

  const handleCopyToClipboard = () => {
    const textToCopy = `안녕하세요! 저는 ${userProfile?.name}이고, 레벨 ${userProfile?.level}입니다.`;
    copyToClipboard(textToCopy);
  };

  const handleGetClipboard = async () => {
    const clipboardData = await getFromClipboard();
    if (clipboardData) {
      setClipboardText(clipboardData.text);
    }
  };

  const handleShare = () => {
    share({
      text: `EcoLife 앱에서 레벨 ${userProfile?.level}을 달성했습니다! 총 ${userProfile?.points}포인트를 획득했어요.`,
      title: 'EcoLife 성과 공유'
    });
  };

  const handleBrightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBrightness = parseInt(event.target.value);
    setBrightnessLevel(newBrightness);
    setBrightness({ level: newBrightness });
  };

  const handleCarbonCreditClick = () => {
    copyToClipboard('Carbon Credit 정보가 클립보드에 복사되었습니다!');
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{userProfile?.name}</h2>
          <p className="text-gray-600">{userProfile?.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard 
            value={`${userProfile?.co2Saved}kg`}
            label="Total CO2 Saved"
            color="green"
          />
          <StatCard 
            value={userProfile?.carbonCredits.toLocaleString() || '0'}
            label="Carbon Credits"
            color="blue"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Carbon Credit</h3>
          <CarbonCreditCard 
            points={userProfile?.points || 0}
            onClick={handleCarbonCreditClick}
          />
        </div>
      </div>

      <div className="px-4 pb-24 space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">클립보드 테스트</h3>
          <div className="space-y-2">
            <button 
              onClick={handleCopyToClipboard}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              프로필 정보 복사
            </button>
            <button 
              onClick={handleGetClipboard}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              클립보드 내용 가져오기
            </button>
            {clipboardText && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                <strong>클립보드:</strong> {clipboardText}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">공유하기</h3>
          <button 
            onClick={handleShare}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            성과 공유하기
          </button>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">화면 밝기 조절</h3>
          <input
            type="range"
            min="0"
            max="255"
            value={brightness}
            onChange={handleBrightnessChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <p className="text-sm text-gray-600 mt-2">현재 밝기: {brightness}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
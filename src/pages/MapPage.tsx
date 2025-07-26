import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components';
import { useAndroidApi } from '../hooks';


const MapPage: React.FC = () => {
  const { updateBottomNavigation, getSystemInfo, showToast } = useAndroidApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    updateBottomNavigation('map');
    checkLocation();
  }, [updateBottomNavigation]);

  const checkLocation = async () => {
    const systemInfo = await getSystemInfo();
    if (systemInfo) {
      setLocationEnabled(systemInfo.locationEnabled);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      showToast({ message: `"${searchQuery}" 검색 중...` });
    }
  };

  const mapMarkers = [
    { id: 1, x: 45, y: 35, type: 'eco-spot' },
    { id: 2, x: 65, y: 25, type: 'eco-spot' },
    { id: 3, x: 25, y: 60, type: 'recycling' },
    { id: 4, x: 75, y: 70, type: 'eco-spot' }
  ];

  const handleMarkerClick = (markerId: number) => {
    showToast({ message: `친환경 장소 ${markerId}번을 선택했습니다!` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Eco Map</h1>
        <p className="text-gray-600 mb-4">Where are you heading to?</p>
        
        <SearchBar
          placeholder="Search for eco-friendly places..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <div className="relative flex-1">
        <div 
          className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          <div className="absolute inset-0 p-4">
            <div className="text-center mb-4">
              <div className="inline-block bg-white rounded-lg px-4 py-2 shadow-sm">
                <p className="text-sm font-medium text-gray-700">
                  {locationEnabled === null ? (
                    '위치 확인 중...'
                  ) : locationEnabled ? (
                    '✅ 위치 서비스 활성화됨'
                  ) : (
                    '❌ 위치 서비스 비활성화됨'
                  )}
                </p>
              </div>
            </div>

            {mapMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute w-6 h-6 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${marker.x}%`, 
                  top: `${marker.y}%` 
                }}
                onClick={() => handleMarkerClick(marker.id)}
              >
                <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                🌱 친환경 장소 찾기
              </h3>
              <p className="text-xs text-gray-600">
                핑크 마커를 클릭하여 상세 정보를 확인하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 bg-white pb-24">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={checkLocation}
            className="bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            위치 상태 확인
          </button>
          <button 
            onClick={() => showToast({ message: '근처 친환경 장소를 검색합니다!' })}
            className="bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            근처 장소 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
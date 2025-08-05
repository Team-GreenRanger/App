import React, { useEffect, useState } from "react";
import { SearchBar } from "../components";
import { useAndroidApi } from "../hooks";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import GoogleMap from "./GoogleMap.tsx";

const MapPage: React.FC = () => {
  const { updateBottomNavigation, getSystemInfo, showToast } = useAndroidApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    updateBottomNavigation("map");
    checkLocation();
  }, [updateBottomNavigation]);

  const checkLocation = async () => {
    const systemInfo = await getSystemInfo();
    if (systemInfo) {
      setLocationEnabled(systemInfo.locationEnabled);
    }
  };
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <>로딩중...</>;
      case Status.FAILURE:
        return <>에러 발생</>;
      case Status.SUCCESS:
        return <GoogleMap />;
    }
  };
  const handleSearch = () => {
    if (searchQuery.trim()) {
      showToast({ message: `"${searchQuery}" 검색 중...` });
    }
  };

  // const mapMarkers = [
  //   { id: 1, x: 45, y: 35, type: 'eco-spot' },
  //   { id: 2, x: 65, y: 25, type: 'eco-spot' },
  //   { id: 3, x: 25, y: 60, type: 'recycling' },
  //   { id: 4, x: 75, y: 70, type: 'eco-spot' }
  // ];

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
      <div className="bg-white px-4 py-6">
        <p>maps will be here</p>
        <Wrapper
          apiKey="AIzaSyAgywfTrsN-rwo0rmqlHEUV-edLU195kds"
          render={render}
        />
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
            onClick={() =>
              showToast({ message: "근처 친환경 장소를 검색합니다!" })
            }
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

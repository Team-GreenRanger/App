import React, { useEffect, useState, useCallback, useRef } from "react";
import { SearchBar } from "../components";
import { useAndroidApi } from "../hooks";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { MapPin, Navigation, X, Clock, Route, Car, Train, Bike } from "lucide-react";
import GoogleMap from "./GoogleMap.tsx";
import { privateApi } from "../api";
import bikeIcon from "../assets/images/bike_icon.svg";

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
}

interface BikeStation {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  freeBikes: number;
  emptySlots: number;
  totalSlots: number;
  distance: number;
  isRenting: boolean;
  isReturning: boolean;
}

interface NavigationState {
  isNavigating: boolean;
  destination?: PlaceResult;
  route?: google.maps.DirectionsResult;
  travelMode?: google.maps.TravelMode;
}

const MapPage: React.FC = () => {
  const { updateBottomNavigation, getCurrentLocation, requestLocationUpdates, stopLocationUpdates, showToast } = useAndroidApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    isNavigating: false
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [bikeStations, setBikeStations] = useState<BikeStation[]>([]);
  const [bikeMarkers, setBikeMarkers] = useState<google.maps.Marker[]>([]);
  const [showBikeWarning, setShowBikeWarning] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<google.maps.Marker | null>(null); // 사용자 위치 마커
  const [previousStationCount, setPreviousStationCount] = useState<number>(0); // 이전 대여소 개수 추적
  const lastApiCallRef = useRef<number>(0);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    updateBottomNavigation("map");
    initializeLocation();
    
    // 컴포넌트 언마운트 시 위치 업데이트 중지
    return () => {
      stopLocationUpdates();
    };
  }, [updateBottomNavigation]);

  useEffect(() => {
    if (currentLocation && map) {
      console.log('🚲 Setting up bike stations and map listeners');
      
      // 초기 로드는 즐시 호출
      fetchBikeStations();
      
      // 지도 이벤트 리스너 - 디바운싱 적용
      const zoomListener = map.addListener('zoom_changed', () => {
        console.log('🔍 Zoom changed, debouncing API call');
        debouncedFetchBikeStations(); // 디바운싱 적용
      });

      const idleListener = map.addListener('idle', () => {
        console.log('🗺️ Map idle, checking center and updating location');
        const center = map.getCenter();
        if (center) {
          const newLocation = {
            lat: center.lat(),
            lng: center.lng()
          };
          
          console.log('📍 새로운 지도 중심:', newLocation);
          console.log('📍 현재 currentLocation:', currentLocation);
          
          // 위치가 실제로 변경된 경우만 업데이트
          if (!currentLocation || 
              Math.abs(newLocation.lat - currentLocation.lat) > 0.001 || 
              Math.abs(newLocation.lng - currentLocation.lng) > 0.001) {
            console.log('🔄 위치 변경 감지! currentLocation 업데이트 후 API 호출');
            setCurrentLocation(newLocation); // 상태 업데이트
            
            // 직접 API 호출 (상태 업데이트가 비동기라서)
            setTimeout(() => {
              console.log('🚀 상태 업데이트 후 API 호출');
              debouncedFetchBikeStations();
            }, 100);
          } else {
            console.log('😴 위치 변경 없음, API 호출 스킵');
          }
        }
      });

      // 드래그 이벤트 추가 - 드래그 중에는 API 호출 안함
      const dragStartListener = map.addListener('dragstart', () => {
        console.log('👋 Drag started, canceling pending API calls');
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
          fetchTimeoutRef.current = null;
        }
      });

      const dragEndListener = map.addListener('dragend', () => {
        console.log('🔄 Drag ended, scheduling API call');
        debouncedFetchBikeStations();
      });

      return () => {
        console.log('🧹 Cleaning up map listeners');
        google.maps.event.removeListener(zoomListener);
        google.maps.event.removeListener(idleListener);
        google.maps.event.removeListener(dragStartListener);
        google.maps.event.removeListener(dragEndListener);
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
      };
    }
  }, [currentLocation, map]);

  const getRadiusFromZoom = (zoomLevel: number): number => {
    if (zoomLevel >= 16) return 500;   // 500m
    if (zoomLevel >= 15) return 1000;  // 1km
    if (zoomLevel >= 14) return 2000;  // 2km
    if (zoomLevel >= 13) return 5000;  // 5km
    if (zoomLevel >= 12) return 8000;  // 8km
    return 10000; // 10km (최대)
  };

  const fetchBikeStations = useCallback(async () => {
    console.log('🚲 fetchBikeStations 호출!');
    
    if (!map) {
      console.log('❌ map이 없음');
      return;
    }

    // 지도에서 직접 중심 좌표 가져오기 (상태에 의존하지 않음)
    const center = map.getCenter();
    if (!center) {
      console.log('❌ 지도 중심을 가져올 수 없음');
      return;
    }
    
    const apiLocation = {
      lat: center.lat(),
      lng: center.lng()
    };

    const zoomLevel = map.getZoom() || 15;
    const radius = getRadiusFromZoom(zoomLevel);
    
    console.log(`🔍 Fetching bike stations - zoom: ${zoomLevel}, radius: ${radius}m`);
    console.log(`📍 API에 사용할 좌표:`, apiLocation);
    console.log(`📍 currentLocation 상태:`, currentLocation);

    setShowBikeWarning(false);

    try {
      console.log('🚀 Making API call to /bikes/stations/nearby');
      const params = {
        latitude: apiLocation.lat,  // 지도 중심 좌표 사용
        longitude: apiLocation.lng, // 지도 중심 좌표 사용
        radius: Math.max(100, Math.min(radius, 5000)) // 최대 5km로 제한
      };
      console.log('📝 API params:', params);
      
      const response = await privateApi.get('/bikes/stations/nearby', { params });
      
      console.log('📨 API 응답:', response.data);

      if (response.data.success) {
        console.log(`✅ 성공! ${response.data.data.stations.length}개 자전거 대여소 수신`);
        const stations = response.data.data.stations;
        setBikeStations(stations);
        displayBikeMarkers(stations);
      } else {
        console.log('⚠️ API 성공하지만 success: false');
      }
    } catch (error) {
      console.error('🚫 Failed to fetch bike stations:', error);
      console.error('🚫 Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }, [map]); // map에만 의존, currentLocation 제거!

  // 사용자가 더 이상 터치 안할 때만 API 호출
  const debouncedFetchBikeStations = useCallback(() => {
    // 기존 타이머 취소
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      console.log('⏰ 디바운싱 완료! API 호출 시작');
      // map만 있으면 API 호출 가능
      if (map) {
        console.log('✅ map 존재, API 호출 시작');
        fetchBikeStations();
      } else {
        console.log('❌ 디바운싱 시점에 map 없음');
      }
    }, 1000); // 1초로 늘림 - 사용자가 1초간 아무것도 안 할 때만 호출
  }, [map, fetchBikeStations]); // currentLocation 제거!

  // Android API를 사용한 위치 초기화
  const initializeLocation = async () => {
    console.log('📍 위치 초기화 시작');
    
    try {
      // 현재 위치 가져오기 (Hook에서 가져온 함수 사용)
      const location = await getCurrentLocation();
      
      if (location && !location.error) {
        console.log('✅ Android API로 위치 획득:', location);
        const newLocation = {
          lat: location.latitude,
          lng: location.longitude
        };
        setCurrentLocation(newLocation);
        
        // 지도가 로드되면 중심 이동
        if (map) {
          map.setCenter(newLocation);
          updateUserLocationMarker(newLocation);
        }
        
        // 위치 업데이트 시작
        requestLocationUpdates((updatedLocation) => {
          console.log('📍 위치 업데이트:', updatedLocation);
          if (!updatedLocation.error) {
            const newLoc = {
              lat: updatedLocation.latitude,
              lng: updatedLocation.longitude
            };
            setCurrentLocation(newLoc);
            updateUserLocationMarker(newLoc);
          }
        });
        
      } else {
        console.log('⚠️ Android API 실패, 브라우저 API 사용');
        fallbackToNavigatorGeolocation();
      }
    } catch (error) {
      console.error('🚫 Android 위치 API 오류:', error);
      fallbackToNavigatorGeolocation();
    }
  };

  // 브라우저 Geolocation API 폴백
  const fallbackToNavigatorGeolocation = () => {
    console.log('🌐 브라우저 Geolocation API 사용');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ 브라우저로 위치 획득:', position.coords);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          if (map) {
            map.setCenter(location);
            updateUserLocationMarker(location);
          }
        },
        (error) => {
          console.error("🚫 브라우저 위치 오류:", error);
          const defaultLocation = { lat: 37.5665, lng: 126.9780 };
          setCurrentLocation(defaultLocation);
          if (map) {
            map.setCenter(defaultLocation);
          }
        }
      );
    }
  };

  // 사용자 위치 마커 업데이트 (보라색 점)
  const updateUserLocationMarker = (location: {lat: number, lng: number}) => {
    if (!map) return;
    
    // 기존 마커 제거
    if (userLocationMarker) {
      userLocationMarker.setMap(null);
    }
    
    // 보라색 점 마커 생성
    const userMarker = new google.maps.Marker({
      position: location,
      map: map,
      title: "내 위치",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10, // 조금 더 크게
        fillColor: '#9C27B0', // 보라색
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: '#FFFFFF',
        strokeOpacity: 1
      },
      zIndex: 1000 // 다른 마커보다 위에 표시
    });
    
    setUserLocationMarker(userMarker);
    console.log('📍 사용자 위치 마커 업데이트 (보라색):', location);
  };

  // 사용자가 현재 위치로 지도 이동 (버튼용)
  const moveToCurrentLocation = async () => {
    console.log('🎯 현재 위치로 이동 시도');
    
    try {
      const location = await getCurrentLocation();
      
      if (location && !location.error) {
        const newLocation = {
          lat: location.latitude,
          lng: location.longitude
        };
        setCurrentLocation(newLocation);
        
        if (map) {
          map.setCenter(newLocation);
          map.setZoom(16); // 좀 더 확대
          updateUserLocationMarker(newLocation);
        }
        
        showToast({ message: '현재 위치로 이동했습니다' });
      } else {
        fallbackToNavigatorGeolocation();
      }
    } catch (error) {
      console.error('🚫 위치 이동 실패:', error);
      fallbackToNavigatorGeolocation();
    }
  };

  // 경로 주변 자전거 대여소 필터링 (경로 표시 중일 때만)
  const filterStationsNearRoute = (stations: BikeStation[]): BikeStation[] => {
    if (!navigation.route || !navigation.isNavigating) {
      return stations; // 경로 없으면 모든 대여소 표시
    }

    const route = navigation.route.routes[0];
    if (!route || !route.legs) return stations;

    const routePath: google.maps.LatLng[] = [];
    route.legs.forEach(leg => {
      leg.steps?.forEach(step => {
        if (step.path) {
          routePath.push(...step.path);
        }
      });
    });

    if (routePath.length === 0) return stations;

    // 경로에서 500m 이내의 대여소만 필터링
    const filteredStations = stations.filter(station => {
      const stationPos = new google.maps.LatLng(
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );

      return routePath.some(routePoint => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          stationPos,
          routePoint
        );
        return distance <= 500; // 500m 이내
      });
    });

    console.log(`🛣️ 경로 주변 필터링: ${stations.length}개 → ${filteredStations.length}개`);
    return filteredStations;
  };

  const displayBikeMarkers = (stations: BikeStation[]) => {
    if (!map) {
      console.log('No map available for displaying markers');
      return;
    }

    // 항상 기존 마커를 먼저 완전히 제거
    console.log('🧹 기존 마커 완전 제거');
    clearBikeMarkers();

    // 경로 표시 중이면 경로 주변 대여소만 표시
    let filteredStations = filterStationsNearRoute(stations);
    
    // 현재 지도 viewport 내의 대여소만 필터링
    const bounds = map.getBounds();
    if (bounds) {
      filteredStations = filteredStations.filter(station => {
        const stationPos = new google.maps.LatLng(
          parseFloat(station.latitude),
          parseFloat(station.longitude)
        );
        return bounds.contains(stationPos);
      });
    }
    
    console.log(`Displaying ${filteredStations.length} bike markers (viewport filtered)`);
    
    // 마커 개수 업데이트
    setPreviousStationCount(filteredStations.length);

    // 10개 이상이면 작은 파란색 점으로 표시
    if (filteredStations.length >= 10) {
      console.log(`🚲 자전거 대여소가 10개 이상 (${filteredStations.length}개), 파란색 점으로 표시`);
      createDotMarkers(filteredStations);
    } else {
      // 10개 이하면 아이콘 마커 사용
      console.log(`🚲 자전거 대여소 10개 이하 (${filteredStations.length}개), 아이콘 마커 표시`);
      createIconMarkers(filteredStations);
    }
  };

  // 파란색 점 마커 생성
  const createDotMarkers = (stations: BikeStation[]) => {
    const markers = stations.map((station) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude)
        },
        map: map,
        title: `${station.name}\n대여가능: ${station.freeBikes}개\n전체: ${station.totalSlots}개`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 4,
          fillColor: '#1976D2',
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          strokeOpacity: 1
        },
        optimized: false
      });

      createBikeInfoWindow(marker, station);
      return marker;
    });

    setBikeMarkers(markers);
  };

  // 아이콘 마커 생성
  const createIconMarkers = (stations: BikeStation[]) => {
    const size = 36;
    const anchor = 18;

    const markers = stations.map((station) => {
      const bikeIconWithBackground = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${(size/2) - 2}" fill="#1565C0" stroke="#0D47A1" stroke-width="2"/>
            <g transform="translate(${(size-30)/2}, ${(size-27)/2 + 2}) scale(1)">
              <path d="M6.25 24.625C5.08968 24.625 3.97688 24.1641 3.15641 23.3436C2.33594 22.5231 1.875 21.4103 1.875 20.25C1.875 19.0897 2.33594 17.9769 3.15641 17.1564C3.97688 16.3359 5.08968 15.875 6.25 15.875C7.41032 15.875 8.52312 16.3359 9.34359 17.1564C10.1641 17.9769 10.625 19.0897 10.625 20.25C10.625 21.4103 10.1641 22.5231 9.34359 23.3436C8.52312 24.1641 7.41032 24.625 6.25 24.625M6.25 14C4.5924 14 3.00269 14.6585 1.83058 15.8306C0.65848 17.0027 0 18.5924 0 20.25C0 21.9076 0.65848 23.4973 1.83058 24.6694C3.00269 25.8415 4.5924 26.5 6.25 26.5C7.9076 26.5 9.49732 25.8415 10.6694 24.6694C11.8415 23.4973 12.5 21.9076 12.5 20.25C12.5 18.5924 11.8415 17.0027 10.6694 15.8306C9.49732 14.6585 7.9076 14 6.25 14M18.5 11.5H23.75V9.25H19.75L17.325 5.1625C16.9625 4.5375 16.25 4.125 15.5 4.125C14.9125 4.125 14.375 4.3625 14 4.75L9.375 9.3625C8.9875 9.75 8.75 10.25 8.75 10.875C8.75 11.6625 9.1625 12.325 9.8125 12.7125L14 15.25V21.5H16.25V13.375L13.4375 11.3125L16.3375 8.375M23.75 24.625C22.5897 24.625 21.4769 24.1641 20.6564 23.3436C19.8359 22.5231 19.375 21.4103 19.375 20.25C19.375 19.0897 19.8359 17.9769 20.6564 17.1564C21.4769 16.3359 22.5897 15.875 23.75 15.875C24.9103 15.875 26.0231 16.3359 26.8436 17.1564C27.6641 17.9769 28.125 19.0897 28.125 20.25C28.125 21.4103 27.6641 22.5231 26.8436 23.3436C26.0231 24.1641 24.9103 24.625 23.75 24.625M23.75 14C22.0924 14 20.5027 14.6585 19.3306 15.8306C18.1585 17.0027 17.5 18.5924 17.5 20.25C17.5 21.9076 18.1585 23.4973 19.3306 24.6694C20.5027 25.8415 22.0924 26.5 23.75 26.5C24.5708 26.5 25.3835 26.3383 26.1418 26.0242C26.9001 25.7102 27.5891 25.2498 28.1694 24.6694C28.7498 24.0891 29.2102 23.4001 29.5242 22.6418C29.8383 21.8835 30 21.0708 30 20.25C30 19.4292 29.8383 18.6165 29.5242 17.8582C29.2102 17.0999 28.7498 16.4109 28.1694 15.8306C27.5891 15.2502 26.9001 14.7898 26.1418 14.4758C25.3835 14.1617 24.5708 14 23.75 14M20 5C21.25 5 22.25 4 22.25 2.75C22.25 1.5 21.25 0.5 20 0.5C18.75 0.5 17.75 1.5 17.75 2.75C17.75 4 18.75 5 20 5Z" fill="white"/>
            </g>
          </svg>
        `),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(anchor, size - 2)
      };

      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude)
        },
        map: map,
        title: `${station.name}\n대여가능: ${station.freeBikes}개\n전체: ${station.totalSlots}개`,
        icon: bikeIconWithBackground,
        optimized: false
      });

      createBikeInfoWindow(marker, station);
      return marker;
    });

    setBikeMarkers(markers);
  };

  // InfoWindow 생성 공통 함수
  const createBikeInfoWindow = (marker: google.maps.Marker, station: BikeStation) => {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-sm mb-2 text-gray-800">${station.name}</h3>
          <p class="text-xs text-gray-600 mb-3">${station.address}</p>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span class="font-medium text-blue-600">대여가능: ${station.freeBikes}개</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-gray-400"></div>
              <span class="text-gray-600">빈자리: ${station.emptySlots}개</span>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-gray-200">
            <p class="text-xs text-gray-500">전체: ${station.totalSlots}개 | 거리: ${station.distance}m</p>
          </div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  };



  const clearBikeMarkers = () => {
    console.log(`Clearing ${bikeMarkers.length} bike markers`);
    bikeMarkers.forEach(marker => marker.setMap(null));
    setBikeMarkers([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map || !currentLocation) return;

    try {
      const service = new google.maps.places.PlacesService(map);
      const request = {
        query: searchQuery,
        location: currentLocation,
        radius: 50000,
        fields: ['name', 'geometry', 'formatted_address', 'place_id'],
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: PlaceResult[] = results.slice(0, 5).map((place, index) => ({
            id: place.place_id || `place-${index}`,
            name: place.name || 'Unknown',
            address: place.formatted_address || 'Unknown address',
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          }));
          setSearchResults(places);
          setSelectedPlace(null);
          clearRoute();
        } else {
          console.warn('Places search failed:', status);
          setSearchResults([]);
        }
      });
    } catch (error) {
      console.error('Search error:', error);
      showToast({ message: "Search failed. Please try again." });
    }
  };

  const selectPlace = (place: PlaceResult) => {
    setSelectedPlace(place);
    setSearchResults([]);
    
    if (map) {
      map.setCenter({ lat: place.lat, lng: place.lng });
    }
    
    showRoute(place);
  };

  const showRoute = async (destination: PlaceResult) => {
    if (!map) return;

    // 최신 사용자 위치 가져오기
    let startLocation = currentLocation;
    
    try {
      const freshLocation = await getCurrentLocation();
      if (freshLocation && !freshLocation.error) {
        startLocation = {
          lat: freshLocation.latitude,
          lng: freshLocation.longitude
        };
        setCurrentLocation(startLocation);
        console.log('🚀 길안내용 최신 위치 획득:', startLocation);
      }
    } catch (error) {
      console.log('⚠️ 최신 위치 획득 실패, 기존 위치 사용');
    }
    
    if (!startLocation) {
      showToast({ message: "현재 위치를 확인할 수 없습니다." });
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    
    const travelModes = [
      { mode: google.maps.TravelMode.WALKING, name: "Walking" },
      { mode: google.maps.TravelMode.TRANSIT, name: "Transit" },
      { mode: google.maps.TravelMode.DRIVING, name: "Driving" }
    ];

    for (const { mode, name } of travelModes) {
      try {
        const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
          const request: google.maps.DirectionsRequest = {
            origin: startLocation,
            destination: { lat: destination.lat, lng: destination.lng },
            travelMode: mode,
            unitSystem: google.maps.UnitSystem.METRIC,
            region: 'KR',
            language: 'en'
          };

          if (mode === google.maps.TravelMode.TRANSIT) {
            request.transitOptions = {
              departureTime: new Date(),
            };
          }

          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error(`${name} route failed: ${status}`));
            }
          });
        });

        if (directionsRenderer) {
          directionsRenderer.setMap(null);
        }

        const renderer = new google.maps.DirectionsRenderer({
          directions: result,
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#22C55E',
            strokeWeight: 6,
            strokeOpacity: 0.8
          }
        });
        
        setDirectionsRenderer(renderer);
        setNavigation(prev => ({
          ...prev,
          route: result,
          travelMode: mode
        }));

        console.log(`${name} route found successfully`);
        return;

      } catch (error) {
        console.warn(error);
        continue;
      }
    }

    showStraightLine(destination);
    showToast({ message: "경로를 찾을 수 없습니다. 직선거리를 표시합니다." });
  };

  const showStraightLine = async (destination: PlaceResult) => {
    if (!map) return;

    // 최신 위치 확인
    let startLocation = currentLocation;
    try {
      const freshLocation = await getCurrentLocation();
      if (freshLocation && !freshLocation.error) {
        startLocation = {
          lat: freshLocation.latitude,
          lng: freshLocation.longitude
        };
        setCurrentLocation(startLocation);
      }
    } catch (error) {
      console.log('직선거리용 위치 업데이트 실패');
    }
    
    if (!startLocation) return;

    clearRoute();

    const straightLine = new google.maps.Polyline({
      path: [startLocation, { lat: destination.lat, lng: destination.lng }],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map
    });

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(startLocation.lat, startLocation.lng),
      new google.maps.LatLng(destination.lat, destination.lng)
    );

    const mockRoute = {
      routes: [{
        legs: [{
          distance: { text: `${(distance / 1000).toFixed(1)} km`, value: distance },
          duration: { text: `${Math.round(distance / 1000 * 15)} min`, value: Math.round(distance / 15) * 60 }
        }]
      }]
    };

    setNavigation(prev => ({
      ...prev,
      route: mockRoute as google.maps.DirectionsResult,
      travelMode: google.maps.TravelMode.WALKING
    }));
  };

  const startNavigation = () => {
    if (!selectedPlace) return;
    
    setNavigation(prev => ({
      ...prev,
      isNavigating: true,
      destination: selectedPlace
    }));
    
    showToast({ message: `Navigation started to ${selectedPlace.name}` });
  };

  const stopNavigation = () => {
    setNavigation({ isNavigating: false });
    setSelectedPlace(null);
    setSearchResults([]);
    setSearchQuery("");
    clearRoute();
  };

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setDirectionsRenderer(null);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSelectedPlace(null);
    setSearchQuery("");
    clearRoute();
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading map...</div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600">Failed to load map</div>
          </div>
        );
      case Status.SUCCESS:
        return <GoogleMap onMapLoad={setMap} currentLocation={currentLocation} />;
    }
  };

  const getRouteInfo = () => {
    if (!navigation.route) return null;
    
    const route = navigation.route.routes[0];
    const leg = route.legs[0];
    
    return {
      distance: leg.distance?.text || '',
      duration: leg.duration?.text || '',
      mode: navigation.travelMode
    };
  };

  const getTravelModeIcon = (mode?: google.maps.TravelMode) => {
    switch (mode) {
      case google.maps.TravelMode.WALKING:
        return <Navigation className="w-4 h-4" />;
      case google.maps.TravelMode.TRANSIT:
        return <Train className="w-4 h-4" />;
      case google.maps.TravelMode.DRIVING:
        return <Car className="w-4 h-4" />;
      default:
        return <Route className="w-4 h-4" />;
    }
  };

  const routeInfo = getRouteInfo();
  const showSearchResults = searchResults.length > 0;
  const headerHeight = showSearchResults ? "pt-0" : "pt-40";

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Bike Station Warning - 높은 Z-index */}
      {showBikeWarning && (
        <div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 pointer-events-none"
          style={{ opacity: '0.5' }}
        >
          <Bike className="w-5 h-5" />
          <span className="text-sm">Cannot show public bike station, too far away</span>
        </div>
      )}

      <div className={`${showSearchResults ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 bg-white shadow-md`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-800">Eco Map</h1>
            {(selectedPlace || navigation.isNavigating) && (
              <button
                onClick={clearSearch}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-4">Where are you heading to?</p>
          <SearchBar
            placeholder="Search for eco-friendly places..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
          
          {bikeStations.length > 0 && !showBikeWarning && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Bike className="w-4 h-4 text-blue-500" />
              <span>{bikeStations.length} bike stations nearby</span>
            </div>
          )}
        </div>
        
        {showSearchResults && (
          <div className="bg-white border-t border-gray-200 max-h-80 overflow-y-auto">
            {searchResults.map((place) => (
              <div
                key={place.id}
                onClick={() => selectPlace(place)}
                className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${headerHeight} h-screen`}>
        <Wrapper
          apiKey="AIzaSyAgywfTrsN-rwo0rmqlHEUV-edLU195kds"
          render={render}
          libraries={['places', 'geometry']}
        />
      </div>

      {selectedPlace && !navigation.isNavigating && (
        <div className="absolute bottom-36 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-40">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{selectedPlace.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedPlace.address}</p>
              
              {routeInfo && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    {getTravelModeIcon(routeInfo.mode)}
                    <span>{routeInfo.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{routeInfo.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={startNavigation}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Start Navigating
          </button>
        </div>
      )}

      {navigation.isNavigating && navigation.destination && (
        <div className="absolute bottom-36 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">Navigation Active</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{navigation.destination.name}</h3>
          
          {routeInfo && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                {getTravelModeIcon(routeInfo.mode)}
                <span>{routeInfo.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{routeInfo.duration}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={stopNavigation}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Stop Navigation
          </button>
        </div>
      )}

      <button
        onClick={moveToCurrentLocation}
        className="fixed bottom-48 right-4 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <Navigation className="w-6 h-6 text-blue-500" />
      </button>
    </div>
  );
};

export default MapPage;
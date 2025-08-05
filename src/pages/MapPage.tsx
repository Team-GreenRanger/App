import React, { useEffect, useState } from "react";
import { SearchBar } from "../components";
import { useAndroidApi } from "../hooks";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { MapPin, Navigation, X, Clock, Route, Car, Train } from "lucide-react";
import GoogleMap from "./GoogleMap.tsx";

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
}

interface NavigationState {
  isNavigating: boolean;
  destination?: PlaceResult;
  route?: google.maps.DirectionsResult;
  travelMode?: google.maps.TravelMode;
}

const MapPage: React.FC = () => {
  const { updateBottomNavigation, getSystemInfo, showToast } = useAndroidApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    isNavigating: false
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    updateBottomNavigation("map");
    getCurrentLocation();
  }, [updateBottomNavigation]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          if (map) {
            map.setCenter(location);
          }
        },
        (error) => {
          console.error("Location error:", error);
          const defaultLocation = { lat: 37.5665, lng: 126.9780 };
          setCurrentLocation(defaultLocation);
          if (map) {
            map.setCenter(defaultLocation);
          }
        }
      );
    }
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
    if (!currentLocation || !map) return;

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
            origin: currentLocation,
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
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: mode === google.maps.TravelMode.WALKING ? '#4285F4' : 
                        mode === google.maps.TravelMode.TRANSIT ? '#34A853' : '#EA4335',
            strokeWeight: 4,
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
    showToast({ message: "No route available. Showing straight line distance." });
  };

  const showStraightLine = (destination: PlaceResult) => {
    if (!currentLocation || !map) return;

    clearRoute();

    const straightLine = new google.maps.Polyline({
      path: [currentLocation, { lat: destination.lat, lng: destination.lng }],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map
    });

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
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
        <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-40">
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
        <div className="absolute bottom-20 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-40">
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
        onClick={getCurrentLocation}
        className="fixed bottom-32 right-4 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <Navigation className="w-6 h-6 text-blue-500" />
      </button>
    </div>
  );
};

export default MapPage;
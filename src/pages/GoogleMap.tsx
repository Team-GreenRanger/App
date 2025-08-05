import { useEffect, useRef, useState } from "react";

interface GoogleMapProps {
  onMapLoad?: (map: google.maps.Map) => void;
  currentLocation?: {lat: number, lng: number} | null;
}

function GoogleMap({ onMapLoad, currentLocation }: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.marker.AdvancedMarkerElement>();

  useEffect(() => {
    if (ref.current && !googleMap) {
      const initialLocation = currentLocation || {
        lat: 37.5665,
        lng: 126.9780,
      };

      const initialMap = new window.google.maps.Map(ref.current, {
        center: initialLocation,
        zoom: 15,
        mapId: "eco_map",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setGoogleMap(initialMap);
      if (onMapLoad) {
        onMapLoad(initialMap);
      }
    }
  }, [ref.current, onMapLoad]);

  useEffect(() => {
    if (googleMap && currentLocation) {
      googleMap.setCenter(currentLocation);
      
      if (currentLocationMarker) {
        currentLocationMarker.map = null;
      }

      try {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: currentLocation,
          map: googleMap,
          title: "Your Location",
        });

        setCurrentLocationMarker(marker);
      } catch (error) {
        console.warn("AdvancedMarkerElement not available, using regular marker");
        const fallbackMarker = new google.maps.Marker({
          position: currentLocation,
          map: googleMap,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });
      }
    }
  }, [googleMap, currentLocation]);

  return (
    <div 
      ref={ref} 
      id="map" 
      className="w-full h-full"
      style={{ 
        minHeight: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
    />
  );
}

export default GoogleMap;
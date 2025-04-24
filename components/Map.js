// import { useEffect, useRef } from 'react';
// import dynamic from 'next/dynamic';

// // Client-side only Leaflet import
// const L = typeof window !== 'undefined' ? require('leaflet') : null;
// if (typeof window !== 'undefined') {
//   require('leaflet/dist/leaflet.css');
// }

// const Map = ({ order, language }) => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const routeLineRef = useRef(null);

//   useEffect(() => {
//     if (typeof window === 'undefined' || !L || !mapRef.current || !order?.address) return;

//     const map = L.map('orderMap').setView([24.7136, 46.6753], 12);
    
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);

//     mapRef.current = map;

//     const geocodeAddress = async () => {
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(order.address)}`
//         );
//         const data = await response.json();
        
//         if (data.length > 0) {
//           const { lat, lon } = data[0];
//           const location = L.latLng(parseFloat(lat), parseFloat(lon));
          
//           map.setView(location, 15);
          
//           if (markerRef.current) {
//             map.removeLayer(markerRef.current);
//           }
          
//           markerRef.current = L.marker(location, {
//             icon: L.divIcon({
//               className: 'custom-marker',
//               html: `<div style="background-color: ${order.status === 'pickup' ? '#3b82f6' : '#10b981'}; 
//                      width: 24px; height: 24px; border-radius: 50%; 
//                      border: 2px solid white; display: flex; 
//                      align-items: center; justify-content: center;
//                      color: white; font-weight: bold;">
//                      ${order.status === 'pickup' ? 'P' : 'D'}
//                     </div>`,
//               iconSize: [24, 24],
//               iconAnchor: [12, 12]
//             })
//           }).addTo(map);
          
//           markerRef.current.bindPopup(`
//             <div style="min-width: 200px;">
//               <h3 style="margin: 0 0 8px 0; font-weight: bold;">
//                 ${language === 'en' ? 'Order' : 'طلب'} #${order.id}
//               </h3>
//               <p style="margin: 4px 0;">
//                 <strong>${language === 'en' ? 'Status' : 'الحالة'}:</strong> 
//                 ${order.status}
//               </p>
//               <p style="margin: 4px 0;">
//                 <strong>${language === 'en' ? 'Address' : 'العنوان'}:</strong> 
//                 ${order.address}
//               </p>
//             </div>
//           `);
          
//           if (order.status === 'delivery' && order.storeLocation) {
//             drawRoute(order.storeLocation, location);
//           }
//         }
//       } catch (error) {
//         console.error('Geocoding error:', error);
//       }
//     };

//     const drawRoute = async (origin, destination) => {
//       try {
//         if (routeLineRef.current) {
//           map.removeLayer(routeLineRef.current);
//         }
        
//         const response = await fetch(
//           `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
//         );
//         const data = await response.json();
        
//         if (data.routes && data.routes.length > 0) {
//           const route = data.routes[0];
//           const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          
//           routeLineRef.current = L.polyline(routeCoordinates, {
//             color: '#3b82f6',
//             weight: 4,
//             opacity: 0.7,
//             dashArray: '5, 5'
//           }).addTo(map);
//         }
//       } catch (error) {
//         console.error('Routing error:', error);
//       }
//     };

//     geocodeAddress();

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.remove();
//       }
//     };
//   }, [order, language]);

//   return (
//     <div 
//       id="orderMap" 
//       className="w-full h-64 rounded-md overflow-hidden border border-gray-200"
//     />
//   );
// };

// // Export with dynamic loading (client-side only)
// export default dynamic(() => Promise.resolve(Map), {
//   ssr: false
// });

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Map({ pickupLocation, deliveryLocation, className = '', height = '300px' }) {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const { language } = useLanguage();

  // Default locations (will be used if no locations are provided)
  const DEFAULT_LOCATION = { lat: 25.276987, lng: 55.296249 }; // Dubai

  // Function to initialize the map
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places&language=${language}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      setIsLoaded(true);
    }
  }, [language]);

  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!isLoaded) return;

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Create map centered on default location or pickup location if available
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: pickupLocation || DEFAULT_LOCATION,
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        language: language
      });

      setMap(mapInstance);

      // Create directions service & renderer
      const directionsServiceInstance = new window.google.maps.DirectionsService();
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });

      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
    };

    initializeMap();

    // Cleanup function
    return () => {
      setMap(null);
      setDirectionsRenderer(null);
      setDirectionsService(null);
    };
  }, [isLoaded, pickupLocation, language]);

  // Calculate and display route when both locations are available
  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || !pickupLocation || !deliveryLocation) return;

    const pickup = pickupLocation;
    const delivery = deliveryLocation;

    directionsService.route(
      {
        origin: pickup,
        destination: delivery,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        avoidTolls: false,
        avoidHighways: false,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          // Create custom markers for pickup and delivery
          const pickupMarker = new window.google.maps.Marker({
            position: pickup,
            map: map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" stroke-width="2"/>
                  <path d="M20 10 L20 22 L26 16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            },
            title: language === 'en' ? 'Pickup Location' : 'موقع الاستلام',
            animation: window.google.maps.Animation.DROP,
          });

          const deliveryMarker = new window.google.maps.Marker({
            position: delivery,
            map: map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#F59E0B" stroke="white" stroke-width="2"/>
                  <path d="M15 20 L20 25 L25 20 L20 15 Z" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            },
            title: language === 'en' ? 'Delivery Location' : 'موقع التسليم',
            animation: window.google.maps.Animation.DROP,
          });

          // Adjust map bounds to fit both markers
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(pickup);
          bounds.extend(delivery);
          map.fitBounds(bounds);

          // Add info windows for markers
          const pickupInfo = new window.google.maps.InfoWindow({
            content: `<div><strong>${language === 'en' ? 'Pickup Location' : 'موقع الاستلام'}</strong></div>`
          });

          const deliveryInfo = new window.google.maps.InfoWindow({
            content: `<div><strong>${language === 'en' ? 'Delivery Location' : 'موقع التسليم'}</strong></div>`
          });

          pickupMarker.addListener('click', () => {
            pickupInfo.open(map, pickupMarker);
          });

          deliveryMarker.addListener('click', () => {
            deliveryInfo.open(map, deliveryMarker);
          });
        }
      }
    );
  }, [map, directionsService, directionsRenderer, pickupLocation, deliveryLocation, language]);

  // Show individual markers if we don't have both locations
  useEffect(() => {
    if (!map || !isLoaded || (pickupLocation && deliveryLocation)) return;

    // Clear any existing markers
    map.setCenter(pickupLocation || deliveryLocation || DEFAULT_LOCATION);

    if (pickupLocation) {
      new window.google.maps.Marker({
        position: pickupLocation,
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" stroke-width="2"/>
              <path d="M20 10 L20 22 L26 16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
        title: language === 'en' ? 'Pickup Location' : 'موقع الاستلام',
        animation: window.google.maps.Animation.DROP,
      });
    }

    if (deliveryLocation) {
      new window.google.maps.Marker({
        position: deliveryLocation,
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#F59E0B" stroke="white" stroke-width="2"/>
              <path d="M15 20 L20 25 L25 20 L20 15 Z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
        title: language === 'en' ? 'Delivery Location' : 'موقع التسليم',
        animation: window.google.maps.Animation.DROP,
      });
    }
  }, [map, isLoaded, pickupLocation, deliveryLocation, language]);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {/* Display a message if Google Maps API key is missing */}
      {isLoaded && !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="absolute bottom-2 left-2 right-2 bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-md text-sm">
          {language === 'en' 
            ? 'Note: Add a Google Maps API key in your environment variables for full map functionality.' 
            : 'ملاحظة: أضف مفتاح API لخرائط Google في متغيرات البيئة للحصول على وظائف الخريطة الكاملة.'}
        </div>
      )}
    </div>
  );
}
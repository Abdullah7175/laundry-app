import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Client-side only Leaflet import
const L = typeof window !== 'undefined' ? require('leaflet') : null;
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

const Map = ({ order, language }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routeLineRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !L || !mapRef.current || !order?.address) return;

    const map = L.map('orderMap').setView([24.7136, 46.6753], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(order.address)}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const location = L.latLng(parseFloat(lat), parseFloat(lon));
          
          map.setView(location, 15);
          
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          markerRef.current = L.marker(location, {
            icon: L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${order.status === 'pickup' ? '#3b82f6' : '#10b981'}; 
                     width: 24px; height: 24px; border-radius: 50%; 
                     border: 2px solid white; display: flex; 
                     align-items: center; justify-content: center;
                     color: white; font-weight: bold;">
                     ${order.status === 'pickup' ? 'P' : 'D'}
                    </div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(map);
          
          markerRef.current.bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">
                ${language === 'en' ? 'Order' : 'طلب'} #${order.id}
              </h3>
              <p style="margin: 4px 0;">
                <strong>${language === 'en' ? 'Status' : 'الحالة'}:</strong> 
                ${order.status}
              </p>
              <p style="margin: 4px 0;">
                <strong>${language === 'en' ? 'Address' : 'العنوان'}:</strong> 
                ${order.address}
              </p>
            </div>
          `);
          
          if (order.status === 'delivery' && order.storeLocation) {
            drawRoute(order.storeLocation, location);
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };

    const drawRoute = async (origin, destination) => {
      try {
        if (routeLineRef.current) {
          map.removeLayer(routeLineRef.current);
        }
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          
          routeLineRef.current = L.polyline(routeCoordinates, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '5, 5'
          }).addTo(map);
        }
      } catch (error) {
        console.error('Routing error:', error);
      }
    };

    geocodeAddress();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [order, language]);

  return (
    <div 
      id="orderMap" 
      className="w-full h-64 rounded-md overflow-hidden border border-gray-200"
    />
  );
};

// Export with dynamic loading (client-side only)
export default dynamic(() => Promise.resolve(Map), {
  ssr: false
});
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Alert {
  id: number;
  type: string;
  location: string;
  time: string;
  responders: number;
  coordinates: { lat: number; lng: number };
}

interface LeafletMapProps {
  alerts: Alert[];
}

const LeafletMap = ({ alerts }: LeafletMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when alerts change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Custom emergency marker icon
    const emergencyIcon = L.divIcon({
      className: "custom-emergency-marker",
      html: `
        <div style="position: relative; width: 40px; height: 40px;">
          <div style="position: absolute; inset: 0; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: hsl(var(--primary));"></div>
          </div>
          <div style="position: relative; width: 40px; height: 40px; border-radius: 50%; background: hsl(var(--primary)); border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // Add markers for each alert
    alerts.forEach((alert) => {
      const marker = L.marker([alert.coordinates.lat, alert.coordinates.lng], {
        icon: emergencyIcon,
      })
        .addTo(map.current!)
        .bindPopup(
          `
          <div style="padding: 8px; min-width: 150px;">
            <h3 style="font-weight: 600; margin-bottom: 4px; text-transform: capitalize; font-size: 14px;">${alert.type}</h3>
            <p style="font-size: 13px; margin-bottom: 4px;">${alert.location}</p>
            <p style="font-size: 12px; color: #666;">${alert.responders} responders • ${alert.time}</p>
          </div>
        `
        );

      markers.current.push(marker);
    });
  }, [alerts]);

  return <div ref={mapContainer} className="w-full h-full rounded-2xl" />;
};

export default LeafletMap;

import { useEffect } from 'react';
import {
  MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type LatLng = { lat: number; lng: number };

const CENTER: [number, number] = [7.4425, 3.9015];
const BOUNDS: [[number, number], [number, number]] = [
  [7.425, 3.88],
  [7.46, 3.925],
];

function ClickPicker({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
    },
  });
  return null;
}

function FlyToPosition({ position }: { position: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 17, { animate: true, duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

export function CampusMap({
  pickup,
  destination,
  pickupName,
  destinationName,
  onPick,
  onRecalibrate,
  recalibrating = false,
}: {
  pickup: LatLng | null;
  destination: LatLng | null;
  pickupName?: string;
  destinationName?: string;
  onPick: (p: LatLng) => void;
  onRecalibrate?: () => void;
  recalibrating?: boolean;
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border border-border">
      <MapContainer
        center={pickup ? [pickup.lat, pickup.lng] : CENTER}
        zoom={16}
        minZoom={14}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1.0}
        className="h-[46vh] w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickPicker onPick={onPick} />
        <FlyToPosition position={pickup} />

        {pickup && (
          <CircleMarker
            center={[pickup.lat, pickup.lng]}
            radius={9}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2563EB', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-semibold text-xs text-brand-600">
                📍 {pickupName || 'Pickup Point'}
              </span>
            </Tooltip>
          </CircleMarker>
        )}

        {destination && (
          <CircleMarker
            center={[destination.lat, destination.lng]}
            radius={10}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#0B7A4B', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-semibold text-xs text-accent">
                🎯 {destinationName || 'Destination'}
              </span>
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Floating Working Re-calibrate GPS Button */}
      {onRecalibrate && (
        <button
          type="button"
          onClick={onRecalibrate}
          disabled={recalibrating}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur text-ink border border-border shadow-md px-3 py-2 rounded-xl text-xs font-bold hover:bg-brand-50 hover:text-brand-600 transition-all active:scale-95 disabled:opacity-50"
          title="Re-calibrate GPS Location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-brand-600 ${recalibrating ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
          {recalibrating ? 'Calibrating…' : 'Re-calibrate GPS'}
        </button>
      )}
    </div>
  );
}
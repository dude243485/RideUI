import { useEffect } from 'react';
import {
  MapContainer, TileLayer, CircleMarker, useMap, useMapEvents,
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
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyToPickup({ pickup }: { pickup: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (pickup) map.flyTo([pickup.lat, pickup.lng], 17);
  }, [pickup, map]);
  return null;
}

export function CampusMap({
  pickup,
  destination,
  onPick,
}: {
  pickup: LatLng | null;
  destination: LatLng | null;
  onPick: (p: LatLng) => void;
}) {
  return (
    <MapContainer
      center={CENTER}
      zoom={16}
      minZoom={15}
      maxBounds={BOUNDS}
      maxBoundsViscosity={1.0}
      className="h-[45vh] w-full rounded-xl z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickPicker onPick={onPick} />
      <FlyToPickup pickup={pickup} />

      {pickup && (
        <CircleMarker
          center={[pickup.lat, pickup.lng]}
          radius={8}
          pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2563EB', fillOpacity: 1 }}
        />
      )}

      {destination && (
        <CircleMarker
          center={[destination.lat, destination.lng]}
          radius={10}
          pathOptions={{ color: '#0B7A4B', fillColor: '#0B7A4B', fillOpacity: 0.9 }}
        />
      )}
    </MapContainer>
  );
}
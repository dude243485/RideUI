import { useEffect, useState } from 'react';
import {
  MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CAMPUS_LANDMARKS } from '../lib/geoUtils';

export type LatLng = { lat: number; lng: number };
export type MapLayerMode = 'streets' | 'satellite' | 'osm';

const CENTER: [number, number] = [7.4420, 3.8985]; // Centered across Indy, Zik, SUB, Jaja, and Central Campus
const BOUNDS: [[number, number], [number, number]] = [
  [7.420, 3.875],
  [7.475, 3.935],
];

// Highlighted POIs rendered as interactive quick-tap nodes on the campus map
const INTERACTIVE_POIS = CAMPUS_LANDMARKS.filter((l) =>
  [
    'Independence Hall (Indy Katanga)',
    'Abu Bakar Salam P. G. Hall',
    'Nnamdi Azikiwe Hall (Zik Baluba)',
    'Jaja Clinic (University Health Services)',
    'Barth Road (near Independence Hall)',
    'Barth Road (near Jaja Clinic)',
    'Appleton Road',
    'Tafawa Balewa Hall',
    'Trenchard Hall',
    'Kenneth Dike Library (Main Library)',
    'Sultan Bello Hall',
    'Tedder Hall',
    'Mellanby Hall',
    'Kuti Hall',
    'Queen Elizabeth II Hall (Queens Hall)',
    'Queen Idia Hall',
    'Obafemi Awolowo Hall (Awo Hall)',
    'Faculty of Technology Complex',
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Education',
    'Student Union Building (S.U.B)',
    'Benue Road',
    'Abadina Road (near Abadina Gate)',
    'UI Zoological Gardens (Zoo)',
    'UI Main Gate',
    'Awo Stadium',
  ].includes(l.name)
);

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
  const [layerMode, setLayerMode] = useState<MapLayerMode>(() => {
    return (localStorage.getItem('rideui_map_layer') as MapLayerMode) || 'streets';
  });

  const handleSwitchLayer = (mode: MapLayerMode) => {
    setLayerMode(mode);
    localStorage.setItem('rideui_map_layer', mode);
  };

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
        {layerMode === 'streets' && (
          <TileLayer
            key="carto-voyager"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        )}

        {layerMode === 'satellite' && (
          <>
            <TileLayer
              key="esri-satellite"
              attribution="&copy; Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            <TileLayer
              key="satellite-labels"
              attribution=""
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              maxZoom={19}
              opacity={0.85}
            />
          </>
        )}

        {layerMode === 'osm' && (
          <TileLayer
            key="osm-classic"
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        <ClickPicker onPick={onPick} />
        <FlyToPosition position={pickup} />

        {/* Visible Campus Landmark & Road Nodes */}
        {INTERACTIVE_POIS.map((poi) => {
          const isPickup = pickup && Math.abs(pickup.lat - poi.lat) < 0.0003 && Math.abs(pickup.lng - poi.lng) < 0.0003;
          const isDest = destination && Math.abs(destination.lat - poi.lat) < 0.0003 && Math.abs(destination.lng - poi.lng) < 0.0003;
          if (isPickup || isDest) return null;

          const isRoad = poi.type === 'road';
          const isHealth = poi.type === 'health';
          const isHostel = poi.type === 'hostel';

          const fillColor = isHealth ? '#DC2626' : isHostel ? '#8B5CF6' : isRoad ? '#F59E0B' : '#64748B';

          return (
            <CircleMarker
              key={poi.name}
              center={[poi.lat, poi.lng]}
              radius={isRoad ? 4 : 5}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onPick({ lat: poi.lat, lng: poi.lng });
                },
              }}
              pathOptions={{
                color: '#ffffff',
                weight: 1.5,
                fillColor,
                fillOpacity: 0.85,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
                <span className="font-bold text-[11px] text-ink">
                  {poi.shortName || poi.name}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* User's Pickup Point */}
        {pickup && (
          <CircleMarker
            center={[pickup.lat, pickup.lng]}
            radius={10}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2563EB', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-semibold text-xs text-brand-600 bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-brand-200">
                📍 {pickupName || 'Pickup Point'}
              </span>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Selected Destination Point */}
        {destination && (
          <CircleMarker
            center={[destination.lat, destination.lng]}
            radius={11}
            pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#0B7A4B', fillOpacity: 1 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-semibold text-xs text-accent bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-accent/40">
                🎯 {destinationName || 'Destination'}
              </span>
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Floating Map Style Switcher (Streets / Satellite / OSM) */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-white/95 backdrop-blur border border-border shadow-md rounded-xl p-0.5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => handleSwitchLayer('streets')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
            layerMode === 'streets'
              ? 'bg-brand-600 text-white shadow-sm font-bold'
              : 'text-muted hover:text-ink'
          }`}
          title="Clean Street Map"
        >
          <span>🗺️</span>
          <span>Streets</span>
        </button>
        <button
          type="button"
          onClick={() => handleSwitchLayer('satellite')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
            layerMode === 'satellite'
              ? 'bg-brand-600 text-white shadow-sm font-bold'
              : 'text-muted hover:text-ink'
          }`}
          title="Aerial Satellite Photography"
        >
          <span>🛰️</span>
          <span>Satellite</span>
        </button>
        <button
          type="button"
          onClick={() => handleSwitchLayer('osm')}
          className={`px-2 py-1.5 rounded-lg transition-all text-[11px] font-medium ${
            layerMode === 'osm'
              ? 'bg-brand-600 text-white shadow-sm font-bold'
              : 'text-muted hover:text-ink'
          }`}
          title="Classic OpenStreetMap"
        >
          <span>OSM</span>
        </button>
      </div>

      {/* Floating Re-calibrate GPS Button */}
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

      {/* Campus Map Legend Pill */}
      <div className="absolute bottom-2 left-3 z-10 bg-white/90 backdrop-blur border border-border rounded-lg px-2 py-1 text-[10px] text-muted flex items-center gap-2 shadow-sm pointer-events-none">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> Clinic</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600 inline-block" /> Halls</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Roads</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> Faculties</span>
      </div>
    </div>
  );
}
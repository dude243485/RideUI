import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Navigation } from 'lucide-react';
import { ScreenShell, BottomSheet, Button, Wordmark, StatusBanner } from '../components/ui';
import { CampusMap, type LatLng } from '../components/CampusMap';
import { useUserLocation } from '../lib/useUserLocation';
import { resolveCampusLandmark, CAMPUS_LANDMARKS } from '../lib/geoUtils';

const DEFAULT_CAMPUS_PICKUP: LatLng = { lat: 7.4416, lng: 3.9006 }; // UI Main Gate

// Quick popular UI destinations for instant selection
const POPULAR_DESTINATIONS = [
  { label: 'Indy Hall', name: 'Independence Hall (Indy Katanga)' },
  { label: 'Abu Bakar Salam', name: 'Abu Bakar Salam P. G. Hall' },
  { label: 'Zik Hall', name: 'Nnamdi Azikiwe Hall (Zik Baluba)' },
  { label: 'Jaja Clinic', name: 'Jaja Clinic (University Health Services)' },
  { label: 'Barth Road', name: 'Barth Road (near Independence Hall)' },
  { label: 'Appleton Road', name: 'Appleton Road' },
  { label: 'KD Library', name: 'Kenneth Dike Library (Main Library)' },
  { label: 'Trenchard Hall', name: 'Trenchard Hall' },
  { label: 'Faculty of Tech', name: 'Faculty of Technology Complex' },
  { label: 'Benue Road', name: 'Benue Road' },
  { label: 'Abadina Road', name: 'Abadina Road (near Abadina Gate)' },
  { label: 'Queens Hall', name: 'Queen Elizabeth II Hall (Queens Hall)' },
  { label: 'Awo Hall', name: 'Obafemi Awolowo Hall (Awo Hall)' },
  { label: 'Idia Hall', name: 'Queen Idia Hall' },
  { label: 'Tedder Hall', name: 'Tedder Hall' },
  { label: 'Mellanby Hall', name: 'Mellanby Hall' },
  { label: 'Sultan Bello Hall', name: 'Sultan Bello Hall' },
  { label: 'Faculty of Arts', name: 'Faculty of Arts' },
  { label: 'Faculty of Science', name: 'Faculty of Science' },
  { label: 'UI Zoo', name: 'UI Zoological Gardens (Zoo)' },
  { label: 'Main Gate', name: 'UI Main Gate' },
].map((item) => {
  const found = CAMPUS_LANDMARKS.find((l) => l.name === item.name);
  return {
    label: item.label,
    name: item.name,
    coords: found ? { lat: found.lat, lng: found.lng } : { lat: 7.4416, lng: 3.9006 },
  };
});

export default function R2Home() {
  const navigate = useNavigate();
  const { position, status, retry } = useUserLocation();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const effectivePickup = position || DEFAULT_CAMPUS_PICKUP;

  // Resolve building/landmark names from coordinates
  const pickupLandmark = resolveCampusLandmark(effectivePickup);
  const destLandmark = destination ? resolveCampusLandmark(destination) : null;

  async function handleRecalibrate() {
    setIsCalibrating(true);
    retry();
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1500);
  }

  function handleSelectPopular(coords: LatLng) {
    setDestination(coords);
  }

  return (
    <ScreenShell className="bg-surface">
      {/* Header bar with wordmark & live pickup location indicator */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Wordmark size="sm" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink border border-border rounded-xl px-3 py-1.5 bg-white shadow-sm max-w-[220px] truncate">
          <MapPin size={14} className="text-brand-600 flex-shrink-0" />
          <span className="truncate" title={pickupLandmark.name}>
            {status === 'locating' || isCalibrating ? 'Calibrating GPS…' : pickupLandmark.name}
          </span>
        </div>
      </div>

      {/* Campus Map with GPS calibrate button and interactive landmark pins */}
      <div className="px-4 pb-2">
        <CampusMap
          pickup={effectivePickup}
          destination={destination}
          pickupName={pickupLandmark.name}
          destinationName={destLandmark ? destLandmark.name : undefined}
          onPick={setDestination}
          onRecalibrate={handleRecalibrate}
          recalibrating={isCalibrating}
        />
      </div>

      {/* Bottom Sheet */}
      <div className="sticky bottom-0 mt-auto">
        <BottomSheet>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-ink">Where to on Campus?</h2>
            <button
              type="button"
              onClick={handleRecalibrate}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200 shadow-sm active:scale-95"
            >
              <Compass size={13} className={isCalibrating ? 'animate-spin' : ''} />
              Re-calibrate GPS
            </button>
          </div>

          {/* Current Locations Summary Panel */}
          <div className="bg-white border border-border rounded-xl p-3 mb-2 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">Current Location / Pickup</span>
                <p className="text-sm font-semibold text-ink truncate">
                  {pickupLandmark.name}
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-border/60 ml-4" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold block">Selected Destination</span>
                <p className="text-sm font-bold text-accent truncate">
                  {destLandmark ? destLandmark.name : 'Tap map or select a popular spot below'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Popular Destination Chips */}
          <div className="mb-3">
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Navigation size={12} className="text-brand-600" /> Popular Campus Spots & Roads
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none pr-1">
              {POPULAR_DESTINATIONS.map((dest) => {
                const isSelected = destination &&
                  Math.abs(destination.lat - dest.coords.lat) < 0.0003 &&
                  Math.abs(destination.lng - dest.coords.lng) < 0.0003;

                return (
                  <button
                    key={dest.label}
                    type="button"
                    onClick={() => handleSelectPopular(dest.coords)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-700 shadow'
                        : 'bg-white text-ink border-border hover:bg-brand-50 hover:text-brand-600'
                    }`}
                  >
                    {dest.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(status === 'denied' || status === 'unavailable') && (
            <div className="mb-3">
              <StatusBanner
                type="reconnecting"
                message="GPS off — default pickup set to UI Main Gate."
              />
              <button onClick={handleRecalibrate} className="mt-2 text-brand-600 text-sm font-medium underline">
                Enable device GPS & Re-calibrate
              </button>
            </div>
          )}

          <Button
            size="rider"
            disabled={!destination}
            onClick={() =>
              destination &&
              navigate('/drivers', {
                state: {
                  destination,
                  pickup: effectivePickup,
                  pickupName: pickupLandmark.name,
                  destinationName: destLandmark?.name || 'Campus Destination',
                },
              })
            }
          >
            {destination ? `Confirm: ${destLandmark?.name}` : 'Tap map or pick destination'}
          </Button>
        </BottomSheet>
      </div>
    </ScreenShell>
  );
}
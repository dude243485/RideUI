import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass } from 'lucide-react';
import { ScreenShell, BottomSheet, Button, Wordmark, StatusBanner } from '../components/ui';
import { CampusMap, type LatLng } from '../components/CampusMap';
import { useUserLocation } from '../lib/useUserLocation';
import { resolveCampusLandmark } from '../lib/geoUtils';

const DEFAULT_CAMPUS_PICKUP: LatLng = { lat: 7.4416, lng: 3.9006 }; // UI Main Gate

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

  return (
    <ScreenShell className="bg-surface">
      {/* Header bar with wordmark & live pickup location indicator */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Wordmark size="sm" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink border border-border rounded-xl px-3 py-1.5 bg-white shadow-sm max-w-[210px] truncate">
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
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200"
            >
              <Compass size={13} className={isCalibrating ? 'animate-spin' : ''} />
              Re-calibrate GPS
            </button>
          </div>

          {/* Current Locations Summary Panel */}
          <div className="bg-white border border-border rounded-xl p-3 mb-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-muted font-bold block">Current Location / Pickup</span>
                <p className="text-sm font-semibold text-ink truncate">
                  {pickupLandmark.name}
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-border/60 ml-4" />

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-muted font-bold block">Tapped Destination</span>
                <p className="text-sm font-semibold text-ink truncate">
                  {destLandmark ? destLandmark.name : 'Tap any building/area on the map'}
                </p>
              </div>
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

          <p className="text-xs text-muted mb-4">
            {destLandmark
              ? `Ready to head to ${destLandmark.name}. Tap below to view live campus drivers.`
              : 'Tap anywhere on the University of Ibadan campus map to pin your drop-off building.'}
          </p>

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
            {destination ? `Confirm destination (${destLandmark?.name})` : 'Select a destination on map'}
          </Button>
        </BottomSheet>
      </div>
    </ScreenShell>
  );
}
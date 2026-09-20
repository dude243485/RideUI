import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { ScreenShell, BottomSheet, Button, Wordmark, StatusBanner } from '../components/ui';
import { CampusMap, type LatLng } from '../components/CampusMap';
import { useUserLocation } from '../lib/useUserLocation';

const DEFAULT_CAMPUS_PICKUP: LatLng = { lat: 7.4416, lng: 3.9006 }; // UI Main Gate

export default function R2Home() {
  const navigate = useNavigate();
  const { position, status, retry } = useUserLocation();
  const [destination, setDestination] = useState<LatLng | null>(null);

  const effectivePickup = position || DEFAULT_CAMPUS_PICKUP;

  const pickupLabel =
    status === 'granted'
      ? 'Pickup: your location'
      : status === 'locating'
        ? 'Finding you…'
        : 'Pickup: Main Gate';

  return (
    <ScreenShell className="bg-surface">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Wordmark size="sm" />
        <div className="flex items-center gap-1 text-xs font-medium text-ink border border-border rounded-xl px-3 py-1.5 bg-white">
          <MapPin size={14} className="text-brand-600" />
          {pickupLabel}
        </div>
      </div>

      <div className="px-4 pb-2">
        <CampusMap pickup={effectivePickup} destination={destination} onPick={setDestination} />
      </div>

      <div className="sticky bottom-0 mt-auto">
        <BottomSheet>
          <h2 className="text-xl font-bold text-ink mb-1">Where to?</h2>

          {(status === 'denied' || status === 'unavailable') && (
            <div className="mb-3">
              <StatusBanner
                type="reconnecting"
                message="GPS off — default pickup set to UI Main Gate."
              />
              <button onClick={retry} className="mt-2 text-brand-600 text-sm font-medium underline">
                Enable device GPS
              </button>
            </div>
          )}

          <p className="text-sm text-muted mb-4">
            {destination ? 'Destination pinned on campus map.' : 'Tap the campus map to pick your destination.'}
          </p>

          <Button
            size="rider"
            disabled={!destination}
            onClick={() =>
              destination &&
              navigate('/drivers', { state: { destination, pickup: effectivePickup } })
            }
          >
            {destination ? 'Confirm destination' : 'Select a destination'}
          </Button>
        </BottomSheet>
      </div>
    </ScreenShell>
  );
}
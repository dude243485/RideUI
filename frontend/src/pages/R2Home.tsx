import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { ScreenShell, BottomSheet, Button, Wordmark, StatusBanner } from '../components/ui';
import { CampusMap, type LatLng } from '../components/CampusMap';
import { useUserLocation } from '../lib/useUserLocation';

export default function R2Home() {
  const navigate = useNavigate();
  const { position, status, retry } = useUserLocation();
  const [destination, setDestination] = useState<LatLng | null>(null);

  const pickupLabel =
    status === 'granted'
      ? 'Pickup: your location'
      : status === 'locating'
        ? 'Finding you…'
        : 'Location off';

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
        <CampusMap pickup={position} destination={destination} onPick={setDestination} />
      </div>

      <div className="sticky bottom-0 mt-auto">
        <BottomSheet>
          <h2 className="text-xl font-bold text-ink mb-1">Where to?</h2>

          {(status === 'denied' || status === 'unavailable') && (
            <div className="mb-3">
              <StatusBanner
                type="error"
                message="We need your location to set your pickup point."
              />
              <button onClick={retry} className="mt-2 text-brand-600 text-sm font-medium underline">
                Try again
              </button>
            </div>
          )}

          <p className="text-sm text-muted mb-4">
            {destination ? 'Destination pinned.' : 'Tap the map to drop a pin.'}
          </p>

          <Button
            size="rider"
            disabled={!destination || !position}
            onClick={() =>
              destination &&
              position &&
              navigate('/drivers', { state: { destination, pickup: position } })
            }
          >
            {destination ? 'Confirm destination' : 'Select a destination'}
          </Button>
        </BottomSheet>
      </div>
    </ScreenShell>
  );
}
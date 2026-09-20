import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, Bell } from 'lucide-react';
import {
  ScreenShell, OnlineToggle, StopChip, StatusBanner,
  SkeletonBlock, Wordmark, Button,
} from '../../components/ui';
import { useStops } from '../../lib/useStops';
import { setDriverStatus, getPendingDriverRequests } from '../../lib/api';

export function D2Home() {
  const navigate = useNavigate();
  const { stops, status, reload } = useStops();
  const [online, setOnline] = useState(true);
  const [atStop, setAtStop] = useState('Main Gate');
  const [incomingRide, setIncomingRide] = useState<any | null>(null);

  // Sync status to backend
  async function handleToggleOnline(newOnline: boolean) {
    setOnline(newOnline);
    try {
      const selectedHub = stops.find((s) => s.name === atStop);
      await setDriverStatus(newOnline ? 'available' : 'offline', selectedHub?.id || null);
    } catch {
      // Ignore
    }
  }

  // Sync current hub to backend
  async function handleSelectStop(stopName: string) {
    setAtStop(stopName);
    try {
      const selectedHub = stops.find((s) => s.name === stopName);
      if (selectedHub) {
        await setDriverStatus(online ? 'available' : 'offline', selectedHub.id);
      }
    } catch {
      // Ignore
    }
  }

  // Poll for incoming ride requests while online
  useEffect(() => {
    if (!online) return;

    const interval = setInterval(async () => {
      try {
        const requests = await getPendingDriverRequests();
        if (requests && requests.length > 0) {
          setIncomingRide(requests[0]);
        }
      } catch {
        // Ignore
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [online]);

  return (
    <ScreenShell>
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-border">
        <Wordmark size="sm" />
        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-surface border border-border text-muted">
          Driver Portal
        </span>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-6 gap-6">
        {status === 'loading' ? (
          <div className="flex flex-col gap-4">
            <SkeletonBlock h="h-40" />
            <SkeletonBlock h="h-16" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => <SkeletonBlock key={i} h="h-11" w="w-28" />)}
            </div>
          </div>
        ) : status === 'error' ? (
          <div>
            <StatusBanner type="error" message="Could not connect. Check your network." />
            <button className="mt-3 text-brand-600 text-sm font-medium underline" onClick={reload}>
              Try again
            </button>
          </div>
        ) : status === 'empty' ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle size={40} className="text-muted" />
            <p className="text-lg text-muted font-medium">No stops available right now.</p>
          </div>
        ) : (
          <>
            <OnlineToggle online={online} onChange={handleToggleOnline} />

            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-brand-600" />
                <p className="text-base font-semibold text-ink">I'm currently at:</p>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {stops.map((s) => (
                  <StopChip
                    key={s.id}
                    label={s.name}
                    selected={atStop === s.name}
                    onClick={() => handleSelectStop(s.name)}
                  />
                ))}
              </div>
            </div>

            {incomingRide && (
              <div className="bg-brand-50 border-2 border-brand-600 rounded-xl p-4 flex flex-col gap-3 animate-bounce">
                <div className="flex items-center gap-2 text-brand-600">
                  <Bell size={20} className="animate-spin" />
                  <span className="font-bold text-sm uppercase tracking-wide">New Ride Request!</span>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {incomingRide.rider?.name || 'Student'} is requesting a ride from {incomingRide.pickup?.name || 'Campus'} to {incomingRide.destination?.name || 'Destination'} (₦{incomingRide.fare})
                </p>
                <Button
                  size="driver-md"
                  onClick={() => navigate('/driver/request', { state: { ride: incomingRide } })}
                >
                  VIEW REQUEST
                </Button>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
              {online ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
                  <p className="text-xl font-bold text-ink">Waiting for requests…</p>
                  <p className="text-sm text-muted">Stay close to your current campus stop.</p>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <p className="text-xl font-bold text-muted">You're offline</p>
                  <p className="text-sm text-muted">Toggle ONLINE above to start receiving student rides.</p>
                </>
              )}
            </div>

            {online && !incomingRide && (
              <button
                className="text-center text-xs text-muted underline pb-4"
                onClick={() => navigate('/driver/request')}
              >
                Simulate incoming request →
              </button>
            )}
          </>
        )}
      </div>
    </ScreenShell>
  );
}
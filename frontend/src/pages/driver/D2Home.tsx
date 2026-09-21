import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Phone, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import {
  ScreenShell, OnlineToggle, StopChip,
  Wordmark, Button,
} from '../../components/ui';
import { useStops } from '../../lib/useStops';
import { useUserLocation } from '../../lib/useUserLocation';
import { resolveCampusLandmark } from '../../lib/geoUtils';
import { setDriverStatus, getPendingDriverRequests, getCurrentUser } from '../../lib/api';

export function D2Home() {
  const navigate = useNavigate();
  const { stops } = useStops();
  const { position, retry: retryGps } = useUserLocation();
  const [online, setOnline] = useState(true);
  const [atStop, setAtStop] = useState('Main Gate');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [calibrating, setCalibrating] = useState(false);

  const currentUser = getCurrentUser();

  // Resolve driver's campus location from GPS
  const resolvedDriverLocation = position
    ? resolveCampusLandmark(position)
    : { name: atStop, distanceMeters: 0 };

  const currentDisplayLocation = position ? resolvedDriverLocation.name : atStop;

  // Sync driver location & online status to backend
  const syncLocation = useCallback(async (isOnline: boolean, stopName?: string, coords?: { lat: number; lng: number } | null) => {
    try {
      const selectedHub = stops.find((s) => s.name === (stopName || atStop));
      const hubId = selectedHub?.id || null;
      const coordinates = coords !== undefined ? coords : (position || (selectedHub ? { lat: selectedHub.lat, lng: selectedHub.lng } : null));

      await setDriverStatus(
        isOnline ? 'available' : 'offline',
        hubId,
        coordinates || undefined
      );
    } catch {
      // Ignore network sync glitch
    }
  }, [stops, atStop, position]);

  // Initial sync when position or stops resolve
  useEffect(() => {
    if (online) {
      syncLocation(true, atStop, position);
    }
  }, [position, atStop, online, syncLocation]);

  // Handle toggling online/offline
  async function handleToggleOnline(newOnline: boolean) {
    setOnline(newOnline);
    await syncLocation(newOnline);
  }

  // Handle manual stop selection
  async function handleSelectStop(stopName: string) {
    setAtStop(stopName);
    await syncLocation(online, stopName);
  }

  // Re-calibrate driver GPS
  async function handleRecalibrateGps() {
    setCalibrating(true);
    retryGps();
    setTimeout(() => {
      setCalibrating(false);
      syncLocation(online);
    }, 1500);
  }

  // Poll for incoming student ride orders while online
  useEffect(() => {
    if (!online) return;

    let mounted = true;
    const fetchOrders = async () => {
      try {
        const requests = await getPendingDriverRequests();
        if (mounted && Array.isArray(requests)) {
          setPendingOrders(requests);
        }
      } catch {
        // Ignore polling error
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2500);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [online]);

  return (
    <ScreenShell>
      {/* Driver Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border bg-white">
        <Wordmark size="sm" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border text-ink flex items-center gap-1">
            <ShieldCheck size={14} className="text-accent" />
            {currentUser?.name || 'Campus Driver'}
          </span>
          {currentUser?.phone && (
            <span className="text-xs text-muted font-medium">({currentUser.phone})</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-4 gap-4 overflow-y-auto pb-8">
        <OnlineToggle online={online} onChange={handleToggleOnline} />

        {/* Driver GPS & Location Card */}
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-ink font-semibold text-sm">
              <MapPin size={16} className="text-brand-600" />
              <span>Current Driver Location</span>
            </div>
            <button
              type="button"
              onClick={handleRecalibrateGps}
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200 transition-colors"
            >
              <Compass size={13} className={calibrating ? 'animate-spin' : ''} />
              {calibrating ? 'Calibrating…' : 'Re-calibrate GPS'}
            </button>
          </div>

          <div className="bg-surface rounded-xl p-3 border border-border flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-ink truncate">{currentDisplayLocation}</p>
              <p className="text-[11px] text-muted mt-0.5">
                {position
                  ? `Live GPS: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                  : 'Preset hub station (enable GPS for live tracking)'}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          </div>

          {/* Quick Hub Switcher */}
          <div className="mt-3">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Campus Hub Quick Select</p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {stops.slice(0, 10).map((s) => (
                <StopChip
                  key={s.id}
                  label={s.name}
                  selected={atStop === s.name}
                  onClick={() => handleSelectStop(s.name)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Nearest Live Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wide flex items-center gap-1.5">
              <Bell size={16} className={pendingOrders.length > 0 ? 'text-brand-600 animate-bounce' : 'text-muted'} />
              Nearest Student Orders ({pendingOrders.length})
            </h3>
            {online && (
              <span className="text-xs text-accent font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                Live Matching
              </span>
            )}
          </div>

          {pendingOrders.length === 0 ? (
            <div className="bg-white border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-2">
                <Compass size={20} className={online ? 'animate-spin' : ''} />
              </div>
              <p className="text-sm font-bold text-ink">
                {online ? 'Listening for campus requests…' : 'You are currently offline'}
              </p>
              <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                {online
                  ? 'When a student books a ride near your location, their order and contact phone number will appear right here.'
                  : 'Toggle the switch above to go online and receive student rides.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingOrders.map((order) => {
                const studentName = order.rider?.name || 'Student';
                const studentPhone = order.rider?.phone || '';
                const pickupLoc = order.pickup?.name || order.pickupHub?.name || 'Campus Location';
                const destLoc = order.destination?.name || order.destinationHub?.name || 'Destination';

                return (
                  <div
                    key={order._id}
                    className="bg-white border-2 border-brand-600 rounded-xl p-4 shadow-md flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-base text-ink">{studentName}</span>
                          <span className="text-xs bg-brand-50 text-brand-600 font-semibold px-2 py-0.5 rounded border border-brand-200">
                            {order.serviceType || 'Campus Drop'}
                          </span>
                        </div>
                        {studentPhone && (
                          <a
                            href={`tel:${studentPhone}`}
                            className="text-xs text-brand-600 font-semibold flex items-center gap-1 mt-0.5 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={12} /> {studentPhone} (Tap to Call)
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-ink">₦{order.fare}</span>
                        {order.distanceKm != null && (
                          <span className="text-[11px] text-muted block">{order.distanceKm} km</span>
                        )}
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="flex items-center gap-2 text-xs bg-surface p-2.5 rounded-lg border border-border">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-muted block font-bold">Pick up at</span>
                        <p className="font-bold text-brand-600 truncate">{pickupLoc}</p>
                      </div>
                      <ArrowRight size={14} className="text-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0 text-right">
                        <span className="text-[10px] uppercase tracking-wider text-muted block font-bold">Drop off at</span>
                        <p className="font-bold text-accent truncate">{destLoc}</p>
                      </div>
                    </div>

                    <Button
                      size="driver-md"
                      onClick={() => navigate('/driver/request', { state: { ride: order } })}
                    >
                      VIEW & ACCEPT REQUEST
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
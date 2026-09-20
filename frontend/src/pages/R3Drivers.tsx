import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  ScreenShell, DriverCard, Button,
  SkeletonBlock, SkeletonDriverCard, StatusBanner,
} from '../components/ui';
import type { LatLng } from '../components/CampusMap';
import { useFare } from '../lib/useFare';
import { bookRide } from '../lib/api';

const DEFAULT_DRIVERS = [
  { rank: 1, driverId: 'mock_driver_1', name: 'Musa A.', initials: 'MA', vehicle: 'Keke', eta: '2 min away', plateNumber: 'OYO-2041' },
  { rank: 2, driverId: 'mock_driver_2', name: 'Tunde O.', initials: 'TO', vehicle: 'Keke', eta: '4 min away', plateNumber: 'OYO-1892' },
  { rank: 3, driverId: 'mock_driver_3', name: 'Ibrahim S.', initials: 'IS', vehicle: 'Car', eta: '6 min away', plateNumber: 'OYO-3044' },
];

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

export function R3Drivers() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [selectedRank, setSelectedRank] = useState(1);
  const [booking, setBooking] = useState(false);

  const pickup: LatLng | undefined = state?.pickup;
  const to: LatLng | undefined = state?.destination;

  const { fare, serviceType, tier, distanceKm, suggestedDrivers, status: fareStatus, retry } = useFare(pickup, to);

  const driverList = (suggestedDrivers && suggestedDrivers.length > 0)
    ? suggestedDrivers.map((d, index) => ({
        rank: index + 1,
        driverId: d.driverId,
        name: d.name,
        initials: d.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'DR',
        vehicle: d.vehicleType === 'car' ? 'Car' : 'Keke',
        plateNumber: d.plateNumber,
        eta: `${Math.max(1, Math.round((d.distanceKm || 0.5) * 3))} min away`,
      }))
    : DEFAULT_DRIVERS;

  useEffect(() => {
    if (fareStatus === 'loaded' || fareStatus === 'error') {
      setViewState('loaded');
    } else {
      const t = setTimeout(() => setViewState('loaded'), 1000);
      return () => clearTimeout(t);
    }
  }, [fareStatus]);

  if (!to || !pickup) return <Navigate to="/home" replace />;

  const selectedDriver = driverList.find((d) => d.rank === selectedRank) || driverList[0];
  const canConfirm = !booking && (fare !== null || fareStatus === 'loaded');

  async function handleConfirmRide() {
    if (!selectedDriver) return;
    setBooking(true);
    let rideData: any = null;

    try {
      rideData = await bookRide({
        pickup: { lat: pickup!.lat, lng: pickup!.lng, name: 'Campus Pickup' },
        destination: { lat: to!.lat, lng: to!.lng, name: 'Campus Destination' },
        driverId: selectedDriver.driverId,
      });
    } catch (err) {
      console.warn('Backend ride request fallback for demo:', err);
    }

    setBooking(false);
    navigate('/waiting', {
      state: {
        destination: to,
        pickup,
        driver: selectedDriver,
        fare: fare || 150,
        serviceType: serviceType || 'Shared Car/Keke',
        tier,
        distanceKm,
        rideId: rideData?._id || 'demo_ride_' + Date.now(),
        ride: rideData,
      },
    });
  }

  return (
    <ScreenShell>
      <div className="px-4 pt-6 pb-4">
        <button onClick={() => navigate('/home')} className="text-sm text-muted mb-4 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-ink mb-1">Choose your driver</h1>

        <div className="flex items-center gap-2 mt-3 bg-white border border-border rounded-xl px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted uppercase tracking-wide">From</p>
            <p className="text-sm font-semibold text-ink truncate">Campus Pickup</p>
          </div>
          <ArrowRight size={16} className="text-brand-600 flex-shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-xs text-muted uppercase tracking-wide">To</p>
            <p className="text-sm font-semibold text-ink truncate">Pinned on map</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col gap-3 overflow-y-auto pb-56">
        {viewState === 'loading' && (
          <>
            <SkeletonBlock h="h-4" w="w-32" className="mb-1" />
            {[1, 2, 3].map((i) => <SkeletonDriverCard key={i} />)}
          </>
        )}

        {viewState === 'error' && (
          <StatusBanner type="error" message="Failed to load drivers. Tap to retry." />
        )}

        {viewState === 'empty' && (
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <AlertCircle size={36} className="text-muted" />
            <p className="text-base text-muted">
              No drivers online right now.<br />Try again in a minute.
            </p>
          </div>
        )}

        {viewState === 'loaded' && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{driverList.length} drivers nearby</p>
              {serviceType && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-600">
                  {serviceType}
                </span>
              )}
            </div>

            {driverList.map((d) => (
              <DriverCard
                key={d.rank}
                {...d}
                selected={selectedRank === d.rank}
                onSelect={() => setSelectedRank(d.rank)}
              />
            ))}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 pb-6 pt-4 bg-surface border-t border-border flex flex-col gap-3">
        <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3 min-h-[68px]">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Estimated fare</p>
            {distanceKm != null && (
              <p className="text-xs text-muted mt-0.5">{distanceKm} km campus distance</p>
            )}
          </div>

          {fareStatus === 'loading' && <SkeletonBlock h="h-8" w="w-24" />}

          {fareStatus === 'loaded' && fare !== null && (
            <div className="text-right">
              <p className="text-2xl font-bold text-ink">₦{fare.toLocaleString()}</p>
              {tier && <p className="text-[11px] text-brand-600 font-medium">Tier {tier} rate</p>}
            </div>
          )}

          {fareStatus === 'error' && (
            <button onClick={retry} className="text-sm font-medium text-brand-600 underline">
              Couldn't load price. Retry
            </button>
          )}
        </div>

        <Button
          size="rider"
          loading={booking}
          disabled={!canConfirm}
          onClick={handleConfirmRide}
        >
          Confirm ride with {selectedDriver?.name ?? '—'}
        </Button>
      </div>
    </ScreenShell>
  );
}
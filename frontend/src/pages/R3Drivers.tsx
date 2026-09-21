import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import {
  ScreenShell, DriverCard, Button,
  SkeletonBlock, SkeletonDriverCard, StatusBanner,
} from '../components/ui';
import type { LatLng } from '../components/CampusMap';
import { useFare } from '../lib/useFare';
import { bookRide, seedLiveDrivers } from '../lib/api';

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

export function R3Drivers() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [selectedRank, setSelectedRank] = useState(1);
  const [booking, setBooking] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const pickup: LatLng | undefined = state?.pickup;
  const to: LatLng | undefined = state?.destination;
  const pickupName: string = state?.pickupName || 'Campus Pickup';
  const destinationName: string = state?.destinationName || 'Campus Destination';

  const { fare, serviceType, tier, distanceKm, suggestedDrivers, status: fareStatus, retry } = useFare(pickup, to);

  const driverList = suggestedDrivers.map((d, index) => ({
    rank: index + 1,
    driverId: d.driverId,
    name: d.name,
    phone: d.phone || '',
    initials: d.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR',
    vehicle: d.vehicleType === 'car' ? 'Car' : 'Keke',
    plateNumber: d.plateNumber,
    distanceKm: d.distanceKm,
    eta: `${Math.max(1, Math.round((d.distanceKm || 0.5) * 3))} min away`,
  }));

  useEffect(() => {
    if (fareStatus === 'loaded') {
      setViewState(driverList.length > 0 ? 'loaded' : 'empty');
    } else if (fareStatus === 'error') {
      setViewState('error');
    } else {
      setViewState('loading');
    }
  }, [fareStatus, driverList.length]);

  if (!to || !pickup) return <Navigate to="/home" replace />;

  const selectedDriver = driverList.find((d) => d.rank === selectedRank) || driverList[0];
  const canConfirm = !booking && (fare !== null || fareStatus === 'loaded') && !!selectedDriver;

  async function handleSeedDrivers() {
    setSeeding(true);
    try {
      await seedLiveDrivers();
      retry();
    } catch (err) {
      console.error('Failed to seed live drivers', err);
    } finally {
      setSeeding(false);
    }
  }

  async function handleConfirmRide() {
    if (!selectedDriver) return;
    setBooking(true);
    let rideData: any = null;

    try {
      rideData = await bookRide({
        pickup: { lat: pickup!.lat, lng: pickup!.lng, name: pickupName },
        destination: { lat: to!.lat, lng: to!.lng, name: destinationName },
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
        pickupName,
        destinationName,
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
        <button onClick={() => navigate('/home')} className="text-sm text-muted mb-4 flex items-center gap-1 hover:text-ink">
          ← Back to map
        </button>
        <h1 className="text-2xl font-bold text-ink mb-1">Select Campus Driver</h1>

        {/* Route Card showing resolved landmark names */}
        <div className="flex items-center gap-2 mt-3 bg-white border border-border rounded-xl px-4 py-3 shadow-sm">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted uppercase tracking-wider font-bold">Pickup</p>
            <p className="text-sm font-semibold text-ink truncate" title={pickupName}>{pickupName}</p>
          </div>
          <ArrowRight size={16} className="text-brand-600 flex-shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[11px] text-muted uppercase tracking-wider font-bold">Destination</p>
            <p className="text-sm font-semibold text-ink truncate" title={destinationName}>{destinationName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col gap-3 overflow-y-auto pb-56">
        {viewState === 'loading' && (
          <>
            <SkeletonBlock h="h-4" w="w-48" className="mb-1" />
            {[1, 2, 3].map((i) => <SkeletonDriverCard key={i} />)}
          </>
        )}

        {viewState === 'error' && (
          <div className="flex flex-col gap-3">
            <StatusBanner type="error" message="Failed to load live campus drivers from database." />
            <Button size="rider" variant="secondary" onClick={() => retry()}>
              <RefreshCw size={16} /> Tap to retry
            </Button>
          </div>
        )}

        {viewState === 'empty' && (
          <div className="flex flex-col items-center py-10 gap-4 text-center bg-white border border-border rounded-2xl p-6 shadow-sm">
            <AlertCircle size={40} className="text-muted" />
            <div>
              <p className="text-base font-bold text-ink">No Drivers Currently Online</p>
              <p className="text-xs text-muted mt-1">
                No active transporters found near {pickupName} in the database.
              </p>
            </div>
            <Button
              size="rider"
              variant="primary"
              loading={seeding}
              onClick={handleSeedDrivers}
            >
              <UserCheck size={18} />
              Activate Campus Demo Transporters
            </Button>
            <p className="text-[11px] text-muted">
              Registers 3 verified UI campus drivers (Musa A., Tunde O., Ibrahim S.) in MongoDB.
            </p>
          </div>
        )}

        {viewState === 'loaded' && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">
                {driverList.length} live {driverList.length === 1 ? 'driver' : 'drivers'} available
              </p>
              {serviceType && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
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

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 pb-6 pt-4 bg-surface border-t border-border flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3 min-h-[68px]">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide font-medium">Standard UI Tariff</p>
            {distanceKm != null && (
              <p className="text-xs text-muted mt-0.5">{distanceKm} km campus distance</p>
            )}
          </div>

          {fareStatus === 'loading' && <SkeletonBlock h="h-8" w="w-24" />}

          {fareStatus === 'loaded' && fare !== null && (
            <div className="text-right">
              <p className="text-2xl font-bold text-ink">₦{fare.toLocaleString()}</p>
              {tier && <p className="text-[11px] text-brand-600 font-medium">Tariff Tier {tier}</p>}
            </div>
          )}

          {fareStatus === 'error' && (
            <button onClick={retry} className="text-sm font-medium text-brand-600 underline">
              Couldn't load tariff. Retry
            </button>
          )}
        </div>

        <Button
          size="rider"
          loading={booking}
          disabled={!canConfirm}
          onClick={handleConfirmRide}
        >
          {selectedDriver
            ? `Confirm ride with ${selectedDriver.name} (${selectedDriver.phone || selectedDriver.vehicle})`
            : 'Select an available driver'}
        </Button>
      </div>
    </ScreenShell>
  );
}
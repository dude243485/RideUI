import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import {
  ScreenShell, CountdownRing, Button, StatusBanner,
  SkeletonBlock,
} from '../components/ui';
import { getRideDetails, cancelRideRequest } from '../lib/api';

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

export function R4Waiting() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [expired, setExpired] = useState(false);

  const driver = state?.driver;
  const destination = state?.destination;
  const pickup = state?.pickup;
  const pickupName = state?.pickupName || 'Campus Pickup';
  const destinationName = state?.destinationName || 'Campus Destination';
  const rideId = state?.rideId;

  useEffect(() => {
    const t = setTimeout(() => setViewState('loaded'), 500);
    return () => clearTimeout(t);
  }, []);

  // Poll ride status if real rideId exists
  useEffect(() => {
    if (!rideId || String(rideId).startsWith('demo_')) return;

    const interval = setInterval(async () => {
      try {
        const ride = await getRideDetails(rideId);
        if (ride?.status === 'matched') {
          navigate('/matched', {
            state: {
              driver: {
                ...driver,
                name: ride.driver?.user?.name || driver.name,
                vehicle: ride.driver?.vehicleType === 'car' ? 'Car' : (ride.driver?.vehicleType || driver.vehicle),
                plateNumber: ride.driver?.plateNumber || driver.plateNumber || 'OYO-2041',
                phone: ride.driver?.user?.phone || driver.phone,
              },
              pickup,
              destination,
              pickupName,
              destinationName,
              rideId,
              ride,
              fare: ride.fare || state?.fare,
            },
          });
        } else if (ride?.status === 'cancelled') {
          setExpired(true);
        }
      } catch {
        // Ignore polling glitches
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [rideId, driver, destination, pickup, pickupName, destinationName, navigate, state?.fare]);

  if (!driver) return <Navigate to="/home" replace />;

  async function handleCancel() {
    if (rideId && !String(rideId).startsWith('demo_')) {
      try {
        await cancelRideRequest(rideId);
      } catch {
        // Ignore
      }
    }
    navigate('/home');
  }

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 text-center">
        {viewState === 'loading' && (
          <div className="flex flex-col items-center gap-6 w-full">
            <SkeletonBlock h="h-28" w="w-28" className="rounded-full" />
            <SkeletonBlock h="h-7" w="w-56" />
            <SkeletonBlock h="h-5" w="w-72" />
          </div>
        )}

        {viewState === 'error' && (
          <div className="w-full">
            <StatusBanner type="error" message="Connection lost. Retrying…" />
          </div>
        )}

        {viewState === 'empty' && (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle size={48} className="text-muted" />
            <p className="text-base text-muted">
              No drivers online right now.<br />Try again in a minute.
            </p>
            <Button size="rider" variant="secondary" onClick={() => navigate('/home')}>
              Go back
            </Button>
          </div>
        )}

        {viewState === 'loaded' && (
          <>
            <CountdownRing total={25} onExpire={() => setExpired(true)} />

            <div>
              <h1 className="text-2xl font-bold text-ink mb-1">
                Connecting with {driver.name}…
              </h1>
              <p className="text-xs text-brand-600 font-semibold mb-2">
                {driver.vehicle} · {driver.plateNumber || 'Verified UI Driver'} · 📞 {driver.phone || 'Phone on file'}
              </p>
              <p className="text-sm text-muted">
                {expired
                  ? 'Driver has not yet accepted — you can try another driver or call directly.'
                  : 'Driver has received your trip dispatch on campus.'}
              </p>
            </div>

            {/* Route summary */}
            <div className="flex items-center justify-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 shadow-sm text-xs font-medium text-ink w-full max-w-xs">
              <span className="truncate text-brand-600 font-bold">{pickupName}</span>
              <ArrowRight size={14} className="flex-shrink-0 text-muted" />
              <span className="truncate text-accent font-bold">{destinationName}</span>
            </div>

            {expired && (
              <StatusBanner type="reconnecting" message="Still waiting? Feel free to call the driver or cancel." />
            )}
          </>
        )}
      </div>

      <div className="px-4 pb-8 pt-4 flex flex-col gap-3">
        {driver.phone && (
          <Button
            size="rider"
            variant="secondary"
            onClick={() => window.open(`tel:${driver.phone}`)}
          >
            Call driver ({driver.phone})
          </Button>
        )}

        <Button variant="danger" size="rider" onClick={handleCancel}>
          Cancel request
        </Button>

        {viewState === 'loaded' && (
          <Button
            variant="primary"
            size="rider"
            onClick={() =>
              navigate('/matched', {
                state: {
                  driver,
                  destination,
                  pickup,
                  pickupName,
                  destinationName,
                  rideId,
                  fare: state?.fare,
                },
              })
            }
          >
            Proceed to matched screen →
          </Button>
        )}
      </div>
    </ScreenShell>
  );
}
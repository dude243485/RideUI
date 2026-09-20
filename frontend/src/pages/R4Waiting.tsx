import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
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
  const rideId = state?.rideId;

  useEffect(() => {
    const t = setTimeout(() => setViewState('loaded'), 800);
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
                vehicle: ride.driver?.vehicleType || driver.vehicle,
                plateNumber: ride.driver?.plateNumber || driver.plateNumber || 'KK-4521-OY',
                phone: ride.driver?.user?.phone,
              },
              destination,
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
    }, 2500);

    return () => clearInterval(interval);
  }, [rideId, driver, destination, navigate, state?.fare]);

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
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8 text-center">
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
            <CountdownRing total={20} onExpire={() => setExpired(true)} />

            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">
                Asking {driver.name}…
              </h1>
              <p className="text-base text-muted">
                {expired
                  ? 'No reply — trying the next driver.'
                  : "No reply? We'll try the next driver."}
              </p>
            </div>

            {expired && (
              <StatusBanner type="reconnecting" message="Trying the next driver…" />
            )}
          </>
        )}
      </div>

      <div className="px-4 pb-8 pt-4 flex flex-col gap-4">
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
                  rideId,
                  fare: state?.fare,
                },
              })
            }
          >
            Skip to matched (demo)
          </Button>
        )}
      </div>
    </ScreenShell>
  );
}
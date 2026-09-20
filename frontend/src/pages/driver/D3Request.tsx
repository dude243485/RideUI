import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowDown, AlertCircle } from 'lucide-react';
import {
  ScreenShell, Button, CountdownRing, StatusBanner, SkeletonBlock,
} from '../../components/ui';
import { respondToDriverRide } from '../../lib/api';

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

export function D3Request() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [responding, setResponding] = useState(false);

  const ride = state?.ride;
  const riderName = ride?.rider?.name || 'Student';
  const from = ride?.pickup?.name || ride?.pickupHub?.name || 'Tedder Hall';
  const to = ride?.destination?.name || ride?.destinationHub?.name || 'Main Gate';
  const fare = ride?.fare || 150;

  useEffect(() => {
    const t = setTimeout(() => setViewState('loaded'), 600);
    return () => clearTimeout(t);
  }, []);

  async function decline() {
    setResponding(true);
    if (ride?._id) {
      try {
        await respondToDriverRide(ride._id, 'decline');
      } catch {
        // Ignore
      }
    }
    setResponding(false);
    navigate('/driver/home');
  }

  async function accept() {
    setResponding(true);
    let matchedData = ride;
    if (ride?._id) {
      try {
        matchedData = await respondToDriverRide(ride._id, 'accept');
      } catch {
        // Fallback for demo
      }
    }
    setResponding(false);
    navigate('/driver/trip', { state: { ride: matchedData || ride, riderName, from, to, fare } });
  }

  return (
    <ScreenShell className="bg-surface">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <span className="text-base font-bold text-ink">Incoming Request</span>
        <span className="text-xs text-muted">Auto-declines when timer ends</span>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-8 gap-8">
        {viewState === 'loading' && (
          <div className="flex flex-col gap-6">
            <SkeletonBlock h="h-28" w="w-28" className="rounded-full mx-auto" />
            <SkeletonBlock h="h-10" />
            <SkeletonBlock h="h-10" />
            <SkeletonBlock h="h-10" />
          </div>
        )}

        {viewState === 'error' && (
          <StatusBanner type="error" message="Connection error. Request may have expired." />
        )}

        {viewState === 'empty' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertCircle size={40} className="text-muted" />
            <p className="text-lg text-muted font-medium">
              No requests right now.<br />Try again in a minute.
            </p>
          </div>
        )}

        {viewState === 'loaded' && (
          <>
            <div className="flex justify-center">
              <CountdownRing total={20} onExpire={decline} />
            </div>

            <p className="text-center text-base text-muted">
              Request from <span className="font-bold text-ink">{riderName}</span> · <span className="font-bold text-brand-600">₦{fare}</span>
            </p>

            <div className="bg-white border border-border rounded-xl p-6 flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted uppercase tracking-widest mb-1">FROM</p>
                <p className="text-3xl font-bold text-ink leading-tight">{from}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                <ArrowDown size={20} className="text-brand-600" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted uppercase tracking-widest mb-1">TO</p>
                <p className="text-3xl font-bold text-ink leading-tight">{to}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-4 pb-8 pt-4 flex flex-col gap-3">
        <Button
          size="driver-lg"
          loading={responding}
          disabled={viewState !== 'loaded'}
          onClick={accept}
        >
          ACCEPT
        </Button>
        <Button
          variant="danger"
          size="driver-md"
          disabled={viewState !== 'loaded' || responding}
          onClick={decline}
        >
          DECLINE
        </Button>
      </div>
    </ScreenShell>
  );
}
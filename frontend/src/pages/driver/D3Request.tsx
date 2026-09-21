import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowDown, AlertCircle, Phone, UserCheck } from 'lucide-react';
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
  const riderPhone = ride?.rider?.phone || '';
  const from = ride?.pickup?.name || ride?.pickupHub?.name || 'UI Main Gate';
  const to = ride?.destination?.name || ride?.destinationHub?.name || 'Tedder Hall';
  const fare = ride?.fare || 150;

  useEffect(() => {
    const t = setTimeout(() => setViewState('loaded'), 400);
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
    navigate('/driver/trip', {
      state: {
        ride: matchedData || ride,
        riderName,
        riderPhone,
        from,
        to,
        fare,
      },
    });
  }

  return (
    <ScreenShell className="bg-surface">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <span className="text-base font-bold text-ink">Incoming Student Request</span>
        <span className="text-xs text-muted">Auto-declines when timer expires</span>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-6 gap-6 overflow-y-auto">
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
              <CountdownRing total={30} onExpire={decline} />
            </div>

            {/* Student Info Card */}
            <div className="bg-white border border-border rounded-xl p-4 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-brand-600 font-bold uppercase tracking-wider mb-1">
                <UserCheck size={16} /> Verified UI Student
              </div>
              <p className="text-2xl font-bold text-ink">{riderName}</p>
              {riderPhone && (
                <div className="mt-2">
                  <a
                    href={`tel:${riderPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 font-bold text-xs border border-brand-200 hover:bg-brand-100 transition-colors"
                  >
                    <Phone size={14} /> Call Student ({riderPhone})
                  </a>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted font-medium">Trip Tariff:</span>
                <span className="text-xl font-bold text-ink">₦{fare}</span>
              </div>
            </div>

            {/* Route Landmarks */}
            <div className="bg-white border border-border rounded-xl p-5 flex flex-col items-center gap-3 shadow-sm">
              <div className="text-center w-full">
                <p className="text-xs text-muted uppercase tracking-widest mb-1 font-bold">PICK UP AT</p>
                <p className="text-2xl font-bold text-brand-600 leading-tight">{from}</p>
              </div>
              <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-surface">
                <ArrowDown size={18} className="text-muted" />
              </div>
              <div className="text-center w-full">
                <p className="text-xs text-muted uppercase tracking-widest mb-1 font-bold">DROP OFF AT</p>
                <p className="text-2xl font-bold text-accent leading-tight">{to}</p>
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
          ACCEPT ORDER
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
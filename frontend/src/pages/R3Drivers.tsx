import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  ScreenShell, DriverCard, Button,
  SkeletonBlock, SkeletonDriverCard, StatusBanner,
} from '../components/ui';
import type { LatLng } from '../components/CampusMap';
import { useFare } from '../lib/useFare';

const DRIVERS = [
  { rank: 1, name: 'Musa A.', initials: 'MA', vehicle: 'Keke', eta: '2 min away' },
  { rank: 2, name: 'Tunde O.', initials: 'TO', vehicle: 'Keke', eta: '4 min away' },
  { rank: 3, name: 'Ibrahim S.', initials: 'IS', vehicle: 'Bus', eta: '6 min away' },
];

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

export function R3Drivers() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [selectedRank, setSelectedRank] = useState(1);

  const pickup: LatLng | undefined = state?.pickup;
  const to: LatLng | undefined = state?.destination;

  const { fare, status: fareStatus, retry } = useFare(pickup, to);

  useEffect(() => {
    const t = setTimeout(() => setViewState('loaded'), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!to || !pickup) return <Navigate to="/home" replace />;

  const selectedDriver = DRIVERS.find((d) => d.rank === selectedRank);
  const canConfirm = viewState === 'loaded' && fareStatus === 'loaded';

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
            <p className="text-sm font-semibold text-ink truncate">Near Tedder Hall</p>
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
            <p className="text-sm text-muted">{DRIVERS.length} drivers nearby</p>
            {DRIVERS.map((d) => (
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
          <p className="text-xs text-muted uppercase tracking-wide">Estimated fare</p>

          {fareStatus === 'loading' && <SkeletonBlock h="h-8" w="w-24" />}

          {fareStatus === 'loaded' && fare !== null && (
            <p className="text-2xl font-bold text-ink">₦{fare.toLocaleString()}</p>
          )}

          {fareStatus === 'error' && (
            <button onClick={retry} className="text-sm font-medium text-brand-600 underline">
              Couldn't load price. Retry
            </button>
          )}
        </div>

        <Button
          size="rider"
          disabled={!canConfirm}
          onClick={() =>
            navigate('/waiting', {
              state: { destination: to, pickup, driver: selectedDriver, fare },
            })
          }
        >
          Confirm ride with {selectedDriver?.name ?? '—'}
        </Button>
      </div>
    </ScreenShell>
  );
}
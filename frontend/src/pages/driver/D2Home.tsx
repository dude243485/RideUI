import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle } from 'lucide-react';
import {
  ScreenShell, OnlineToggle, StopChip, StatusBanner,
  SkeletonBlock, Wordmark,
} from '../../components/ui';
import { useStops } from '../../lib/useStops';

export function D2Home() {
  const navigate = useNavigate();
  const { stops, status, reload } = useStops();
  const [online, setOnline] = useState(false);
  const [atStop, setAtStop] = useState('');

  return (
    <ScreenShell>
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-border">
        <Wordmark size="sm" />
        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-surface border border-border text-muted">
          Driver
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
            <OnlineToggle online={online} onChange={setOnline} />

            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-brand-600" />
                <p className="text-base font-semibold text-ink">I'm at:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {stops.map((s) => (
                  <StopChip
                    key={s.id}
                    label={s.name}
                    selected={atStop === s.name}
                    onClick={() => setAtStop(s.name)}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
              {online ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <p className="text-xl font-bold text-ink">Waiting for requests…</p>
                  <p className="text-sm text-muted">Stay close to your current stop.</p>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <p className="text-xl font-bold text-muted">You're offline</p>
                  <p className="text-sm text-muted">Toggle ONLINE above to start accepting rides.</p>
                </>
              )}
            </div>

            {online && (
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
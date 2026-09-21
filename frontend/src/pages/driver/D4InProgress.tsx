import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowDown, CheckCircle2, Phone } from 'lucide-react';
import { ScreenShell, Button } from '../../components/ui';
import { markRideCompleted } from '../../lib/api';

export function D4InProgress() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [completing, setCompleting] = useState(false);

  const ride = state?.ride;
  const rideId = ride?._id || state?.rideId;
  const riderName = state?.riderName || ride?.rider?.name || 'Student';
  const riderPhone = state?.riderPhone || ride?.rider?.phone || '';
  const from = state?.from || ride?.pickup?.name || ride?.pickupHub?.name || 'UI Campus Location';
  const to = state?.to || ride?.destination?.name || ride?.destinationHub?.name || 'Destination';
  const fare = state?.fare || ride?.fare || 150;

  async function handleComplete() {
    setCompleting(true);
    if (rideId && !String(rideId).startsWith('demo_')) {
      try {
        await markRideCompleted(rideId);
      } catch {
        // Fallback for demo
      }
    }
    setCompleting(false);
    navigate('/driver/home');
  }

  return (
    <ScreenShell>
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-base font-bold text-ink">Trip in Progress</span>
        </div>
        <span className="text-base font-bold text-brand-600">₦{fare}</span>
      </div>

      <div className="flex-1 flex flex-col justify-between px-4 py-6 overflow-y-auto">
        <div className="flex flex-col gap-5">
          {/* Rider Details Card with direct call */}
          <div className="bg-brand-50 border border-brand-600 rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-bold mb-0.5">Passenger</p>
                <p className="text-2xl font-bold text-ink">{riderName}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                {riderName.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {riderPhone && (
              <div className="mt-3 pt-3 border-t border-brand-200">
                <a
                  href={`tel:${riderPhone}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-brand-600 font-bold text-xs border border-brand-300 shadow-sm hover:bg-brand-100 transition-colors w-full justify-center"
                >
                  <Phone size={15} /> Call passenger directly ({riderPhone})
                </a>
              </div>
            )}
          </div>

          {/* Route Landmarks Card */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col items-center gap-4 shadow-sm">
            <div className="text-center w-full">
              <p className="text-xs text-muted uppercase tracking-widest mb-1 font-bold">PICKED UP FROM</p>
              <p className="text-2xl font-bold text-brand-600 leading-tight">{from}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-surface">
              <ArrowDown size={20} className="text-brand-600" />
            </div>
            <div className="text-center w-full">
              <p className="text-xs text-muted uppercase tracking-widest mb-1 font-bold">DESTINATION</p>
              <p className="text-2xl font-bold text-accent leading-tight">{to}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 pb-4">
          <Button
            size="driver-lg"
            loading={completing}
            onClick={handleComplete}
          >
            <CheckCircle2 size={24} />
            COMPLETE TRIP (₦{fare})
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
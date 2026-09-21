import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Phone, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScreenShell, StatusBanner, Button } from '../components/ui';

export function R5Matched() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const driver = state?.driver;

  if (!driver) return <Navigate to="/home" replace />;

  const vehicleId = driver.plateNumber || 'OYO-2041';
  const eta = driver.eta ? `~${driver.eta.replace(' away', '')}` : '~3 min';
  const driverPhone = driver.phone || '+2348012345678';
  const pickupName = state?.pickupName || 'Campus Pickup';
  const destinationName = state?.destinationName || 'Campus Destination';

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col px-4 pt-6 gap-5">
        <StatusBanner type="success" message={`${driver.name} confirmed your campus ride.`} />

        {/* Driver Profile Card with Real Phone Number */}
        <div className="bg-white border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow">
            {driver.initials || 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xl font-bold text-ink truncate">{driver.name}</p>
              <ShieldCheck size={18} className="text-accent flex-shrink-0" />
            </div>
            <p className="text-sm text-muted">{driver.vehicle || 'Keke'} · {vehicleId}</p>
            <p className="text-sm font-semibold text-brand-600 mt-0.5">📞 {driverPhone}</p>
          </div>
        </div>

        {/* ETA card */}
        <div className="bg-brand-50 border border-brand-600 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Transporter arriving in</p>
            <p className="text-3xl font-bold text-brand-600">{eta}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        </div>

        {/* Campus Route Summary */}
        <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-sm">
          <p className="text-[11px] text-muted uppercase tracking-wider font-bold mb-2">Campus Route</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="text-brand-600 truncate">{pickupName}</span>
            <ArrowRight size={16} className="text-muted flex-shrink-0" />
            <span className="text-accent truncate">{destinationName}</span>
          </div>
        </div>

        {state?.fare && (
          <div className="bg-white border border-border rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
            <span className="text-sm text-muted font-medium">Standard UI Tariff</span>
            <span className="text-xl font-bold text-ink">₦{Number(state.fare).toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-2">
          <Button size="rider" onClick={() => window.open(`tel:${driverPhone}`)}>
            <Phone size={18} /> Call driver directly ({driverPhone})
          </Button>
          <Button variant="danger" size="rider" onClick={() => navigate('/home')}>
            <X size={18} /> Cancel ride
          </Button>
        </div>

        <button
          className="text-center text-xs text-muted underline mt-auto pb-4"
          onClick={() => navigate('/complete', { state })}
        >
          Trip completed →
        </button>
      </div>
    </ScreenShell>
  );
}
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Phone, X } from 'lucide-react';
import { ScreenShell, StatusBanner, Button } from '../components/ui';

export function R5Matched() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const driver = state?.driver;

  if (!driver) return <Navigate to="/home" replace />;

  const vehicleId = driver.plateNumber || 'KK-4521-OY';
  const eta = driver.eta ? `~${driver.eta.replace(' away', '')}` : '~3 min';
  const driverPhone = driver.phone || '+2348012345678';

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col px-4 pt-6 gap-5">
        <StatusBanner type="success" message={`${driver.name} accepted your request.`} />

        <div className="bg-white border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {driver.initials || 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-ink">{driver.name}</p>
            <p className="text-sm text-muted">{driver.vehicle || 'Keke'} · {vehicleId}</p>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-600 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Arriving in</p>
            <p className="text-3xl font-bold text-brand-600">{eta}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>

        {state?.fare && (
          <div className="bg-white border border-border rounded-xl px-5 py-3 flex items-center justify-between">
            <span className="text-sm text-muted">Agreed Tariff</span>
            <span className="text-lg font-bold text-ink">₦{state.fare.toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button size="rider" onClick={() => window.open(`tel:${driverPhone}`)}>
            <Phone size={18} /> Call driver ({driverPhone})
          </Button>
          <Button variant="danger" size="rider" onClick={() => navigate('/home')}>
            <X size={18} /> Cancel ride
          </Button>
        </div>

        <button
          className="text-center text-xs text-muted underline mt-auto pb-4"
          onClick={() => navigate('/complete', { state })}
        >
          Simulate trip complete →
        </button>
      </div>
    </ScreenShell>
  );
}
import { useNavigate } from 'react-router-dom';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import { ScreenShell, Button } from '../../components/ui';

export function D4InProgress() {
  const navigate = useNavigate();

  const riderName = 'Adewale';
  const from = 'Tedder Hall';
  const to = 'Main Gate';

  return (
    <ScreenShell>
      <div className="px-4 py-3 border-b border-border bg-white flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
        <span className="text-base font-bold text-ink">Ride in progress</span>
      </div>

      <div className="flex-1 flex flex-col justify-between px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="bg-brand-50 border border-brand-600 rounded-xl px-5 py-4">
            <p className="text-sm text-muted mb-1">Rider</p>
            <p className="text-3xl font-bold text-ink">{riderName}</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 flex flex-col items-center gap-5">
            <div className="text-center w-full">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">FROM</p>
              <p className="text-3xl font-bold text-ink">{from}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center">
              <ArrowDown size={24} className="text-brand-600" />
            </div>
            <div className="text-center w-full">
              <p className="text-xs text-muted uppercase tracking-widest mb-1">TO</p>
              <p className="text-3xl font-bold text-ink">{to}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8">
          <Button size="driver-lg" onClick={() => navigate('/driver/home')}>
            <CheckCircle2 size={28} />
            COMPLETE TRIP
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
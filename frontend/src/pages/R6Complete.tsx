import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ScreenShell, Button, Wordmark } from '../components/ui';

export function R6Complete() {
  const navigate = useNavigate();
  const [rating, setRating] = useState<'good' | 'not-good' | null>(null);

  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Trip complete!</h1>
          <p className="text-base text-muted">Thanks for riding with RideUI. Stay safe.</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 w-full">
          <p className="text-sm font-medium text-muted mb-4">How was your ride?</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRating('good')}
              className={`flex-1 h-14 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-colors
                ${rating === 'good' ? 'bg-brand-50 border-brand-600 text-brand-600 border-2' : 'bg-white border-border text-ink'}`}
            >
              <ThumbsUp size={20} /> Good
            </button>
            <button
              onClick={() => setRating('not-good')}
              className={`flex-1 h-14 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-colors
                ${rating === 'not-good' ? 'bg-red-50 border-danger-light text-danger-light border-2' : 'bg-white border-border text-ink'}`}
            >
              <ThumbsDown size={20} /> Not good
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 pt-4 flex flex-col items-center gap-4">
        <Button size="rider" onClick={() => navigate('/home')}>Done</Button>
        <Wordmark size="sm" />
      </div>
    </ScreenShell>
  );
}
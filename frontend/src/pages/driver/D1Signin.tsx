import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wordmark, Button, NumericKeypad, PinDots, Input } from '../../components/ui';

export function D1Signin() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  function handleKey(k: string) {
    if (pin.length < 4) setPin((p) => p + k);
  }

  function handleDelete() {
    setPin((p) => p.slice(0, -1));
  }

  function handleSignIn() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/driver/home');
    }, 1000);
  }

  const ready = code.length >= 4 && pin.length === 4;

  return (
    <div className="min-h-screen bg-surface flex flex-col px-4">
      <div className="flex-1 flex flex-col gap-8 justify-center">
        <div className="flex flex-col items-center gap-2 pt-8">
          <Wordmark size="lg" />
          <p className="text-sm text-muted">Driver Portal</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-ink">Sign in</h1>

          <Input
            label="Driver code"
            placeholder="e.g. DRV-0042"
            value={code}
            onChange={setCode}
          />

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-muted">4-digit PIN</label>
            <PinDots length={4} filled={pin.length} />
            <NumericKeypad onKey={handleKey} onDelete={handleDelete} />
          </div>

          <Button
            size="driver-md"
            loading={loading}
            disabled={!ready}
            onClick={handleSignIn}
          >
            SIGN IN
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-muted py-6">
        University of Ibadan · Transport Services
      </p>
    </div>
  );
}
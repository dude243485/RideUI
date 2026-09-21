import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wordmark, Button, Input, StatusBanner } from '../../components/ui';
import { loginDriver, registerDriver } from '../../lib/api';

export function D1Signin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<'keke' | 'car'>('keke');
  const [plateNumber, setPlateNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginDriver(phone, pin);
      } else {
        await registerDriver({
          name: name.trim(),
          phone: phone.trim(),
          vehicleType,
          plateNumber: plateNumber.trim(),
          password: pin,
        });
      }
      navigate('/driver/home');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col px-4 py-6">
      <div className="flex-1 flex flex-col gap-6 justify-center max-w-md mx-auto w-full">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Wordmark size="lg" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-600">
            Transporter Portal
          </span>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          {/* Mode Switcher */}
          <div className="flex bg-surface p-1 rounded-xl border border-border">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Driver Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Register Transporter
            </button>
          </div>

          <h1 className="text-2xl font-bold text-ink">
            {mode === 'login' ? 'Transporter Sign In' : 'Join Campus Fleet'}
          </h1>

          {error && <StatusBanner type="error" message={error} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Transporter Name"
                placeholder="e.g. Babafemi Alao"
                value={name}
                onChange={setName}
              />
            )}

            <Input
              label="Phone Number"
              placeholder="e.g. 08034567891"
              value={phone}
              onChange={setPhone}
            />

            {mode === 'register' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                        vehicleType === 'keke'
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white border-border text-ink'
                      }`}
                      onClick={() => setVehicleType('keke')}
                    >
                      🛺 Keke (Tricycle)
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                        vehicleType === 'car'
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white border-border text-ink'
                      }`}
                      onClick={() => setVehicleType('car')}
                    >
                      🚗 Car / Bus
                    </button>
                  </div>
                </div>

                <Input
                  label="Plate Number"
                  placeholder="e.g. OYO-4521-KK"
                  value={plateNumber}
                  onChange={setPlateNumber}
                />
              </>
            )}

            <Input
              label={mode === 'login' ? 'PIN / Password' : 'Set 4-digit PIN or Password'}
              type="password"
              placeholder="••••"
              value={pin}
              onChange={setPin}
            />

            <Button
              size="driver-md"
              loading={loading}
              disabled={
                mode === 'login'
                  ? !phone || !pin
                  : !name || !phone || !plateNumber || !pin
              }
              onClick={handleSubmit}
            >
              {mode === 'login' ? 'SIGN IN' : 'REGISTER TRANSPORTER'}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/home')}
            className="text-xs text-muted hover:text-ink underline underline-offset-4"
          >
            ← Back to Student Rider App
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted py-4">
        University of Ibadan · Transport Services Driver Network
      </p>
    </div>
  );
}
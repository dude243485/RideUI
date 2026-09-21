import { useState } from 'react';
import { Wordmark, Button, Input, StatusBanner } from '../components/ui.tsx';
import { useNavigate } from 'react-router-dom';
import { loginRider, registerRider } from '../lib/api.ts';

export default function R1Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginRider(email, password);
      } else {
        await registerRider({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
      }
      navigate('/home');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col px-4 py-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Wordmark size="lg" />
          <p className="text-sm text-muted">University of Ibadan · Student Transit</p>
        </div>

        {/* Card */}
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
              Sign In
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
              Create Account
            </button>
          </div>

          <h1 className="text-xl font-bold text-ink">
            {mode === 'login' ? 'Sign in to RideUI' : 'Create student account'}
          </h1>

          {error && <StatusBanner type="error" message={error} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="e.g. Tolu Adeleke"
                value={name}
                onChange={setName}
              />
            )}

            <Input
              label={mode === 'login' ? 'Email or Phone' : 'Email (e.g. name@ui.edu.ng)'}
              placeholder={mode === 'login' ? 'name@ui.edu.ng or 080...' : 'tolu@ui.edu.ng'}
              value={email}
              onChange={setEmail}
            />

            {mode === 'register' && (
              <Input
                label="Active Phone Number"
                placeholder="08012345678 (for transporter contact)"
                value={phone}
                onChange={setPhone}
              />
            )}

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />

            <Button
              size="rider"
              loading={loading}
              disabled={
                mode === 'login'
                  ? !email || !password
                  : !name || !email || !phone || !password
              }
              onClick={handleSubmit}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-muted">
              First time? Tap <strong>Create Account</strong> above to register.
            </p>
          )}
        </div>

        {/* Link to Transporter side */}
        <div className="text-center">
          <button
            onClick={() => navigate('/driver')}
            className="text-xs text-brand-600 font-semibold underline underline-offset-4"
          >
            Are you a campus driver? Open Transporter Portal →
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted pt-4">
        University of Ibadan · Student Union Transport Initiative
      </p>
    </div>
  );
}

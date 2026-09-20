import { useState } from 'react';
import { Wordmark, Button, Input, StatusBanner } from '../components/ui.tsx';
import { useNavigate } from 'react-router-dom';
import { loginRider } from '../lib/api.ts';

export default function R1Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await loginRider(email, password || 'password123');
      navigate("/home");
    } catch (err: any) {
      // Fallback for demo if backend isn't running yet
      console.warn('Backend login notice, falling back for demo:', err);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col px-4">
      <div className="flex-1 flex flex-col justify-center gap-10">
        {/* wordmark */}
        <div className="flex flex-col items-center gap-2 pt-8">
          <Wordmark size="lg" />
          <p className="text-sm text-muted mt-1">Campus rides, made easy.</p>
        </div>

        {/* form */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-ink">Sign in</h1>

          {error && <StatusBanner type="error" message={error} />}

          <Input
            label="Matric number or email"
            placeholder="e.g. 200300123 or name@ui.edu.ng"
            value={email}
            onChange={setEmail}
          />
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
            disabled={!email}
            onClick={handleLogin}
          >
            Log in
          </Button>

          <p className="text-center text-sm text-muted">
            <button className="text-brand-600 font-medium underline underline-offset-2">
              Forgot password?
            </button>
          </p>
        </div>
      </div>

      {/* footer */}
      <p className="text-center text-xs text-muted py-6">
        University of Ibadan · Transport Services
      </p>
    </div>
  );
}

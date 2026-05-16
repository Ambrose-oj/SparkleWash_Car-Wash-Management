import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-brand-black font-bold text-sm">S</span>
            </div>
            <span className="font-display text-white text-xl">
              Sparkle<span className="text-gold">Wash</span>
            </span>
          </div>
          <p className="font-body text-white/40 text-sm">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-brand-card p-8">
          <h1 className="font-display text-2xl text-white mb-1">Sign in</h1>
          <p className="font-body text-white/40 text-sm mb-8">
            Enter your credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-white/60 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sparklewash.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-white/60 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            {error && (
              <p className="font-body text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gold text-brand-black font-body font-semibold text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

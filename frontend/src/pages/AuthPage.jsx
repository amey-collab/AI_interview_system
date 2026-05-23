import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import useAuth from '../hooks/useAuth.jsx';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/upload');
    }
  }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const response = await api.post(endpoint, payload);
      login(response.data.token, response.data.user);
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-2 text-sm text-slate-400">Login or register to begin your AI interview journey.</p>
          </div>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="rounded-full border border-slate-700/80 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white">
            {mode === 'login' ? 'Create account' : 'Login'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <label className="block text-sm text-slate-300">
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
                placeholder="Your full name"
                required
              />
            </label>
          )}
          <label className="block text-sm text-slate-300">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400"
              placeholder="Secure password"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <p className="text-center text-sm text-slate-500">This system uses JWT auth and stores session progress securely.</p>
        </form>
      </motion.div>
    </main>
  );
};

export default AuthPage;

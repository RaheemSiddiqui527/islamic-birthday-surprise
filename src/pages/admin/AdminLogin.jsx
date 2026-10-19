import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Barah-e-karam username aur password darj karein.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Arch Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
        <div className="w-[500px] h-[700px] border-2 border-[#d4af37] rounded-t-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md islamic-card p-8 sm:p-10 border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-[#d4af37] bg-[#064e3b] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Shield className="w-8 h-8 text-[#fbe08e]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold gold-gradient-text tracking-tight mb-2">
            Admin Dastras
          </h2>
          <p className="text-xs text-[#d4af37]/80 font-cinzel tracking-widest uppercase">
            Islamic Birthday Surprise Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-900/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d4af37]/60">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] placeholder-[#fdfbf7]/30 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d4af37]/60">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] placeholder-[#fdfbf7]/30 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#d4af37]/60 hover:text-[#fbe08e] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-serif text-sm font-bold tracking-wider uppercase text-[#022c22] gold-gradient-bg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(251,224,142,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Tasdeeq Ho Rahi Hai...</span>
            ) : (
              <>
                <span>Login Kijiye</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#d4af37]/15 pt-5">
          <p className="text-[11px] text-[#fdfbf7]/50 font-cinzel">
            Mahfooz Nizam • Password Hash (Bcrypt)
          </p>
        </div>
      </div>
    </div>
  );
}

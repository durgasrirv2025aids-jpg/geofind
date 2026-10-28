import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  role: string;
  badge: string;
  email: string;
  clearanceLevel: string;
  avatarInitials: string;
}

export const PRESET_OFFICERS: UserProfile[] = [
  {
    name: 'Admin User',
    role: 'Officer',
    badge: 'TN-01',
    email: 'admin@geofind.tn.gov.in',
    clearanceLevel: 'Standard',
    avatarInitials: 'AD',
  },
];

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  isAuthenticated?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onCancel,
  isAuthenticated = false,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    const name = username.trim();
    const initials = name.slice(0, 2).toUpperCase();

    onLoginSuccess({
      name,
      role: 'Officer',
      badge: 'TN-USER',
      email: username.includes('@') ? username : `${username}@geofind.tn.gov.in`,
      clearanceLevel: 'Standard',
      avatarInitials: initials || 'US',
    });
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col justify-center items-center p-4 relative">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean, Simple Login Card */}
      <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-slate-800 to-emerald-950 border border-emerald-500/30 items-center justify-center text-white font-black text-2xl shadow-md">
            <span className="text-emerald-400">G</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            GeoFind AI
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access satellite dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder:text-slate-600 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Optional Cancel / Back button */}
        {isAuthenticated && onCancel && (
          <div className="text-center pt-2">
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

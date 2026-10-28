import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Satellite, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  Building2,
  Fingerprint,
  Zap,
  Globe2
} from 'lucide-react';

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
    name: 'Dr. A. Rajesh, IFS',
    role: 'Principal Chief Conservator / Remote Sensing Director',
    badge: 'TN-SRSC-042',
    email: 'rajesh.ifs@geofind.tn.gov.in',
    clearanceLevel: 'Level-4 Orbital Clearance',
    avatarInitials: 'AR',
  },
  {
    name: 'K. Meenakshi, M.Tech',
    role: 'Chief Satellite Geospatial Intelligence Analyst',
    badge: 'TN-GIS-891',
    email: 'meenakshi.k@isro.nrsc.gov.in',
    clearanceLevel: 'Level-3 Sentinel Ops',
    avatarInitials: 'KM',
  },
  {
    name: 'S. Vijayaraghavan',
    role: 'Special Enforcement Officer (Mines & Minerals)',
    badge: 'TN-MIN-104',
    email: 'vijay.enforce@tn.gov.in',
    clearanceLevel: 'Level-2 Field Enforcement',
    avatarInitials: 'SV',
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
  const [email, setEmail] = useState('rajesh.ifs@geofind.tn.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectPreset = (idx: number) => {
    setSelectedRoleIndex(idx);
    const officer = PRESET_OFFICERS[idx];
    setEmail(officer.email);
    setPassword('GeoFind#Orbital2026');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage('Please enter an official government email address.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Verifying satellite cryptographic clearance...');

    setTimeout(() => {
      setIsLoading(false);
      const chosenOfficer = PRESET_OFFICERS[selectedRoleIndex] || {
        name: email.split('@')[0].toUpperCase(),
        role: 'Geospatial Field Specialist',
        badge: 'TN-AUTH-999',
        email,
        clearanceLevel: 'Level-2 Standard Clearance',
        avatarInitials: email.substring(0, 2).toUpperCase(),
      };
      onLoginSuccess(chosenOfficer);
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Background Grid Pattern & Cosmic Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Security Banner */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center text-white font-black text-lg border border-emerald-500/40 shadow-inner">
            <span className="bg-gradient-to-b from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              G
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-white">GeoFind AI</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SECURE AUTH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Tamil Nadu State Satellite Land-Use & Change Detection Command
            </p>
          </div>
        </div>

        {isAuthenticated && onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
          >
            ← Return to Dashboard
          </button>
        )}
      </header>

      {/* Central Login Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl">
          <div className="relative rounded-2xl border border-white/[0.1] bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 md:p-10 space-y-6">
            
            {/* Top Reticle / Icon Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sentinel-2 / Landsat-9 Security Terminal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Officer Authentication
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Enter your official credentials or select a verified government profile below.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
                <Fingerprint className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Quick 1-Click Role Profile Switcher */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Select Verified Profile (1-Click Preset)</span>
                <span className="text-emerald-400">Official Access</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_OFFICERS.map((officer, idx) => {
                  const isSelected = selectedRoleIndex === idx;
                  return (
                    <button
                      type="button"
                      key={officer.badge}
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-black truncate">{officer.name}</div>
                      <div className="text-[9px] font-mono text-emerald-400 truncate">{officer.badge}</div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">{officer.clearanceLevel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Government Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Official Email / Service ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="officer.tn@geofind.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono transition placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Security PIN / Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300">
                    Security Passcode / Token
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    AES-256 Encrypted
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter security key"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono transition placeholder:text-slate-600"
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

              {/* Status Message */}
              {statusMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] ${
                  isLoading
                    ? 'bg-emerald-600 opacity-80 cursor-wait'
                    : 'bg-emerald-500 hover:bg-emerald-400'
                }`}
              >
                <span>{isLoading ? 'Verifying Authorization...' : 'Authenticate & Launch Command Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Compliance Footnote Badges */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>TN Geospatial Act 2024 Verified</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copernicus Level-2A Ground Link</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 px-6 py-4 text-center text-[11px] text-slate-600 border-t border-white/[0.05]">
        <span>GeoFind AI Satellite Intelligence & Change Detection Platform · Official Government Compliance System · Confidential</span>
      </footer>
    </div>
  );
};

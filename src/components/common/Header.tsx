import React, { useState, useEffect } from 'react';
import { Satellite, Sun, Moon, MapPin, Radio, Shield, Zap, Clock, Activity } from 'lucide-react';
import { SatelliteSensorType } from '@/types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeScreen: string;
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onOpenSources: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeScreen,
  activeSensor,
  setActiveSensor,
  onOpenSources
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString().split(' ')[4];
      const ist = now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' });
      setTimeStr(`${ist} IST · ${utc} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between z-30 transition-all duration-200 text-white shadow-2xl relative">
      {/* Subtle top edge glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3.5">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center text-white font-black text-xl shadow-inner border border-emerald-500/40">
            <span className="bg-gradient-to-b from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              G
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg font-black text-white tracking-tight flex items-center space-x-1.5">
              <span>GeoFind AI</span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                PROD
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:flex items-center space-x-2 font-medium">
            <span>Tamil Nadu Satellite Intelligence Command</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono text-[10px]">Copernicus Sentinel-2</span>
          </p>
        </div>
      </div>

      {/* Center Satellite Sensor Constellation Switcher */}
      <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/[0.08] shadow-inner">
        <button
          onClick={() => setActiveSensor('sentinel')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeSensor === 'sentinel'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Sentinel-2 MSI</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-emerald-200 font-semibold">
            10m
          </span>
        </button>

        <button
          onClick={() => setActiveSensor('landsat')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeSensor === 'landsat'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Landsat-9 OLI</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-indigo-200 font-semibold">
            15m
          </span>
        </button>
      </div>

      {/* Right Controls: Telemetry Clock, Coordinates, Sources & Theme */}
      <div className="flex items-center space-x-2.5">
        {/* Live Clock Ticker */}
        {timeStr && (
          <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.07] text-[11px] font-mono text-slate-300">
            <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{timeStr}</span>
          </div>
        )}

        {/* Tamil Nadu Constrained Region Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 text-slate-300 text-xs font-semibold border border-white/[0.07]">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">TN (8.0°N–13.5°N)</span>
        </div>

        {/* Active Data Source Button */}
        <button
          onClick={onOpenSources}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800/90 text-slate-200 text-xs font-bold border border-white/[0.1] hover:border-emerald-500/40 transition-all shadow-sm"
          title="Inspect satellite constellation telemetry"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="hidden sm:inline text-slate-400">Sensor:</span>
          <span className="font-mono text-emerald-400 font-bold">
            {activeSensor === 'sentinel' ? 'Sentinel-2' : 'Landsat-9'}
          </span>
        </button>

        {/* Light/Dark Theme Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08] transition"
          aria-label="Toggle dark mode"
          title="Toggle Command Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </header>
  );
};

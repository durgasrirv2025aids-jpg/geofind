import React from 'react';
import { Satellite, Sun, Moon, MapPin, Radio, Shield, Zap } from 'lucide-react';
import { SENTINEL_SOURCE, LANDSAT_SOURCE } from '@/data/sources';
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
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 transition-colors duration-200 text-white">
      {/* Brand Title & GeoINT Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-emerald-400/30">
          G
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-extrabold text-white tracking-tight">GeoFind AI</h1>
            {/* TRUTHFULNESS BADGES */}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              LIVE ANALYSIS
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              DEMO DATA LABELED
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block font-medium">
            Tamil Nadu Satellite Land-Use & Change Detection Platform
          </p>
        </div>
      </div>

      {/* Center Satellite Sensor Constellation Switcher */}
      <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setActiveSensor('sentinel')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
            activeSensor === 'sentinel'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Sentinel-2 (10m MSI)</span>
        </button>
        <button
          onClick={() => setActiveSensor('landsat')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
            activeSensor === 'landsat'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Landsat-9 (15m Pan)</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Tamil Nadu Constrained Region Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tamil Nadu Bounds (8.0°N–13.5°N)</span>
        </div>

        {/* Active Data Source Button */}
        <button
          onClick={onOpenSources}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition"
          title="View Active Satellite Data Constellation"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Active Sensor:</span>
          <span className="font-mono text-emerald-400">
            {activeSensor === 'sentinel' ? 'Sentinel-2' : 'Landsat-9'}
          </span>
        </button>

        {/* Light/Dark Theme Toggle */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          aria-label="Toggle dark mode"
          title="Toggle Command Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </header>
  );
};

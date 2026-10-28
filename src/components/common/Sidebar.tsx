import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  SlidersHorizontal, 
  FileSearch, 
  FileText, 
  Database, 
  Settings,
  ShieldCheck,
  Radio,
  Satellite
} from 'lucide-react';
import { SatelliteSensorType } from '@/types';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  activeSensor: SatelliteSensorType;
  onOpenSources: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  activeSensor,
  onOpenSources,
  onOpenSettings
}) => {
  const mainNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Detection Map', icon: MapIcon },
    { id: 'change-analysis', label: 'Change Analysis', icon: SlidersHorizontal },
    { id: 'evidence', label: 'Evidence', icon: FileSearch },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-colors duration-200 text-white">
      {/* Top Nav Items */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-xs font-bold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500 font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Nav Items */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Platform Controls
        </div>
        <button
          onClick={onOpenSources}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Database className="w-4 h-4 text-slate-400" />
          <span>Data Sources</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* Satellite Telemetry Box */}
        <div className="mt-4 p-3 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span className="flex items-center space-x-1.5">
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orbital Track</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100% ONLINE</span>
          </div>
          <div className="text-[11px] text-slate-400 leading-snug">
            Active Satellite: <strong className="text-white">{activeSensor === 'sentinel' ? 'Copernicus Sentinel-2 (10m)' : 'USGS Landsat-9 (15m)'}</strong>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Tamil Nadu Pass Validated</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

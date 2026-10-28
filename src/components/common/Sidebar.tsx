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
  Satellite,
  Compass,
  Layers
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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'COMMAND' },
    { id: 'map', label: 'Detection Map', icon: MapIcon, badge: '74' },
    { id: 'change-analysis', label: 'Change Analysis', icon: SlidersHorizontal, badge: 'S2' },
    { id: 'evidence', label: 'Evidence Dossier', icon: FileSearch, badge: 'AUDIT' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: 'PDF' },
  ];

  return (
    <aside className="w-64 bg-[#070c18]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between shrink-0 transition-all duration-200 text-white select-none z-20">
      {/* Top Nav Items */}
      <div className="p-3.5 space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
          <span>Mission Modules</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-l-[3px] border-emerald-400 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className="tracking-tight">{item.label}</span>
              </div>

              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                isActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-white/[0.04] text-slate-500 group-hover:text-slate-400'
              }`}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Nav Items & Orbital Telemetry Widget */}
      <div className="p-3.5 border-t border-white/[0.08] space-y-2">
        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
          System Controls
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenSources}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Sources</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>

        {/* Animated Radar Satellite Telemetry Box */}
        <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-white/[0.08] text-xs space-y-2.5 relative overflow-hidden group shadow-lg">
          {/* Subtle radar background circle */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border border-emerald-500/20 pointer-events-none">
            <div className="absolute inset-2 rounded-full border border-emerald-500/15"></div>
            <div className="absolute inset-4 rounded-full border border-emerald-500/10"></div>
            <div className="absolute inset-0 w-full h-full animate-radar origin-center bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent rounded-full"></div>
          </div>

          <div className="flex items-center justify-between font-bold text-slate-200">
            <span className="flex items-center space-x-1.5">
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] tracking-tight">Constellation Link</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              ONLINE
            </span>
          </div>

          <div className="text-[11px] text-slate-400 leading-snug">
            Sensor: <strong className="text-white font-mono">{activeSensor === 'sentinel' ? 'Sentinel-2 (10m MSI)' : 'Landsat-9 (15m OLI)'}</strong>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1.5 border-t border-white/[0.06]">
            <span className="flex items-center space-x-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span>TN Overpass Sync</span>
            </span>
            <span className="text-slate-400 font-semibold">100% NOMINAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

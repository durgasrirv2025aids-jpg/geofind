import React from 'react';
import { TOPICS } from '@/data/topics';
import { ALL_SECTORS } from '@/data/detections';
import { TopicCategory, SatelliteSensorType, DetectionSector } from '@/types';
import { 
  ArrowRight, 
  Satellite, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Compass, 
  TrendingUp, 
  Sparkles,
  MapPin,
  Flame,
  Trees,
  Building2,
  Waves,
  Crosshair,
  ExternalLink,
  Activity
} from 'lucide-react';

interface OverviewScreenProps {
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onNavigateToMap: (category?: TopicCategory | 'all', sectorId?: string) => void;
  onNavigateToAnalysis?: (sector: DetectionSector) => void;
  onSelectSector: (sector: DetectionSector) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  activeSensor,
  setActiveSensor,
  onNavigateToMap,
  onNavigateToAnalysis,
  onSelectSector,
}) => {
  const topicsList = Object.values(TOPICS);

  // Dynamic calculations from all 74 sectors
  const totalSectors = ALL_SECTORS.length;
  const totalAreaHa = ALL_SECTORS.reduce((acc, s) => acc + s.areaHa, 0).toFixed(1);
  const avgConfidence = Math.round(ALL_SECTORS.reduce((acc, s) => acc + s.confidence, 0) / ALL_SECTORS.length);
  const uniqueDistricts = new Set(ALL_SECTORS.map((s) => s.district)).size;

  // Key critical alert sectors for the Spotlight
  const spotlightSectors = [
    ALL_SECTORS.find((s) => s.id === 'sec-salem-mining-01') || ALL_SECTORS[0],
    ALL_SECTORS.find((s) => s.id === 'sec-trichy-sand-01') || ALL_SECTORS[3],
    ALL_SECTORS.find((s) => s.id === 'sec-nilgiri-forest-01') || ALL_SECTORS[1],
  ];

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'mining':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'deforestation':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'construction':
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'sandmining':
        return <Waves className="w-4 h-4 text-sky-400" />;
      case 'wetland':
        return <Crosshair className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-900 dark:text-white">
      {/* Hero Command Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 md:p-8 text-white shadow-2xl">
        {/* Subtle grid background & glow */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Earth Observation
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                Tamil Nadu Bounds: 8.08°N – 13.5°N | 76.2°E – 80.3°E
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Tamil Nadu Satellite Land-Use & Change Detection Intelligence
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Autonomous multi-temporal satellite analytics over 38 districts. Real-time co-registered spectral verification for unpermitted quarrying, forest loss, riverbed sand dredging, and wetland degradation.
            </p>
          </div>

          {/* Sensor Switcher Widget */}
          <div className="flex flex-col gap-2 shrink-0 bg-slate-800/70 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/70 shadow-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Satellite Constellation
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSensor('sentinel')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSensor === 'sentinel'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" />
                <div className="text-left leading-tight">
                  <div className="font-bold">Sentinel-2 MSI</div>
                  <div className="text-[10px] opacity-80">10m Spatial BOA</div>
                </div>
              </button>

              <button
                onClick={() => setActiveSensor('landsat')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeSensor === 'landsat'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <div className="text-left leading-tight">
                  <div className="font-bold">Landsat-9 OLI</div>
                  <div className="text-[10px] opacity-80">15m Pan-Sharpened</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Defense-grade Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monitored Sectors
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {totalSectors}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Active Sectors
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across {uniqueDistricts} Tamil Nadu districts with multi-spectral baselines
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Altered Footprint
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {totalAreaHa}
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Hectares
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Aggregated surface change detected over multi-temporal observations
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Detection Confidence
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {avgConfidence}%
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Mean Precision
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cross-verified with spectral indices (NDVI, NDWI, NDBI change masks)
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Optical Resolution
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center">
              <Satellite className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {activeSensor === 'sentinel' ? '10m' : '15m'}
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              GSD Optical
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {activeSensor === 'sentinel' ? 'Copernicus Level-2A Multi-Spectral' : 'USGS Landsat-9 OLI-2 Pan-Sharpened'}
          </p>
        </div>
      </div>

      {/* 5 Monitored Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Target Land-Use Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Autonomous multi-sensor classification across all 74 monitored sectors
            </p>
          </div>
          <button
            onClick={() => onNavigateToMap('all')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Open All on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topicsList.map((topic) => {
            const catSectors = ALL_SECTORS.filter((s) => s.category === topic.id);
            const catArea = catSectors.reduce((acc, s) => acc + s.areaHa, 0).toFixed(1);
            const firstSector = catSectors[0];

            return (
              <div
                key={topic.id}
                className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xs hover:shadow-xl group space-y-4"
              >
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${topic.color}20` }}
                      >
                        {getCategoryIcon(topic.id)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition">
                          {topic.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {catArea} ha altered
                        </span>
                      </div>
                    </div>

                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono shrink-0"
                      style={{
                        backgroundColor: topic.lightBg,
                        color: topic.darkColor,
                        border: `1px solid ${topic.borderColor}`,
                      }}
                    >
                      {catSectors.length} Sectors
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {topic.description}
                  </p>

                  {/* Sample District Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Array.from(new Set(catSectors.map((s) => s.district)))
                      .slice(0, 4)
                      .map((district) => (
                        <span
                          key={district}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {district}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => onNavigateToMap(topic.id as TopicCategory)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Map</span>
                  </button>

                  <button
                    onClick={() => {
                      if (firstSector) {
                        onSelectSector(firstSector);
                        if (onNavigateToAnalysis) {
                          onNavigateToAnalysis(firstSector);
                        } else {
                          onNavigateToMap(topic.id as TopicCategory, firstSector.id);
                        }
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-xs"
                  >
                    <span>Analyze Change</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Threat Spotlight Ticker */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 dark:bg-slate-900/90 p-5 backdrop-blur-md shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">
              High-Priority Critical Sectors Spotlight
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Verified High Anomaly Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {spotlightSectors.map((sector) => (
            <div
              key={sector.id}
              onClick={() => {
                onSelectSector(sector);
                if (onNavigateToAnalysis) {
                  onNavigateToAnalysis(sector);
                } else {
                  onNavigateToMap(sector.category, sector.id);
                }
              }}
              className="p-3.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-rose-400/60 cursor-pointer transition group shadow-xs hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-rose-500 dark:text-rose-400 uppercase tracking-wider text-[10px]">
                  {sector.district}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {sector.confidence}% CONF
                </span>
              </div>
              <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-400 transition">
                {sector.title}
              </h4>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{sector.areaHa} ha</span>
                <span className="font-mono">{sector.acquisitionDates.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TOPICS } from '@/data/topics';
import { TopicCategory, SatelliteSensorType } from '@/types';
import { ArrowRight, Satellite, Zap, ShieldCheck } from 'lucide-react';

interface OverviewScreenProps {
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onNavigateToMap: (category?: TopicCategory, sectorId?: string) => void;
  onSelectSector: (sector: any) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  activeSensor,
  setActiveSensor,
  onNavigateToMap,
}) => {
  const topicsList = Object.values(TOPICS);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-900 dark:text-white">
      {/* Screen Title & Subtitle Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              GeoFind AI
            </h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Tamil Nadu Satellite Intelligence
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
            Tamil Nadu Satellite Land-Use & Change Detection Intelligence Platform
          </p>
        </div>

        {/* Satellite Sensor Constellation Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSensor('sentinel')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSensor === 'sentinel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Sentinel-2 (10m)</span>
          </button>
          <button
            onClick={() => setActiveSensor('landsat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSensor === 'landsat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Landsat-9 (15m)</span>
          </button>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="p-4 rounded-lg bg-slate-900 text-white border border-slate-800 flex items-start space-x-3 shadow-md">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-white text-sm">
            Satellite Operational Standard: {activeSensor === 'sentinel' ? 'Copernicus Sentinel-2 MSI (10m)' : 'USGS Landsat-9 OLI-2 (15m Pan-Sharpened)'}
          </div>
          <p className="text-slate-300">
            Map first → Detection second → Evidence third → Details last. Automated Sentinel-2 multispectral comparison across Tamil Nadu bounds.
          </p>
        </div>
      </div>

      {/* 5 Compact Topic Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Monitored Categories
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Automated Satellite Surveillance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicsList.map((topic) => {
            return (
              <div
                key={topic.id}
                onClick={() => onNavigateToMap(topic.id as TopicCategory)}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between shadow-xs space-y-4 cursor-pointer group hover:shadow-lg"
              >
                <div className="space-y-3">
                  {/* Top Bar with Strict Topic Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: topic.color }}
                      />
                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-400 transition">
                        {topic.name}
                      </h4>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-bold"
                      style={{
                        backgroundColor: topic.lightBg,
                        color: topic.darkColor,
                        border: `1px solid ${topic.borderColor}`,
                      }}
                    >
                      {topic.sectorCount} Sectors
                    </span>
                  </div>

                  {/* One-Line Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {topic.description}
                  </p>
                </div>

                {/* View on Map Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToMap(topic.id as TopicCategory);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-600 dark:group-hover:text-white transition"
                >
                  <span>View on Satellite Map</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

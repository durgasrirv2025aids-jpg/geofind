import React from 'react';
import { ACTIVE_SOURCE, AVAILABLE_SOURCES } from '@/data/sources';
import { Satellite, CheckCircle2, X, Radio, AlertCircle } from 'lucide-react';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Satellite className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Satellite Data Sources & Constellations
              </h3>
              <p className="text-xs text-slate-500">
                Tamil Nadu optical & multispectral imagery providers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: CURRENTLY ACTIVE SOURCE */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
            <Radio className="w-4 h-4 animate-pulse text-emerald-500" />
            <span>Currently Active Source</span>
          </h4>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {ACTIVE_SOURCE.name}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white">
                OPERATIONAL BASELINE
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {ACTIVE_SOURCE.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 text-slate-600 dark:text-slate-400 border-t border-emerald-200 dark:border-emerald-900">
              <div>Resolution: <strong>{ACTIVE_SOURCE.resolution}</strong></div>
              <div>Revisit: <strong>{ACTIVE_SOURCE.revisitDays}</strong></div>
            </div>
          </div>
        </div>

        {/* Section 2: AVAILABLE SOURCES */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Secondary & Commercial Sources
          </h4>

          <div className="space-y-3">
            {AVAILABLE_SOURCES.filter(s => s.status !== 'active').map((source) => (
              <div
                key={source.name}
                className="bg-slate-50 dark:bg-slate-850 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {source.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    AVAILABLE
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {source.description}
                </p>
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Spatial Resolution: {source.resolution}</span>
                  <span>{source.revisitDays}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 rounded text-xs font-semibold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Settings, X, Sun, Moon, Map, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  confidenceThreshold,
  setConfidenceThreshold,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Platform Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure GeoFind AI display and threshold parameters
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

        {/* Setting 1: Theme Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">
            Interface Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDarkMode(false)}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                !darkMode
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Lavender/White Theme</span>
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 transition ${
                darkMode
                  ? 'bg-indigo-950 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Theme</span>
            </button>
          </div>
        </div>

        {/* Setting 2: Confidence Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-900 dark:text-white">
              Detection Confidence Threshold
            </label>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              ≥ {confidenceThreshold}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">
            Sectors with detection confidence rating below this threshold will be filtered out.
          </p>
        </div>

        {/* Setting 3: Basemap Provider */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">
            Satellite Tile Basemap Provider
          </label>
          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Esri World Imagery (Standard High-Res Baseline)
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

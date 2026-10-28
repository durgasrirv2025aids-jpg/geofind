import React from 'react';
import { DetectionSector } from '@/types';
import { TOPICS } from '@/data/topics';
import { ALL_SECTORS } from '@/data/detections';
import { ACTIVE_SOURCE } from '@/data/sources';
import { generatePdfReport } from '@/services/pdf';
import { Download, FileText, CheckCircle2, ShieldCheck, MapPin, Calendar } from 'lucide-react';

interface ReportsScreenProps {
  sector: DetectionSector | null;
  onSelectSector: (sector: DetectionSector) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  sector = ALL_SECTORS[0],
  onSelectSector,
}) => {
  const activeSector = sector || ALL_SECTORS[0];
  const topic = TOPICS[activeSector.category];

  const handleDownload = () => {
    generatePdfReport(activeSector);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Satellite Inspection Report
            </h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              OFFICIAL AUDIT DRAFT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Single-detection automated compliance and environmental audit report for Tamil Nadu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <select
            value={activeSector.id}
            onChange={(e) => {
              const found = ALL_SECTORS.find((s) => s.id === e.target.value);
              if (found) onSelectSector(found);
            }}
            className="px-3 py-2 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
          >
            {ALL_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.district} - {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center space-x-2 transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Paper Report Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Document Header Bar */}
        <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
              Government of Tamil Nadu — Satellite Intelligence Audit
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1">
              Land-Use Change & Violation Compliance Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Sentinel-2 Multispectral Index Verification
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono">
            <div>REF ID: GEOFIND-TN-{activeSector.id.toUpperCase()}</div>
            <div>DATE: {new Date().toISOString().split('T')[0]}</div>
            <div className="text-emerald-400 font-semibold">STATUS: VERIFIED DETECTION</div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Category Banner */}
          <div
            className="p-4 rounded-md text-white flex items-center justify-between"
            style={{ backgroundColor: topic?.color }}
          >
            <div>
              <div className="text-xs font-bold uppercase opacity-90">Detection Category</div>
              <div className="text-lg font-bold">{topic?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase opacity-90">Confidence Level</div>
              <div className="text-lg font-bold">
                {activeSector.confidence}% <span className="text-xs font-normal opacity-85">(Demo)</span>
              </div>
            </div>
          </div>

          {/* Section 1: Location & Coordinates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              1. Spatial Location & Territorial Jurisdiction
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">District:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Center Coordinate:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {activeSector.center[0].toFixed(4)}° N, {activeSector.center[1].toFixed(4)}° E
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Area Affected:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.areaHa} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Baseline Acquisition:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.acquisitionDates.before}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Post-Change Acquisition:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.acquisitionDates.after}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tri-Image Evidence Snapshot */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              2. Satellite Evidence Registration
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={activeSector.images.beforeUrl} alt="Before" className="w-full h-32 object-cover" />
                <div className="p-1.5 bg-slate-900 text-[10px] text-slate-300 font-semibold text-center">
                  BEFORE ({activeSector.acquisitionDates.before})
                </div>
              </div>
              <div className="rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={activeSector.images.afterUrl} alt="After" className="w-full h-32 object-cover" />
                <div className="p-1.5 bg-slate-900 text-[10px] text-slate-300 font-semibold text-center">
                  AFTER ({activeSector.acquisitionDates.after})
                </div>
              </div>
              <div className="rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img src={activeSector.images.maskUrl} alt="Mask" className="w-full h-32 object-cover" />
                <div className="p-1.5 bg-slate-900 text-[10px] text-indigo-300 font-semibold text-center">
                  CHANGE MASK ({topic?.name.toUpperCase()})
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Observations */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              3. Automated Sensor Observations & Impact
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded border border-slate-200 dark:border-slate-800">
              {activeSector.description}
            </p>
          </div>

          {/* Section 4: Sensor & System Verification */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified by GeoFind AI Satellite Engine (Copernicus Sentinel-2 10m L2A)</span>
            </div>
            <button
              onClick={handleDownload}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Copy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

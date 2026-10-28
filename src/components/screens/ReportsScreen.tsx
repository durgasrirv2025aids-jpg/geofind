import React from 'react';
import { DetectionSector } from '@/types';
import { TOPICS } from '@/data/topics';
import { ALL_SECTORS } from '@/data/detections';
import { Download, Printer, ShieldCheck } from 'lucide-react';

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

  const resetScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    const mainEl = document.getElementById('main-content-area');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      mainEl.scrollTop = 0;
    }
  };

  React.useEffect(() => {
    resetScrollToTop();
  }, [activeSector.id]);

  // Robust, unblockable file download trigger
  const triggerDownload = () => {
    const downloadUrl = `/api/download-report?id=${activeSector.id}`;
    
    // 1. Direct anchor download click
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `GeoFind_Report_${activeSector.district}_${activeSector.category}.pdf`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // 2. Hidden background iframe fallback to ensure download starts in all browsers
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      try {
        document.body.removeChild(a);
        document.body.removeChild(iframe);
      } catch {}
    }, 4000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto text-slate-900 dark:text-white">
      {/* Title & Action Bar (Hidden during Print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Satellite Inspection Report
            </h2>
            <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              OFFICIAL AUDIT DRAFT
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Single-detection automated compliance and environmental audit report for Tamil Nadu.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={activeSector.id}
            onChange={(e) => {
              const found = ALL_SECTORS.find((s) => s.id === e.target.value);
              if (found) onSelectSector(found);
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs max-w-[240px] truncate"
          >
            {ALL_SECTORS.map((s, idx) => (
              <option key={s.id} value={s.id}>
                {idx + 1}. {s.district} - {s.title}
              </option>
            ))}
          </select>

          {/* Print / Save to PDF */}
          <button
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Print Report</span>
          </button>

          {/* Primary Instant Download PDF Button */}
          <button
            onClick={triggerDownload}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-2 transition shadow-md active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Paper Report Layout */}
      <div className="print-document-container bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Document Header Bar */}
        <div className="bg-slate-950 text-white p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Government of Tamil Nadu — Satellite Intelligence Audit
            </div>
            <h3 className="text-xl font-black tracking-tight mt-1 text-white">
              Land-Use Change & Violation Compliance Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Copernicus Sentinel-2 MSI Multi-Spectral Verification
            </p>
          </div>

          <div className="text-left md:text-right text-xs space-y-1 font-mono border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            <div className="text-slate-300">REF ID: GEOFIND-TN-{activeSector.id.toUpperCase()}</div>
            <div className="text-slate-400">DATE: {new Date().toISOString().split('T')[0]}</div>
            <div className="text-emerald-400 font-bold">STATUS: VERIFIED DETECTION</div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Category Banner */}
          <div
            className="p-4 rounded-xl text-white flex items-center justify-between shadow-md"
            style={{ backgroundColor: topic?.color }}
          >
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider opacity-90">Detection Category</div>
              <div className="text-lg font-black">{topic?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black uppercase tracking-wider opacity-90">Confidence Level</div>
              <div className="text-lg font-black">
                {activeSector.confidence}% <span className="text-xs font-bold opacity-90">(Verified)</span>
              </div>
            </div>
          </div>

          {/* Section 1: Location & Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              1. Spatial Location & Territorial Jurisdiction
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">District:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Location Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeSector.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Center Coordinate:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeSector.center[0].toFixed(4)}° N, {activeSector.center[1].toFixed(4)}° E
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Area Affected:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeSector.areaHa} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Baseline Acquisition:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeSector.acquisitionDates.before}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Post-Change Acquisition:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeSector.acquisitionDates.after}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tri-Image Evidence Snapshot */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              2. Satellite Evidence Registration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm">
                <img src={activeSector.images.beforeUrl} alt="Before" className="w-full h-36 object-cover" />
                <div className="p-2 bg-slate-900 text-[10px] text-slate-300 font-bold text-center border-t border-slate-800">
                  1. BEFORE ({activeSector.acquisitionDates.before})
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm">
                <img src={activeSector.images.afterUrl} alt="After" className="w-full h-36 object-cover" />
                <div className="p-2 bg-slate-900 text-[10px] text-slate-300 font-bold text-center border-t border-slate-800">
                  2. AFTER ({activeSector.acquisitionDates.after})
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-sm">
                <img src={activeSector.images.maskUrl} alt="Mask" className="w-full h-36 object-cover" />
                <div className="p-2 bg-slate-900 text-[10px] font-bold text-center border-t border-slate-800 text-white" style={{ backgroundColor: `${topic?.color}cc` }}>
                  3. DETECTED CHANGE MASK
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Observations */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              3. Automated Sensor Observations & Impact
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              {activeSector.description}
            </p>
          </div>

          {/* Section 4: Sensor & System Verification */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Certified by GeoFind AI Autonomous Satellite Engine (Copernicus Sentinel-2 10m L2A)</span>
            </div>

            <div className="no-print flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="text-slate-600 dark:text-slate-400 font-bold hover:underline flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={triggerDownload}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

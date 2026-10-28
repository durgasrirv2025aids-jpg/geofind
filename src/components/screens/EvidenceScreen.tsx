import React, { useState } from 'react';
import { DetectionSector, SatelliteSensorType } from '@/types';
import { TOPICS } from '@/data/topics';
import { ALL_SECTORS } from '@/data/detections';
import { ImageMagnifier } from '../common/ImageMagnifier';
import { formatDisplayDate, getCategoryCalloutLabel, getBaselineLabel, getObservedChangeLabel } from './ChangeAnalysisScreen';
import { 
  MapPin, 
  Calendar, 
  FileText, 
  Satellite, 
  Crosshair, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Camera, 
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EvidenceScreenProps {
  sector: DetectionSector | null;
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onNavigateToReports: (sector: DetectionSector) => void;
  onSelectSector: (sector: DetectionSector) => void;
}

export const EvidenceScreen: React.FC<EvidenceScreenProps> = ({
  sector = ALL_SECTORS[0],
  activeSensor,
  setActiveSensor,
  onNavigateToReports,
  onSelectSector,
}) => {
  const activeSector = sector || ALL_SECTORS[0];
  const topic = TOPICS[activeSector.category];

  const [categoryFilter, setCategoryFilter] = useState<string>(activeSector.category || 'all');
  const [imagerySource, setImagerySource] = useState<'satellite' | 'aerial'>('satellite');
  const [showAnnotation, setShowAnnotation] = useState(true);

  const hasAerial = Boolean(activeSector.images.aerialBeforeUrl && activeSector.images.aerialAfterUrl);

  const displayedSectors = categoryFilter === 'all'
    ? ALL_SECTORS
    : ALL_SECTORS.filter((s) => s.category === categoryFilter);

  const currentSectorIndex = displayedSectors.findIndex((s) => s.id === activeSector.id);

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

  const handlePrevSector = () => {
    if (displayedSectors.length === 0) return;
    const prevIdx = (currentSectorIndex - 1 + displayedSectors.length) % displayedSectors.length;
    onSelectSector(displayedSectors[prevIdx]);
    resetScrollToTop();
  };

  const handleNextSector = () => {
    if (displayedSectors.length === 0) return;
    const nextIdx = (currentSectorIndex + 1) % displayedSectors.length;
    onSelectSector(displayedSectors[nextIdx]);
    resetScrollToTop();
  };

  const handleCategoryFilterChange = (cat: string) => {
    setCategoryFilter(cat);
    const catSectors = cat === 'all' ? ALL_SECTORS : ALL_SECTORS.filter((s) => s.category === cat);
    if (catSectors.length > 0) {
      onSelectSector(catSectors[0]);
    }
    resetScrollToTop();
  };

  const cacheBuster = `?v=2`;
  let rawBefore = activeSector.images.beforeUrl;
  let rawAfter = activeSector.images.afterUrl;
  let rawMask = activeSector.images.maskUrl;

  if (imagerySource === 'aerial' && hasAerial) {
    rawBefore = activeSector.images.aerialBeforeUrl!;
    rawAfter = activeSector.images.aerialAfterUrl!;
    rawMask = activeSector.images.aerialMaskUrl || activeSector.images.maskUrl;
  }

  const beforeImg = rawBefore ? `${rawBefore}${cacheBuster}` : '';
  const afterImg = rawAfter ? `${rawAfter}${cacheBuster}` : '';
  const maskImg = rawMask ? `${rawMask}${cacheBuster}` : '';

  const beforeFormatted = formatDisplayDate(activeSector.acquisitionDates.before);
  const afterFormatted = formatDisplayDate(activeSector.acquisitionDates.after);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-white">
      {/* Screen Title & Sensor Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: topic?.color }}
            />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Satellite Evidence Record
            </h2>
            <span
              className="px-2.5 py-0.5 rounded text-xs font-black text-white uppercase"
              style={{ backgroundColor: topic?.color }}
            >
              {topic?.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Multi-spectral satellite image verification ({beforeFormatted} vs {afterFormatted}), geographical coordinates, and sensor metadata.
          </p>
        </div>

        {/* Satellite Sensor Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSensor('sentinel')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold transition ${
              activeSensor === 'sentinel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Sentinel-2 (10m)</span>
          </button>
          <button
            onClick={() => setActiveSensor('landsat')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold transition ${
              activeSensor === 'landsat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Landsat-9 (15m)</span>
          </button>
        </div>
      </div>

      {/* QUICK CATEGORY SWITCHER & SECTOR STEPPER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => handleCategoryFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            All Sectors (74)
          </button>
          {Object.values(TOPICS).map((top) => {
            const isCatActive = categoryFilter === top.id;
            return (
              <button
                key={top.id}
                onClick={() => handleCategoryFilterChange(top.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border flex items-center space-x-1.5 ${
                  isCatActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: isCatActive ? top.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isCatActive ? '#ffffff' : top.color }}
                />
                <span>{top.name}</span>
                <span className="text-[10px] opacity-80 font-mono">({top.sectorCount})</span>
              </button>
            );
          })}
        </div>

        {/* Sector Stepper (< Prev / Dropdown / Next >) */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrevSector}
            title="Previous Sector"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={activeSector.id}
            onChange={(e) => {
              const found = ALL_SECTORS.find((s) => s.id === e.target.value);
              if (found) onSelectSector(found);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white max-w-[280px] md:max-w-[360px] truncate"
          >
            {displayedSectors.map((s, idx) => (
              <option key={s.id} value={s.id}>
                {idx + 1}. {s.district} - {s.title} ({s.areaHa} ha)
              </option>
            ))}
          </select>

          <button
            onClick={handleNextSector}
            title="Next Sector"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold hidden sm:inline-block">
            {currentSectorIndex >= 0 ? currentSectorIndex + 1 : 1}/{displayedSectors.length}
          </span>
        </div>
      </div>

      {/* THE THREE IMAGES GRID WITH ULTRA-ZOOM LOUPE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Primary Tri-Image Satellite Evidence Set</span>
              <span className="text-xs font-mono font-semibold text-emerald-500 uppercase">
                ({imagerySource === 'aerial' ? 'Drone Aerial 0.5m Orthophoto' : 'Sentinel-2 L2A 10m Multispectral'})
              </span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {hasAerial && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs">
                <button
                  onClick={() => setImagerySource('satellite')}
                  className={`px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                    imagerySource === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Satellite className="w-3 h-3" />
                  <span>Satellite</span>
                </button>
                <button
                  onClick={() => setImagerySource('aerial')}
                  className={`px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                    imagerySource === 'aerial' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Drone Aerial</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAnnotation(!showAnnotation)}
              className="px-2.5 py-1 rounded text-xs font-bold bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
              <span>Marker {showAnnotation ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Image 1: Before Image with Magnifier */}
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{beforeFormatted}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Baseline
              </span>
            </div>
            <div className="relative h-72 bg-slate-950">
              <ImageMagnifier
                src={beforeImg}
                alt={`Before Imagery: ${beforeFormatted}`}
                className="w-full h-full"
                zoomLevel={2.5}
              />
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Baseline Condition:</span> {getBaselineLabel(activeSector.category)}
            </div>
          </div>

          {/* Image 2: After Image with Magnifier & Detection Callout */}
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{afterFormatted}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                2. Change Detected
              </span>
            </div>
            <div className="relative h-72 bg-slate-950">
              <ImageMagnifier
                src={afterImg}
                alt={`After Imagery: ${afterFormatted}`}
                className="w-full h-full"
                zoomLevel={2.5}
              />

              {/* Annotation Callout Pin */}
              {showAnnotation && (
                <div className="absolute top-[48%] left-[24%] -translate-y-1/2 flex items-center pointer-events-none z-20">
                  <div className="px-2.5 py-0.5 bg-white text-slate-900 rounded-md shadow-xl font-black text-[11px] border border-slate-200 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{getCategoryCalloutLabel(activeSector.category)}</span>
                  </div>
                  <div className="w-10 h-0.5 bg-white shadow-md relative">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-white bg-white/70 absolute -right-1 -top-1" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Observed Change:</span> {getObservedChangeLabel(activeSector.category, activeSector.areaHa)}
            </div>
          </div>

          {/* Image 3: Highlighted Change Mask with Magnifier */}
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                <span>GIS Polygon Mask</span>
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: topic?.color }}
              >
                3. {topic?.name}
              </span>
            </div>
            <div className="relative h-72 bg-slate-950">
              <ImageMagnifier
                src={maskImg}
                alt="Change Mask"
                className="w-full h-full"
                zoomLevel={2.5}
              />
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Per-Pixel Mask:</span> Extracted spatial perimeter matching spectral index diff.
            </div>
          </div>
        </div>
      </div>

      {/* Detection Facts & Satellite Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detection Facts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Detection Verification Facts</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Sector ID</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{activeSector.id}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Category</span>
              <span className="font-bold text-slate-900 dark:text-white capitalize">{activeSector.category}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Area Affected</span>
              <span className="font-bold text-emerald-500">{activeSector.areaHa} Hectares</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">AI Confidence</span>
              <span className="font-bold text-amber-500">{activeSector.confidence}% High Confidence</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Sensor Type</span>
              <span className="font-bold text-slate-900 dark:text-white">{activeSector.sensor}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Spatial Resolution</span>
              <span className="font-bold text-indigo-500 font-mono">{activeSector.resolution}</span>
            </div>
          </div>
        </div>

        {/* Spatial Coordinates & Description */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>Geographical Coordinates</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Center Lat/Long:</span>
              <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-slate-800 dark:text-slate-200 font-bold">
                {activeSector.center[0].toFixed(4)}° N, {activeSector.center[1].toFixed(4)}° E
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-1">District / Region:</span>
              <span className="font-bold text-slate-900 dark:text-white">{activeSector.district}, Tamil Nadu</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Description:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeSector.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-linear-to-br from-slate-900 to-slate-950 p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col justify-between text-white">
          <div className="space-y-3">
            <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block uppercase tracking-wider">
              Official Dossier
            </span>
            <h4 className="text-lg font-black tracking-tight text-white">
              Generate Evidentiary PDF Report
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Export high-resolution satellite imagery pairs, spectral NDVI differencing charts, and GIS coordinates into a sealed PDF report for district administration.
            </p>
          </div>

          <button
            onClick={() => onNavigateToReports(activeSector)}
            className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Export Official PDF Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { DetectionSector, SatelliteSensorType } from '@/types';
import { TOPICS } from '@/data/topics';
import { ALL_SECTORS } from '@/data/detections';
import { ImageMagnifier } from '../common/ImageMagnifier';
import { 
  Sliders, 
  Columns, 
  Layers, 
  Calendar, 
  Satellite,
  Zap,
  Eye,
  Camera,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ChangeAnalysisScreenProps {
  sector: DetectionSector | null;
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onNavigateToEvidence: (sector: DetectionSector) => void;
  onSelectSector: (sector: DetectionSector) => void;
}

// Format date to "January 19, 2020" style
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('January') || dateStr.includes('May') || dateStr.includes('February')) {
    return dateStr;
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const monthIndex = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const d = new Date(year, monthIndex, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }
  return dateStr;
}

export function getCategoryCalloutLabel(category: string): string {
  switch (category) {
    case 'mining':
      return 'Granite Quarrying';
    case 'deforestation':
      return 'Deforestation';
    case 'construction':
      return 'Illegal Construction';
    case 'sandmining':
      return 'Sand Dredging';
    case 'wetland':
      return 'Wetland Infill';
    default:
      return 'Detected Change';
  }
}

export function getBaselineLabel(category: string): string {
  switch (category) {
    case 'mining':
      return 'Unaltered Hill Ridge & Natural Terrain';
    case 'deforestation':
      return 'Intact Forest Canopy / Unaltered Parcel';
    case 'construction':
      return 'Cultivated Agricultural Farmland';
    case 'sandmining':
      return 'Natural Riverbed & Riparian Sandbars';
    case 'wetland':
      return 'Pristine Wetland Sanctuary & Lagoons';
    default:
      return 'Baseline Condition';
  }
}

export function getObservedChangeLabel(category: string, areaHa: number): string {
  switch (category) {
    case 'mining':
      return `Active Granite Quarry Excavation (${areaHa} ha)`;
    case 'deforestation':
      return `Observed Canopy Deforestation (${areaHa} ha)`;
    case 'construction':
      return `Unauthorized Logistics Warehouses (${areaHa} ha)`;
    case 'sandmining':
      return `Mechanized Sand Dredging Scars (${areaHa} ha)`;
    case 'wetland':
      return `Debris Dumping & Land Reclamation (${areaHa} ha)`;
    default:
      return `Observed Change Event (${areaHa} ha)`;
  }
}

export const ChangeAnalysisScreen: React.FC<ChangeAnalysisScreenProps> = ({
  sector = ALL_SECTORS[0],
  activeSensor,
  setActiveSensor,
  onNavigateToEvidence,
  onSelectSector,
}) => {
  const activeSector = sector || ALL_SECTORS[0];
  const topic = TOPICS[activeSector.category];

  const [categoryFilter, setCategoryFilter] = useState<string>(activeSector.category || 'all');
  const [viewMode, setViewMode] = useState<'swipe' | 'side' | 'mask'>('side');
  const [imagerySource, setImagerySource] = useState<'satellite' | 'aerial' | 'comparison'>('satellite');
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const hasAerial = Boolean(activeSector.images.aerialBeforeUrl && activeSector.images.aerialAfterUrl);
  const hasComparison = Boolean(activeSector.images.comparisonUrl);

  // Filtered sectors list based on category filter
  const displayedSectors = categoryFilter === 'all'
    ? ALL_SECTORS
    : ALL_SECTORS.filter((s) => s.category === categoryFilter);

  const currentSectorIndex = displayedSectors.findIndex((s) => s.id === activeSector.id);

  const handlePrevSector = () => {
    if (displayedSectors.length === 0) return;
    const prevIdx = (currentSectorIndex - 1 + displayedSectors.length) % displayedSectors.length;
    onSelectSector(displayedSectors[prevIdx]);
  };

  const handleNextSector = () => {
    if (displayedSectors.length === 0) return;
    const nextIdx = (currentSectorIndex + 1) % displayedSectors.length;
    onSelectSector(displayedSectors[nextIdx]);
  };

  const handleCategoryFilterChange = (cat: string) => {
    setCategoryFilter(cat);
    const catSectors = cat === 'all' ? ALL_SECTORS : ALL_SECTORS.filter((s) => s.category === cat);
    if (catSectors.length > 0) {
      onSelectSector(catSectors[0]);
    }
  };

  // Determine active before/after images based on source + cache buster
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX;
    const x = Math.max(0, Math.min(touchX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const beforeFormattedDate = formatDisplayDate(activeSector.acquisitionDates.before);
  const afterFormattedDate = formatDisplayDate(activeSector.acquisitionDates.after);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-white">
      {/* Sector Switcher & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: topic?.color }}
            />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Satellite Change Analysis
            </h2>
            <span
              className="px-2.5 py-0.5 rounded text-xs font-black text-white uppercase"
              style={{ backgroundColor: topic?.color }}
            >
              {topic?.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            High-precision multi-temporal satellite comparison ({beforeFormattedDate} vs {afterFormattedDate}) across Tamil Nadu.
          </p>
        </div>

        {/* Satellite Sensor Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSensor('sentinel')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold transition ${
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
            className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold transition ${
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

      {/* Key Facts Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Location</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs truncate block">{activeSector.locationName}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">District</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">{activeSector.district}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Area Affected</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{activeSector.areaHa} ha</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Acquisition Period</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">
            {beforeFormattedDate} → {afterFormattedDate}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Confidence</span>
          <span className="font-bold text-amber-500 text-xs">
            {activeSector.confidence}% <span className="text-[9px] font-normal text-emerald-400">Verified</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Active Sensor Baseline</span>
          <span className="font-bold text-indigo-500 text-xs uppercase font-mono">{activeSector.resolution}</span>
        </div>
      </div>

      {/* View Switcher & Imagery Source Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
        {/* Left: View Mode (Side-by-Side, Swipe, Mask) */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setViewMode('side')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 transition ${
              viewMode === 'side'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => setViewMode('swipe')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 transition ${
              viewMode === 'swipe'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Swipe Slider</span>
          </button>
          <button
            onClick={() => setViewMode('mask')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 transition ${
              viewMode === 'mask'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Before / After / Mask</span>
          </button>
        </div>

        {/* Right: Imagery Level & Callout Annotations */}
        <div className="flex flex-wrap items-center gap-2">
          {hasAerial && (
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setImagerySource('satellite')}
                className={`px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                  imagerySource === 'satellite'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Satellite className="w-3 h-3" />
                <span>Satellite (10m)</span>
              </button>
              <button
                onClick={() => setImagerySource('aerial')}
                className={`px-2.5 py-1 rounded font-bold transition flex items-center space-x-1 ${
                  imagerySource === 'aerial'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Drone Inspection (0.5m)</span>
              </button>
            </div>
          )}

          {/* Toggle Annotation Pin */}
          <button
            onClick={() => setShowAnnotation(!showAnnotation)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 border transition ${
              showAnnotation
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detection Callout {showAnnotation ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Imagery Rendering Canvas Container */}
      <div>
        {/* VIEW MODE 1: SIDE-BY-SIDE (MATCHING USER REFERENCE IMAGE) */}
        {viewMode === 'side' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* BEFORE PANEL */}
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col">
                {/* Date Header matching reference image */}
                <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                      {beforeFormattedDate}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Baseline (Before)
                  </span>
                </div>

                {/* Imagery Container with Magnifier */}
                <div className="relative h-[480px] bg-slate-950">
                  <ImageMagnifier
                    src={beforeImg}
                    alt={`Before: ${beforeFormattedDate}`}
                    className="w-full h-full"
                    zoomLevel={2.5}
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white px-3 py-1 rounded text-xs font-bold border border-slate-700/80 pointer-events-none backdrop-blur-xs flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>{getBaselineLabel(activeSector.category)}</span>
                  </div>
                </div>
              </div>

              {/* AFTER PANEL */}
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col">
                {/* Date Header matching reference image */}
                <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                      {afterFormattedDate}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: topic?.color }}
                  >
                    Change Detected
                  </span>
                </div>

                {/* Imagery Container with Magnifier & Detection Callout */}
                <div className="relative h-[480px] bg-slate-950">
                  <ImageMagnifier
                    src={afterImg}
                    alt={`After: ${afterFormattedDate}`}
                    className="w-full h-full"
                    zoomLevel={2.5}
                  />

                  {/* ANNOTATION CALLOUT PIN MATCHING USER REFERENCE: "Deforestation ──⚪" */}
                  {showAnnotation && (
                    <div className="absolute top-[48%] left-[28%] -translate-y-1/2 flex items-center pointer-events-none z-20">
                      {/* Label badge */}
                      <div className="px-3 py-1 bg-white text-slate-900 rounded-md shadow-2xl font-black text-xs border border-slate-200 flex items-center space-x-1.5 backdrop-blur-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>{getCategoryCalloutLabel(activeSector.category)}</span>
                      </div>
                      {/* Line connector */}
                      <div className="w-16 h-0.5 bg-white shadow-lg relative">
                        {/* Target dot pointer */}
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white/80 absolute -right-1.5 -top-1.5 shadow-xl animate-pulse" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white px-3 py-1 rounded text-xs font-bold border border-slate-700/80 pointer-events-none backdrop-blur-xs flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{getObservedChangeLabel(activeSector.category, activeSector.areaHa)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Reference Sheet Banner if available */}
            {hasComparison && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Official Multi-Temporal Satellite Pair Verified
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Co-registered Sentinel-2 MSI satellite acquisition: {beforeFormattedDate} vs {afterFormattedDate} with validated ground truth.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateToEvidence(activeSector)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap"
                >
                  Generate Official Report & Evidence →
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 2: SWIPE SLIDER */}
        {viewMode === 'swipe' && (
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[580px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 select-none cursor-ew-resize bg-slate-950 shadow-2xl"
          >
            {/* After Image */}
            <img
              src={afterImg}
              alt="After Satellite Imagery"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-xs flex items-center space-x-2 border border-slate-700 shadow-lg">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>AFTER: {afterFormattedDate}</span>
            </div>

            {/* Annotation callout on After side */}
            {showAnnotation && (
              <div className="absolute top-[50%] left-[65%] -translate-y-1/2 flex items-center pointer-events-none z-10">
                <div className="px-3 py-1 bg-white text-slate-900 rounded-md shadow-2xl font-black text-xs border border-slate-200 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>{getCategoryCalloutLabel(activeSector.category)}</span>
                </div>
                <div className="w-14 h-0.5 bg-white shadow-lg relative">
                  <div className="w-3 h-3 rounded-full border-2 border-white bg-white/70 absolute -right-1 -top-1" />
                </div>
              </div>
            )}

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeImg}
                alt="Before Satellite Imagery"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-xs flex items-center space-x-2 border border-slate-700 shadow-lg">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>BEFORE: {beforeFormattedDate}</span>
              </div>
            </div>

            {/* Slider Wipe Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-30 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl font-black text-xs border border-slate-300">
                ↔
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 3: 3-PANE MASK WITH MAGNIFYING LENS */}
        {viewMode === 'mask' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
              <ImageMagnifier
                src={beforeImg}
                alt="Before"
                className="w-full h-full"
                zoomLevel={2}
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-3 py-1.5 rounded text-xs font-bold border border-slate-700 pointer-events-none">
                1. BEFORE: {beforeFormattedDate}
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
              <ImageMagnifier
                src={afterImg}
                alt="After"
                className="w-full h-full"
                zoomLevel={2}
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white px-3 py-1.5 rounded text-xs font-bold border border-slate-700 pointer-events-none">
                2. AFTER: {afterFormattedDate}
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
              <ImageMagnifier
                src={maskImg}
                alt="Change Mask"
                className="w-full h-full"
                zoomLevel={2}
              />
              <div
                className="absolute top-3 left-3 text-white px-3 py-1.5 rounded text-xs font-bold uppercase backdrop-blur-xs pointer-events-none"
                style={{ backgroundColor: topic?.color }}
              >
                3. DETECTED CHANGE MASK ({topic?.name})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LeafletMap } from '../map/LeafletMap';
import { DISTRICTS } from '@/data/districts';
import { TOPICS } from '@/data/topics';
import { DetectionSector, TopicCategory, SatelliteSensorType } from '@/types';
import { Search, Satellite, Zap, Compass, X, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface MapScreenProps {
  sectors: DetectionSector[];
  selectedSector: DetectionSector | null;
  activeSensor: SatelliteSensorType;
  setActiveSensor: (sensor: SatelliteSensorType) => void;
  onSelectSector: (sector: DetectionSector) => void;
  onNavigateToAnalysis: (sector: DetectionSector) => void;
  onNavigateToEvidence: (sector: DetectionSector) => void;
  filterCategory: TopicCategory | 'all';
  setFilterCategory: (cat: TopicCategory | 'all') => void;
  onRunDistrictAnalysis: (districtName: string) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  sectors,
  selectedSector,
  activeSensor,
  setActiveSensor,
  onSelectSector,
  onNavigateToAnalysis,
  onNavigateToEvidence,
  filterCategory,
  setFilterCategory,
  onRunDistrictAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mapFocusCenter, setMapFocusCenter] = useState<[number, number] | null>(
    selectedSector ? selectedSector.center : null
  );

  React.useEffect(() => {
    if (selectedSector) {
      setMapFocusCenter(selectedSector.center);
    }
  }, [selectedSector]);

  const handleSelectCategory = (cat: TopicCategory | 'all') => {
    setFilterCategory(cat);
    setMapFocusCenter(null);
  };

  const handleSelectDistrict = (districtName: string, center: [number, number]) => {
    setSearchQuery(districtName);
    setIsDropdownOpen(false);
    setMapFocusCenter(center);
    onRunDistrictAnalysis(districtName);
  };

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedSectors = sectors.filter(
    (s) => filterCategory === 'all' || s.category === filterCategory
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] p-3 sm:p-4 md:p-6 space-y-3 max-w-[1920px] mx-auto text-slate-900 dark:text-white">
      {/* Top Glass Command Dock */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shrink-0 z-20">
        
        {/* Search District Auto-suggest */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search Tamil Nadu district or quarry zone..."
              className="w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 dark:text-white transition placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Auto-suggest dropdown */}
          {isDropdownOpen && filteredDistricts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 dark:divide-slate-800/60">
              <div className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <span>Tamil Nadu Districts ({filteredDistricts.length})</span>
                <span className="text-emerald-500 font-mono">Select to Scan</span>
              </div>
              {filteredDistricts.map((district) => (
                <button
                  key={district.name}
                  onClick={() => handleSelectDistrict(district.name, district.center)}
                  className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-emerald-50 dark:hover:bg-slate-800/70 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {district.name}
                    </span>
                    {district.hasDemoSector && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        SURVEILLANCE ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {district.detectionCount} Sectors
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Constellation Toggle & Category Filter Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Satellite Constellation Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setActiveSensor('sentinel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                activeSensor === 'landsat'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Landsat-9 (15m)</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => handleSelectCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                filterCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:text-white dark:border-emerald-500 shadow-sm'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Sectors ({sectors.length})
            </button>

            {Object.values(TOPICS).map((topic) => {
              const isCatActive = filterCategory === topic.id;
              const count = sectors.filter((s) => s.category === topic.id).length;

              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectCategory(topic.id as TopicCategory)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border flex items-center space-x-1.5 transition ${
                    isCatActive
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  style={{
                    backgroundColor: isCatActive ? topic.color : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isCatActive ? '#ffffff' : topic.color,
                    }}
                  />
                  <span>{topic.name}</span>
                  <span className="text-[10px] opacity-80 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map View Canvas */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-slate-950">
        <LeafletMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          onNavigateToAnalysis={onNavigateToAnalysis}
          onNavigateToEvidence={onNavigateToEvidence}
          filterCategory={filterCategory}
          focusCenter={mapFocusCenter}
        />

        {/* Floating Bottom Quick Sector Navigation Strip */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-slate-950/90 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-800/90 shadow-2xl flex items-center space-x-2.5 overflow-x-auto">
          <div className="text-[11px] font-black uppercase text-slate-300 whitespace-nowrap px-2 flex items-center space-x-2 border-r border-slate-800 mr-1 shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: filterCategory === 'all' ? '#10b981' : TOPICS[filterCategory]?.color || '#10b981',
              }}
            />
            <span className="text-white font-bold">
              {filterCategory === 'all' ? 'All Active Sectors' : TOPICS[filterCategory]?.name}
            </span>
            <span className="text-emerald-400 font-mono">({displayedSectors.length})</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-0.5">
            {displayedSectors.map((sec, idx) => {
              const isSelected = selectedSector?.id === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    onSelectSector(sec);
                    setMapFocusCenter(sec.center);
                  }}
                  className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'bg-slate-900/90 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="text-emerald-400 font-mono text-[11px]">{idx + 1}.</span>
                  <span className="font-bold text-white">{sec.district}:</span>
                  <span className="max-w-[160px] truncate text-slate-300">{sec.title}</span>
                  <span className="text-[10px] font-mono text-emerald-300">({sec.areaHa} ha)</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToAnalysis(sec);
                    }}
                    className="ml-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition uppercase tracking-wider"
                    title="Compare Satellite Images"
                  >
                    Compare
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

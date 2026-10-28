import React, { useState } from 'react';
import { LeafletMap } from '../map/LeafletMap';
import { DISTRICTS } from '@/data/districts';
import { TOPICS } from '@/data/topics';
import { DetectionSector, TopicCategory, SatelliteSensorType } from '@/types';
import { Search, Satellite, Zap, Eye, Compass, Layers } from 'lucide-react';

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

  const filteredDistricts = DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 space-y-4 max-w-[1800px] mx-auto text-slate-900 dark:text-white">
      {/* Search, Sensor Switcher & Category Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 z-20">
        
        {/* Tamil Nadu District Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search Tamil Nadu district or location..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Auto-suggest dropdown */}
          {isDropdownOpen && filteredDistricts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-50 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-850">
                Tamil Nadu Districts ({filteredDistricts.length})
              </div>
              {filteredDistricts.map((district) => (
                <button
                  key={district.name}
                  onClick={() => handleSelectDistrict(district.name, district.center)}
                  className="w-full px-3.5 py-2 text-left text-xs hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center justify-between transition"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {district.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {district.hasDemoSector && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        DEMO READY
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {district.detectionCount} Sectors
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Satellite Sensor Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-850 p-1 rounded-md border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSensor('sentinel')}
            className={`px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1 transition ${
              activeSensor === 'sentinel'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Satellite className="w-3 h-3" />
            <span>Sentinel-2 (10m)</span>
          </button>
          <button
            onClick={() => setActiveSensor('landsat')}
            className={`px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1 transition ${
              activeSensor === 'landsat'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Landsat-9 (15m)</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap border transition ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            All Detections ({sectors.length})
          </button>
          {Object.values(TOPICS).map((topic) => {
            const isCatActive = filterCategory === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectCategory(topic.id as TopicCategory)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap border flex items-center space-x-1.5 transition ${
                  isCatActive
                    ? 'text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Satellite Map Component */}
        <LeafletMap
          sectors={sectors}
          selectedSector={selectedSector}
          onSelectSector={onSelectSector}
          onNavigateToAnalysis={onNavigateToAnalysis}
          onNavigateToEvidence={onNavigateToEvidence}
          filterCategory={filterCategory}
          focusCenter={mapFocusCenter}
        />

        {/* Floating Quick Sector Strip at Bottom of Map */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-2xl flex items-center space-x-2 overflow-x-auto">
          <div className="text-[11px] font-black uppercase text-slate-300 whitespace-nowrap px-2 flex items-center space-x-1.5 border-r border-slate-700 mr-1 shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: filterCategory === 'all' ? '#10b981' : TOPICS[filterCategory]?.color || '#10b981',
              }}
            />
            <span>
              {filterCategory === 'all' ? 'All Sectors' : TOPICS[filterCategory]?.name} (
              {sectors.filter((s) => filterCategory === 'all' || s.category === filterCategory).length}
              )
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-0.5">
            {sectors
              .filter((s) => filterCategory === 'all' || s.category === filterCategory)
              .map((sec, idx) => {
                const isSelected = selectedSector?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      onSelectSector(sec);
                      setMapFocusCenter(sec.center);
                    }}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-emerald-400 font-mono text-[11px]">{idx + 1}.</span>
                    <span className="font-bold text-white">{sec.district}:</span>
                    <span className="max-w-[150px] truncate text-slate-300">{sec.title}</span>
                    <span className="text-[10px] font-mono text-emerald-300">({sec.areaHa} ha)</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAnalysis(sec);
                      }}
                      className="ml-1 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition uppercase"
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

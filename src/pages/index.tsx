import React, { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { OverviewScreen } from '@/components/screens/OverviewScreen';
import { MapScreen } from '@/components/screens/MapScreen';
import { ChangeAnalysisScreen } from '@/components/screens/ChangeAnalysisScreen';
import { EvidenceScreen } from '@/components/screens/EvidenceScreen';
import { ReportsScreen } from '@/components/screens/ReportsScreen';
import { DataSourcesModal } from '@/components/modals/DataSourcesModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { AnalysisProgressModal } from '@/components/modals/AnalysisProgressModal';
import { DEMO_SECTORS, ALL_SECTORS } from '@/data/detections';
import { DetectionSector, TopicCategory, SatelliteSensorType } from '@/types';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<string>('overview');
  const [selectedSector, setSelectedSector] = useState<DetectionSector | null>(DEMO_SECTORS[0]);
  const [filterCategory, setFilterCategory] = useState<TopicCategory | 'all'>('all');
  
  // Sleek GeoINT Command Dark Theme as Default!
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Satellite Sensor Choice (Sentinel-2 vs Landsat-9)
  const [activeSensor, setActiveSensor] = useState<SatelliteSensorType>('sentinel');
  
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);

  // Modals state
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analyzingDistrict, setAnalyzingDistrict] = useState('Salem');

  // Filter sectors by confidence threshold
  const filteredSectors = ALL_SECTORS.filter(s => s.confidence >= confidenceThreshold);

  // Update HTML dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigateToMap = (category?: TopicCategory, sectorId?: string) => {
    if (category) {
      setFilterCategory(category);
      const catSectors = ALL_SECTORS.filter((s) => s.category === category);
      setSelectedSector(catSectors[0] || null);
    } else {
      setFilterCategory('all');
      setSelectedSector(ALL_SECTORS[0] || null);
    }
    if (sectorId) {
      const found = ALL_SECTORS.find((s) => s.id === sectorId);
      if (found) setSelectedSector(found);
    }
    setActiveScreen('map');
  };

  const handleNavigateToAnalysis = (sector: DetectionSector) => {
    setSelectedSector(sector);
    setActiveScreen('change-analysis');
  };

  const handleNavigateToEvidence = (sector: DetectionSector) => {
    setSelectedSector(sector);
    setActiveScreen('evidence');
  };

  const handleNavigateToReports = (sector: DetectionSector) => {
    setSelectedSector(sector);
    setActiveScreen('reports');
  };

  const handleRunDistrictAnalysis = (districtName: string) => {
    setAnalyzingDistrict(districtName);
    setIsAnalysisModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-[#0b0f19] text-white' : 'bg-[#f8f7ff] text-slate-900'}`}>
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeScreen={activeScreen}
        activeSensor={activeSensor}
        setActiveSensor={setActiveSensor}
        onOpenSources={() => setIsSourcesOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          activeSensor={activeSensor}
          onOpenSources={() => setIsSourcesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeScreen === 'overview' && (
            <OverviewScreen
              activeSensor={activeSensor}
              setActiveSensor={setActiveSensor}
              onNavigateToMap={handleNavigateToMap}
              onSelectSector={(sector) => setSelectedSector(sector)}
            />
          )}

          {activeScreen === 'map' && (
            <MapScreen
              sectors={filteredSectors}
              selectedSector={selectedSector}
              activeSensor={activeSensor}
              setActiveSensor={setActiveSensor}
              onSelectSector={(sector) => setSelectedSector(sector)}
              onNavigateToAnalysis={handleNavigateToAnalysis}
              onNavigateToEvidence={handleNavigateToEvidence}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              onRunDistrictAnalysis={handleRunDistrictAnalysis}
            />
          )}

          {activeScreen === 'change-analysis' && (
            <ChangeAnalysisScreen
              sector={selectedSector}
              activeSensor={activeSensor}
              setActiveSensor={setActiveSensor}
              onNavigateToEvidence={handleNavigateToEvidence}
              onSelectSector={(sector) => setSelectedSector(sector)}
            />
          )}

          {activeScreen === 'evidence' && (
            <EvidenceScreen
              sector={selectedSector}
              activeSensor={activeSensor}
              setActiveSensor={setActiveSensor}
              onNavigateToReports={handleNavigateToReports}
              onSelectSector={(sector) => setSelectedSector(sector)}
            />
          )}

          {activeScreen === 'reports' && (
            <ReportsScreen
              sector={selectedSector}
              onSelectSector={(sector) => setSelectedSector(sector)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <DataSourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        confidenceThreshold={confidenceThreshold}
        setConfidenceThreshold={setConfidenceThreshold}
      />

      <AnalysisProgressModal
        isOpen={isAnalysisModalOpen}
        districtName={analyzingDistrict}
        onClose={() => setIsAnalysisModalOpen(false)}
        onComplete={() => {
          setIsAnalysisModalOpen(false);
          const districtSector = ALL_SECTORS.find(s => s.district.toLowerCase().includes(analyzingDistrict.toLowerCase()));
          if (districtSector) {
            setSelectedSector(districtSector);
          }
        }}
      />
    </div>
  );
}

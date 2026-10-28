import React from 'react';
import dynamic from 'next/dynamic';
import { DetectionSector, TopicCategory } from '@/types';

interface LeafletMapProps {
  sectors: DetectionSector[];
  selectedSector: DetectionSector | null;
  onSelectSector: (sector: DetectionSector) => void;
  onNavigateToAnalysis: (sector: DetectionSector) => void;
  onNavigateToEvidence: (sector: DetectionSector) => void;
  filterCategory?: TopicCategory | 'all';
  focusCenter?: [number, number] | null;
}

const DynamicLeafletInner = dynamic(
  () => import('./LeafletMapInner').then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] bg-slate-900 flex items-center justify-center text-slate-400 text-xs rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Tamil Nadu Satellite Basemap...</span>
        </div>
      </div>
    ),
  }
);

export const LeafletMap: React.FC<LeafletMapProps> = (props) => {
  return <DynamicLeafletInner {...props} />;
};

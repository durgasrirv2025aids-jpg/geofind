import { TopicInfo } from '@/types';

export const TOPICS: Record<string, TopicInfo> = {
  mining: {
    id: 'mining',
    name: 'Illegal Mining',
    description: 'Unpermitted open-cast stone quarrying and hill slope granite extraction',
    color: '#ef4444',
    darkColor: '#dc2626',
    lightBg: '#fef2f2',
    borderColor: '#fca5a5',
    sectorCount: 14,
  },
  deforestation: {
    id: 'deforestation',
    name: 'Deforestation',
    description: 'Tree canopy clearing, forest encroaching and timber exploitation in protected ranges',
    color: '#22c55e',
    darkColor: '#16a34a',
    lightBg: '#f0fdf4',
    borderColor: '#86efac',
    sectorCount: 18,
  },
  construction: {
    id: 'construction',
    name: 'Illegal Construction',
    description: 'Unapproved urban structural expansion and land conversion in restricted zones',
    color: '#f97316',
    darkColor: '#ea580c',
    lightBg: '#fff7ed',
    borderColor: '#fdba74',
    sectorCount: 22,
  },
  sandmining: {
    id: 'sandmining',
    name: 'Sand Mining',
    description: 'Excessive mechanized riverbed sand extraction destroying riparian ecosystems',
    color: '#3b82f6',
    darkColor: '#2563eb',
    lightBg: '#eff6ff',
    borderColor: '#93c5fd',
    sectorCount: 11,
  },
  wetland: {
    id: 'wetland',
    name: 'Wetland Loss',
    description: 'Draining, dumping and urbanization encroaching on key marshlands and lake basins',
    color: '#a855f7',
    darkColor: '#9333ea',
    lightBg: '#faf5ff',
    borderColor: '#d8b4fe',
    sectorCount: 9,
  }
};

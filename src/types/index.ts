export type TopicCategory = 'mining' | 'deforestation' | 'construction' | 'sandmining' | 'wetland';
export type SatelliteSensorType = 'sentinel' | 'landsat';

export interface TopicInfo {
  id: TopicCategory;
  name: string;
  description: string;
  color: string;
  darkColor: string;
  lightBg: string;
  borderColor: string;
  sectorCount: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DetectionSector {
  id: string;
  title: string;
  category: TopicCategory;
  district: string;
  locationName: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // coordinates array
  areaHa: number;
  confidence: number; // 0-100
  isDemo: boolean;
  acquisitionDates: {
    before: string; // e.g. "2024-01-12"
    after: string;  // e.g. "2024-08-28"
  };
  changeType: string;
  sensor: string; // e.g. "Sentinel-2 MSI 10m"
  resolution: string; // "10m spatial resolution"
  images: {
    beforeUrl: string;
    afterUrl: string;
    maskUrl: string;
    annotatedUrl?: string;
    comparisonUrl?: string;
    aerialBeforeUrl?: string;
    aerialAfterUrl?: string;
    aerialMaskUrl?: string;
  };
  status: 'active' | 'under_review' | 'verified' | 'resolved';
  description: string;
}

export interface DistrictInfo {
  name: string;
  code: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  detectionCount: number;
  hasDemoSector?: boolean;
}

export interface AnalysisPipelineStage {
  stage: number;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  detail: string;
}

export interface DataSensorSource {
  name: string;
  constellation: string;
  resolution: string;
  revisitDays: string;
  status: 'active' | 'available' | 'offline';
  description: string;
}

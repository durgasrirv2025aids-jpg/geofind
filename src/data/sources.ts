import { DataSensorSource } from '@/types';

export const SENTINEL_SOURCE: DataSensorSource = {
  name: 'Copernicus Sentinel-2 MSI',
  constellation: 'European Space Agency (ESA) Sentinel Constellation',
  resolution: '10 m Spatial Resolution (RGB, NIR, SWIR)',
  revisitDays: '5 Days Revisit Cycle',
  status: 'active',
  description: 'Primary operational multispectral baseline for optical land-cover change detection and vegetation index differencing across Tamil Nadu.'
};

export const LANDSAT_SOURCE: DataSensorSource = {
  name: 'USGS Landsat-9 OLI-2',
  constellation: 'USGS / NASA Landsat Program',
  resolution: '15 m Pan-Sharpened / 30 m Multispectral',
  revisitDays: '8 Days Revisit Cycle',
  status: 'available',
  description: 'Secondary operational satellite constellation for long-term historical trend analysis, pan-sharpened land-cover mapping, and thermal surface validation.'
};

export const ACTIVE_SOURCE = SENTINEL_SOURCE;

export const AVAILABLE_SOURCES: DataSensorSource[] = [
  SENTINEL_SOURCE,
  LANDSAT_SOURCE,
  {
    name: 'PlanetScope SuperDove (Connected API)',
    constellation: 'Planet Labs Daily Fleet',
    resolution: '3.0 m High-Resolution Daily Optical',
    revisitDays: 'Daily Orbital Pass',
    status: 'available',
    description: 'Commercial micro-constellation API connection enabled for target site verification.'
  }
];

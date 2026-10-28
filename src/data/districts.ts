import { DistrictInfo } from '@/types';

export const TAMIL_NADU_BOUNDS: [[number, number], [number, number]] = [
  [8.0, 76.0],  // Southwest bound
  [13.5, 80.5]  // Northeast bound
];

export const DISTRICTS: DistrictInfo[] = [
  { name: 'Salem', code: 'SLM', center: [11.6643, 78.1460], bounds: [[11.45, 77.9], [11.9, 78.4]], detectionCount: 4, hasDemoSector: true },
  { name: 'Nilgiris', code: 'NLG', center: [11.4916, 76.7337], bounds: [[11.2, 76.4], [11.7, 77.0]], detectionCount: 5, hasDemoSector: true },
  { name: 'Chennai Periphery', code: 'CHN', center: [13.0827, 80.2707], bounds: [[12.9, 80.0], [13.25, 80.35]], detectionCount: 7, hasDemoSector: true },
  { name: 'Cauvery Riverbed (Trichy)', code: 'CAU', center: [10.8505, 78.6990], bounds: [[10.7, 78.5], [11.0, 78.9]], detectionCount: 3, hasDemoSector: true },
  { name: 'Pallikaranai Marsh', code: 'PLK', center: [12.9348, 80.2137], bounds: [[12.90, 80.18], [12.97, 80.24]], detectionCount: 2, hasDemoSector: true },
  { name: 'Coimbatore', code: 'CBE', center: [11.0168, 76.9558], bounds: [[10.8, 76.7], [11.2, 77.2]], detectionCount: 3 },
  { name: 'Madurai', code: 'MDU', center: [9.9252, 78.1198], bounds: [[9.7, 77.9], [10.1, 78.3]], detectionCount: 4 },
  { name: 'Tiruchirappalli', code: 'TPJ', center: [10.7905, 78.7047], bounds: [[10.6, 78.5], [11.0, 78.9]], detectionCount: 2 },
  { name: 'Kanchipuram', code: 'KPM', center: [12.8342, 79.7036], bounds: [[12.6, 79.5], [13.0, 79.9]], detectionCount: 5 },
  { name: 'Cuddalore', code: 'CDL', center: [11.7480, 79.7714], bounds: [[11.5, 79.5], [11.9, 80.0]], detectionCount: 3 },
  { name: 'Erode', code: 'ERD', center: [11.3410, 77.7172], bounds: [[11.1, 77.4], [11.6, 77.9]], detectionCount: 2 },
  { name: 'Tirunelveli', code: 'TNV', center: [8.7139, 77.7567], bounds: [[8.5, 77.5], [8.9, 78.0]], detectionCount: 3 },
  { name: 'Vellore', code: 'VLR', center: [12.9165, 79.1325], bounds: [[12.7, 78.9], [13.1, 79.4]], detectionCount: 4 },
  { name: 'Thanjavur', code: 'TJV', center: [10.7870, 79.1378], bounds: [[10.5, 78.9], [11.0, 79.4]], detectionCount: 2 },
  { name: 'Dindigul', code: 'DGL', center: [10.3673, 77.9803], bounds: [[10.1, 77.7], [10.6, 78.2]], detectionCount: 3 },
  { name: 'Kanyakumari', code: 'KKM', center: [8.0883, 77.5385], bounds: [[8.0, 77.3], [8.3, 77.7]], detectionCount: 1 },
  { name: 'Tuticorin (Thoothukudi)', code: 'TUT', center: [8.7642, 78.1348], bounds: [[8.5, 77.9], [9.0, 78.3]], detectionCount: 3 },
  { name: 'Ramanathapuram', code: 'RMD', center: [9.3639, 78.8395], bounds: [[9.1, 78.5], [9.6, 79.2]], detectionCount: 2 },
  { name: 'Villupuram', code: 'VPM', center: [11.9401, 79.4861], bounds: [[11.7, 79.2], [12.2, 79.8]], detectionCount: 3 },
  { name: 'Tiruppur', code: 'TPR', center: [11.1085, 77.3411], bounds: [[10.9, 77.1], [11.3, 77.6]], detectionCount: 2 },
];

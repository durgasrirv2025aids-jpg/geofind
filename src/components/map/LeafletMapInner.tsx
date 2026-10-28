import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DetectionSector, TopicCategory } from '@/types';
import { TOPICS } from '@/data/topics';
import { TAMIL_NADU_BOUNDS } from '@/data/districts';

interface LeafletMapInnerProps {
  sectors: DetectionSector[];
  selectedSector: DetectionSector | null;
  onSelectSector: (sector: DetectionSector) => void;
  onNavigateToAnalysis: (sector: DetectionSector) => void;
  onNavigateToEvidence: (sector: DetectionSector) => void;
  filterCategory?: TopicCategory | 'all';
  focusCenter?: [number, number] | null;
}

export const LeafletMapInner: React.FC<LeafletMapInnerProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  onNavigateToAnalysis,
  onNavigateToEvidence,
  filterCategory = 'all',
  focusCenter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<L.Polygon[]>([]);
  const markerLayersRef = useRef<L.Marker[]>([]);
  const sectorMarkersRef = useRef<Record<string, L.Marker>>({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Bounds for Tamil Nadu
    const bounds = L.latLngBounds(
      L.latLng(TAMIL_NADU_BOUNDS[0][0], TAMIL_NADU_BOUNDS[0][1]),
      L.latLng(TAMIL_NADU_BOUNDS[1][0], TAMIL_NADU_BOUNDS[1][1])
    );

    const map = L.map(mapContainerRef.current, {
      center: [11.1271, 78.6569], // Central Tamil Nadu
      zoom: 7,
      minZoom: 6,
      maxZoom: 17,
      maxBounds: bounds,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
    });

    // High quality Satellite tile layer (Esri World Imagery)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics | Tamil Nadu Baseline',
        maxZoom: 18,
      }
    ).addTo(map);

    // Zoom control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Auto-fit map bounds when filterCategory changes to show ALL defect sectors across Tamil Nadu
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (filterCategory !== 'all') {
      const catSectors = sectors.filter((s) => s.category === filterCategory);
      if (catSectors.length > 0) {
        const bounds = L.latLngBounds(catSectors.map((s) => s.center as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10, animate: true });
      }
    } else if (sectors.length > 0) {
      const bounds = L.latLngBounds(sectors.map((s) => s.center as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8, animate: true });
    }
  }, [filterCategory, sectors]);

  // Update center when a single focusCenter is explicitly specified
  useEffect(() => {
    if (mapInstanceRef.current && focusCenter) {
      mapInstanceRef.current.flyTo(focusCenter, 13, { duration: 1.2 });
    }
  }, [focusCenter]);

  // Render Sectors as Polygons AND Custom Colored Pin Markers (only when filterCategory or sectors list changes)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing polygon and marker layers
    polygonLayersRef.current.forEach((layer) => layer.remove());
    polygonLayersRef.current = [];
    markerLayersRef.current.forEach((layer) => layer.remove());
    markerLayersRef.current = [];
    sectorMarkersRef.current = {};

    const filtered = filterCategory === 'all' 
      ? sectors 
      : sectors.filter(s => s.category === filterCategory);

    filtered.forEach((sector) => {
      const topic = TOPICS[sector.category];
      const color = topic ? topic.color : '#ef4444';

      // 1. Polygon Layer
      const polygon = L.polygon(sector.polygon as [number, number][], {
        color: color,
        weight: 2.5,
        fillColor: color,
        fillOpacity: 0.4,
        dashArray: '4, 4',
      }).addTo(map);

      // 2. Custom Colored Pin Marker (L.divIcon)
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="custom-map-pin" style="--pin-color: ${color};">
            <div class="pin-label-pill" style="background-color: ${color};">
              <span>${topic?.name || sector.category}</span>
            </div>
            <div class="pin-pulse-aura"></div>
            <div class="pin-head-ring"></div>
          </div>
        `,
        iconSize: [120, 60],
        iconAnchor: [60, 50],
        popupAnchor: [0, -50],
      });

      const marker = L.marker(sector.center as [number, number], {
        icon: customIcon,
        zIndexOffset: 100,
      }).addTo(map);

      // Popup content HTML with compact layout and 2 direct action buttons
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; min-width: 250px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background-color: ${color}; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
              ${topic?.name || sector.category}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #94a3b8;">
              ${sector.district}
            </span>
          </div>

          <div style="font-weight: 800; font-size: 13px; color: #f8fafc; margin-bottom: 4px;">
            ${sector.locationName}
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px; border-top: 1px solid #334155; border-bottom: 1px solid #334155; padding: 6px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #94a3b8;">Confidence Score:</span>
              <strong style="color: #fbbf24;">${sector.confidence}% <span style="font-weight: normal; color: #34d399; font-size: 10px;">(Verified)</span></strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #94a3b8;">Area Affected:</span>
              <strong style="color: #34d399;">${sector.areaHa} ha</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #94a3b8;">Acquisition Dates:</span>
              <strong style="color: #e2e8f0;">${sector.acquisitionDates.before} → ${sector.acquisitionDates.after}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Detection Type:</span>
              <strong style="color: #38bdf8;">${sector.changeType}</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button id="btn-analysis-${sector.id}" style="background-color: #059669; color: #ffffff; border: none; padding: 7px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
              View Change Analysis
            </button>
            <button id="btn-evidence-${sector.id}" style="background-color: #334155; color: #ffffff; border: none; padding: 7px 4px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
              View Evidence
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });
      polygon.bindPopup(popupHtml, { maxWidth: 300 });

      const handleSelect = () => {
        onSelectSector(sector);
      };

      marker.on('click', handleSelect);
      polygon.on('click', handleSelect);

      const attachPopupListeners = () => {
        setTimeout(() => {
          const btnAnalysis = document.getElementById(`btn-analysis-${sector.id}`);
          const btnEvidence = document.getElementById(`btn-evidence-${sector.id}`);

          if (btnAnalysis) {
            btnAnalysis.onclick = () => onNavigateToAnalysis(sector);
          }
          if (btnEvidence) {
            btnEvidence.onclick = () => onNavigateToEvidence(sector);
          }
        }, 50);
      };

      marker.on('popupopen', attachPopupListeners);
      polygon.on('popupopen', attachPopupListeners);

      polygonLayersRef.current.push(polygon);
      markerLayersRef.current.push(marker);
      sectorMarkersRef.current[sector.id] = marker;
    });
  }, [sectors, filterCategory]);

  // Open popup when selectedSector changes without re-creating all layers
  useEffect(() => {
    if (selectedSector && sectorMarkersRef.current[selectedSector.id]) {
      const marker = sectorMarkersRef.current[selectedSector.id];
      setTimeout(() => {
        marker.openPopup();
      }, 150);
    }
  }, [selectedSector]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800"
      style={{ minHeight: '500px' }}
    />
  );
};


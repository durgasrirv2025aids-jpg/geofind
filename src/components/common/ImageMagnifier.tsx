import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  className?: string;
  zoomLevel?: number;
  magnifierSize?: number;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  className = '',
  zoomLevel = 2.5,
  magnifierSize = 160,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    setCursorPos({ x, y });

    // Calculate background position percentage
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setPosition({ x: bgX, y: bgY });
  };

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />

      {/* Floating Loupe Magnifier */}
      {showMagnifier && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-emerald-400 shadow-2xl z-50 bg-no-repeat overflow-hidden"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            top: `${cursorPos.y - magnifierSize / 2}px`,
            left: `${cursorPos.x - magnifierSize / 2}px`,
            backgroundImage: `url('${src}')`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Crosshair indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-emerald-400 opacity-60"></div>
            <div className="h-3 w-0.5 bg-emerald-400 opacity-60"></div>
          </div>
          <div className="absolute bottom-1 right-3 text-[9px] font-mono font-bold text-emerald-300 bg-slate-900/80 px-1 rounded">
            {zoomLevel}x ZOOM
          </div>
        </div>
      )}

      {/* Hover hint badge */}
      <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[11px] font-bold pointer-events-none flex items-center space-x-1.5 border border-slate-700">
        <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
        <span>Hover for Ultra-Zoom Inspection</span>
      </div>
    </div>
  );
};

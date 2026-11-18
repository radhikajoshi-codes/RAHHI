import React, { useState, useEffect } from 'react';
import { Compass, RotateCw, Sparkles } from 'lucide-react';
import { playBeaconPing } from '../utils/audio';

export default function RealisticCompass({ headingDegrees = 72, headingText = 'ENE · 072°', onCalibrate = null }) {
  const [currentHeading, setCurrentHeading] = useState(headingDegrees);
  const [isRotating, setIsRotating] = useState(false);

  // Subtle natural compass drift for realistic physical feel
  useEffect(() => {
    const interval = setInterval(() => {
      // Small +/- 1 degree jitter like real magnetic gimbal
      const drift = (Math.random() - 0.5) * 1.5;
      setCurrentHeading((prev) => Math.round((prev + drift + 360) % 360));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleManualCalibrate = () => {
    playBeaconPing();
    setIsRotating(true);
    setCurrentHeading((prev) => (prev + 45) % 360);
    setTimeout(() => setIsRotating(false), 600);
    if (onCalibrate) onCalibrate();
  };

  // Cardinal directions calculation
  const getCardinal = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none group">
      {/* 3D Realistic Compass Housing */}
      <div
        onClick={handleManualCalibrate}
        className="relative w-48 h-48 md:w-56 md:h-56 rounded-full cursor-pointer transition-transform active:scale-95 duration-200"
        title="Interactive 3D Compass · Click to calibrate heading"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #334155 0%, #1E293B 65%, #0F172A 100%)',
          boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -4px 8px rgba(0, 0, 0, 0.6), 0 0 0 6px #F1F5F9, 0 0 0 8px #CBD5E1',
        }}
      >
        {/* Outer Milled Metallic Bezel Ring with Degree Ticks */}
        <div className="absolute inset-1.5 rounded-full border border-slate-600/60 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Glass Dome Specular Reflection Overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, rgba(0, 0, 0, 0.15) 55%, transparent 100%)',
            }}
          />

          {/* Rotating Compass Rose Dial */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full transition-transform duration-700 ease-out"
            style={{
              transform: `rotate(${-currentHeading}deg)`,
            }}
          >
            {/* Compass Dial Face Gradients */}
            <defs>
              <radialGradient id="compassFace" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="85%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <linearGradient id="needleNorth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>
              <linearGradient id="needleSouth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Inner Dark Dial Plate */}
            <circle cx="100" cy="100" r="92" fill="url(#compassFace)" stroke="#334155" strokeWidth="1" />

            {/* Outer Degree Track Circle */}
            <circle cx="100" cy="100" r="84" fill="none" stroke="#475569" strokeWidth="0.8" strokeDasharray="1 2" />

            {/* Degree Ticks: 36 ticks around dial */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = i * 10;
              const isMajor = angle % 30 === 0;
              const isCardinal = angle % 90 === 0;
              const length = isCardinal ? 8 : isMajor ? 6 : 3.5;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 82 * Math.sin(rad);
              const y1 = 100 - 82 * Math.cos(rad);
              const x2 = 100 + (82 - length) * Math.sin(rad);
              const y2 = 100 - (82 - length) * Math.cos(rad);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isCardinal ? '#F43F5E' : isMajor ? '#E2E8F0' : '#64748B'}
                  strokeWidth={isCardinal ? '2' : isMajor ? '1.5' : '0.8'}
                />
              );
            })}

            {/* Degree Numbers for 30 deg increments */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              if (deg % 90 === 0) return null; // handled by cardinal letters
              const rad = (deg * Math.PI) / 180;
              const x = 100 + 68 * Math.sin(rad);
              const y = 100 - 68 * Math.cos(rad);
              return (
                <text
                  key={deg}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94A3B8"
                  fontSize="6.5"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {deg}
                </text>
              );
            })}

            {/* Cardinal Letters */}
            {/* North */}
            <text
              x="100"
              y="32"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#F43F5E"
              fontSize="12"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              N
            </text>
            {/* East */}
            <text
              x="168"
              y="100"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#F8FAFC"
              fontSize="11"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              E
            </text>
            {/* South */}
            <text
              x="100"
              y="168"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#F8FAFC"
              fontSize="11"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              S
            </text>
            {/* West */}
            <text
              x="32"
              y="100"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#F8FAFC"
              fontSize="11"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              W
            </text>

            {/* Intercardinal Labels */}
            <text x="142" y="58" textAnchor="middle" dominantBaseline="central" fill="#64748B" fontSize="6.5" fontWeight="700">NE</text>
            <text x="142" y="142" textAnchor="middle" dominantBaseline="central" fill="#64748B" fontSize="6.5" fontWeight="700">SE</text>
            <text x="58" y="142" textAnchor="middle" dominantBaseline="central" fill="#64748B" fontSize="6.5" fontWeight="700">SW</text>
            <text x="58" y="58" textAnchor="middle" dominantBaseline="central" fill="#64748B" fontSize="6.5" fontWeight="700">NW</text>

            {/* Delicate crosshairs */}
            <line x1="100" y1="40" x2="100" y2="160" stroke="#334155" strokeWidth="0.6" strokeDasharray="2 2" />
            <line x1="40" y1="100" x2="160" y2="100" stroke="#334155" strokeWidth="0.6" strokeDasharray="2 2" />
          </svg>

          {/* Magnetic Needle (Always Points North Upward relative to dial rotation) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45))',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* North Needle (Red facet) */}
              <polygon points="100,28 107,96 100,90" fill="#FB7185" />
              <polygon points="100,28 93,96 100,90" fill="#E11D48" />

              {/* South Needle (Silver/Slate facet) */}
              <polygon points="100,172 107,104 100,110" fill="#CBD5E1" />
              <polygon points="100,172 93,104 100,110" fill="#94A3B8" />

              {/* Luminous Center Pin & Brass Pivot Cap */}
              <circle cx="100" cy="100" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="4" fill="#FEF3C7" />
              <circle cx="98" cy="98" r="1.5" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        {/* Top Fixed Heading Indicator Pip */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-400 rotate-45 rounded-xs shadow-md z-30" />
      </div>

      {/* Realistic Digital Readout Badge */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-mono text-xs font-black tracking-wide text-teal-300">
            {String(currentHeading).padStart(3, '0')}° {getCardinal(currentHeading)}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold border-l border-slate-700 pl-2">
            IMU Sensor Rig
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-1">
          Click compass dial to recalibrate heading
        </p>
      </div>
    </div>
  );
}

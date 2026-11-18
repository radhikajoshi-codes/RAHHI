import React, { useState } from 'react';
import { ROOMS_DATA } from '../data/campusData';
import { Ban, Users, AlertTriangle, Package, Flag, Navigation } from 'lucide-react';

export default function CampusMap({
  mode = 'navigate', // 'navigate' | 'hazards' | 'before' | 'after' | 'compact'
  routePolyline = [],
  activeHazards = [],
  currentPosition = { x: 60, y: 255 },
  destination = 'central_library',
  onSelectDestination = null,
  showLabels = true,
  height = 420,
}) {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // SVG coordinate bounds
  const viewBoxWidth = 1040;
  const viewBoxHeight = 480;

  // Determine path string for SVG polyline/path
  const pathD = routePolyline.length > 0
    ? routePolyline.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '')
    : '';

  // Separate styling based on mode
  const isBefore = mode === 'before';
  const isAfter = mode === 'after';
  const isHazardView = mode === 'hazards';

  return (
    <div className="relative w-full bg-white rounded-2xl border border-pink-100 shadow-sm p-4 overflow-hidden select-none">
      {/* Top floor indicator & legend */}
      {showLabels && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-pink-400"></span>
            <span className="font-bold text-slate-800 text-sm">Block A · Floor 1</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-1.5 rounded-full ${isBefore ? 'bg-red-400' : 'bg-teal-400'}`}></span>
              <span>{isBefore ? 'Blocked Route' : 'Route'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-teal-100"></span>
              <span>You</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Destination</span>
            </span>
            {isHazardView && (
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>Active Hazards</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* SVG Canvas Map */}
      <div className="w-full flex items-center justify-center">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto max-h-[460px] drop-shadow-sm transition-all duration-300"
          style={{ maxHeight: height }}
        >
          {/* Defs for gradients, patterns and glow filters */}
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            <linearGradient id="blockedRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background campus grid plate */}
          <rect
            x="10"
            y="10"
            width={viewBoxWidth - 20}
            height={viewBoxHeight - 20}
            rx="18"
            fill="#FAFBFD"
            stroke="#F1F5F9"
            strokeWidth="1.5"
          />

          {/* Main Corridor background guide */}
          <rect
            x="30"
            y="230"
            width="970"
            height="50"
            rx="8"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="390"
            y="259"
            fill="#94A3B8"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.5"
          >
            Main Corridor
          </text>

          {/* Corridor B guide */}
          <rect
            x="525"
            y="30"
            width="40"
            height="200"
            rx="6"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="546"
            y="170"
            fill="#94A3B8"
            fontSize="10"
            fontWeight="600"
            transform="rotate(-90, 546, 170)"
            letterSpacing="0.5"
          >
            Corridor B
          </text>

          {/* ROOMS */}
          {ROOMS_DATA.map((room) => {
            const isDestination = destination === room.id || (room.id === 'central_library' && !destination);
            const isHovered = hoveredRoom === room.id;

            // Highlight Lab 102 specifically in after view as passage
            const isPassageHighlight = (isAfter || mode === 'rerouting') && room.id === 'lab_102';

            return (
              <g
                key={room.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => onSelectDestination && onSelectDestination(room.id)}
              >
                {/* Room Rectangle */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  rx="14"
                  fill={
                    isPassageHighlight
                      ? '#E6F7F5'
                      : room.bgColor || '#FDF2F4'
                  }
                  stroke={
                    isDestination
                      ? '#14B8A6'
                      : isPassageHighlight
                      ? '#0D9488'
                      : isHovered
                      ? '#CBD5E1'
                      : room.borderColor || '#FBCFE8'
                  }
                  strokeWidth={isDestination || isPassageHighlight ? '2.5' : '1.5'}
                  strokeDasharray={isPassageHighlight ? '5 3' : 'none'}
                  className="transition-colors duration-200"
                />

                {/* Room Label */}
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2 - (room.id === 'lab_102' && isPassageHighlight ? 6 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={room.textColor || (isDestination ? '#0D9488' : '#334155')}
                  fontSize={room.id === 'lift' || room.id === 'stairs' ? '12' : '13'}
                  fontWeight="700"
                >
                  {isPassageHighlight ? 'Lab 102 (passage)' : room.name}
                </text>

                {/* Subtitle for Central Library */}
                {room.id === 'central_library' && (
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 + 18}
                    textAnchor="middle"
                    fill="#0D9488"
                    fontSize="10"
                    fontWeight="500"
                  >
                    Main Collection
                  </text>
                )}

                {/* Door / Entrance Indicator Dot */}
                {room.door && (
                  <circle
                    cx={room.door.x}
                    cy={room.door.y}
                    r="3.5"
                    fill="#94A3B8"
                  />
                )}
              </g>
            );
          })}

          {/* Special Transit icons for Lift and Stairs */}
          {/* LIFT Icon */}
          <g transform="translate(822, 342)" pointerEvents="none">
            <rect x="0" y="0" width="20" height="20" rx="3" fill="none" />
            <path
              d="M3 4h14v12H3z M7 13l3-3 3 3 M10 7v6"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* STAIRS Icon */}
          <g transform="translate(915, 342)" pointerEvents="none">
            <path
              d="M3 15h3v-3h3v-3h3v-3h3"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* ROUTE POLYLINE RENDERING */}
          {pathD && (
            <g>
              {/* Route shadow / glow */}
              <path
                d={pathD}
                fill="none"
                stroke={isBefore ? '#FCA5A5' : '#99F6E4'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />

              {/* Main dashed navigation line */}
              <path
                d={pathD}
                fill="none"
                stroke={isBefore ? 'url(#blockedRouteGradient)' : 'url(#routeGradient)'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isBefore ? '8 6' : '10 7'}
                className="animate-[dash_20s_linear_infinite]"
              />

              {/* Waypoint circles along the path */}
              {routePolyline.map((pt, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill={isBefore ? '#EF4444' : '#14B8A6'}
                />
              ))}
            </g>
          )}

          {/* HAZARD MAP OVERLAYS & MARKERS */}
          {(isHazardView || isBefore || isAfter) && (
            <g>
              {/* 1. Blocked Corridor B marker */}
              <g transform="translate(515, 180)">
                {/* Red pulsing danger wave */}
                <circle cx="15" cy="15" r="20" fill="#EF4444" opacity="0.2" className="animate-ping" />
                <rect x="0" y="0" width="30" height="30" rx="8" fill="#EF4444" filter="url(#glow)" />
                <line x1="8" y1="8" x2="22" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="8" x2="8" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>

              {/* In Hazard view: show crowd, obstacle, and stair notices */}
              {isHazardView && (
                <>
                  {/* Crowded zone label */}
                  <g transform="translate(250, 240)">
                    <rect x="0" y="0" width="85" height="22" rx="11" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                    <circle cx="10" cy="11" r="4" fill="#D97706" />
                    <text x="20" y="15" fill="#92400E" fontSize="9" fontWeight="700">
                      Crowded
                    </text>
                  </g>

                  {/* Floor obstacle: Unattended bag */}
                  <g transform="translate(130, 242)">
                    <rect x="0" y="0" width="45" height="18" rx="9" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" />
                    <text x="22" y="13" textAnchor="middle" fill="#9A3412" fontSize="9" fontWeight="700">
                      Bag
                    </text>
                  </g>

                  {/* Warning icon near stairs */}
                  <g transform="translate(865, 275)">
                    <circle cx="8" cy="8" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                    <text x="8" y="12" textAnchor="middle" fill="#D97706" fontSize="11" fontWeight="800">
                      !
                    </text>
                  </g>

                  {/* Caution icon near auditorium */}
                  <g transform="translate(485, 275)">
                    <circle cx="8" cy="8" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                    <text x="8" y="12" textAnchor="middle" fill="#D97706" fontSize="11" fontWeight="800">
                      !
                    </text>
                  </g>
                </>
              )}
            </g>
          )}

          {/* USER CURRENT POSITION MARKER ("You are here") */}
          <g transform={`translate(${currentPosition.x}, ${currentPosition.y})`}>
            {/* Pulsing ring */}
            <circle cx="0" cy="0" r="16" fill="#14B8A6" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="10" fill="#14B8A6" opacity="0.4" />
            <circle cx="0" cy="0" r="7" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

            {/* Label pill "You are here" */}
            <g transform="translate(-38, 16)">
              <rect x="0" y="0" width="76" height="18" rx="9" fill="#0F172A" opacity="0.9" />
              <text x="38" y="12" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="600">
                You are here
              </text>
            </g>
          </g>

          {/* DESTINATION MARKER (Central Library Flag) */}
          <g transform="translate(565, 140)">
            <circle cx="0" cy="0" r="12" fill="#F43F5E" opacity="0.2" className="animate-pulse" />
            <rect x="-10" y="-10" width="20" height="20" rx="6" fill="#F43F5E" />
            {/* Flag glyph */}
            <path
              d="M-4 6V-6l8 3-8 3"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>

      {/* Interactive room quick selector pills underneath */}
      {showLabels && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Click any room on map to set route</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Target:</span>
            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-medium border border-teal-200">
              Central Library (Tag #A1-012)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import {
  Ban,
  Users,
  TrendingDown,
  Package,
  ArrowRight,
  GitFork,
  Radio,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import CampusMap from '../CampusMap';

export default function HazardsView({
  hazards,
  onReroute,
  onOpenReportModal,
}) {
  const criticalHazard = hazards.find((h) => h.severity === 'CRITICAL') || hazards[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <p className="text-xs font-bold text-rose-600 tracking-wide">
            Live hazard scanning · {hazards.filter((h) => h.active).length} alerts on your route
          </p>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Hazard Detection
        </h1>
      </div>

      {/* Top Critical Alert Banner matching reference image */}
      <div className="bg-[#DC2626] rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
            <Ban className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-widest uppercase text-red-200">
              CRITICAL · {criticalHazard.distanceAhead || 18} M AHEAD
            </div>
            <h2 className="text-2xl font-black mt-1">
              {criticalHazard.location} is blocked
            </h2>
            <p className="text-sm font-medium text-red-100 mt-1 max-w-xl">
              {criticalHazard.description}
            </p>
          </div>
        </div>

        <button
          onClick={onReroute}
          className="self-start md:self-auto px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-all flex items-center gap-2 shrink-0 shadow-md active:scale-95"
        >
          <span>Find safe route</span>
          <ArrowRight className="w-4 h-4 text-slate-900" />
        </button>
      </div>

      {/* Grid: Hazard Map (left 7 cols) & Hazard cards list (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hazard Map with visual annotations */}
        <div className="lg:col-span-7 space-y-3">
          <CampusMap
            mode="hazards"
            routePolyline={[
              { id: 'n_start', x: 60, y: 255 },
              { id: 'n_bag_obstacle', x: 140, y: 255 },
              { id: 'n_canteen_junc', x: 200, y: 255 },
              { id: 'n_crowd_zone', x: 310, y: 255 },
              { id: 'n_corridor_b_junc', x: 530, y: 255 },
              { id: 'n_corridor_b_hazard', x: 530, y: 195 },
            ]}
            activeHazards={hazards}
            destination="central_library"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Red cross marks Corridor B blockage</span>
            <button
              onClick={onOpenReportModal}
              className="text-teal-700 font-bold flex items-center gap-1 hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report custom hazard</span>
            </button>
          </div>
        </div>

        {/* Right: 4 Hazard Cards & Recommended Reroute Card */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* 1. Blocked corridor card */}
          <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Blocked corridor
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Corridor B · 18 m ahead · Wet floor
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 uppercase">
              Critical
            </span>
          </div>

          {/* 2. Crowded corridor card */}
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Crowded corridor
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Main Corridor · ~35 people · Class change
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase">
              Moderate
            </span>
          </div>

          {/* 3. Stairs nearby card */}
          <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Stairs nearby
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Down steps 12 m to your right
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 uppercase">
              Caution
            </span>
          </div>

          {/* 4. Obstacle on floor card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Obstacle on floor
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Unattended bag · 4 m ahead · left side
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
              Low
            </span>
          </div>

          {/* RECOMMENDED ACTION CARD matching reference */}
          <div className="mt-4 rounded-3xl p-5 bg-[#E6F7F5] border-2 border-teal-300 shadow-sm space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span>Recommended</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Take the Lab 102 passage
              </h3>
              <p className="text-xs text-teal-800 font-bold mt-0.5">
                +14 m · +20 s · Clear and uncrowded
              </p>
            </div>

            <button
              onClick={onReroute}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#00BFA5] hover:bg-[#00A896] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 active:scale-98 transition-all"
            >
              <span>Reroute me</span>
              <GitFork className="w-4 h-4 rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

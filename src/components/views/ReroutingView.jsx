import React from 'react';
import {
  CheckCircle2,
  Ban,
  Users,
  ArrowRight,
  Volume2,
  GitFork,
  Clock,
  Navigation,
} from 'lucide-react';
import CampusMap from '../CampusMap';

export default function ReroutingView({
  comparison,
  onAcceptRoute,
  onPlayAnnouncement,
}) {
  const { original, rerouted, calculationTime, deltaMeters, deltaSeconds, reasons, voiceAnnouncement } =
    comparison;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>New route calculated in {calculationTime || '0.8 s'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Route updated for your safety
        </h1>
      </div>

      {/* Side-by-side Before & After Route Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE CARD: Original Route */}
        <div className="bg-white rounded-3xl border border-rose-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Before · Original route
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                <Ban className="w-3 h-3" />
                <span>Blocked</span>
              </span>
            </div>

            {/* Before Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
              <CampusMap
                mode="before"
                routePolyline={original.polyline}
                showLabels={false}
                height={230}
              />
            </div>
          </div>

          {/* Bottom stats for Before */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 mt-4 text-sm font-semibold text-slate-600">
            <div>
              <span className="font-extrabold text-slate-900 text-base">
                {original.distanceMeters} m
              </span>{' '}
              <span className="text-xs text-slate-400">distance</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="font-extrabold text-slate-900 text-base">
                {original.walkingTimeFormatted}
              </span>{' '}
              <span className="text-xs text-slate-400">time</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD: Safe Route */}
        <div className="bg-white rounded-3xl border-2 border-teal-300 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                After · Safe route
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                <span>Clear</span>
              </span>
            </div>

            {/* After Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 bg-teal-50/20">
              <CampusMap
                mode="after"
                routePolyline={rerouted.polyline}
                showLabels={false}
                height={230}
              />
            </div>
          </div>

          {/* Bottom stats for After */}
          <div className="flex items-center gap-6 pt-4 border-t border-teal-100 mt-4 text-sm font-semibold">
            <div>
              <span className="font-extrabold text-teal-800 text-base">
                {rerouted.distanceMeters} m
              </span>{' '}
              <span className="text-xs font-bold text-teal-600">
                (+{deltaMeters} m)
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <span className="font-extrabold text-teal-800 text-base">
                {rerouted.walkingTimeFormatted}
              </span>{' '}
              <span className="text-xs font-bold text-teal-600">
                (+{deltaSeconds} s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Why Did Route Change? (left 7 cols) & Voice Announcement Card (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Why did your route change? card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
              i
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Why did your route change?
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mt-0.5 shrink-0">
                <Ban className="w-3.5 h-3.5" />
              </div>
              <p>
                <strong className="text-slate-900">Corridor B is closed</strong> for floor cleaning with a wet floor, which is unsafe to walk on.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mt-0.5 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <p>
                The main corridor is crowded, so the new route avoids it after <strong className="text-slate-900">Lab 102</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p>
                The new route is flat, has no stairs, and is clear of obstacles.
              </p>
            </div>
          </div>
        </div>

        {/* Voice Announcement & Accept Action Card */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-gradient-to-br from-[#99F6E4]/70 via-[#CCFBF1]/50 to-[#FCE7F3]/70 border border-teal-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold tracking-wider text-teal-900 uppercase">
                Voice Announcement
              </span>
              <button
                onClick={onPlayAnnouncement}
                className="p-1.5 rounded-full bg-white text-teal-700 hover:bg-teal-50 transition-colors"
                title="Play voice announcement"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-lg font-black text-slate-900 leading-snug">
              {voiceAnnouncement}
            </p>
          </div>

          <div className="pt-5">
            <button
              onClick={onAcceptRoute}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <span>Accept &amp; continue</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

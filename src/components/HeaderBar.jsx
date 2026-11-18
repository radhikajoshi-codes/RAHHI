import React from 'react';
import {
  Menu,
  Radio,
  Volume2,
  VolumeX,
  PhoneCall,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

export default function HeaderBar({
  onToggleMobileMenu,
  onOpenSos,
  onOpenReportHazard,
  onLaunchDemo,
  soundEnabled,
  onToggleSound,
  beaconsCount = 3,
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FD]/90 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumb info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Kalpana Institute of Technology · Block A</span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Beacon Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-xs">
          <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span className="hidden md:inline">Beacons connected</span>
          <span className="text-[10px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded-full font-bold">
            {beaconsCount}
          </span>
        </div>

        {/* 1-Click Demo Scenario Pill */}
        <button
          onClick={onLaunchDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors shadow-xs"
          title="Run the automated hackathon demo flow"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden lg:inline">Demo Scenario</span>
        </button>

        {/* Report Hazard button */}
        <button
          onClick={onOpenReportHazard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-xs"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Report Hazard</span>
        </button>

        {/* Voice Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
            soundEnabled
              ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
          }`}
          title={soundEnabled ? 'Mute voice instructions' : 'Enable voice instructions'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-teal-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSos}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FCE8EB] hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs tracking-wide transition-transform active:scale-95 shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
}

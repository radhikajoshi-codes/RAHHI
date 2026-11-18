import React, { useState } from 'react';
import {
  Utensils,
  Bath,
  Building,
  UserCheck,
  Send,
  Compass,
  Radio,
  Volume2,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { ROOMS_DATA } from '../../data/campusData';

export default function HomeView({
  selectedDestination,
  onSelectDestination,
  onStartNavigation,
  onOpenSos,
  soundEnabled,
  onToggleSound,
  confidence = 94,
  currentLocationName = 'Main Entrance, Block A',
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const quickShortcuts = [
    { id: 'canteen', name: 'Canteen', icon: Utensils },
    { id: 'washrooms', name: 'Washroom', icon: Bath },
    { id: 'lift', name: 'Lift', icon: Building },
    { id: 'admin_office', name: 'Admin Office', icon: UserCheck },
  ];

  const currentDestObj =
    ROOMS_DATA.find((r) => r.id === selectedDestination) ||
    ROOMS_DATA.find((r) => r.id === 'central_library');

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-teal-600 tracking-wide uppercase">
            Your Indoor Navigation Companion
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Good morning, Aarav <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Where would you like to go today?
          </p>
        </div>

        {/* User profile & beacon badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            <span>Beacons connected</span>
          </div>

          <div className="w-10 h-10 rounded-full ring-2 ring-teal-500/30 overflow-hidden shadow-xs bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            <span>A</span>
          </div>
        </div>
      </div>

      {/* Hero Destination Selection Card */}
      <div className="bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full lg:max-w-xl space-y-5 z-10">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Choose destination
            </label>

            {/* Selector box with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-white hover:bg-slate-50/80 border-2 border-teal-200/90 rounded-2xl p-4 flex items-center justify-between transition-all shadow-xs text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {currentDestObj.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Block A · Floor 1 · {currentDestObj.distanceFromStart || 62} m away
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    dropdownOpen ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>

              {/* Dropdown Options List */}
              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase">
                    Campus Locations
                  </div>
                  {ROOMS_DATA.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        onSelectDestination(room.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                        selectedDestination === room.id
                          ? 'bg-teal-50 text-teal-800 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>{room.name}</span>
                        <span className="text-xs text-slate-400">({room.category})</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {room.distanceFromStart || 50} m
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Shortcut Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {quickShortcuts.map((item) => {
              const Icon = item.icon;
              const isCurrent = selectedDestination === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectDestination(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                      : 'bg-pink-50/60 hover:bg-pink-100/80 border-pink-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-rose-500" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Start Navigation Action Button */}
          <div className="pt-2">
            <button
              onClick={onStartNavigation}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-[#00BFA5] text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Send className="w-5 h-5 fill-white rotate-45" />
              <span>Start Navigation</span>
            </button>
          </div>
        </div>

        {/* Circular Radar / Wayfinding Compass Animation */}
        <div className="relative flex items-center justify-center p-6">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-dashed border-teal-300/60 flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
            <div className="w-36 h-36 rounded-full border border-pink-200 flex items-center justify-center bg-gradient-to-tr from-teal-50 via-rose-50 to-white" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-400 p-1 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Compass className="w-10 h-10 text-teal-600 animate-pulse-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Voice assistance */}
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-pink-100/70 text-rose-500 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>

            {/* Custom toggle switch */}
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-teal-500' : 'bg-slate-300'
              }`}
              aria-label="Toggle voice"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm">Voice assistance</h4>
            <p className="text-xs text-teal-600 font-semibold mt-0.5">
              {soundEnabled ? 'Active · English (India)' : 'Paused / Muted'}
            </p>
          </div>

          {/* Equalizer Wave simulation */}
          <div className="flex items-end gap-1 h-6 mt-4">
            <span className="w-1.5 bg-teal-400 rounded-full h-3 animate-pulse" />
            <span className="w-1.5 bg-teal-500 rounded-full h-5 animate-pulse" />
            <span className="w-1.5 bg-teal-600 rounded-full h-4 animate-pulse" />
            <span className="w-1.5 bg-teal-400 rounded-full h-6 animate-pulse" />
            <span className="w-1.5 bg-teal-300 rounded-full h-2 animate-pulse" />
            <span className="w-1.5 bg-teal-500 rounded-full h-4 animate-pulse" />
          </div>
        </div>

        {/* Card 2: Current location */}
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Live
            </span>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm">Current location</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentLocationName}
            </p>
          </div>

          {/* Confidence Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Location confidence</span>
              <span className="font-bold text-teal-700">{confidence}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-rose-400 transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Emergency assistance */}
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              24/7 Security
            </span>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm">Emergency assistance</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Alerts campus security and shares your live location.
            </p>
          </div>

          {/* SOS button */}
          <div className="mt-4">
            <button
              onClick={onOpenSos}
              className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md shadow-rose-500/25 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-white" />
              <span>SOS · Get Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

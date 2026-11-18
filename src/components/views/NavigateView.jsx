import React, { useState } from 'react';
import {
  ArrowUp,
  CornerUpLeft,
  DoorOpen,
  RotateCcw,
  Pause,
  Play,
  AlertTriangle,
  PhoneCall,
  Volume2,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import CampusMap from '../CampusMap';
import { speakText, stopSpeech } from '../../utils/audio';

export default function NavigateView({
  route,
  onOpenSos,
  onTriggerHazardAlert,
  onRepeatInstruction,
  soundEnabled = true,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const instructions = route?.instructions || [
    {
      step: 1,
      distance: 35,
      text: 'Walk straight along the main corridor, then turn left at Corridor B.',
      icon: 'ArrowUp',
    },
    {
      step: 2,
      distance: 20,
      text: 'Turn left, walk 20 m',
      icon: 'CornerUpLeft',
    },
    {
      step: 3,
      distance: 7,
      text: 'Library door on your right',
      icon: 'DoorOpen',
    },
  ];

  const currentInstruction = instructions[currentStepIndex] || instructions[0];

  const handleRepeat = () => {
    if (soundEnabled) {
      speakText(`${currentInstruction.distance} metres. ${currentInstruction.text}`);
    }
    if (onRepeatInstruction) onRepeatInstruction();
  };

  const handleTogglePause = () => {
    if (!isPaused) {
      stopSpeech();
    } else if (soundEnabled) {
      speakText(`Resuming navigation. ${currentInstruction.text}`);
    }
    setIsPaused(!isPaused);
  };

  const handleNextStep = () => {
    if (currentStepIndex < instructions.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (soundEnabled) {
        speakText(instructions[nextIdx].text);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header matching reference */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-bold text-teal-600 tracking-wide uppercase">
              Navigating · Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Main Entrance <span className="text-slate-400 font-normal">→</span> Central Library
          </h1>
        </div>

        {/* Distance & Walking Time Stats + SOS */}
        <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto">
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Distance
            </p>
            <p className="text-2xl font-black text-[#0D9488]">
              {route?.distanceMeters || 62} m
            </p>
          </div>

          <div className="h-9 w-px bg-slate-200" />

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Walking time
            </p>
            <p className="text-2xl font-black text-rose-500">
              {route?.walkingTimeFormatted || '1 min 20 s'}
            </p>
          </div>

          <button
            onClick={onOpenSos}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs tracking-wide shadow-xs active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4 fill-rose-600" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Campus Map (left 7 cols) & Instructions Panel (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Campus Map */}
        <div className="lg:col-span-7 space-y-3">
          <CampusMap
            mode="navigate"
            routePolyline={route?.polyline || []}
            destination="central_library"
            currentPosition={{ x: 60, y: 255 }}
          />

          {/* Quick simulation bar */}
          <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Simulate step:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                Step {currentStepIndex + 1} of {instructions.length}
              </span>
            </div>
            <button
              onClick={handleNextStep}
              disabled={currentStepIndex >= instructions.length - 1}
              className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Advance next step →
            </button>
          </div>
        </div>

        {/* Right: Step-by-step instructions & Hazard alerts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: NEXT INSTRUCTION banner with soft gradient */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#99F6E4]/90 via-[#A7F3D0]/60 to-[#FCE7F3]/90 border border-teal-200/80 shadow-sm relative overflow-hidden">
            <p className="text-[11px] font-extrabold text-teal-900 tracking-wider uppercase opacity-80">
              Next Instruction
            </p>

            {/* Large arrow + Distance */}
            <div className="flex items-center gap-3 my-2">
              <ArrowUp className="w-9 h-9 stroke-[3] text-slate-900" />
              <span className="text-3xl font-black text-slate-900">
                {currentInstruction.distance} m
              </span>
            </div>

            {/* Instruction description */}
            <p className="text-lg font-bold text-slate-900 leading-snug">
              {currentInstruction.text}
            </p>

            {isPaused && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold">
                <Pause className="w-3 h-3" />
                <span>Navigation paused</span>
              </div>
            )}
          </div>

          {/* Card 2: THEN Steps List */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Then
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <CornerUpLeft className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Turn left, walk 20 m
                </p>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Library door on your right
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Repeat and Pause Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRepeat}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Repeat</span>
            </button>

            <button
              onClick={handleTogglePause}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-slate-600" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>

          {/* Card 4: Hazard ahead warning banner */}
          <div
            onClick={onTriggerHazardAlert}
            className="cursor-pointer bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 transition-colors shadow-xs group"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs">
              <span className="font-extrabold text-amber-900">
                Hazard ahead:{' '}
              </span>
              <span className="text-amber-800 font-medium">
                Crowded junction near Corridor B in 30 m. Wet floor report pending in Corridor B.
              </span>
              <div className="mt-1 text-[11px] font-bold text-amber-900 underline">
                View Hazard Details &amp; Safe Reroute →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

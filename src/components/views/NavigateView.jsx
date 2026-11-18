import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  CornerUpLeft,
  CornerDownRight,
  ArrowRight,
  DoorOpen,
  RotateCcw,
  Pause,
  Play,
  AlertTriangle,
  PhoneCall,
  Volume2,
  CheckCircle,
  Navigation,
  Sparkles,
  Footprints,
} from 'lucide-react';
import CampusMap from '../CampusMap';
import { speakText, stopSpeech } from '../../utils/audio';
import confetti from 'canvas-confetti';

export default function NavigateView({
  route,
  originName = 'Main Entrance, Block A',
  destinationName = 'Central Library',
  selectedDestination = 'central_library',
  onSelectDestination = null,
  onOpenSos,
  onTriggerHazardAlert,
  soundEnabled = true,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const [currentPolyIndex, setCurrentPolyIndex] = useState(0);

  const polyline = route?.polyline || [];
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
      text: 'Turn left, walk 20 m along Corridor B',
      icon: 'CornerUpLeft',
    },
    {
      step: 3,
      distance: 7,
      text: 'Library door on your right',
      icon: 'DoorOpen',
    },
  ];

  // Dynamic user position coordinates on map
  const activeCoord = polyline[currentPolyIndex] || polyline[0] || { x: 60, y: 255 };

  // Calculate remaining distance and time based on progress
  const progressRatio = polyline.length > 1 ? currentPolyIndex / (polyline.length - 1) : 0;
  const remainingDist = Math.max(0, Math.round((route?.distanceMeters || 62) * (1 - progressRatio)));
  const remainingSecs = Math.max(0, Math.round((route?.walkingTimeSeconds || 80) * (1 - progressRatio)));
  const remainingFormatted = remainingSecs >= 60
    ? `${Math.floor(remainingSecs / 60)} min ${remainingSecs % 60} s`
    : `${remainingSecs} s`;

  // Active turn instruction based on step index
  const currentInstruction = instructions[currentStepIndex] || instructions[0];

  // Live walking simulation effect
  useEffect(() => {
    let interval = null;
    if (isSimulatingWalk && !isPaused && polyline.length > 1) {
      interval = setInterval(() => {
        setCurrentPolyIndex((prev) => {
          if (prev >= polyline.length - 1) {
            setIsSimulatingWalk(false);
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
            if (soundEnabled) {
              speakText(`You have arrived at ${destinationName}. Destination reached.`);
            }
            return prev;
          }
          const nextPoly = prev + 1;

          // Update turn instruction step dynamically
          const calculatedStep = Math.min(
            instructions.length - 1,
            Math.floor((nextPoly / (polyline.length - 1)) * instructions.length)
          );
          setCurrentStepIndex(calculatedStep);

          return nextPoly;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isSimulatingWalk, isPaused, polyline, instructions, destinationName, soundEnabled]);

  const handleRepeat = () => {
    if (soundEnabled) {
      speakText(`${currentInstruction.distance} metres. ${currentInstruction.text}`);
    }
  };

  const handleTogglePause = () => {
    if (!isPaused) {
      stopSpeech();
    } else if (soundEnabled) {
      speakText(`Resuming navigation. ${currentInstruction.text}`);
    }
    setIsPaused(!isPaused);
  };

  const handleResetWalk = () => {
    setIsSimulatingWalk(false);
    setCurrentPolyIndex(0);
    setCurrentStepIndex(0);
  };

  const handleAdvanceStep = () => {
    if (currentPolyIndex < polyline.length - 1) {
      const nextPoly = currentPolyIndex + 1;
      setCurrentPolyIndex(nextPoly);
      const nextStep = Math.min(
        instructions.length - 1,
        Math.floor((nextPoly / (polyline.length - 1)) * instructions.length)
      );
      setCurrentStepIndex(nextStep);
      if (soundEnabled && instructions[nextStep]) {
        speakText(instructions[nextStep].text);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-extrabold text-teal-600 tracking-wider uppercase">
              Navigating · Live Guidance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            {originName.split(',')[0]} <span className="text-slate-400 font-normal">→</span> {destinationName}
          </h1>
        </div>

        {/* Distance & Walking Time Stats + SOS */}
        <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto">
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isSimulatingWalk ? 'Remaining Dist' : 'Distance'}
            </p>
            <p className="text-2xl font-black text-[#0D9488]">
              {remainingDist} m
            </p>
          </div>

          <div className="h-9 w-px bg-slate-200" />

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isSimulatingWalk ? 'Time Left' : 'Walking Time'}
            </p>
            <p className="text-2xl font-black text-rose-500">
              {remainingFormatted}
            </p>
          </div>

          <button
            onClick={onOpenSos}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 fill-rose-600" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Campus Map (7 cols) & Instructions Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Campus Map */}
        <div className="lg:col-span-7 space-y-3">
          <CampusMap
            mode="navigate"
            routePolyline={polyline}
            destination={selectedDestination}
            onSelectDestination={onSelectDestination}
            currentPosition={activeCoord}
          />

          {/* Interactive Walk Simulator Control Bar */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulatingWalk(!isSimulatingWalk)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                  isSimulatingWalk
                    ? 'bg-amber-100 border border-amber-300 text-amber-900'
                    : 'bg-teal-500 hover:bg-teal-600 text-white shadow-xs'
                }`}
              >
                {isSimulatingWalk ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Walk</span>
                  </>
                ) : (
                  <>
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Start Live Walk Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetWalk}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                title="Reset simulation to start"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">
                Waypoint {currentPolyIndex + 1}/{polyline.length}
              </span>
              <button
                onClick={handleAdvanceStep}
                disabled={currentPolyIndex >= polyline.length - 1}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Step Forward →
              </button>
            </div>
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
              Upcoming Waypoints
            </p>

            <div className="space-y-2.5">
              {instructions.slice(1).map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    currentStepIndex === idx + 1 ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <CornerUpLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {step.text}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {step.distance} metres
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Repeat and Pause Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRepeat}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>Repeat Voice</span>
            </button>

            <button
              onClick={handleTogglePause}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
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
                Corridor B has active floor cleaning &amp; wet floor report. Recalculation ready.
              </span>
              <div className="mt-1 text-[11px] font-bold text-amber-900 underline">
                View Hazard Detection &amp; Safe Reroute →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  Mic,
  MapPin,
  Route,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'User Opens RAAHI at Main Entrance',
    description: 'System initializes at Main Entrance, Block A, Floor 1 (Tag #A1-004) with 94% beacon confidence.',
    actionName: 'Go to Scan / Verify Location',
    view: 'scan',
    voiceText: 'You are at the Main Entrance, Block A. Facing east.',
  },
  {
    step: 2,
    title: 'User Selects Central Library',
    description: 'Destination chosen from quick selector. Destination distance computed via campus topological graph.',
    actionName: 'Set Central Library',
    view: 'home',
    voiceText: 'Destination Central Library selected.',
  },
  {
    step: 3,
    title: 'RAAHI Displays Walking Route of 62 m',
    description: 'Initial shortest path generated: 62 metres, estimated 1 min 20 s walking time via Corridor B.',
    actionName: 'Open Navigation View',
    view: 'navigate',
    voiceText: 'Starting navigation to Central Library. Walk straight for 35 metres.',
  },
  {
    step: 4,
    title: 'Wet-Floor Hazard Appears in Corridor B',
    description: 'Campus sensor/student report triggers critical obstruction: Floor cleaning in progress and wet floor in Corridor B.',
    actionName: 'Trigger Hazard Alert',
    view: 'hazards',
    voiceText: 'Warning! Hazard ahead: Corridor B is blocked due to cleaning and wet floor.',
  },
  {
    step: 5,
    title: 'System Flags Original Route as Unsafe',
    description: 'Autonomous safety engine checks edge traversability and flags Corridor B as impassable.',
    actionName: 'Detect Blocked Path',
    view: 'hazards',
    voiceText: 'Original route is unsafe. Recalculating safe alternative.',
  },
  {
    step: 6,
    title: 'RAAHI Calculates New Route via Lab 102',
    description: 'Dijkstra recalculates bypass passage through Lab 102 in 0.8 seconds to avoid the wet floor and crowded zone.',
    actionName: 'Calculate Safe Reroute',
    view: 'rerouting',
    voiceText: 'Alternative safe route calculated via Lab 102 passage.',
  },
  {
    step: 7,
    title: 'Displays Updated Route (76 m) & Reasons',
    description: 'Displays side-by-side Before/After comparison: 76 metres (+14m, +20s) with clear safety explanations.',
    actionName: 'Review Route Comparison',
    view: 'rerouting',
    voiceText: 'Route changed. Turn left into Lab 102 passage in 12 metres.',
  },
  {
    step: 8,
    title: 'Voice Assistant Announces New Directions',
    description: 'Hands-free voice system speaks out turn-by-turn instruction and updates interactive voice guidance.',
    actionName: 'Launch Voice Guidance',
    view: 'voice',
    voiceText: 'Route changed. Turn left into Lab 102 passage in 12 metres.',
  },
];

export default function DemoWalkthroughModal({
  isOpen,
  onClose,
  onApplyStep,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepData = DEMO_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          onApplyStep(DEMO_STEPS[nextIdx]);
        } else {
          setIsPlaying(false);
          try {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isOpen, onApplyStep]);

  if (!isOpen) return null;

  const handleGoStep = (index) => {
    setCurrentStepIndex(index);
    onApplyStep(DEMO_STEPS[index]);
  };

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onApplyStep(DEMO_STEPS[nextIdx]);
    } else {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onApplyStep(DEMO_STEPS[prevIdx]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-indigo-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-teal-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Hackathon Presentation Mode
              </span>
              <span className="text-xs font-bold text-slate-400">
                Step {currentStepIndex + 1} of 8
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              8-Step Automated Demo Scenario
            </h2>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-8 gap-1.5 mb-6">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleGoStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-indigo-600 ring-2 ring-indigo-300'
                  : idx < currentStepIndex
                  ? 'bg-teal-500'
                  : 'bg-slate-200'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Current Step Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-teal-50/40 to-white border border-indigo-100 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
              Scenario Milestone {stepData.step}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Target Screen: <strong className="text-slate-800 uppercase">{stepData.view}</strong>
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900">
            {stepData.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {stepData.description}
          </p>

          {stepData.voiceText && (
            <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs font-semibold text-slate-700 italic">
              <Mic className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Voice TTS: “{stepData.voiceText}”</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Auto play toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-700" />
                <span>Auto-Play Sequence (4s/step)</span>
              </>
            )}
          </button>

          {/* Stepper buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish & Celebrate' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

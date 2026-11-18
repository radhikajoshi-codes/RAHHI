import React, { useState } from 'react';
import {
  QrCode,
  Zap,
  Radio,
  Volume2,
  Compass,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_TAGS } from '../../data/campusData';
import { playBeaconPing, speakText } from '../../utils/audio';

export default function ScanLocationView({
  onConfirmLocation,
  soundEnabled = true,
}) {
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const [torchOn, setTorchOn] = useState(false);
  const [nfcScanning, setNfcScanning] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const currentTag = SAMPLE_TAGS[selectedTagIndex] || SAMPLE_TAGS[0];

  const handleSimulateScan = (index) => {
    setIsScanning(true);
    playBeaconPing();
    setTimeout(() => {
      setSelectedTagIndex(index);
      setIsScanning(false);
      if (soundEnabled) {
        speakText(SAMPLE_TAGS[index].tts);
      }
    }, 700);
  };

  const handleNfcTap = () => {
    setNfcScanning(true);
    playBeaconPing();
    setTimeout(() => {
      setNfcScanning(false);
      if (soundEnabled) {
        speakText('NFC tag verified at waist height.');
      }
    }, 1200);
  };

  const handleAudioCue = () => {
    playBeaconPing();
    if (soundEnabled) {
      speakText(currentTag.tts);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-teal-600 tracking-wide uppercase">
          Step 2 · Find where you are
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
          Scan a location tag
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Hold your phone near the QR or NFC tag on the wall at waist height.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Viewfinder & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm flex flex-col items-center">
          {/* Simulated Scanner Viewport */}
          <div
            className={`relative w-full max-w-md aspect-square rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
              torchOn ? 'bg-amber-50/30' : 'bg-[#FAFBFD]'
            }`}
          >
            {/* Viewfinder holographic corner brackets */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-teal-400 rounded-tl-xl shadow-xs" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-teal-400 rounded-tr-xl shadow-xs" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-teal-400 rounded-bl-xl shadow-xs" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-teal-400 rounded-br-xl shadow-xs" />

            {/* Scanning Laser Beam */}
            <div className="absolute left-10 right-10 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400 animate-scan pointer-events-none" />

            {/* QR Icon in center */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center">
                <QrCode
                  className={`w-full h-full text-slate-800 transition-transform ${
                    isScanning ? 'scale-90 animate-pulse' : 'scale-100'
                  }`}
                />
              </div>

              {/* Status Pill */}
              <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
                <RefreshCw
                  className={`w-3.5 h-3.5 text-teal-600 ${
                    isScanning ? 'animate-spin' : ''
                  }`}
                />
                <span>Scanning… tag detected</span>
              </div>
            </div>

            {/* NFC Ripple effect when tapped */}
            {nfcScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border-4 border-teal-400 animate-ping opacity-75" />
              </div>
            )}
          </div>

          {/* Scanner action bar: Torch, NFC, Audio cues */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                torchOn
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-pink-100 text-rose-500'
              }`}
            >
              <Zap className="w-4 h-4 text-rose-500" />
              <span>{torchOn ? 'Torch On' : 'Torch'}</span>
            </button>

            <button
              onClick={handleNfcTap}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                nfcScanning
                  ? 'bg-teal-100 border-teal-300 text-teal-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-pink-100 text-rose-500'
              }`}
            >
              <Radio className="w-4 h-4 text-rose-500" />
              <span>NFC</span>
            </button>

            <button
              onClick={handleAudioCue}
              className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl text-xs font-bold bg-white hover:bg-slate-50 border border-pink-100 text-rose-500 transition-all"
            >
              <Volume2 className="w-4 h-4 text-rose-500" />
              <span>Audio cues</span>
            </button>
          </div>

          {/* Manual Tag Switcher for Demo testing */}
          <div className="w-full max-w-md mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Switch simulated tag:</span>
            <div className="flex gap-1.5">
              {SAMPLE_TAGS.map((tag, idx) => (
                <button
                  key={tag.id}
                  onClick={() => handleSimulateScan(idx)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedTagIndex === idx
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  #{tag.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Location Details & Confirmation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Main Location Found Card with soft gradient */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#99F6E4]/40 via-[#CCFBF1]/30 to-[#FCE7F3]/60 border border-teal-200/60 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 tracking-wider uppercase mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Location Found</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {currentTag.name}
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {currentTag.building} · {currentTag.floor} · Tag #{currentTag.id}
            </p>

            {/* Confidence metric */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Confidence</span>
                <span className="text-base font-extrabold text-slate-900">
                  {currentTag.confidence}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-pink-400"
                  style={{ width: `${currentTag.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Signals used */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Signals used
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span>QR tag</span>
                </span>
                <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Radio className="w-4 h-4 text-slate-400" />
                  <span>Bluetooth beacons</span>
                </span>
                <span className="text-rose-500 font-bold text-xs">
                  {currentTag.beaconsNearby} nearby
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Heading</span>
                </span>
                <span className="text-slate-800 font-bold text-xs">
                  {currentTag.heading}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Audio TTS Quote */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-start gap-3">
            <Volume2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <p className="text-xs font-semibold text-slate-700 italic">
              “{currentTag.tts}”
            </p>
          </div>

          {/* Confirm & Start Navigation Action Button */}
          <button
            onClick={() => onConfirmLocation(currentTag)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-400 to-[#00BFA5] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>Confirm &amp; start navigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  AlertTriangle,
  X,
  ShieldAlert,
  MapPin,
  Radio,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { playSosSiren } from '../../utils/audio';

export default function SosModal({
  isOpen,
  onClose,
  currentLocation = 'Main Entrance, Block A, Floor 1',
}) {
  const [sosStatus, setSosStatus] = useState('confirming'); // 'confirming' | 'dispatched'
  const [countdown, setCountdown] = useState(3);
  const [soundAlert, setSoundAlert] = useState(true);

  useEffect(() => {
    let timer = null;
    let stopSirenFn = null;

    if (isOpen && sosStatus === 'confirming') {
      if (soundAlert) {
        stopSirenFn = playSosSiren();
      }

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSosStatus('dispatched');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (stopSirenFn) stopSirenFn();
    };
  }, [isOpen, sosStatus, soundAlert]);

  if (!isOpen) return null;

  const handleInstantDispatch = () => {
    setCountdown(0);
    setSosStatus('dispatched');
  };

  const handleCancel = () => {
    setSosStatus('confirming');
    setCountdown(3);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-rose-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {sosStatus === 'confirming' ? (
          <div className="text-center space-y-5">
            {/* Pulsing emergency icon */}
            <div className="relative inline-flex items-center justify-center">
              <span className="w-24 h-24 rounded-full bg-rose-500/20 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                <PhoneCall className="w-9 h-9 fill-white animate-bounce" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Dispatching Campus Security SOS
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Auto-dispatching in <strong className="text-rose-600 text-lg">{countdown}</strong> seconds...
              </p>
            </div>

            {/* Current simulated location preview */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Simulated Emergency Coordinates</span>
              </div>
              <p className="text-xs font-semibold text-slate-800">
                {currentLocation}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                GPS: 12.9716° N, 77.5946° E · Beacon Node #A1-004
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleInstantDispatch}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-600/25 transition-all"
              >
                Send Alert Now
              </button>
              <button
                onClick={handleCancel}
                className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
              <button
                onClick={() => setSoundAlert(!soundAlert)}
                className="flex items-center gap-1.5 hover:text-slate-700 font-medium"
              >
                {soundAlert ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundAlert ? 'Siren sound active' : 'Siren muted'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Dispatched confirmation screen */
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Security Dispatched
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Help is on the way!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Stay where you are. Campus Quick Response Team (QRT) has been notified.
              </p>
            </div>

            {/* Responder Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Assigned Officer:</span>
                <span className="font-bold text-slate-900">Officer R. Sharma (QRT-1)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Estimated Arrival:</span>
                <span className="font-extrabold text-rose-600">~2 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Live Telemetry:</span>
                <span className="text-emerald-700 font-bold">Broadcasting to Security Desk</span>
              </div>
            </div>

            {/* Emergency Hotline Info */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
              <p className="font-bold">Campus Control Desk: +91 80 2555 0199</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Keep line open or use voice assistant to speak with operators.
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Close &amp; Return to Navigation
            </button>
          </div>
        )}

        {/* Safety Disclaimer */}
        <p className="text-[10px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-3">
          Simulated emergency alert for campus demonstration only. Does not contact external emergency services.
        </p>
      </div>
    </div>
  );
}

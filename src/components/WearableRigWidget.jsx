import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Eye,
  X,
  Sparkles,
  Layers,
  Battery,
  Wifi,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function WearableRigWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Corner Floating Hardware Rig Badge on Front Page */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200/90 p-2 shadow-md hover:shadow-lg hover:border-teal-400 transition-all cursor-pointer flex items-center gap-3 group"
        title="Click to view connected RAAHI Wearable Hardware Kit Telemetry"
      >
        {/* Thumbnail of user's uploaded chest-rig image */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-300 group-hover:scale-105 transition-transform">
          <img
            src="/wearable-rig.jpg"
            alt="RAAHI Wearable Assistive Hardware Rig"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Info label */}
        <div className="pr-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
              Sensor Rig
            </span>
            <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <h5 className="text-xs font-black text-slate-900 mt-0.5 leading-tight group-hover:text-teal-700 transition-colors">
            RAAHI Wearable Kit
          </h5>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            3x Sonar · ESP32 · Vivo Mount
          </p>
        </div>
      </div>

      {/* Expanded Hardware Telemetry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  Assistive Hardware Telemetry
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  RAAHI Wearable Sensor-Rig Active
                </h3>
              </div>
            </div>

            {/* High-Res Photo Display with annotations */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner mb-5 max-h-64 flex items-center justify-center bg-slate-900">
              <img
                src="/wearable-rig.jpg"
                alt="RAAHI Wearable Assistive Hardware Rig full view"
                className="w-full h-full object-cover"
              />

              {/* Holographic Sonar Beams Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono bg-teal-500/80 px-2 py-0.5 rounded font-bold">
                    Left Sonar: 2.4 m
                  </span>
                  <span className="font-mono bg-emerald-500/80 px-2 py-0.5 rounded font-bold">
                    Center Sonar: 1.8 m
                  </span>
                  <span className="font-mono bg-teal-500/80 px-2 py-0.5 rounded font-bold">
                    Right Sonar: 3.1 m
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Component Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Cpu className="w-3.5 h-3.5 text-teal-600" />
                  <span>Microcontroller</span>
                </div>
                <p className="font-bold text-slate-800">ESP32 Dual-Core</p>
                <p className="text-[10px] text-teal-600 font-semibold">240 MHz · BLE 5.0</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5 text-rose-500" />
                  <span>Obstacle Array</span>
                </div>
                <p className="font-bold text-slate-800">3x HC-SR04 Sonar</p>
                <p className="text-[10px] text-slate-500">120° Wide Coverage</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Radio className="w-3.5 h-3.5 text-blue-500" />
                  <span>Laser ToF &amp; IMU</span>
                </div>
                <p className="font-bold text-slate-800">VL53L0X + MPU6050</p>
                <p className="text-[10px] text-slate-500">Millimeter Precision</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Battery Status</span>
                </div>
                <p className="font-bold text-slate-800">88% Li-Ion Pack</p>
                <p className="text-[10px] text-emerald-600 font-semibold">~6.5 hrs remaining</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Wifi className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Signal Strength</span>
                </div>
                <p className="font-bold text-slate-800">-54 dBm (Strong)</p>
                <p className="text-[10px] text-indigo-600 font-semibold">BLE RTT Connected</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>Optical Hub</span>
                </div>
                <p className="font-bold text-slate-800">Vivo Camera Mount</p>
                <p className="text-[10px] text-slate-500">Live AI Landmark VPS</p>
              </div>
            </div>

            {/* Footer action button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
    </>
  );
}

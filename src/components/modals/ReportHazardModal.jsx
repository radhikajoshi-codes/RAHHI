import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Ban,
  Users,
  Package,
  Droplets,
  Plus,
} from 'lucide-react';
import { playHazardAlert } from '../../utils/audio';

export default function ReportHazardModal({
  isOpen,
  onClose,
  onSubmitHazard,
}) {
  const [location, setLocation] = useState('Corridor B');
  const [hazardType, setHazardType] = useState('wet_floor');
  const [severity, setSeverity] = useState('CRITICAL');
  const [description, setDescription] = useState('Water spill reported near central junction.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const titleMap = {
      wet_floor: 'Wet floor & cleaning',
      blocked: 'Corridor blocked',
      crowded: 'Crowded corridor',
      obstacle: 'Obstacle on pathway',
    };

    const newHazard = {
      id: `hz_custom_${Date.now()}`,
      title: titleMap[hazardType] || 'Hazard detected',
      location,
      distanceAhead: 15,
      type: hazardType,
      severity,
      tag: severity === 'CRITICAL' ? 'Immediate detour' : 'Caution',
      description,
      mapPoint: location === 'Corridor B' ? { x: 530, y: 195 } : { x: 310, y: 255 },
      active: true,
      blockedEdges: location === 'Corridor B' ? [
        ['n_corridor_b_junc', 'n_corridor_b_hazard'],
        ['n_corridor_b_hazard', 'n_library_door'],
      ] : [],
    };

    playHazardAlert();
    onSubmitHazard(newHazard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-amber-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Report Campus Hazard
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Alert fellow students and trigger automated safe rerouting
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Location selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Hazard Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-400"
            >
              <option value="Corridor B">Corridor B (Library Wing)</option>
              <option value="Main Corridor">Main Corridor (Central)</option>
              <option value="Lab 102 Entrance">Lab 102 Entryway</option>
              <option value="Washrooms Passage">Washrooms Outer Passage</option>
              <option value="Lift Lobby">Lift &amp; Stairs Lobby</option>
            </select>
          </div>

          {/* Hazard Type */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Hazard Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'wet_floor', label: 'Wet Floor', icon: Droplets },
                { id: 'blocked', label: 'Blocked Way', icon: Ban },
                { id: 'crowded', label: 'Crowded Area', icon: Users },
                { id: 'obstacle', label: 'Obstacle / Bag', icon: Package },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = hazardType === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setHazardType(item.id)}
                    className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-600" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['LOW', 'MEDIUM', 'CRITICAL'].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 px-3 rounded-xl border font-extrabold text-center uppercase text-[11px] transition-all ${
                    severity === lvl
                      ? lvl === 'CRITICAL'
                        ? 'bg-red-500 border-red-600 text-white shadow-xs'
                        : lvl === 'MEDIUM'
                        ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                        : 'bg-slate-700 border-slate-800 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-400"
              placeholder="Provide details about the obstruction..."
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Hazard Alert</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

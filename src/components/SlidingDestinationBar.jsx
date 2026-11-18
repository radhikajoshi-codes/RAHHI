import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Utensils,
  Bath,
  Building,
  UserCheck,
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ROOMS_DATA } from '../data/campusData';

export default function SlidingDestinationBar({
  selectedDestination,
  onSelectDestination,
}) {
  const scrollContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Academic', 'Food & Rest', 'Accessibility'];

  const filteredRooms = ROOMS_DATA.filter((room) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Academic') return room.category === 'Academic' || room.type === 'library';
    if (activeCategory === 'Food & Rest') return room.category === 'Food & Drinks' || room.category === 'Restrooms';
    if (activeCategory === 'Accessibility') return room.category === 'Accessibility' || room.id === 'lift' || room.id === 'washrooms';
    return true;
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getIconForRoom = (id) => {
    switch (id) {
      case 'central_library':
        return BookOpen;
      case 'canteen':
        return Utensils;
      case 'washrooms':
        return Bath;
      case 'lift':
        return Building;
      case 'admin_office':
        return UserCheck;
      default:
        return Building;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-pink-100 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Explore Destinations (Slide to browse)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Tap any location card to set course and update map
            </p>
          </div>
        </div>

        {/* Categories & Scroll Buttons */}
        <div className="flex items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-teal-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Left/Right Slider Arrow Buttons */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Sliding Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredRooms.map((room) => {
          const Icon = getIconForRoom(room.id);
          const isSelected = selectedDestination === room.id;
          const isLibrary = room.id === 'central_library';

          return (
            <div
              key={room.id}
              onClick={() => onSelectDestination(room.id)}
              className={`snap-start shrink-0 w-60 p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-200 shadow-md scale-[1.01]'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Target</span>
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-teal-500 text-white shadow-xs'
                        : isLibrary
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="pr-12">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {room.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">
                      {room.category || 'Facility'} · Tag #{room.tagId || 'A1-001'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
                  <span className="font-extrabold text-teal-800">
                    {room.distanceFromStart || 50} metres
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">
                    ~{Math.round((room.distanceFromStart || 50) / 0.77)}s walk
                  </span>
                </div>
              </div>

              {/* Status footer pill */}
              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                {room.id === 'stairs' ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>Flight of 18 steps</span>
                  </span>
                ) : room.id === 'lift' ? (
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    <span>Wheelchair accessible</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Clear pathway</span>
                  </span>
                )}

                <span className="text-teal-600 font-extrabold group-hover:underline">
                  Select →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

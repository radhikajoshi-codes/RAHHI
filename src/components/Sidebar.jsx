import React from 'react';
import {
  Home,
  QrCode,
  Navigation,
  AlertTriangle,
  GitFork,
  Mic,
  Building2,
  Sparkles,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: '1 · Home', icon: Home, badge: null },
  { id: 'scan', label: '2 · Scan Location', icon: QrCode, badge: null },
  { id: 'navigate', label: '3 · Navigate', icon: Navigation, badge: null },
  { id: 'hazards', label: '4 · Hazards', icon: AlertTriangle, badge: '4' },
  { id: 'rerouting', label: '5 · Rerouting', icon: GitFork, badge: 'New' },
  { id: 'voice', label: '6 · Voice Assistant', icon: Mic, badge: null },
];

export default function Sidebar({
  currentView,
  onSelectView,
  isMobileOpen,
  setIsMobileOpen,
  onLaunchDemo,
}) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#FCF7F8] border-r border-[#F1E5E7] flex flex-col justify-between p-5 z-50 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo & Nav items */}
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Navigation className="w-5 h-5 fill-white text-teal-500 rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                RAAHI
              </h1>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">
                Indoor Navigation
              </p>
            </div>
          </div>

          {/* Section label */}
          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 px-3">
            User Journey
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-[#E6F7F5] text-[#0D9488] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#0D9488]' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#0D9488] text-white'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Hackathon Demo Trigger Button */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 px-1">
            <button
              onClick={() => {
                onLaunchDemo();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold shadow-md shadow-teal-500/25 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>1-Click Hackathon Demo</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Simulates Corridor B wet floor &amp; reroute
            </p>
          </div>
        </div>

        {/* Bottom: Campus Location Card & Credits */}
        <div className="space-y-3 pt-4">
          <div className="p-3.5 rounded-2xl bg-white border border-[#F1E5E7] shadow-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Kalpana Institute of Technology
                </p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  Main Block · Floor 1
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 px-1 flex items-center justify-between">
            <span>RAAHI v2.4</span>
            <span className="text-[10px] text-slate-300">uxpilot.ai reference</span>
          </div>
        </div>
      </aside>
    </>
  );
}

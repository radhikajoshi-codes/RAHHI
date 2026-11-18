import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';

// Views
import HomeView from './components/views/HomeView';
import ScanLocationView from './components/views/ScanLocationView';
import NavigateView from './components/views/NavigateView';
import HazardsView from './components/views/HazardsView';
import ReroutingView from './components/views/ReroutingView';
import VoiceAssistantView from './components/views/VoiceAssistantView';

// Modals
import SosModal from './components/modals/SosModal';
import ReportHazardModal from './components/modals/ReportHazardModal';
import DemoWalkthroughModal from './components/modals/DemoWalkthroughModal';

// Utilities & Data
import { INITIAL_HAZARDS, ROOMS_DATA, GRAPH_NODES } from './data/campusData';
import { calculateRoute, getRouteComparison } from './utils/routing';
import { speakText, playHazardAlert } from './utils/audio';

export default function App() {
  // Navigation View State ('home' | 'scan' | 'navigate' | 'hazards' | 'rerouting' | 'voice')
  const [currentView, setCurrentView] = useState('home');

  // Campus User Context
  const [originNodeId, setOriginNodeId] = useState('n_start');
  const [currentLocationName, setCurrentLocationName] = useState('Main Entrance, Block A');
  const [selectedDestination, setSelectedDestination] = useState('central_library');
  const [confidence, setConfidence] = useState(94);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Hazards State
  const [hazards, setHazards] = useState(INITIAL_HAZARDS);
  const [isReroutedRouteAccepted, setIsReroutedRouteAccepted] = useState(false);

  // Modals & Drawers
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Dynamic Route calculation from current originNodeId to selectedDestination
  const currentRoute = useMemo(() => {
    return calculateRoute(originNodeId, selectedDestination, hazards, {
      forceOriginal: !isReroutedRouteAccepted && originNodeId === 'n_start' && selectedDestination === 'central_library',
      avoidCrowd: true,
    });
  }, [originNodeId, selectedDestination, hazards, isReroutedRouteAccepted]);

  // Destination room object
  const destRoomObj = useMemo(() => {
    return (
      ROOMS_DATA.find((r) => r.id === selectedDestination) ||
      ROOMS_DATA.find((r) => r.id === 'central_library')
    );
  }, [selectedDestination]);

  // Before & After comparison data for Rerouting view
  const comparisonData = useMemo(() => {
    return getRouteComparison(hazards);
  }, [hazards]);

  // Voice toggle
  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
    showToast(soundEnabled ? 'Voice instructions muted' : 'Voice instructions enabled');
  };

  // Switch destination
  const handleSelectDestination = (destId) => {
    setSelectedDestination(destId);
    const room = ROOMS_DATA.find((r) => r.id === destId);
    if (room) {
      showToast(`Destination set to ${room.name}`);
      if (soundEnabled) {
        speakText(`Destination set to ${room.name}.`);
      }
    }
  };

  // Start navigation from home
  const handleStartNavigation = () => {
    setCurrentView('navigate');
    if (soundEnabled) {
      speakText(`Starting navigation to ${destRoomObj.name}. Walk along corridor.`);
    }
  };

  // Confirm scanned location tag or photo landmark
  const handleConfirmLocation = (loc) => {
    setOriginNodeId(loc.nodeId || 'n_start');
    setCurrentLocationName(`${loc.name}, ${loc.building}`);
    setConfidence(loc.confidence);
    setCurrentView('navigate');
    showToast(`Origin positioned at ${loc.name}`);
    if (soundEnabled) {
      speakText(`Location verified at ${loc.name}. Calculating route to ${destRoomObj.name}.`);
    }
  };

  // Trigger hazard detection flow
  const handleTriggerHazardAlert = () => {
    playHazardAlert();
    setCurrentView('hazards');
    if (soundEnabled) {
      speakText('Alert! Corridor B is blocked due to cleaning and wet floor.');
    }
  };

  // Open rerouting view
  const handleRerouteClick = () => {
    setCurrentView('rerouting');
    if (soundEnabled) {
      speakText(comparisonData.spokenText);
    }
  };

  // Accept rerouted route and resume navigation
  const handleAcceptReroute = () => {
    setIsReroutedRouteAccepted(true);
    setCurrentView('navigate');
    showToast('Safe route via Lab 102 accepted');
    if (soundEnabled) {
      speakText('Safe route through Lab 102 accepted. Turn left into Lab 102 passage in 12 metres.');
    }
  };

  // Report a new hazard
  const handleSubmitHazard = (newHazard) => {
    setHazards((prev) => [newHazard, ...prev]);
    showToast(`Hazard alert reported: ${newHazard.title}`);
    if (soundEnabled) {
      speakText(`New hazard reported at ${newHazard.location}. Updating campus safety routes.`);
    }
  };

  // Hackathon Demo Step Applicator
  const handleApplyDemoStep = (stepObj) => {
    setCurrentView(stepObj.view);
    if (stepObj.step === 1) {
      setOriginNodeId('n_start');
      setCurrentLocationName('Main Entrance, Block A');
      setSelectedDestination('central_library');
    }
    if (stepObj.step >= 6) {
      setIsReroutedRouteAccepted(true);
    } else {
      setIsReroutedRouteAccepted(false);
    }
    if (soundEnabled && stepObj.voiceText) {
      speakText(stepObj.voiceText);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row text-slate-800 antialiased font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onLaunchDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header Bar */}
        <HeaderBar
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenReportHazard={() => setIsReportModalOpen(true)}
          onLaunchDemo={() => setIsDemoModalOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          beaconsCount={3}
        />

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'home' && (
            <HomeView
              selectedDestination={selectedDestination}
              onSelectDestination={handleSelectDestination}
              onStartNavigation={handleStartNavigation}
              onOpenSos={() => setIsSosOpen(true)}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              confidence={confidence}
              currentLocationName={currentLocationName}
            />
          )}

          {currentView === 'scan' && (
            <ScanLocationView
              onConfirmLocation={handleConfirmLocation}
              soundEnabled={soundEnabled}
            />
          )}

          {currentView === 'navigate' && (
            <NavigateView
              route={currentRoute}
              originName={currentLocationName}
              destinationName={destRoomObj.name}
              selectedDestination={selectedDestination}
              onSelectDestination={handleSelectDestination}
              onOpenSos={() => setIsSosOpen(true)}
              onTriggerHazardAlert={handleTriggerHazardAlert}
              soundEnabled={soundEnabled}
            />
          )}

          {currentView === 'hazards' && (
            <HazardsView
              hazards={hazards}
              onReroute={handleRerouteClick}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {currentView === 'rerouting' && (
            <ReroutingView
              comparison={comparisonData}
              onAcceptRoute={handleAcceptReroute}
              onPlayAnnouncement={() => {
                if (soundEnabled) speakText(comparisonData.spokenText);
              }}
            />
          )}

          {currentView === 'voice' && (
            <VoiceAssistantView
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onNavigateTo={(destId) => {
                setSelectedDestination(destId);
                setCurrentView('navigate');
              }}
              onOpenSos={() => setIsSosOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        currentLocation={currentLocationName}
      />

      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitHazard={handleSubmitHazard}
      />

      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onApplyStep={handleApplyDemoStep}
      />
    </div>
  );
}

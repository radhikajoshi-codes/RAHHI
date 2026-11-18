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
import { INITIAL_HAZARDS, ROOMS_DATA } from './data/campusData';
import { calculateRoute, getRouteComparison } from './utils/routing';
import { speakText, playHazardAlert } from './utils/audio';

export default function App() {
  // Navigation View State ('home' | 'scan' | 'navigate' | 'hazards' | 'rerouting' | 'voice')
  const [currentView, setCurrentView] = useState('home');

  // Campus User Context
  const [selectedDestination, setSelectedDestination] = useState('central_library');
  const [currentLocationName, setCurrentLocationName] = useState('Main Entrance, Block A');
  const [confidence, setConfidence] = useState(94);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Hazards State
  const [hazards, setHazards] = useState(INITIAL_HAZARDS);
  const [isReroutedRouteAccepted, setIsReroutedRouteAccepted] = useState(false);

  // Modals & Drawers
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Route calculation
  const currentRoute = useMemo(() => {
    // If user has accepted safe bypass or route is rerouted, calculate safe path
    return calculateRoute('n_start', 'n_library_door', hazards, {
      forceOriginal: !isReroutedRouteAccepted,
      avoidCrowd: true,
    });
  }, [hazards, isReroutedRouteAccepted]);

  // Before & After comparison data for Rerouting view
  const comparisonData = useMemo(() => {
    return getRouteComparison(hazards);
  }, [hazards]);

  // Voice toggle
  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Switch destination
  const handleSelectDestination = (destId) => {
    setSelectedDestination(destId);
    const room = ROOMS_DATA.find((r) => r.id === destId);
    if (soundEnabled && room) {
      speakText(`Destination set to ${room.name}.`);
    }
  };

  // Start navigation from home
  const handleStartNavigation = () => {
    setCurrentView('navigate');
    if (soundEnabled) {
      speakText('Starting navigation to Central Library. Walk straight for 35 metres.');
    }
  };

  // Confirm scanned location tag
  const handleConfirmLocation = (tag) => {
    setCurrentLocationName(`${tag.name}, ${tag.building}`);
    setConfidence(tag.confidence);
    setCurrentView('navigate');
    if (soundEnabled) {
      speakText(`Location verified at ${tag.name}. Calculating route.`);
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
    if (soundEnabled) {
      speakText('Safe route through Lab 102 accepted. Turn left into Lab 102 passage in 12 metres.');
    }
  };

  // Report a new hazard
  const handleSubmitHazard = (newHazard) => {
    setHazards((prev) => [newHazard, ...prev]);
    if (soundEnabled) {
      speakText(`New hazard reported at ${newHazard.location}. Updating campus safety routes.`);
    }
  };

  // Hackathon Demo Step Applicator
  const handleApplyDemoStep = (stepObj) => {
    setCurrentView(stepObj.view);
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
              onOpenSos={() => setIsSosOpen(true)}
              onTriggerHazardAlert={handleTriggerHazardAlert}
              onRepeatInstruction={() => {}}
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

# RAAHI – Smart Indoor Navigation & Safety System
> *Your Indoor Navigation Companion for Smart Campuses*

RAAHI is a modern, responsive, and fully interactive indoor navigation and safety web application designed for complex campus environments (demonstrated on **Block A · Floor 1** of **Kalpana Institute of Technology**).

Built faithfully based on the reference UI/UX design specifications, RAAHI provides real-time positioning, interactive 2D indoor campus routing, smart hazard detection, dynamic rerouting around obstacles, voice-guided instructions, and emergency SOS assistance.

---

## 📸 Key Screens & Features

### 1. Home Dashboard (`1 · Home`)
- **Personalized Welcome Screen**: Displays user greeting (*"Good morning, Aarav 👋"*), active institution banner, and live beacon connectivity status (*"3 Beacons connected"*).
- **Destination Selector & Quick Pills**: Instant one-tap navigation to key campus facilities:
  - 📚 **Central Library** (62 m away)
  - 🍴 **Canteen**
  - 🚻 **Washrooms**
  - 🛗 **Lift**
  - 👤 **Admin Office**
- **Live Status Cards**:
  - **Voice Assistance Card**: Toggle on/off, language indicator (`English (India)`), and real-time audio visualizer waves.
  - **Current Location Card**: Simulated live position with **94% location confidence** progress bar.
  - **Emergency Assistance Card**: Instant SOS trigger connected to Campus Security.
- **Wayfinding Radar**: Concentric pulsing compass animation indicating indoor orientation.

### 2. Location Scanning (`2 · Scan Location`)
- **Simulated QR/NFC Scanner**: Realistic optical viewfinder with holographic cyan corners, dynamic scanning laser beam, and status indicators.
- **Multimodal Positioning Signals**:
  - **QR Tag**: Instant verification (e.g., Tag `#A1-004`).
  - **Bluetooth Beacons**: 3 nearby BLE beacons simulated with signal strength triangulation.
  - **Heading Orientation**: Digital compass bearing (e.g., *Facing East*).
- **Accessibility Controls**:
  - ⚡ **Torch / Flashlight**: Visual illumination simulation.
  - 🛈 **NFC Tap**: Wave ripple simulation with audio confirmation.
  - 🔊 **Audio Cues**: Synthesized beacon sonar ping with text-to-speech spoken location readout.
- **Tag Switcher**: Test positioning at Main Entrance, Canteen, Auditorium, or Central Library.

### 3. Indoor 2D Navigation (`3 · Navigate`)
- **Interactive SVG Campus Map**:
  - Renders all campus rooms (*Room 101, Lab 102, Central Library, Admin Office, Canteen, Washrooms, Auditorium*), doors, corridors (*Main Corridor, Corridor B*), stairs, and accessibility lifts.
  - Interactive clickable rooms to dynamically change target destination.
  - Animated dashed turquoise route path with glowing waypoints.
  - Pulsing *"You are here"* beacon and red destination flag.
- **Turn-by-Turn Guidance Cards**:
  - **Next Instruction Card**: Gradient banner showing metric distance (`↑ 35 m`) and detailed direction (*"Walk straight along the main corridor, then turn left at Corridor B."*).
  - **Then Step List**: Sub-steps showing turns, distances, and landmarks (*"Turn left, walk 20 m"*, *"Library door on your right"*).
- **Navigation Controls**:
  - `⟳ Repeat`: Re-speaks the current navigation instruction.
  - `⏸ Pause / Resume`: Temporarily freezes live route tracking.
  - `Advance Step`: Simulates moving along waypoints in real time.
- **Proactive Hazard Alert Banner**: Warns user about upcoming crowd transitions and wet floor hazards.

### 4. Smart Hazard Detection (`4 · Hazards`)
- **Live Hazard Scanning Bar**: Displays real-time active alerts detected on the path.
- **Critical Alert Banner**: High-priority alert banner (*"CRITICAL · 18 M AHEAD: Corridor B is blocked - Floor cleaning in progress and wet floor detected. Stop and wait for guidance."*).
- **Visual Hazard Map**: Shows ❌ danger markers on blocked corridors, crowd density zones, floor obstacles, and stairs.
- **Hazard Categorization**:
  1. 🚫 **Blocked corridor** (*Corridor B · 18 m ahead · Wet floor* - Critical)
  2. 👥 **Crowded corridor** (*Main Corridor · ~35 people · Class change* - Moderate)
  3. ⚠️ **Stairs nearby** (*Down steps 12 m to your right* - Caution)
  4. 🎒 **Obstacle on floor** (*Unattended bag · 4 m ahead · left side* - Low)
- **Crowdsourced Hazard Reporting**: Built-in modal allowing students and staff to submit new hazards with location, category, severity, and instant reroute recalculation.

### 5. Intelligent Rerouting (`5 · Rerouting`)
- **Sub-Second Recalculation**: Reroutes in **0.8 s** using Dijkstra's shortest path algorithm with hazard penalties.
- **Side-by-Side Comparison**:
  - **Before (Original Route)**: 62 m distance · 1 min 20 s · **Blocked** at Corridor B.
  - **After (Safe Route via Lab 102)**: 76 m distance (+14 m) · 1 min 40 s (+20 s) · **Clear**.
- **Transparent Safety Reasons**:
  - 🚫 Corridor B is closed for floor cleaning with a wet floor, which is unsafe to walk on.
  - 👥 The main corridor is crowded, so the new route avoids it after Lab 102.
  - ✓ The new route is flat, has no stairs, and is clear of obstacles.
- **Voice Announcement Integration**: Auto-announces: *“Route changed. Turn left into Lab 102 passage in 12 metres.”*

### 6. Voice Assistant (`6 · Voice Assistant`)
- **Hands-Free Guidance**: Speech synthesis using Web Speech API with fallback synthesized tones.
- **Microphone Interaction**: Speech recognition (`SpeechRecognition` / `webkitSpeechRecognition`) supporting natural language voice queries.
- **Voice Commands Supported**:
  - *"Take me to the library"* (Starts navigation to Central Library)
  - *"Where am I?"* (Speaks current room, building, and confidence)
  - *"Where is the nearest washroom?"* (Calculates distance and direction to washrooms)
  - *"How far is left?"* (Reports remaining distance and walking time)
  - *"Call for help"* (Activates emergency SOS protocol)
- **Live Interactive Transcript**: Visual conversation history bubbles with repeat, mute, and text fallback input.

### 7. Emergency SOS (`SOS`)
- **Rapid Confirmation Dialog**: 3-second auto-dispatch countdown with emergency siren sound effect.
- **Live Telemetry Sharing**:
  - Campus Coordinates: `Lat: 12.9716° N, Lon: 77.5946° E`
  - Indoor Beacon: `Block A · Floor 1 · Node #A1-004`
- **Security Dispatch Simulation**: Assigns Officer R. Sharma (QRT-1) with 2-minute ETA and campus control desk contact number (`+91 80 2555 0199`).
- **Safety Notice**: Clearly states that this is a simulated campus emergency demonstration.

---

## 🎯 1-Click Hackathon Demo Scenario

RAAHI includes a dedicated **1-Click Hackathon Demo** feature in the header and sidebar that walks judges through the complete 8-step journey:

1. **User opens RAAHI** at Main Entrance, Block A, Floor 1 (94% confidence).
2. **User selects Central Library** as the destination.
3. **RAAHI displays walking route of 62 metres** (1 min 20 s via Corridor B).
4. **Wet-floor hazard appears in Corridor B** (cleaning in progress).
5. **System detects original route is unsafe** and triggers danger alerts.
6. **RAAHI calculates a new route through Lab 102 passage** in 0.8 s.
7. **Displays updated route of 76 metres (+14 m)** with safety explanations.
8. **Voice assistant announces**: *"Route changed. Turn left into Lab 102 passage in 12 metres."*

You can run this demo via **Auto-Play** (4 seconds per step) or step through it manually with celebration confetti upon completion!

---

## 🛠️ Technical Implementation

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (customized palette `#00BFA5`, `#0D9488`, `#E6F7F5`, `#FCE7EB`, `#F43F5E`)
- **Icons**: Lucide React
- **Indoor Routing Engine**:
  - Campus graph representation with nodes (rooms, corridors, doors, junctions) and weighted edges.
  - Dijkstra shortest path routing with dynamic edge blocking for critical hazards and penalty weights for crowded areas.
  - Polyline generation for smooth SVG canvas rendering.
- **Audio & Speech Engine**:
  - Web Audio API oscillators for synthesized beacon pings, hazard alert chimes, and SOS siren effects.
  - Web Speech API (`SpeechSynthesis`) for Indian English voice guidance.
  - Speech Recognition (`webkitSpeechRecognition`) for hands-free voice input.
- **No External Paid APIs or Hardware Needed**: Self-contained, zero external backend dependencies, runs 100% offline in browser.

---

## 🚀 How to Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:5173
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Browser Compatibility
- Google Chrome / Chromium (Recommended for full Web Speech synthesis & recognition)
- Microsoft Edge
- Mozilla Firefox
- Safari (iOS / macOS)

---

*Designed and developed for smart campus safety, accessibility, and navigation excellence.*

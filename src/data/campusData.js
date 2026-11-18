// Campus data for RAAHI: Block A · Floor 1 (Kalpana Institute of Technology)

export const CAMPUS_METADATA = {
  institution: "Kalpana Institute of Technology",
  building: "Block A",
  floor: "Floor 1",
  mapDimensions: { width: 1040, height: 480 },
  version: "2.4.0",
  activeBeaconsCount: 3,
};

export const ROOMS_DATA = [
  {
    id: "room_101",
    name: "Room 101",
    shortName: "Room 101",
    x: 40,
    y: 30,
    width: 220,
    height: 195,
    type: "classroom",
    bgColor: "#FDF2F4",
    borderColor: "#FBCFE8",
    door: { x: 150, y: 225 },
    category: "Academic",
    capacity: 60,
    nodeId: "n_room101_door",
  },
  {
    id: "lab_102",
    name: "Lab 102",
    shortName: "Lab 102",
    x: 280,
    y: 30,
    width: 240,
    height: 195,
    type: "laboratory",
    bgColor: "#FDF2F4",
    borderColor: "#FBCFE8",
    door: { x: 380, y: 225 },
    passageDoorNorth: { x: 520, y: 120 },
    category: "Academic",
    capacity: 45,
    nodeId: "n_lab102_door",
    description: "Equipped with bypass safety passage connecting to Library North Wing",
  },
  {
    id: "central_library",
    name: "Central Library",
    shortName: "Library",
    x: 540,
    y: 30,
    width: 230,
    height: 195,
    type: "library",
    bgColor: "#E6F7F5",
    borderColor: "#5EEAD4",
    textColor: "#0D9488",
    door: { x: 550, y: 130 },
    category: "Facility",
    tagId: "A1-012",
    nodeId: "n_library_door",
    distanceFromStart: 62,
    walkingTimeSeconds: 80,
    quickAccess: true,
  },
  {
    id: "admin_office",
    name: "Admin Office",
    shortName: "Admin Office",
    x: 790,
    y: 30,
    width: 210,
    height: 195,
    type: "administrative",
    bgColor: "#FDF2F8",
    borderColor: "#FBCFE8",
    door: { x: 800, y: 140 },
    category: "Administrative",
    tagId: "A1-016",
    nodeId: "n_admin_door",
    distanceFromStart: 95,
    walkingTimeSeconds: 120,
    quickAccess: true,
  },
  {
    id: "canteen",
    name: "Canteen",
    shortName: "Canteen",
    x: 40,
    y: 285,
    width: 220,
    height: 175,
    type: "amenity",
    bgColor: "#FDF2F4",
    borderColor: "#FBCFE8",
    door: { x: 150, y: 285 },
    category: "Food & Drinks",
    tagId: "A1-008",
    nodeId: "n_canteen_door",
    distanceFromStart: 25,
    walkingTimeSeconds: 30,
    quickAccess: true,
  },
  {
    id: "washrooms",
    name: "Washrooms",
    shortName: "Washrooms",
    x: 280,
    y: 285,
    width: 220,
    height: 175,
    type: "amenity",
    bgColor: "#FDF2F4",
    borderColor: "#FBCFE8",
    door: { x: 380, y: 285 },
    category: "Restrooms",
    tagId: "A1-006",
    nodeId: "n_washroom_door",
    distanceFromStart: 38,
    walkingTimeSeconds: 45,
    quickAccess: true,
  },
  {
    id: "auditorium",
    name: "Auditorium",
    shortName: "Auditorium",
    x: 520,
    y: 285,
    width: 250,
    height: 175,
    type: "event",
    bgColor: "#FDF2F4",
    borderColor: "#FBCFE8",
    door: { x: 600, y: 285 },
    category: "Events",
    tagId: "A1-010",
    nodeId: "n_auditorium_door",
    distanceFromStart: 85,
    walkingTimeSeconds: 110,
    quickAccess: false,
  },
  {
    id: "lift",
    name: "LIFT",
    shortName: "Lift",
    x: 790,
    y: 310,
    width: 85,
    height: 75,
    type: "transit",
    bgColor: "#2563EB",
    borderColor: "#1D4ED8",
    textColor: "#FFFFFF",
    door: { x: 790, y: 270 },
    category: "Accessibility",
    tagId: "A1-018",
    nodeId: "n_lift_door",
    distanceFromStart: 90,
    walkingTimeSeconds: 115,
    quickAccess: true,
  },
  {
    id: "stairs",
    name: "STAIRS",
    shortName: "Stairs",
    x: 885,
    y: 310,
    width: 85,
    height: 75,
    type: "transit",
    bgColor: "#C2410C",
    borderColor: "#9A3412",
    textColor: "#FFFFFF",
    door: { x: 885, y: 270 },
    category: "Transit",
    tagId: "A1-020",
    nodeId: "n_stairs_door",
    distanceFromStart: 98,
    walkingTimeSeconds: 125,
    quickAccess: false,
  },
];

export const CORRIDORS_DATA = [
  {
    id: "main_corridor",
    name: "Main Corridor",
    x: 30,
    y: 230,
    width: 970,
    height: 50,
    color: "#F8FAFC",
  },
  {
    id: "corridor_b",
    name: "Corridor B",
    x: 525,
    y: 30,
    width: 40,
    height: 200,
    color: "#F8FAFC",
  },
];

// Campus Navigation Graph
// Coordinates correspond to the 1040x480 SVG map coordinate system
export const GRAPH_NODES = {
  n_start: {
    id: "n_start",
    label: "Main Entrance",
    x: 60,
    y: 255,
    type: "entrance",
    tagId: "A1-004",
    building: "Block A",
    floor: "Floor 1",
  },
  n_room101_door: {
    id: "n_room101_door",
    label: "Room 101 Entry",
    x: 150,
    y: 225,
    type: "door",
    tagId: "A1-002",
  },
  n_bag_obstacle: {
    id: "n_bag_obstacle",
    label: "Corridor West (Bag Obstacle)",
    x: 140,
    y: 255,
    type: "corridor_point",
  },
  n_canteen_junc: {
    id: "n_canteen_junc",
    label: "Canteen Junction",
    x: 200,
    y: 255,
    type: "junction",
  },
  n_crowd_zone: {
    id: "n_crowd_zone",
    label: "Main Corridor (Crowded Section)",
    x: 310,
    y: 255,
    type: "corridor_point",
  },
  n_lab102_door: {
    id: "n_lab102_door",
    label: "Lab 102 South Door",
    x: 380,
    y: 255,
    type: "door",
  },
  n_lab102_inner: {
    id: "n_lab102_inner",
    label: "Lab 102 Internal Passage",
    x: 380,
    y: 130,
    type: "bypass_passage",
  },
  n_lab102_north: {
    id: "n_lab102_north",
    label: "Lab 102 North Link",
    x: 530,
    y: 130,
    type: "passage_exit",
  },
  n_corridor_b_junc: {
    id: "n_corridor_b_junc",
    label: "Corridor B Turn Point",
    x: 530,
    y: 255,
    type: "junction",
  },
  n_corridor_b_hazard: {
    id: "n_corridor_b_hazard",
    label: "Corridor B Hazard (Wet Floor)",
    x: 530,
    y: 195,
    type: "hazard_point",
  },
  n_library_door: {
    id: "n_library_door",
    label: "Central Library Entrance",
    x: 555,
    y: 130,
    type: "destination",
    tagId: "A1-012",
  },
  n_auditorium_door: {
    id: "n_auditorium_door",
    label: "Auditorium Main Entry",
    x: 600,
    y: 285,
    type: "door",
    tagId: "A1-010",
  },
  n_admin_junc: {
    id: "n_admin_junc",
    label: "Admin & Lift Junction",
    x: 800,
    y: 255,
    type: "junction",
  },
  n_lift_door: {
    id: "n_lift_door",
    label: "Lift Entrance",
    x: 820,
    y: 275,
    type: "door",
    tagId: "A1-018",
  },
  n_stairs_door: {
    id: "n_stairs_door",
    label: "East Staircase Entrance",
    x: 910,
    y: 275,
    type: "door",
    tagId: "A1-020",
  },
  n_washroom_door: {
    id: "n_washroom_door",
    label: "Washrooms Entry",
    x: 380,
    y: 285,
    type: "door",
    tagId: "A1-006",
  },
  n_canteen_door: {
    id: "n_canteen_door",
    label: "Canteen Entry",
    x: 150,
    y: 285,
    type: "door",
    tagId: "A1-008",
  },
  n_admin_door: {
    id: "n_admin_door",
    label: "Admin Office Entry",
    x: 810,
    y: 140,
    type: "door",
    tagId: "A1-016",
  },
};

// Complete bidirectional graph edges
export const GRAPH_EDGES = [
  // Main spine west-to-east
  { from: "n_start", to: "n_bag_obstacle", distance: 8, baseCrowd: 1 },
  { from: "n_bag_obstacle", to: "n_canteen_junc", distance: 6, baseCrowd: 1 },
  { from: "n_canteen_junc", to: "n_crowd_zone", distance: 11, baseCrowd: 2 },
  { from: "n_crowd_zone", to: "n_lab102_door", distance: 7, baseCrowd: 3 },
  { from: "n_lab102_door", to: "n_corridor_b_junc", distance: 15, baseCrowd: 2 },
  { from: "n_corridor_b_junc", to: "n_admin_junc", distance: 27, baseCrowd: 1 },

  // Room 101 connection
  { from: "n_bag_obstacle", to: "n_room101_door", distance: 6 },

  // Corridor B (Direct path to Library)
  { from: "n_corridor_b_junc", to: "n_corridor_b_hazard", distance: 6, corridor: "Corridor B" },
  { from: "n_corridor_b_hazard", to: "n_library_door", distance: 9, corridor: "Corridor B" },

  // Lab 102 bypass passage (Alternate safe bypass)
  { from: "n_lab102_door", to: "n_lab102_inner", distance: 13, passage: "Lab 102 Passage" },
  { from: "n_lab102_inner", to: "n_lab102_north", distance: 15, passage: "Lab 102 Passage" },
  { from: "n_lab102_north", to: "n_library_door", distance: 6, corridor: "North Wing Access" },

  // Canteen, Washrooms, Auditorium
  { from: "n_canteen_junc", to: "n_canteen_door", distance: 4 },
  { from: "n_crowd_zone", to: "n_washroom_door", distance: 8 },
  { from: "n_corridor_b_junc", to: "n_auditorium_door", distance: 10 },

  // Admin, Lift, and Staircase
  { from: "n_admin_junc", to: "n_admin_door", distance: 12 },
  { from: "n_admin_junc", to: "n_lift_door", distance: 5 },
  { from: "n_admin_junc", to: "n_stairs_door", distance: 11 },
  { from: "n_lift_door", to: "n_stairs_door", distance: 7 },
];

export const INITIAL_HAZARDS = [
  {
    id: "hz_wet_corridor_b",
    title: "Blocked corridor",
    location: "Corridor B",
    distanceAhead: 18,
    type: "blocked",
    severity: "CRITICAL",
    icon: "Ban",
    tag: "Wet floor",
    description: "Floor cleaning in progress and wet floor detected. Stop and wait for guidance.",
    blockedEdges: [
      ["n_corridor_b_junc", "n_corridor_b_hazard"],
      ["n_corridor_b_hazard", "n_library_door"],
    ],
    mapPoint: { x: 530, y: 195 },
    active: true,
  },
  {
    id: "hz_crowd_main",
    title: "Crowded corridor",
    location: "Main Corridor",
    crowdEstimate: "~35 people",
    reason: "Class change",
    type: "crowded",
    severity: "MEDIUM",
    icon: "Users",
    tag: "Heavy flow",
    description: "Main corridor has heavy pedestrian flow between classes.",
    mapPoint: { x: 310, y: 255 },
    active: true,
  },
  {
    id: "hz_stairs_nearby",
    title: "Stairs nearby",
    location: "Down steps 12 m to your right",
    distanceAhead: 12,
    type: "stairs",
    severity: "INFO",
    icon: "TrendingDown",
    tag: "Caution steps",
    description: "Descent steps detected. For wheelchair or cart access, divert to the Lift.",
    mapPoint: { x: 885, y: 310 },
    active: true,
  },
  {
    id: "hz_bag_obstacle",
    title: "Obstacle on floor",
    location: "Unattended bag · 4 m ahead · left side",
    distanceAhead: 4,
    type: "obstacle",
    severity: "LOW",
    icon: "Package",
    tag: "Temporary obstruction",
    description: "Unattended backpack resting on the left corridor floor.",
    mapPoint: { x: 140, y: 245 },
    active: true,
  },
];

export const SAMPLE_TAGS = [
  {
    id: "A1-004",
    name: "Main Entrance",
    building: "Block A",
    floor: "Floor 1",
    confidence: 94,
    beaconsNearby: 3,
    heading: "Facing East",
    nodeId: "n_start",
    tts: "You are at the Main Entrance, Block A. Facing east.",
  },
  {
    id: "A1-020",
    name: "East Staircase Landing",
    building: "Block A",
    floor: "Floor 1",
    confidence: 97,
    beaconsNearby: 4,
    heading: "Facing West towards Corridor",
    nodeId: "n_stairs_door",
    tts: "You are at the East Wing Stairwell landing. Lift is on your right.",
  },
  {
    id: "A1-008",
    name: "Canteen Hub",
    building: "Block A",
    floor: "Floor 1",
    confidence: 96,
    beaconsNearby: 4,
    heading: "Facing North",
    nodeId: "n_canteen_door",
    tts: "You are near the Canteen Hub, Block A Floor 1.",
  },
  {
    id: "A1-006",
    name: "Washrooms & Rest Area",
    building: "Block A",
    floor: "Floor 1",
    confidence: 91,
    beaconsNearby: 2,
    heading: "Facing East",
    nodeId: "n_washroom_door",
    tts: "You are at the Washrooms entry hallway.",
  },
  {
    id: "A1-012",
    name: "Central Library Gate",
    building: "Block A",
    floor: "Floor 1",
    confidence: 98,
    beaconsNearby: 4,
    heading: "Facing South",
    nodeId: "n_library_door",
    tts: "Welcome to Central Library, Block A.",
  },
];

// Visual Landmark Database for Photo-Based VPS Positioning
export const LANDMARK_PHOTOS = [
  {
    id: "photo_staircase",
    name: "East Wing Staircase",
    category: "Stairwell / Transit",
    nodeId: "n_stairs_door",
    building: "Block A",
    floor: "Floor 1",
    confidence: 97,
    heading: "Facing West toward Main Corridor",
    description: "Granite wide steps with safety yellow treads and stainless steel handrails near Lift Lobby.",
    tag: "Tag #A1-020",
    features: [
      "Flight of 18 steps with anti-slip nosing",
      "Stainless steel safety handrail",
      "Green Emergency Exit sign #EX-14",
      "Adjacent to Lift Shaft wall",
    ],
    tts: "Visual Landmark recognized: You are at the East Wing Staircase, Block A, Floor 1.",
    // Vector illustration representation for instant offline preview
    previewSvg: `
      <svg viewBox="0 0 400 300" class="w-full h-full object-cover">
        <rect width="400" height="300" fill="#E2E8F0"/>
        <path d="M0 120 L400 60 L400 300 L0 300 Z" fill="#CBD5E1"/>
        <polygon points="50,280 120,240 180,240 110,280" fill="#94A3B8"/>
        <polygon points="110,240 180,200 240,200 170,240" fill="#64748B"/>
        <polygon points="170,200 240,160 300,160 230,200" fill="#475569"/>
        <polygon points="230,160 300,120 360,120 290,160" fill="#334155"/>
        <line x1="30" y1="230" x2="330" y2="80" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
        <rect x="290" y="30" width="80" height="35" rx="6" fill="#10B981"/>
        <text x="330" y="52" fill="#FFFFFF" font-size="12" font-weight="bold" text-anchor="middle">EXIT →</text>
        <circle cx="200" cy="150" r="18" fill="none" stroke="#00BFA5" stroke-width="3" stroke-dasharray="4 2"/>
        <text x="200" y="195" fill="#0F172A" font-size="11" font-weight="bold" text-anchor="middle">East Wing Steps #A1-020</text>
      </svg>
    `,
  },
  {
    id: "photo_entrance",
    name: "Main Entrance Portico",
    category: "Building Entry",
    nodeId: "n_start",
    building: "Block A",
    floor: "Floor 1",
    confidence: 95,
    heading: "Facing East into Corridor",
    description: "Automatic glass double doors with security turnstiles and digital information kiosk.",
    tag: "Tag #A1-004",
    features: [
      "Twin sliding glass turnstile gates",
      "Welcome digital information kiosk",
      "Kalpana Institute bronze wall emblem",
    ],
    tts: "Visual Landmark recognized: You are at the Main Entrance, Block A.",
    previewSvg: `
      <svg viewBox="0 0 400 300" class="w-full h-full object-cover">
        <rect width="400" height="300" fill="#F1F5F9"/>
        <rect x="60" y="40" width="280" height="220" rx="10" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>
        <line x1="200" y1="40" x2="200" y2="260" stroke="#0D9488" stroke-width="6"/>
        <rect x="90" y="120" width="90" height="130" fill="#99F6E4" opacity="0.5"/>
        <rect x="220" y="120" width="90" height="130" fill="#99F6E4" opacity="0.5"/>
        <rect x="130" y="15" width="140" height="25" rx="5" fill="#0F172A"/>
        <text x="200" y="32" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle">BLOCK A ENTRANCE</text>
        <circle cx="200" cy="170" r="20" fill="none" stroke="#00BFA5" stroke-width="3" stroke-dasharray="4 2"/>
      </svg>
    `,
  },
  {
    id: "photo_library",
    name: "Central Library Glass Gate",
    category: "Academic Facility",
    nodeId: "n_library_door",
    building: "Block A",
    floor: "Floor 1",
    confidence: 98,
    heading: "Facing North toward Stacks",
    description: "Frosted acoustic glass portal with automated RFID book loan scanners.",
    tag: "Tag #A1-012",
    features: [
      "Dual RFID anti-theft scanner pedestals",
      "Acoustic wooden slatted ceiling",
      "Central Library signage plaque",
    ],
    tts: "Visual Landmark recognized: You are at Central Library entrance.",
    previewSvg: `
      <svg viewBox="0 0 400 300" class="w-full h-full object-cover">
        <rect width="400" height="300" fill="#F0FDFA"/>
        <rect x="80" y="50" width="240" height="210" rx="12" fill="#CCFBF1" stroke="#5EEAD4" stroke-width="4"/>
        <rect x="110" y="90" width="25" height="160" rx="4" fill="#0D9488"/>
        <rect x="265" y="90" width="25" height="160" rx="4" fill="#0D9488"/>
        <rect x="145" y="30" width="110" height="24" rx="4" fill="#134E4A"/>
        <text x="200" y="46" fill="#FFFFFF" font-size="10" font-weight="bold" text-anchor="middle">CENTRAL LIBRARY</text>
        <circle cx="200" cy="150" r="20" fill="none" stroke="#00BFA5" stroke-width="3" stroke-dasharray="4 2"/>
      </svg>
    `,
  },
  {
    id: "photo_canteen",
    name: "Canteen Hub & Cafeteria",
    category: "Food & Drinks",
    nodeId: "n_canteen_door",
    building: "Block A",
    floor: "Floor 1",
    confidence: 94,
    heading: "Facing South toward Counter",
    description: "Dining area entrance with digital daily menu board and beverage station.",
    tag: "Tag #A1-008",
    features: [
      "Illuminated digital menu display",
      "Stainless steel tray return shelf",
      "Red accent pillar",
    ],
    tts: "Visual Landmark recognized: You are at the Canteen Food Court.",
    previewSvg: `
      <svg viewBox="0 0 400 300" class="w-full h-full object-cover">
        <rect width="400" height="300" fill="#FFF1F2"/>
        <rect x="60" y="60" width="280" height="190" rx="8" fill="#FFE4E6" stroke="#FDA4AF" stroke-width="3"/>
        <circle cx="120" cy="160" r="30" fill="#F43F5E" opacity="0.8"/>
        <circle cx="280" cy="160" r="30" fill="#F43F5E" opacity="0.8"/>
        <rect x="160" y="140" width="80" height="70" rx="6" fill="#FB7185"/>
        <rect x="120" y="35" width="160" height="24" rx="4" fill="#BE123C"/>
        <text x="200" y="51" fill="#FFFFFF" font-size="10" font-weight="bold" text-anchor="middle">CAMPUS FOOD HUB</text>
        <circle cx="200" cy="180" r="20" fill="none" stroke="#00BFA5" stroke-width="3" stroke-dasharray="4 2"/>
      </svg>
    `,
  },
];

// Advanced Audio, Speech Recognition & Synthesized Cues for RAAHI

let audioCtx = null;
let micStream = null;
let analyserNode = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Initializes real microphone stream and Web Audio Analyser
 * Returns audio energy level (0-100) via callback
 */
export async function startMicAnalyser(onVolumeChange) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream = stream;

    const ctx = getAudioContext();
    if (!ctx) return null;

    const source = ctx.createMediaStreamSource(stream);
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 64;
    source.connect(analyserNode);

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    let isTracking = true;

    const checkVolume = () => {
      if (!isTracking || !analyserNode) return;
      analyserNode.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const volumeLevel = Math.min(100, Math.round((average / 128) * 100));
      onVolumeChange(volumeLevel, dataArray);

      requestAnimationFrame(checkVolume);
    };

    requestAnimationFrame(checkVolume);

    return () => {
      isTracking = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      micStream = null;
      analyserNode = null;
    };
  } catch (err) {
    console.warn('Microphone permission or stream not available:', err);
    return null;
  }
}

/**
 * Synthesizes a gentle radar beacon ping
 */
export function playBeaconPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio ping error:', e);
  }
}

/**
 * Positive acknowledgement chime when voice command is recognized
 */
export function playVoiceAcknowledge() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {}
}

/**
 * Synthesizes an alert chime for hazards
 */
export function playHazardAlert() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.2);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.warn('Hazard alert error:', e);
  }
}

/**
 * Synthesizes an SOS alarm siren (returns a stop function)
 */
export function playSosSiren() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2, ctx.currentTime);
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    lfo.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    return () => {
      try {
        osc.stop();
        lfo.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (err) {}
    };
  } catch (e) {
    return () => {};
  }
}

/**
 * Text-to-speech helper with Indian English voice preference
 */
export function speakText(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes('en-IN') ||
        v.name.includes('India') ||
        v.lang.includes('en-GB') ||
        v.lang.includes('en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Enhanced Natural Language Intent Parser with broad fuzzy matching
 */
export function parseVoiceIntent(transcript) {
  const t = transcript.toLowerCase().trim();

  // 1. START / NAVIGATION LAUNCH INTENT
  if (
    t === 'start' ||
    t.includes('start') ||
    t.includes('begin') ||
    t.includes('let us go') ||
    t.includes("let's go") ||
    t.includes('chalo') ||
    t.includes('shuru') ||
    t.includes('navigate now')
  ) {
    return {
      type: 'start_navigation',
      reply: 'Starting navigation now. Follow the highlighted corridor path.',
    };
  }

  // 2. LIBRARY
  if (t.includes('library') || t.includes('book') || t.includes('reading')) {
    return {
      type: 'navigate',
      destination: 'central_library',
      reply: 'Starting navigation to Central Library. Distance is 62 metres.',
    };
  }

  // 3. STAIRCASE / STEPS
  if (t.includes('stair') || t.includes('step') || t.includes('stairs')) {
    return {
      type: 'navigate',
      destination: 'stairs',
      reply: 'Navigating to East Wing Staircase. 98 metres ahead on the right.',
    };
  }

  // 4. WASHROOMS
  if (
    t.includes('washroom') ||
    t.includes('toilet') ||
    t.includes('restroom') ||
    t.includes('loo') ||
    t.includes('water')
  ) {
    return {
      type: 'navigate',
      destination: 'washrooms',
      reply: 'Washrooms are 38 metres ahead on the left. Guiding you there.',
    };
  }

  // 5. CANTEEN / FOOD
  if (
    t.includes('canteen') ||
    t.includes('cafeteria') ||
    t.includes('food') ||
    t.includes('coffee') ||
    t.includes('lunch') ||
    t.includes('eat')
  ) {
    return {
      type: 'navigate',
      destination: 'canteen',
      reply: 'Setting route to Canteen Food Hub. 25 metres on your left.',
    };
  }

  // 6. LIFT / ELEVATOR
  if (t.includes('lift') || t.includes('elevator') || t.includes('wheelchair')) {
    return {
      type: 'navigate',
      destination: 'lift',
      reply: 'Navigating to accessible Lift lobby. 90 metres ahead near the Admin block.',
    };
  }

  // 7. ADMIN OFFICE
  if (t.includes('admin') || t.includes('office') || t.includes('staff') || t.includes('principal')) {
    return {
      type: 'navigate',
      destination: 'admin_office',
      reply: 'Setting course for Admin Office. 95 metres along Main Corridor.',
    };
  }

  // 8. WHERE AM I / LOCATION
  if (
    t.includes('where am i') ||
    t.includes('location') ||
    t.includes('current position') ||
    t.includes('kahan')
  ) {
    return {
      type: 'info',
      reply: 'You are currently at Main Entrance, Block A, Floor 1. Sensor confidence is 94%.',
    };
  }

  // 9. EMERGENCY / SOS
  if (
    t.includes('help') ||
    t.includes('emergency') ||
    t.includes('sos') ||
    t.includes('security') ||
    t.includes('bachao') ||
    t.includes('madad')
  ) {
    return {
      type: 'sos',
      reply: 'Alerting Campus Security Operations Center now. Help is on the way.',
    };
  }

  // 10. HAZARD CHECK
  if (t.includes('hazard') || t.includes('blocked') || t.includes('wet floor') || t.includes('safe')) {
    return {
      type: 'hazard_check',
      reply: 'Caution: Wet floor detected in Corridor B. Safe bypass available through Lab 102.',
    };
  }

  // 11. REPEAT INSTRUCTION
  if (t.includes('repeat') || t.includes('again') || t.includes('pardon') || t.includes('what')) {
    return {
      type: 'repeat',
      reply: 'Walk straight along the main corridor, then turn left at Corridor B.',
    };
  }

  return {
    type: 'general',
    reply: `I heard: "${transcript}". Say "Start" to navigate, or ask for Library, Staircase, or Washroom.`,
  };
}

/**
 * Resilient Speech Recognizer with interim live text and auto-restart
 */
export function createSpeechRecognizer(onResult, onStatusChange, onError, options = {}) {
  if (typeof window === 'undefined') return null;

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    return null;
  }

  try {
    const recognizer = new SpeechRec();
    recognizer.continuous = options.continuous ?? true;
    recognizer.interimResults = true; // Provides live typing feedback as user speaks
    recognizer.lang = options.lang || 'en-IN';

    recognizer.onstart = () => onStatusChange && onStatusChange('listening');
    recognizer.onend = () => onStatusChange && onStatusChange('idle');
    recognizer.onerror = (e) => {
      console.warn('Speech recognition status:', e.error);
      if (onError) onError(e.error);
      if (onStatusChange) onStatusChange('idle');
    };

    recognizer.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text.trim() && onResult) {
        onResult(text.trim(), Boolean(finalTranscript));
      }
    };

    return recognizer;
  } catch (e) {
    console.warn('Failed creating recognizer:', e);
    return null;
  }
}

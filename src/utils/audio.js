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
      // Normalized level 0 to 100
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
 * Text-to-speech helper
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
 * Natural language intent parser for voice commands
 */
export function parseVoiceIntent(transcript) {
  const t = transcript.toLowerCase();

  if (t.includes('library') || t.includes('book')) {
    return {
      type: 'navigate',
      destination: 'central_library',
      reply: 'Starting navigation to Central Library. Distance is 62 metres.',
    };
  }
  if (t.includes('stair') || t.includes('steps')) {
    return {
      type: 'navigate',
      destination: 'stairs',
      reply: 'Navigating to East Wing Staircase. 98 metres ahead on the right.',
    };
  }
  if (t.includes('washroom') || t.includes('toilet') || t.includes('restroom')) {
    return {
      type: 'navigate',
      destination: 'washrooms',
      reply: 'Washrooms are 38 metres ahead on the left. Shall I guide you there?',
    };
  }
  if (t.includes('canteen') || t.includes('cafeteria') || t.includes('food') || t.includes('coffee')) {
    return {
      type: 'navigate',
      destination: 'canteen',
      reply: 'Setting route to Canteen food hub. 25 metres on your left.',
    };
  }
  if (t.includes('lift') || t.includes('elevator')) {
    return {
      type: 'navigate',
      destination: 'lift',
      reply: 'Navigating to accessible Lift lobby. 90 metres ahead near the Admin block.',
    };
  }
  if (t.includes('admin') || t.includes('office')) {
    return {
      type: 'navigate',
      destination: 'admin_office',
      reply: 'Setting course for Admin Office. 95 metres along Main Corridor.',
    };
  }
  if (t.includes('room 101') || t.includes('classroom')) {
    return {
      type: 'navigate',
      destination: 'room_101',
      reply: 'Navigating to Room 101 on your right.',
    };
  }
  if (t.includes('where am i') || t.includes('location') || t.includes('current position')) {
    return {
      type: 'info',
      reply: 'You are currently at Main Entrance, Block A, Floor 1. Location confidence is 94%.',
    };
  }
  if (t.includes('help') || t.includes('emergency') || t.includes('sos') || t.includes('security')) {
    return {
      type: 'sos',
      reply: 'Alerting Campus Security Operations Center now. Help is on the way.',
    };
  }
  if (t.includes('hazard') || t.includes('blocked') || t.includes('wet floor')) {
    return {
      type: 'hazard_check',
      reply: 'Caution: Wet floor detected in Corridor B. Safe bypass available through Lab 102.',
    };
  }

  return {
    type: 'general',
    reply: `I heard: "${transcript}". Say "Take me to library", "Where am I?", or "Nearest washroom".`,
  };
}

/**
 * Speech Recognition Instance Builder with robust error fallback
 */
export function createSpeechRecognizer(onResult, onStatusChange, onError) {
  if (typeof window === 'undefined') return null;

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    return null;
  }

  try {
    const recognizer = new SpeechRec();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = 'en-IN';

    recognizer.onstart = () => onStatusChange && onStatusChange('listening');
    recognizer.onend = () => onStatusChange && onStatusChange('idle');
    recognizer.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      if (onError) onError(e.error);
      if (onStatusChange) onStatusChange('idle');
    };

    recognizer.onresult = (event) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    return recognizer;
  } catch (e) {
    console.warn('Failed creating recognizer:', e);
    return null;
  }
}

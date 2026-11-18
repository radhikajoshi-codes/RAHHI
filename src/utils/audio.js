// Audio and Speech Utilities for RAAHI

let audioCtx = null;

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

    // LFO for modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2, ctx.currentTime); // 2 Hz cycle
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
 * Text-to-speech helper with Indian English or preferred voice
 */
export function speakText(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Pick English (India) or clean English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en-IN') || v.name.includes('India') || v.lang.includes('en-GB') || v.lang.includes('en-US')
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

/**
 * Stop active speech synthesis
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Recognition Wrapper
 */
export function createSpeechRecognizer(onResult, onStatusChange) {
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
      console.warn('Speech recognition event:', e.error);
      onStatusChange && onStatusChange('idle');
    };

    recognizer.onresult = (event) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    return recognizer;
  } catch (e) {
    return null;
  }
}

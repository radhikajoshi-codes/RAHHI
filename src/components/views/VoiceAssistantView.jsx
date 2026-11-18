import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  VolumeX,
  Volume2,
  Bot,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  speakText,
  stopSpeech,
  createSpeechRecognizer,
  startMicAnalyser,
  parseVoiceIntent,
  playVoiceAcknowledge,
} from '../../utils/audio';

export default function VoiceAssistantView({
  soundEnabled,
  onToggleSound,
  onNavigateTo,
  onOpenSos,
}) {
  const [isListening, setIsListening] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState('1.0x');
  const [queryText, setQueryText] = useState('');
  const [activePrompt, setActivePrompt] = useState('Tap the mic and speak any command (e.g. "Start navigation")');
  const [interimText, setInterimText] = useState('');
  const [micVolume, setMicVolume] = useState(0);
  const [audioBars, setAudioBars] = useState([8, 14, 20, 16, 26, 18, 22, 12]);
  const [permissionError, setPermissionError] = useState(null);

  const cleanupMicRef = useRef(null);
  const recognizerRef = useRef(null);

  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'raahi',
      text: 'Hello Aarav! I am listening. You can say "Start navigation", "Where is the library?", "Where is the nearest washroom?", or "Where am I?".',
    },
  ]);

  const trySayingPrompts = [
    { text: 'Start navigation', label: 'Start Nav' },
    { text: 'Take me to the library', label: 'Library' },
    { text: 'Take me to the staircase', label: 'Staircase' },
    { text: 'Where is the nearest washroom?', label: 'Washroom' },
    { text: 'Where am I?', label: 'Location' },
    { text: 'Is Corridor B safe?', label: 'Hazard Check' },
    { text: 'Call for help', label: 'Emergency SOS' },
  ];

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      stopVoiceCapture();
    };
  }, []);

  const startVoiceCapture = async () => {
    setPermissionError(null);
    setIsListening(true);
    setActivePrompt('Listening... Speak your command clearly.');
    setInterimText('');

    // 1. Connect real Web Audio microphone analyser
    try {
      const stopAnalyser = await startMicAnalyser((volume, freqData) => {
        setMicVolume(volume);
        if (freqData && freqData.length >= 8) {
          const bars = [
            Math.max(6, Math.min(38, freqData[1] / 5)),
            Math.max(6, Math.min(38, freqData[3] / 4)),
            Math.max(6, Math.min(38, freqData[5] / 3)),
            Math.max(6, Math.min(38, freqData[7] / 3)),
            Math.max(6, Math.min(38, freqData[9] / 3)),
            Math.max(6, Math.min(38, freqData[11] / 4)),
            Math.max(6, Math.min(38, freqData[13] / 5)),
            Math.max(6, Math.min(38, freqData[15] / 6)),
          ];
          setAudioBars(bars);
        }
      });
      cleanupMicRef.current = stopAnalyser;
    } catch (err) {
      console.warn('Mic analyser warning:', err);
    }

    // 2. Start Speech Recognition
    const recognizer = createSpeechRecognizer(
      (transcript, isFinal) => {
        setInterimText(transcript);
        if (isFinal || transcript.toLowerCase().includes('start') || transcript.length > 15) {
          playVoiceAcknowledge();
          handleUserSpeechInput(transcript);
          setInterimText('');
        }
      },
      (status) => {
        if (status === 'idle' && isListening) {
          try {
            recognizer.start();
          } catch (e) {}
        }
      },
      (error) => {
        console.warn('Voice recognizer error:', error);
        if (error === 'not-allowed') {
          setPermissionError('Microphone access was denied. Please allow microphone permission in your browser or use the quick voice chips below.');
          stopVoiceCapture();
        } else if (error === 'no-speech') {
          setActivePrompt('Listening... Speak a destination or command.');
        } else if (error === 'network') {
          setPermissionError('Browser speech recognition network unavailable. You can tap any voice prompt below or type your query.');
          stopVoiceCapture();
        }
      },
      { continuous: true }
    );

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
      }
    } else {
      setPermissionError('Speech recognition is not supported in this browser. Please use the quick voice chips below or type your request.');
    }
  };

  const stopVoiceCapture = () => {
    setIsListening(false);
    if (cleanupMicRef.current) {
      cleanupMicRef.current();
      cleanupMicRef.current = null;
    }
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) { }
      recognizerRef.current = null;
    }
    setMicVolume(0);
    setInterimText('');
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopVoiceCapture();
      setActivePrompt('Tap the mic to ask a question');
    } else {
      startVoiceCapture();
    }
  };

  const handleUserSpeechInput = (transcript) => {
    setActivePrompt(`“${transcript}”`);
    const newMsg = { id: Date.now(), sender: 'user', text: transcript };
    setConversation((prev) => [...prev, newMsg]);

    // Parse natural language intent
    const intent = parseVoiceIntent(transcript);

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'raahi', text: intent.reply },
      ]);

      if (soundEnabled) {
        speakText(intent.reply, { rate: parseFloat(speechSpeed) });
      }

      // Execute intent action
      if (intent.type === 'start_navigation' && onNavigateTo) {
        onNavigateTo('central_library');
      } else if (intent.type === 'navigate' && onNavigateTo) {
        onNavigateTo(intent.destination);
      } else if (intent.type === 'sos' && onOpenSos) {
        onOpenSos();
      }
    }, 450);
  };

  const handleRepeatLast = () => {
    const lastBotMsg = [...conversation].reverse().find((m) => m.sender === 'raahi');
    if (lastBotMsg && soundEnabled) {
      speakText(lastBotMsg.text, { rate: parseFloat(speechSpeed) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-teal-600 tracking-wide uppercase">
            Hands-free Smart Navigation
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Voice Assistant
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Speak naturally to request directions, start navigation, or ask about campus locations.
          </p>
        </div>

        {/* Voice assistance toggle & speed selector */}
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs">
          <div className="text-right">
            <h4 className="text-xs font-bold text-slate-800">Voice Guidance</h4>
            <p className="text-[10px] text-teal-600 font-bold">
              {soundEnabled ? `Active · ${speechSpeed}` : 'Muted'}
            </p>
          </div>

          <button
            onClick={onToggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${soundEnabled ? 'bg-teal-500' : 'bg-slate-300'
              }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>

      {/* Permission alert notice if mic is blocked */}
      {permissionError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Microphone Status Notice: </span>
            <span>{permissionError}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Left Mic Controller (7 cols) & Right Conversation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Glowing Microphone Orb & Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[440px]">
          {/* Status pill */}
          <div className="mb-6 flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-teal-500'
                }`}
            />
            <span>{isListening ? 'Listening... Speak now!' : 'Tap microphone to speak'}</span>
          </div>

          {/* Central Microphone Orb with radiant audio wave reaction */}
          <div className="relative flex items-center justify-center my-4">
            <div
              className={`absolute w-52 h-52 rounded-full transition-all duration-300 ${isListening
                ? 'bg-gradient-to-tr from-teal-300/40 via-sky-300/40 to-pink-300/40 animate-ping opacity-75'
                : 'bg-gradient-to-tr from-teal-100/30 via-slate-100/30 to-pink-100/30 opacity-40'
                }`}
              style={{
                transform: `scale(${1 + micVolume / 120})`,
              }}
            />

            <div className="w-44 h-44 rounded-full border border-teal-200 flex items-center justify-center bg-white shadow-lg shadow-teal-500/10">
              <button
                onClick={handleMicToggle}
                className={`w-32 h-32 rounded-full p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer ${isListening
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600 ring-4 ring-rose-200'
                  : 'bg-gradient-to-br from-teal-300 via-sky-200 to-pink-200 ring-4 ring-teal-100'
                  }`}
                aria-label="Toggle voice input"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Mic
                    className={`w-12 h-12 transition-colors ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-800'
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Equalizer bars driven by real mic frequency */}
          <div className="flex items-end gap-1.5 h-10 my-3">
            {audioBars.map((height, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full transition-all duration-100 ${isListening ? 'bg-gradient-to-t from-teal-400 to-rose-400' : 'bg-slate-200'
                  }`}
                style={{
                  height: isListening ? `${height}px` : '6px',
                }}
              />
            ))}
          </div>

          {/* Active Prompt Quote & Interim Transcript */}
          <p className="text-lg font-extrabold text-slate-900 mt-2 text-center max-w-md px-4">
            {interimText ? `“${interimText}”` : activePrompt}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Say "Start", "Take me to library", or "Where is washroom?"
          </p>

          {/* Control Buttons: Repeat & Mute */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-7">
            <button
              onClick={handleRepeatLast}
              className="py-3 px-4 rounded-2xl bg-[#00BFA5] hover:bg-[#00A896] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repeat instruction</span>
            </button>

            <button
              onClick={onToggleSound}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-pink-200 text-rose-500 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              {soundEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{soundEnabled ? 'Mute' : 'Unmute'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Conversation History & Quick Prompts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Conversation History</span>
              </div>

              {/* Chat bubbles list */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {conversation.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${isUser
                          ? 'bg-[#FCE8EB] text-slate-800 rounded-tr-none'
                          : 'bg-[#E6F7F5] text-slate-900 rounded-tl-none border border-teal-200/60'
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick text input fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (queryText.trim()) {
                  handleUserSpeechInput(queryText.trim());
                  setQueryText('');
                }
              }}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a voice query (e.g. 'start', 'library')..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* One-Tap Voice Commands */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              One-Tap Voice Commands
            </h3>

            <div className="flex flex-wrap gap-2">
              {trySayingPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserSpeechInput(item.text)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>“{item.text}”</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

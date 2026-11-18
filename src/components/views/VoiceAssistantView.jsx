import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  VolumeX,
  Volume2,
  Bot,
  Send,
  Sparkles,
} from 'lucide-react';
import { speakText, stopSpeech, createSpeechRecognizer } from '../../utils/audio';

export default function VoiceAssistantView({
  soundEnabled,
  onToggleSound,
  onNavigateTo,
  onOpenSos,
}) {
  const [isListening, setIsListening] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState('1.0x');
  const [queryText, setQueryText] = useState('');
  const [activePrompt, setActivePrompt] = useState('Where is the nearest washroom?');

  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Take me to the library.',
    },
    {
      id: 2,
      sender: 'raahi',
      text: 'Starting navigation to Central Library. Walk straight for 35 metres.',
    },
    {
      id: 3,
      sender: 'user',
      text: 'Where is the nearest washroom?',
    },
    {
      id: 4,
      sender: 'raahi',
      text: 'Washrooms are 18 metres behind you, on the left. Shall I navigate there?',
    },
  ]);

  const trySayingPrompts = [
    { text: 'Where am I?', answer: 'You are currently in Main Corridor, Block A, Floor 1 near Lab 102.' },
    { text: 'How far is left?', answer: 'You have approximately 27 metres left to reach Central Library.' },
    { text: 'Call for help', action: 'sos', answer: 'Initiating emergency SOS protocol. Connecting to campus security.' },
    { text: 'Take me to the library', action: 'library', answer: 'Setting course for Central Library via safe bypass passage.' },
  ];

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        handleUserMessage(transcript);
        setIsListening(false);
      },
      (status) => {
        if (status === 'idle') setIsListening(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch (e) {
        // Fallback simulation if mic permission or speech recognition unavailable
        simulateMicInput();
      }
    } else {
      simulateMicInput();
    }
  };

  const simulateMicInput = () => {
    setTimeout(() => {
      handleUserMessage(activePrompt);
      setIsListening(false);
    }, 1800);
  };

  const handleUserMessage = (userText) => {
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setConversation((prev) => [...prev, newMsg]);

    const lower = userText.toLowerCase();
    let reply = "I'm with you. Follow the highlighted corridor markers.";

    if (lower.includes('washroom') || lower.includes('toilet') || lower.includes('restroom')) {
      reply = 'Washrooms are 18 metres behind you, on the left. Shall I navigate there?';
    } else if (lower.includes('library') || lower.includes('book')) {
      reply = 'Starting navigation to Central Library. Walk straight for 35 metres.';
      if (onNavigateTo) onNavigateTo('central_library');
    } else if (lower.includes('where am i') || lower.includes('location')) {
      reply = 'You are currently at Main Entrance, Block A, Floor 1. Location confidence is 94%.';
    } else if (lower.includes('help') || lower.includes('emergency') || lower.includes('sos')) {
      reply = 'Triggering emergency campus assistance now.';
      if (onOpenSos) onOpenSos();
    } else if (lower.includes('far') || lower.includes('distance')) {
      reply = 'Central Library is 62 metres away, approximately 1 minute and 20 seconds of walking.';
    }

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'raahi', text: reply },
      ]);
      if (soundEnabled) {
        speakText(reply, { rate: parseFloat(speechSpeed) });
      }
    }, 600);
  };

  const handleTrySaying = (item) => {
    setActivePrompt(item.text);
    handleUserMessage(item.text);
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
            Hands-free guidance
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Voice Assistant
          </h1>
        </div>

        {/* Voice assistance toggle widget */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Voice assistance</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              {soundEnabled ? `On · Speed ${speechSpeed}` : 'Muted'}
            </p>
          </div>

          <button
            onClick={onToggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              soundEnabled ? 'bg-teal-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Mic Controller (7 cols) & Right Conversation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Glowing Microphone Orb & Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-pink-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[440px]">
          {/* Status pill */}
          <div className="mb-6 flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening ? 'bg-emerald-500 animate-ping' : 'bg-teal-500'
              }`}
            />
            <span>{isListening ? 'Listening…' : 'Ready to listen'}</span>
          </div>

          {/* Central Microphone Orb with radiant glow */}
          <div className="relative flex items-center justify-center my-4">
            {/* Outer animated gradient glow aura */}
            <div
              className={`absolute w-52 h-52 rounded-full transition-all duration-700 ${
                isListening
                  ? 'bg-gradient-to-tr from-teal-300/40 via-sky-300/40 to-pink-300/40 animate-ping opacity-60'
                  : 'bg-gradient-to-tr from-teal-100/30 via-slate-100/30 to-pink-100/30 opacity-40'
              }`}
            />

            {/* Middle decorative ring */}
            <div className="w-44 h-44 rounded-full border border-teal-200 flex items-center justify-center bg-white shadow-lg shadow-teal-500/10">
              {/* Inner glowing circle */}
              <button
                onClick={handleMicClick}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-200 via-sky-100 to-pink-200 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-inner group"
                aria-label="Toggle voice input"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Mic
                    className={`w-12 h-12 transition-colors ${
                      isListening ? 'text-teal-600 scale-110' : 'text-slate-800'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-center gap-1.5 h-8 my-3">
            {[4, 12, 24, 18, 30, 16, 28, 14, 22, 8].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-gradient-to-t from-teal-400 to-pink-400 rounded-full transition-all duration-200"
                style={{
                  height: isListening ? `${h}px` : '6px',
                }}
              />
            ))}
          </div>

          {/* Prompt Quote */}
          <p className="text-xl font-extrabold text-slate-900 mt-2 text-center">
            “{activePrompt}”
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Tap the mic or say “Hey Raahi”
          </p>

          {/* Control Buttons: Repeat & Mute */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-7">
            <button
              onClick={handleRepeatLast}
              className="py-3 px-4 rounded-2xl bg-[#00BFA5] hover:bg-[#00A896] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 active:scale-98 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repeat instruction</span>
            </button>

            <button
              onClick={onToggleSound}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-pink-200 text-rose-500 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
            >
              <VolumeX className="w-4 h-4" />
              <span>{soundEnabled ? 'Mute' : 'Unmute'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Conversation Bubbles & Try Saying Chips */}
        <div className="lg:col-span-5 space-y-4">
          {/* Conversation history card */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Conversation</span>
              </div>

              {/* Chat bubbles list */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {conversation.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isUser
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
                  handleUserMessage(queryText.trim());
                  setQueryText('');
                }
              }}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Raahi (e.g., Where is library?)..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* TRY SAYING Card */}
          <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Try Saying
            </h3>

            <div className="flex flex-wrap gap-2">
              {trySayingPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTrySaying(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 text-xs font-semibold transition-all"
                >
                  “{item.text}”
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Mic, MessageSquare, StopCircle, X } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini';
import { translations, Language } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Speech Recognition Type Definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceTherapy = ({ setPage, personality, voiceSettings, theme }: { 
  setPage: (p: any) => void, 
  personality: string, 
  voiceSettings: { voiceName: string, rate: number }, 
  theme: 'light' | 'dark'
}) => {
  const t = translations.en;
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasResultRef = useRef(false);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = async (event: any) => {
        hasResultRef.current = true;
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (event.results[0].isFinal) {
          handleVoiceInput(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError("Microphone access is needed for voice therapy.");
        } else if (event.error === 'no-speech') {
          // Handled by onend fallback
        } else {
          setError("An error occurred with voice input. Please try again.");
        }
        setStatus('idle');
      };

      recognition.onend = () => {
        if (statusRef.current === 'listening') {
          if (!hasResultRef.current) {
            speak(t.voiceFallback);
          } else {
            setStatus('idle');
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Voice input is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleVoiceInput = async (text: string) => {
    setStatus('thinking');
    try {
      const prompt = `You are Telmi, a mental health companion with a ${personality} personality. 
      The user is speaking in English. Please respond in English.
      IMPORTANT: Your response MUST be under 100 words.
      User said: "${text}"`;
      const response = await getGeminiResponse(prompt, personality);
      if (response) {
        speak(response);
      } else {
        speak(t.voiceFallback);
      }
    } catch (error) {
      console.error('Gemini error:', error);
      speak(t.voiceFallback);
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang === 'en-US') || 
                       voices.find(v => v.lang.startsWith('en'));
    
    if (voiceSettings.voiceName !== 'Default') {
      const preferredVoice = voices.find(v => v.name === voiceSettings.voiceName);
      if (preferredVoice) selectedVoice = preferredVoice;
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 1.0;
    utterance.rate = voiceSettings.rate;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    setError(null);
    if (status === 'idle') {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          hasResultRef.current = false;
          recognitionRef.current.start();
          setStatus('listening');
          setTranscript('');
        } catch (e) {
          console.error('Recognition start error', e);
        }
      }
    } else if (status === 'listening') {
      if (recognitionRef.current) recognitionRef.current.stop();
      setStatus('idle');
    } else if (status === 'speaking') {
      window.speechSynthesis.cancel();
      setStatus('idle');
    }
  };

  const resetSession = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setTranscript('');
    setStatus('idle');
    setError(null);
  };

  const quickActions = [
    { id: 'text', icon: MessageSquare, label: t.switchToText, action: () => setPage('text') },
    { id: 'reset', icon: RefreshCw, label: t.resetSession, action: resetSession },
    { id: 'stop', icon: StopCircle, label: t.stopAudio, action: () => window.speechSynthesis.cancel() },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Center Orb Section */}
      <div className="flex flex-col items-center z-10">
        <div className="relative w-72 h-72 md:w-96 md:h-96 mb-16">
          {/* Outer Glow */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full blur-[100px] opacity-50 transition-colors duration-1000",
              status === 'listening' ? "bg-pink-300" : 
              status === 'thinking' ? "bg-pink-400" : 
              status === 'speaking' ? "bg-pink-200" : "bg-pink-100"
            )}
            animate={{
              scale: status === 'listening' ? [1, 1.3, 1] : 1,
              opacity: status === 'thinking' ? [0.3, 0.6, 0.3] : 0.5,
            }}
            transition={{ 
              scale: { repeat: Infinity, duration: 3 },
              opacity: { repeat: Infinity, duration: 2 }
            }}
          />
          
          {/* Main Glass Orb */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full flex items-center justify-center overflow-hidden ios-shadow inner-glow border-white/40",
              theme === 'light' ? "glass" : "glass-dark"
            )}
            animate={{
              scale: status === 'listening' ? [1, 1.05, 1] : 1,
            }}
            transition={{
              scale: { repeat: Infinity, duration: 2 },
            }}
          >
            {/* Liquid Glass Effect */}
            <motion.div
              className={cn(
                "absolute inset-0 opacity-40 bg-gradient-to-br",
                status === 'listening' ? "from-pink-200 to-pink-400" : 
                status === 'thinking' ? "from-pink-300 to-pink-500" : 
                status === 'speaking' ? "from-pink-100 to-pink-300" : "from-pink-50 to-pink-200"
              )}
              animate={{
                borderRadius: ["45% 55% 60% 40% / 45% 45% 55% 55%", "55% 45% 40% 60% / 55% 55% 45% 45%", "45% 55% 60% 40% / 45% 45% 55% 55%"],
                rotate: [0, 360],
              }}
              transition={{ 
                borderRadius: { repeat: Infinity, duration: 10, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 30, ease: "linear" }
              }}
            />

            {/* Inner Reflection */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl" />

            <div className="absolute flex flex-col items-center">
              <Mic className={cn(
                "w-16 h-16 transition-all duration-700",
                status === 'listening' ? "text-white scale-110" : "text-white/60"
              )} />
            </div>
          </motion.div>

          {/* Close Button */}
          <button 
            onClick={() => {
              window.speechSynthesis.cancel();
              setPage('home');
            }}
            className={cn("absolute -top-12 -right-12 p-3 rounded-full transition-colors z-20", theme === 'light' ? "hover:bg-pink-50 text-slate-400" : "hover:bg-white/10 text-pink-200")}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Particles */}
          {(status === 'speaking' || status === 'listening') && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-pink-300 blur-[1px]"
                  initial={{ x: "50%", y: "50%", opacity: 1 }}
                  animate={{
                    x: `${Math.random() * 250 - 75}%`,
                    y: `${Math.random() * 250 - 75}%`,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center max-w-2xl px-6">
          <motion.h3 
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-3xl font-bold mb-4 tracking-tight",
              theme === 'light' ? "text-slate-900" : "text-white"
            )}
          >
            {status === 'idle' ? t.readyToListen : status.charAt(0).toUpperCase() + status.slice(1) + '...'}
          </motion.h3>
          
          <p className={cn(
            "text-lg font-medium italic opacity-70 mb-10",
            theme === 'light' ? "text-pink-800" : "text-pink-200"
          )}>
            {error ? (
              <span className="text-pink-400 font-bold">{error}</span>
            ) : (
              <>
                {status === 'idle' && t.tapToTalk}
                {status === 'listening' && t.listeningHeart}
                {status === 'thinking' && t.reflecting}
                {status === 'speaking' && t.telmiSpeaking}
              </>
            )}
          </p>

          <AnimatePresence>
            {transcript && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "glass-card p-8 ios-shadow text-left",
                  theme === 'dark' && "glass-dark"
                )}
              >
                <p className={cn(
                  "text-lg leading-relaxed italic",
                  theme === 'light' ? "text-slate-700" : "text-pink-100"
                )}>
                  "{transcript}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleListening}
          className={cn(
            "mt-12 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500",
            status === 'listening' ? "bg-pink-400" : 
            status === 'speaking' ? "bg-pink-300" : "bg-pink-400"
          )}
        >
          {status === 'listening' ? <StopCircle className="w-10 h-10" /> : 
           status === 'speaking' ? <Pause className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </motion.button>
      </div>

      {/* Right Side Floating Panel */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            whileHover="hover"
            initial="initial"
            onClick={action.action}
            className={cn(
              "group relative flex items-center justify-end gap-4 p-4 rounded-full ios-shadow inner-glow transition-all duration-500",
              theme === 'light' ? "glass" : "glass-dark"
            )}
          >
            <motion.span
              variants={{
                initial: { opacity: 0, x: 20, width: 0 },
                hover: { opacity: 1, x: 0, width: "auto" }
              }}
              className={cn(
                "whitespace-nowrap font-bold text-xs uppercase tracking-widest overflow-hidden",
                theme === 'light' ? "text-pink-700" : "text-pink-200"
              )}
            >
              {action.label}
            </motion.span>
            <action.icon className={cn(
              "w-6 h-6 transition-colors duration-500",
              theme === 'light' ? "text-pink-600" : "text-pink-200"
            )} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

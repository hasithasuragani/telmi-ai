import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, RotateCcw, Settings2, ShieldAlert } from 'lucide-react';
import { translations, Language } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BreathingSession = ({ theme }: { theme: 'light' | 'dark' }) => {
  const t = translations.en;
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [duration, setDuration] = useState(1); // minutes
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnxietyMode, setIsAnxietyMode] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    let phaseTimer: any;
    if (isActive) {
      const cycle = isAnxietyMode ? { inhale: 4, hold: 4, exhale: 6 } : { inhale: 4, hold: 2, exhale: 4 };
      
      const runCycle = () => {
        setPhase('Inhale');
        phaseTimer = setTimeout(() => {
          setPhase('Hold');
          phaseTimer = setTimeout(() => {
            setPhase('Exhale');
            phaseTimer = setTimeout(runCycle, cycle.exhale * 1000);
          }, cycle.hold * 1000);
        }, cycle.inhale * 1000);
      };

      runCycle();
    } else {
      setPhase('Inhale');
    }
    return () => clearTimeout(phaseTimer);
  }, [isActive, isAnxietyMode]);

  const getPhaseText = (p: string) => {
    switch(p) {
      case 'Inhale': return t.inhale;
      case 'Hold': return t.hold;
      case 'Exhale': return t.exhale;
      default: return p;
    }
  };

  const startSession = (mins: number) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(true);
  };

  const cycle = isAnxietyMode ? { inhale: 4, hold: 4, exhale: 6 } : { inhale: 4, hold: 2, exhale: 4 };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <div className="mb-16 text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-5xl font-bold tracking-tight mb-4", theme === 'light' ? "text-slate-900" : "text-white")}
        >
          {t.breathingSession}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("text-xl font-medium italic opacity-60", theme === 'light' ? "text-pink-800" : "text-pink-200")}
        >
          "{t.slowDownFade}"
        </motion.p>
      </div>

      <div className="relative w-96 h-96 flex items-center justify-center mb-24">
        {/* Outer Glow Layer 1 */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-[80px] opacity-40",
            theme === 'light' ? "bg-pink-300" : "bg-pink-400"
          )}
          animate={{
            scale: phase === 'Inhale' ? [1, 1.8] : phase === 'Exhale' ? [1.8, 1] : 1.8,
          }}
          transition={{ duration: phase === 'Inhale' ? cycle.inhale : phase === 'Exhale' ? cycle.exhale : cycle.hold, ease: "easeInOut" }}
        />

        {/* Outer Glow Layer 2 */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-[40px] opacity-20",
            theme === 'light' ? "bg-pink-200" : "bg-pink-300"
          )}
          animate={{
            scale: phase === 'Inhale' ? [1, 1.4] : phase === 'Exhale' ? [1.4, 1] : 1.4,
          }}
          transition={{ duration: phase === 'Inhale' ? cycle.inhale : phase === 'Exhale' ? cycle.exhale : cycle.hold, ease: "easeInOut" }}
        />

        {/* Main Glass Orb */}
        <motion.div
          className={cn(
            "w-80 h-80 rounded-full glass flex items-center justify-center border-white/40 ios-shadow relative overflow-hidden inner-glow",
            theme === 'dark' && "glass-dark"
          )}
          animate={{
            scale: phase === 'Inhale' ? [1, 1.25] : phase === 'Exhale' ? [1.25, 1] : 1.25,
          }}
          transition={{ duration: phase === 'Inhale' ? cycle.inhale : phase === 'Exhale' ? cycle.exhale : cycle.hold, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 to-transparent" />
          
          <motion.div
            className="w-64 h-64 rounded-full bg-pink-300/20 blur-2xl"
            animate={{
              borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />

          <div className="absolute flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className={cn("text-4xl font-bold tracking-tight", theme === 'light' ? "text-slate-800" : "text-white")}
              >
                {isActive ? getPhaseText(phase) : t.ready}
              </motion.span>
            </AnimatePresence>
            {isActive && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn("text-sm font-bold uppercase tracking-[0.3em] mt-4 opacity-40", theme === 'light' ? "text-slate-500" : "text-pink-200")}
              >
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Instructions Overlay */}
        <div className="absolute -bottom-16 text-center w-full">
          <motion.p 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-lg font-bold tracking-tight opacity-60", theme === 'light' ? "text-slate-600" : "text-pink-100")}
          >
            {isActive ? (
              phase === 'Inhale' ? (isAnxietyMode ? "Breathe in calm" : t.breatheInCalm) :
              phase === 'Hold' ? (isAnxietyMode ? "Hold gently" : t.holdStillness) :
              (isAnxietyMode ? "Release tension" : t.releaseTension)
            ) : t.selectDuration}
          </motion.p>
        </div>
      </div>

      {!isActive ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {[1, 3, 5].map((m) => (
            <motion.button
              key={m}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startSession(m)}
              className={cn(
                "glass-card p-10 flex flex-col items-center gap-4 ios-shadow transition-all duration-500",
                theme === 'dark' && "glass-dark"
              )}
            >
              <span className={cn("text-4xl font-bold tracking-tight", theme === 'light' ? "text-slate-800" : "text-white")}>{m}</span>
              <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-40", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.minute}</span>
            </motion.button>
          ))}
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAnxietyMode(!isAnxietyMode)}
            className={cn(
              "glass-card p-10 flex flex-col items-center gap-4 transition-all duration-500 ios-shadow",
              isAnxietyMode 
                ? (theme === 'light' ? "bg-pink-50 border-pink-200 ring-2 ring-pink-100" : "bg-pink-400/20 border-pink-300 ring-2 ring-pink-400/20") 
                : (theme === 'dark' ? "glass-dark" : "")
            )}
          >
            <ShieldAlert className={cn("w-8 h-8", isAnxietyMode ? "text-pink-400" : "text-slate-400")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-center leading-tight", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.anxietyRelief}</span>
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(false)}
          className={cn(
            "px-12 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all duration-500 ios-shadow inner-glow",
            theme === 'light' ? "bg-pink-100 text-pink-700 hover:bg-pink-200" : "bg-white/10 text-pink-200 hover:bg-white/20"
          )}
        >
          <RotateCcw className="w-5 h-5" />
          {t.stopSession}
        </motion.button>
      )}
    </div>
  );
};

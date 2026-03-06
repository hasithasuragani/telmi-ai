import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Volume2, 
  Palette, 
  Bell, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Heart,
  Bot,
  Zap,
  Moon,
  MessageCircle,
  X,
  Play,
  Sun,
  Cloud,
  Waves,
  Languages,
  Check
} from 'lucide-react';
import { translations, Language, languages, languageCodes } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Theme = 'Soft Pink' | 'Lavender Haze' | 'Peach Calm' | 'Mint Serenity';

interface VoiceSettings {
  voiceName: string;
  rate: number;
}

export const Settings = ({ 
  personality, 
  setPersonality, 
  theme, 
  setTheme,
  voiceSettings,
  setVoiceSettings,
  themeMode
}: { 
  personality: string, 
  setPersonality: (p: string) => void,
  theme: Theme,
  setTheme: (t: Theme) => void,
  voiceSettings: VoiceSettings,
  setVoiceSettings: (v: VoiceSettings) => void,
  themeMode: 'light' | 'dark'
}) => {
  const t = translations.en;
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);

  const personalities = [
    { id: 'Gentle Companion', icon: Heart, desc: 'Soft, supportive, and warm.' },
    { id: 'Professional Therapist', icon: ShieldCheck, desc: 'Insightful, clinical yet empathetic.' },
    { id: 'Motivational Guide', icon: Zap, desc: 'Energetic, positive, and encouraging.' },
    { id: 'Calm Monk', icon: Moon, desc: 'Zen-like, peaceful, and wise.' },
    { id: 'Silent Listener', icon: MessageCircle, desc: 'Brief, focused on listening.' },
  ];

  const themes: { id: Theme, icon: any, desc: string }[] = [
    { id: 'Soft Pink', icon: Sun, desc: 'Warm pinks and ambers.' },
    { id: 'Lavender Haze', icon: Cloud, desc: 'Peaceful purples and blues.' },
    { id: 'Peach Calm', icon: Moon, desc: 'Soft peach and coral.' },
    { id: 'Mint Serenity', icon: Waves, desc: 'Refreshing mint and teal.' },
  ];

  const voices = [
    { name: 'Default', desc: 'Standard calm voice' },
    { name: 'Soft Female', desc: 'Gentle and nurturing' },
    { name: 'Soft Male', desc: 'Calm and steady' },
  ];

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const previewVoice = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(t.voiceWelcome);
    const langCode = 'en-US';
    utterance.lang = langCode;
    
    const browserVoices = window.speechSynthesis.getVoices();
    
    // Filter voices by language
    const langVoices = browserVoices.filter(v => 
      v.lang.toLowerCase().replace('_', '-') === langCode.toLowerCase() || 
      v.lang.toLowerCase().startsWith('en')
    );
    
    let selectedVoice = null;
    
    if (langVoices.length > 0) {
      if (voiceSettings.voiceName === 'Soft Female') {
        selectedVoice = langVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha')
        ) || langVoices[0];
      } else if (voiceSettings.voiceName === 'Soft Male') {
        selectedVoice = langVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('man') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('alex')
        ) || langVoices[0];
      } else {
        selectedVoice = langVoices[0];
      }
    }
    
    if (!selectedVoice) {
      selectedVoice = browserVoices.find(v => v.name === voiceSettings.voiceName);
    }
    
    if (!selectedVoice) {
      selectedVoice = langVoices[0] || browserVoices.find(v => v.lang.startsWith('en')) || browserVoices[0];
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = voiceSettings.rate;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-16 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-5xl font-bold tracking-tight mb-4", themeMode === 'light' ? "text-slate-900" : "text-white")}
        >
          {t.settings}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("text-xl font-medium italic opacity-60", themeMode === 'light' ? "text-pink-800" : "text-pink-200")}
        >
          "{t.customizeSanctuary}"
        </motion.p>
      </div>

      <div className="space-y-12">
        {/* AI Personality */}
        <section>
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
              <Bot className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className={cn("text-2xl font-bold tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t.aiPersonality}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalities.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPersonality(p.id)}
                className={cn(
                  "glass-card p-8 text-left flex flex-col gap-6 transition-all duration-500 ios-shadow",
                  personality === p.id 
                    ? (themeMode === 'light' ? "bg-pink-50 border-pink-100 ring-2 ring-pink-100" : "bg-pink-400/20 border-pink-200 ring-2 ring-pink-400/20") 
                    : (themeMode === 'dark' ? "glass-dark" : "")
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500",
                  personality === p.id ? "bg-pink-300 text-white" : (themeMode === 'light' ? "bg-white/40 text-slate-400" : "bg-white/5 text-pink-200/40")
                )}>
                  <p.icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className={cn("font-bold text-lg mb-2 tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{p.id}</h4>
                  <p className={cn("text-sm leading-relaxed opacity-60", themeMode === 'light' ? "text-slate-500" : "text-pink-200")}>{p.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Other Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className={cn("text-2xl font-bold tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t.voiceSound}</h3>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowVoiceModal(true)}
              className={cn(
                "w-full glass-card p-8 flex items-center justify-between transition-all duration-500 ios-shadow",
                themeMode === 'light' ? "hover:bg-white/40" : "glass-dark hover:bg-white/10"
              )}
            >
              <span className={cn("text-base font-bold tracking-tight", themeMode === 'light' ? "text-slate-700" : "text-white")}>{t.voiceSelection}</span>
              <div className="text-xs font-bold text-pink-400 uppercase tracking-[0.2em] flex items-center gap-2">
                {voiceSettings.voiceName} <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className={cn("text-2xl font-bold tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t.appearance}</h3>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAppearanceModal(true)}
              className={cn(
                "w-full glass-card p-8 flex items-center justify-between transition-all duration-500 ios-shadow",
                themeMode === 'light' ? "hover:bg-white/40" : "glass-dark hover:bg-white/10"
              )}
            >
              <span className={cn("text-base font-bold tracking-tight", themeMode === 'light' ? "text-slate-700" : "text-white")}>{t.colorPalette}</span>
              <div className="text-xs font-bold text-pink-400 uppercase tracking-[0.2em] flex items-center gap-2">
                {theme} <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="pt-12 border-t border-pink-50/20">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={cn(
              "glass-card p-10 ios-shadow border-pink-400/20 flex flex-col md:flex-row items-center justify-between gap-8",
              themeMode === 'light' ? "bg-pink-50/50" : "bg-pink-900/10"
            )}
          >
            <div>
              <h3 className={cn("text-2xl font-bold tracking-tight mb-2", themeMode === 'light' ? "text-pink-700" : "text-pink-400")}>{t.dangerZone}</h3>
              <p className={cn("text-base opacity-60", themeMode === 'light' ? "text-pink-400" : "text-pink-200")}>{t.resetDataDesc}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-10 py-5 bg-pink-400 text-white font-bold rounded-2xl shadow-2xl hover:bg-pink-500 transition-all duration-500 flex items-center gap-3"
            >
              <Trash2 className="w-6 h-6" />
              {t.resetData}
            </button>
          </motion.div>
        </section>
      </div>

      {/* Voice Modal */}
      <AnimatePresence>
        {showVoiceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVoiceModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "glass-card w-full max-w-xl p-10 relative z-10 overflow-hidden ios-shadow",
                themeMode === 'dark' && "glass-dark"
              )}
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className={cn("text-2xl font-bold tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t.voiceSoundSettings}</h3>
                <button 
                  onClick={() => setShowVoiceModal(false)} 
                  className={cn("p-3 rounded-full transition-colors", themeMode === 'light' ? "hover:bg-pink-50 text-slate-400" : "hover:bg-white/5 text-pink-200")}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <label className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-6 block opacity-40", themeMode === 'light' ? "text-slate-500" : "text-pink-200")}>{t.selectVoice}</label>
                  <div className="space-y-4">
                    {voices.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setVoiceSettings({ ...voiceSettings, voiceName: v.name })}
                        className={cn(
                          "w-full p-6 rounded-[28px] border text-left flex items-center justify-between transition-all duration-500 ios-shadow inner-glow",
                          voiceSettings.voiceName === v.name 
                            ? (themeMode === 'light' ? "bg-pink-50 border-pink-300" : "bg-pink-600/20 border-pink-400") 
                            : (themeMode === 'light' ? "bg-white/20 border-white/40 hover:bg-white/40" : "bg-white/5 border-white/10 hover:bg-white/10")
                        )}
                      >
                        <div>
                          <div className={cn("font-bold text-lg tracking-tight mb-1", themeMode === 'light' ? "text-slate-800" : "text-white")}>{v.name}</div>
                          <div className={cn("text-xs opacity-60", themeMode === 'light' ? "text-slate-500" : "text-pink-200")}>{v.desc}</div>
                        </div>
                        {voiceSettings.voiceName === v.name && <div className="w-3 h-3 bg-pink-300 rounded-full shadow-lg shadow-pink-300/50" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <label className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-40", themeMode === 'light' ? "text-slate-500" : "text-pink-200")}>{t.speechSpeed}</label>
                    <span className="text-sm font-bold text-pink-400">{voiceSettings.rate}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.8" 
                    max="1.2" 
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-pink-50 rounded-full appearance-none cursor-pointer accent-pink-300"
                  />
                </div>

                <button 
                  onClick={previewVoice}
                  className={cn(
                    "w-full py-5 text-white font-bold text-lg rounded-[24px] shadow-2xl transition-all duration-500 flex items-center justify-center gap-3",
                    themeMode === 'light' ? "bg-pink-300 hover:bg-pink-400" : "bg-pink-400 hover:bg-pink-500 shadow-pink-900/40"
                  )}
                >
                  <Play className="w-6 h-6 fill-white" />
                  {t.previewVoice}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appearance Modal */}
      <AnimatePresence>
        {showAppearanceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppearanceModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "glass-card w-full max-w-2xl p-10 relative z-10 overflow-hidden ios-shadow",
                themeMode === 'dark' && "glass-dark"
              )}
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className={cn("text-2xl font-bold tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t.appearanceSettings}</h3>
                <button 
                  onClick={() => setShowAppearanceModal(false)} 
                  className={cn("p-3 rounded-full transition-colors", themeMode === 'light' ? "hover:bg-pink-50 text-slate-400" : "hover:bg-white/5 text-pink-200")}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {themes.map((t_item) => (
                  <motion.button
                    key={t_item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(t_item.id)}
                    className={cn(
                      "p-8 rounded-[32px] border text-left transition-all duration-500 group ios-shadow inner-glow",
                      theme === t_item.id 
                        ? (themeMode === 'light' ? "bg-pink-50 border-pink-300" : "bg-pink-600/20 border-pink-400") 
                        : (themeMode === 'light' ? "bg-white/20 border-white/40 hover:bg-white/40" : "bg-white/5 border-white/10 hover:bg-white/10")
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-[22px] flex items-center justify-center mb-6 shadow-xl transition-all duration-500",
                      theme === t_item.id ? "bg-pink-300 text-white" : (themeMode === 'light' ? "bg-white/40 text-slate-400" : "bg-white/5 text-pink-200/40")
                    )}>
                      <t_item.icon className="w-8 h-8" />
                    </div>
                    <h4 className={cn("font-bold text-lg mb-2 tracking-tight", themeMode === 'light' ? "text-slate-800" : "text-white")}>{t_item.id}</h4>
                    <p className={cn("text-xs leading-relaxed opacity-60", themeMode === 'light' ? "text-slate-500" : "text-pink-200")}>{t_item.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

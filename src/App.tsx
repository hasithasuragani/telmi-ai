import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Mic, 
  MessageSquare, 
  Wind, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon,
  Sparkles,
  Leaf,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Components ---
import { TextTherapy } from './components/TextTherapy';
import { VoiceTherapy } from './components/VoiceTherapy';
import { Dashboard } from './components/Dashboard';
import { Journal } from './components/Journal';
import { Meditation } from './components/Meditation';
import { BreathingSession } from './components/BreathingSession';
import { Settings } from './components/Settings';
import { ParticleCanvas } from './components/ParticleCanvas';
import { translations } from './translations';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Page = 'home' | 'voice' | 'text' | 'meditation' | 'breathing' | 'journal' | 'dashboard' | 'settings';
type Emotion = 'happy' | 'sad' | 'anxious' | 'calm' | 'overthinking' | 'drained';
type Theme = 'Soft Pink' | 'Lavender Haze' | 'Peach Calm' | 'Mint Serenity';

interface VoiceSettings {
  voiceName: string;
  rate: number;
}

interface MoodEntry {
  date: string; // YYYY-MM-DD
  emotion: Emotion;
}

interface Metrics {
  happiness: number;
  calmness: number;
  anxiety: number;
  sadness: number;
  stress: number;
  confidence: number;
}

// --- Global Components ---

const Background = ({ theme }: { theme: 'light' | 'dark' }) => {
  const cloudImage = "https://images.pexels.com/photos/907485/pexels-photo-907485.jpeg";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Real Cloud Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${cloudImage})`,
          filter: theme === 'dark' 
            ? 'brightness(0.5) contrast(1.1) saturate(1.3)' 
            : 'brightness(1.1) contrast(1.15) saturate(1.2)'
        }}
      />
      
      {/* Soft Blur Overlay for Glass UI - Reduced blur for background clarity */}
      <div className={cn(
        "absolute inset-0 backdrop-blur-[10px] transition-colors duration-1000",
        theme === 'light' ? "bg-[rgba(255,240,245,0.25)]" : "bg-black/30"
      )} />

      {/* Real Canvas-based Particle System */}
      <ParticleCanvas theme={theme} />
      
      {/* Subtle Texture/Grain */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
    </div>
  );
};

const Sidebar = ({ currentPage, setPage, theme, onEnter }: { currentPage: Page, setPage: (p: Page) => void, theme: 'light' | 'dark', onEnter?: () => void }) => {
  const t = translations.en;
  const navItems = [
    { id: 'voice', icon: Mic, label: t.voiceTherapy },
    { id: 'text', icon: MessageSquare, label: t.textTherapy },
    { id: 'breathing', icon: Wind, label: t.breathing },
    { id: 'meditation', icon: Leaf, label: t.meditation },
    { id: 'journal', icon: BookOpen, label: t.journal },
    { id: 'dashboard', icon: BarChart3, label: t.dashboard },
  ];

  const handleNav = (id: Page) => {
    setPage(id);
    if (onEnter) onEnter();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-5 top-1/2 -translate-y-1/2 z-[999]"
    >
      <div className={cn(
        "flex flex-col gap-4 p-3 rounded-[32px] ios-shadow inner-glow",
        theme === 'light' ? "glass" : "glass-dark"
      )}>
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleNav(item.id as Page)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group ios-shadow",
              currentPage === item.id 
                ? (theme === 'light' ? "bg-pink-500 text-white shadow-lg" : "bg-pink-600 text-white shadow-lg shadow-pink-900/40")
                : (theme === 'light' ? "bg-white/40 text-slate-500 hover:text-pink-600 hover:bg-white/60" : "bg-white/10 text-pink-200/60 hover:text-white hover:bg-white/20")
            )}
          >
            <item.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className={cn(
              "absolute left-full ml-5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none ios-shadow",
              theme === 'light' ? "bg-white text-slate-800" : "bg-slate-800 text-white"
            )}>
              {item.label}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const LandingPage = ({ onEnter, theme }: { onEnter: () => void, theme: 'light' | 'dark' }) => {
  const t = translations.en;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="text-center mb-16 relative z-10"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
          className={cn(
            "text-[10rem] md:text-[16rem] font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b drop-shadow-[0_0_60px_rgba(255,255,255,0.4)]",
            theme === 'light' ? "from-pink-600/90 to-rose-400/90" : "from-white to-pink-300"
          )}
        >
          {t.telmi}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.8 }}
          className={cn(
            "text-3xl md:text-4xl font-medium italic opacity-80 tracking-[0.1em]",
            theme === 'light' ? "text-pink-900" : "text-pink-100"
          )}
        >
          “{t.tagline}.”
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 2.5 }}
        className={cn(
          "max-w-3xl text-center mb-20 glass-card p-12 ios-shadow relative z-10",
          theme === 'dark' && "glass-dark"
        )}
      >
        <p className={cn(
          "text-2xl md:text-3xl leading-relaxed font-light tracking-tight",
          theme === 'light' ? "text-slate-800" : "text-pink-50"
        )}>
          {t.landingDesc}
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px -12px rgba(244, 63, 94, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 3.5, duration: 1 }}
        onClick={onEnter}
        className={cn(
          "px-20 py-8 rounded-[40px] font-bold text-3xl ios-shadow inner-glow transition-all duration-700 relative z-10",
          theme === 'light' ? "bg-pink-500 text-white hover:bg-pink-600" : "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-900/40"
        )}
      >
        {t.goHome}
      </motion.button>
    </div>
  );
};

const Navbar = ({ currentPage, setPage, theme, toggleTheme }: { currentPage: Page, setPage: (p: Page) => void, theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const t = translations.en;
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className={cn(
        "px-6 py-3 rounded-full flex items-center justify-between ios-shadow inner-glow transition-all duration-500",
        theme === 'light' ? "glass" : "glass-dark"
      )}>
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setPage('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Heart className="text-white w-6 h-6 fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <h1 className={cn("font-display font-bold text-xl tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>{t.telmi}</h1>
            <p className={cn("text-[10px] uppercase tracking-[0.2em] font-bold opacity-60", theme === 'light' ? "text-slate-600" : "text-pink-200")}>{t.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {[
            { id: 'home', icon: Sparkles, label: t.home },
            { id: 'dashboard', icon: BarChart3, label: t.growth },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-500 flex items-center gap-2",
                currentPage === item.id 
                  ? (theme === 'light' ? "bg-pink-500 text-white shadow-md" : "bg-pink-600 text-white shadow-lg shadow-pink-900/40")
                  : (theme === 'light' ? "text-slate-600 hover:bg-pink-100" : "text-pink-100 hover:bg-white/10")
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
          
          <div className="w-[1px] h-6 bg-slate-300/30 mx-2" />
          
          <button 
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-full transition-all duration-500",
              theme === 'light' ? "bg-pink-100 text-pink-600 hover:bg-pink-200" : "bg-white/10 text-pink-200 hover:bg-white/20"
            )}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setPage('settings')}
            className={cn(
              "p-2.5 rounded-full transition-all duration-500",
              theme === 'light' ? "bg-pink-100 text-pink-600 hover:bg-pink-200" : "bg-white/10 text-pink-200 hover:bg-white/20"
            )}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- Home Page Component ---

const Home = ({ setPage, onSelectEmotion, selectedEmotion, theme }: { setPage: (p: Page) => void, onSelectEmotion: (e: Emotion) => void, selectedEmotion?: Emotion, theme: 'light' | 'dark' }) => {
  const t = translations.en;
  const emotions: { id: Emotion, emoji: string, label: string }[] = [
    { id: 'happy', emoji: '😊', label: t.happy },
    { id: 'sad', emoji: '😔', label: t.sad },
    { id: 'anxious', emoji: '😰', label: t.anxious },
    { id: 'calm', emoji: '😌', label: t.calm },
    { id: 'overthinking', emoji: '💭', label: t.overthinking },
    { id: 'drained', emoji: '😴', label: t.drained },
  ];

  const features = [
    { id: 'voice', icon: Mic, title: t.voiceTherapy, desc: t.voiceDesc, color: 'from-pink-400 to-rose-500' },
    { id: 'text', icon: MessageSquare, title: t.textTherapy, desc: t.textDesc, color: 'from-rose-400 to-pink-600' },
    { id: 'meditation', icon: Leaf, title: t.meditationSpace, desc: t.meditationDesc, color: 'from-pink-500 to-rose-700' },
    { id: 'breathing', icon: Wind, title: t.breathingSession, desc: t.breathingDesc, color: 'from-rose-500 to-pink-800' },
    { id: 'journal', icon: BookOpen, title: t.reflectiveJournal, desc: t.journalDesc, color: 'from-pink-600 to-rose-900' },
    { id: 'dashboard', icon: BarChart3, title: t.emotionalDashboard, desc: t.dashboardDesc, color: 'from-rose-600 to-pink-950' },
  ];

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className={cn(
          "font-display text-6xl md:text-8xl font-bold mb-6 tracking-tight",
          theme === 'light' ? "text-slate-900" : "text-white"
        )}>{t.telmi}</h2>
        <p className={cn(
          "text-xl md:text-2xl font-medium italic opacity-80",
          theme === 'light' ? "text-pink-700" : "text-pink-200"
        )}>“{t.tagline}.”</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={cn(
          "glass-card p-10 mb-20 ios-shadow",
          theme === 'dark' && "glass-dark"
        )}
      >
        <h3 className={cn(
          "text-center text-sm font-bold uppercase tracking-[0.3em] mb-10 opacity-60",
          theme === 'light' ? "text-slate-600" : "text-pink-200"
        )}>{t.howFeeling}</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {emotions.map((e) => (
            <motion.button
              key={e.id}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectEmotion(e.id)}
              className={cn(
                "flex flex-col items-center gap-4 p-4 rounded-3xl transition-all duration-500",
                selectedEmotion === e.id 
                  ? (theme === 'light' ? "bg-pink-500 text-white shadow-xl scale-110" : "bg-pink-600 text-white shadow-xl scale-110 shadow-pink-900/40")
                  : (theme === 'light' ? "hover:bg-pink-100/50" : "hover:bg-white/10")
              )}
            >
              <span className="text-5xl filter drop-shadow-md">{e.emoji}</span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                selectedEmotion === e.id ? "text-white" : (theme === 'light' ? "text-slate-500" : "text-pink-200")
              )}>{e.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.button
            key={f.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
            onClick={() => setPage(f.id as Page)}
            className={cn(
              "glass-card p-10 text-left group relative overflow-hidden ios-shadow",
              theme === 'dark' && "glass-dark"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 shadow-xl bg-gradient-to-br transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
              f.color
            )}>
              <f.icon className="text-white w-8 h-8" />
            </div>
            <h3 className={cn(
              "text-2xl font-bold mb-3 tracking-tight",
              theme === 'light' ? "text-slate-900" : "text-white"
            )}>{f.title}</h3>
            <p className={cn(
              "text-sm leading-relaxed mb-8 opacity-70",
              theme === 'light' ? "text-slate-600" : "text-pink-100"
            )}>{f.desc}</p>
            <div className={cn(
              "flex items-center text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
              theme === 'light' ? "text-pink-600 group-hover:text-pink-800" : "text-pink-300 group-hover:text-white"
            )}>
              {t.explore} <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Decorative Gradient Glow */}
            <div className={cn(
              "absolute -right-10 -bottom-10 w-40 h-40 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br",
              f.color
            )} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    happiness: 80,
    calmness: 65,
    anxiety: 40,
    sadness: 30,
    stress: 55,
    confidence: 70
  });
  const [personality, setPersonality] = useState('Gentle Companion');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [theme, setTheme] = useState<string>('Soft Pink');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceName: 'Default',
    rate: 1.0
  });

  // Persistence
  useEffect(() => {
    const savedMood = localStorage.getItem('telmi_today_mood');
    if (savedMood) setSelectedEmotion(savedMood as Emotion);

    const savedHistory = localStorage.getItem('telmi_mood_history');
    if (savedHistory) setMoodHistory(Object.entries(JSON.parse(savedHistory)).map(([date, emotion]) => ({ date, emotion: emotion as Emotion })));

    const savedPersonality = localStorage.getItem('telmi_personality_mode');
    if (savedPersonality) setPersonality(savedPersonality);

    const savedPalette = localStorage.getItem('telmi_palette');
    if (savedPalette) setTheme(savedPalette);

    const savedState = localStorage.getItem('telmi_state_v4');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.metrics) setMetrics(parsed.metrics);
      if (parsed.themeMode) setThemeMode(parsed.themeMode);
      if (parsed.voiceSettings) setVoiceSettings(parsed.voiceSettings);
    }
  }, []);

  useEffect(() => {
    if (selectedEmotion) localStorage.setItem('telmi_today_mood', selectedEmotion);
    
    const historyObj = moodHistory.reduce((acc, curr) => ({ ...acc, [curr.date]: curr.emotion }), {});
    localStorage.setItem('telmi_mood_history', JSON.stringify(historyObj));

    localStorage.setItem('telmi_personality_mode', personality);
    localStorage.setItem('telmi_palette', theme);

    localStorage.setItem('telmi_state_v4', JSON.stringify({ 
      metrics,
      themeMode, 
      voiceSettings 
    }));
  }, [selectedEmotion, moodHistory, metrics, personality, themeMode, theme, voiceSettings]);

  const handleSelectEmotion = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    localStorage.setItem('telmi_today_mood', emotion);
    
    // Update Mood History for today
    const today = new Date().toISOString().split('T')[0];
    setMoodHistory(prev => {
      const filtered = prev.filter(m => m.date !== today);
      const newHistory = [...filtered, { date: today, emotion }];
      const historyObj = newHistory.reduce((acc, curr) => ({ ...acc, [curr.date]: curr.emotion }), {});
      localStorage.setItem('telmi_mood_history', JSON.stringify(historyObj));
      return newHistory;
    });

    // Update Metrics
    setMetrics(prev => {
      const next = { ...prev };
      switch(emotion) {
        case 'happy': 
          next.happiness = Math.min(100, next.happiness + 5);
          break;
        case 'calm':
          next.calmness = Math.min(100, next.calmness + 5);
          break;
        case 'anxious':
          next.anxiety = Math.min(100, next.anxiety + 5);
          break;
        case 'sad':
          next.sadness = Math.min(100, next.sadness + 5);
          break;
        case 'overthinking':
          next.stress = Math.min(100, next.stress + 5);
          break;
        case 'drained':
          next.stress = Math.min(100, next.stress + 3);
          next.sadness = Math.min(100, next.sadness + 3);
          break;
      }
      return next;
    });
  };

  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');

  const renderPage = () => {
    const props = { theme: themeMode };
    switch (page) {
      case 'home': return <Home setPage={setPage} onSelectEmotion={handleSelectEmotion} selectedEmotion={selectedEmotion} theme={themeMode} />;
      case 'text': return <TextTherapy personality={personality} {...props} />;
      case 'voice': return <VoiceTherapy setPage={setPage} personality={personality} voiceSettings={voiceSettings} {...props} />;
      case 'breathing': return <BreathingSession {...props} />;
      case 'journal': return <Journal {...props} />;
      case 'dashboard': return <Dashboard setPage={setPage} metrics={metrics} moodHistory={moodHistory} {...props} />;
      case 'meditation': return <Meditation {...props} />;
      case 'settings': return (
        <Settings 
          personality={personality} 
          setPersonality={setPersonality} 
          theme={theme as any} 
          setTheme={setTheme as any}
          voiceSettings={voiceSettings}
          setVoiceSettings={setVoiceSettings}
          themeMode={themeMode}
        />
      );
      default: return <Home setPage={setPage} onSelectEmotion={handleSelectEmotion} selectedEmotion={selectedEmotion} theme={themeMode} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen relative transition-colors duration-1000",
      themeMode === 'light' ? "text-slate-900" : "text-white",
      theme === 'Lavender Haze' && "theme-lavender",
      theme === 'Peach Calm' && "theme-peach",
      theme === 'Mint Serenity' && "theme-mint"
    )}>
      <Background theme={themeMode} />
      
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LandingPage onEnter={() => setShowLanding(false)} theme={themeMode} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navbar currentPage={page} setPage={setPage} theme={themeMode} toggleTheme={toggleTheme} />
            <Sidebar currentPage={page} setPage={setPage} theme={themeMode} onEnter={() => setShowLanding(false)} />
            
            <AnimatePresence mode="wait">
              <motion.main
                key={page}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderPage()}
              </motion.main>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

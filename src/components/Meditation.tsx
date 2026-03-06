import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Leaf, Video, Music, Compass, Pause } from 'lucide-react';
import { translations, Language } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Meditation = ({ theme }: { theme: 'light' | 'dark' }) => {
  const t = translations.en;
  const [activeVideo, setActiveVideo] = useState('inpok4MKVLM'); // Default: 10 min mindfulness
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const videos = [
    { id: 'inpok4MKVLM', title: '10-Minute Mindfulness', category: t.todaysCalm, duration: '10:00' },
    { id: 'ZToicYcHIOU', title: 'Deep Relaxation', category: t.livePeaceful, duration: '15:00' },
    { id: '6p_yaNFSYao', title: 'Anxiety Relief', category: t.peacefulLessons, duration: '12:00' },
    { id: 'O-6f5wQXSu8', title: 'Sleep Meditation', category: t.nightlyCalm, duration: '20:00' },
  ];

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAmbient = () => {
    if (!audioRef.current) return;

    if (ambientPlaying) {
      let vol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          if (audioRef.current) audioRef.current.volume = vol;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0;
          }
          setAmbientPlaying(false);
        }
      }, 50);
    } else {
      audioRef.current.play();
      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.45) {
          vol += 0.05;
          if (audioRef.current) audioRef.current.volume = vol;
        } else {
          clearInterval(fadeIn);
        }
      }, 50);
      setAmbientPlaying(true);
    }
  };

  const handleSurpriseMe = () => {
    const random = videos[Math.floor(Math.random() * videos.length)];
    setActiveVideo(random.id);
  };

  const startLesson = () => {
    setActiveVideo('6p_yaNFSYao');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-16 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-5xl font-bold tracking-tight mb-4", theme === 'light' ? "text-slate-900" : "text-white")}
        >
          {t.meditationSpace}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("text-xl font-medium italic opacity-60", theme === 'light' ? "text-pink-800" : "text-pink-200")}
        >
          "{t.meditationTagline}"
        </motion.p>
      </div>

      {/* Main Video Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "glass-card overflow-hidden mb-16 aspect-video relative ios-shadow p-4",
          theme === 'dark' && "glass-dark"
        )}
      >
        <div className="w-full h-full rounded-[24px] overflow-hidden relative ios-shadow">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recommended List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className={cn("text-2xl font-bold tracking-tight flex items-center gap-4", theme === 'light' ? "text-slate-800" : "text-white")}>
              <Video className="w-7 h-7 text-pink-400" />
              {t.recommendedJourneys}
            </h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSurpriseMe}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] ios-shadow transition-all duration-500",
                theme === 'light' ? "bg-pink-50 text-pink-400 hover:bg-pink-100" : "bg-white/10 text-pink-200 hover:bg-white/20"
              )}
            >
              <Sparkles className="w-4 h-4" />
              {t.surpriseMe}
            </motion.button>
          </div>

          <div className="space-y-6">
            {videos.map((v) => (
              <motion.button
                key={v.id}
                whileHover={{ x: 10 }}
                onClick={() => setActiveVideo(v.id)}
                className={cn(
                  "w-full glass-card p-6 flex items-center gap-6 text-left transition-all duration-500 ios-shadow",
                  activeVideo === v.id 
                    ? (theme === 'light' ? "bg-pink-50 border-pink-100" : "bg-pink-400/20 border-pink-200") 
                    : (theme === 'dark' ? "glass-dark" : "")
                )}
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0 relative ios-shadow">
                  <img 
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} 
                    alt={v.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{v.category}</div>
                  <h4 className={cn("font-bold text-lg tracking-tight", theme === 'light' ? "text-slate-800" : "text-white")}>{v.title}</h4>
                </div>
                <div className={cn("text-sm font-bold opacity-40", theme === 'light' ? "text-slate-400" : "text-pink-200")}>{v.duration}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lessons & Sounds */}
        <div className="lg:col-span-5 space-y-10">
          <h3 className={cn("text-2xl font-bold tracking-tight flex items-center gap-4 px-2", theme === 'light' ? "text-slate-800" : "text-white")}>
            <Compass className="w-7 h-7 text-pink-400" />
            {t.calmLessons}
          </h3>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "glass-card p-10 ios-shadow relative overflow-hidden",
              theme === 'light' ? "bg-gradient-to-br from-pink-50 to-white border-pink-50" : "glass-dark"
            )}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center shadow-xl mb-8">
              <Leaf className="text-white w-7 h-7" />
            </div>
            <h4 className={cn("text-xl font-bold tracking-tight mb-4", theme === 'light' ? "text-slate-800" : "text-white")}>{t.artOfLettingGo}</h4>
            <p className={cn("text-base leading-relaxed mb-10 opacity-70", theme === 'light' ? "text-slate-600" : "text-pink-100")}>
              {t.artOfLettingGoDesc}
            </p>
            <button 
              onClick={startLesson}
              className={cn(
                "w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-500 ios-shadow inner-glow",
                theme === 'light' ? "bg-pink-50 text-pink-400 hover:bg-pink-100" : "bg-white/10 text-pink-200 hover:bg-white/20"
              )}
            >
              {t.startLesson}
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "glass-card p-10 ios-shadow relative overflow-hidden",
              theme === 'light' ? "bg-gradient-to-br from-pink-50 to-white border-pink-50" : "glass-dark"
            )}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-300 flex items-center justify-center shadow-xl mb-8">
              <Music className="text-white w-7 h-7" />
            </div>
            <h4 className={cn("text-xl font-bold tracking-tight mb-4", theme === 'light' ? "text-slate-800" : "text-white")}>{t.ambientSoundscapes}</h4>
            <p className={cn("text-base leading-relaxed mb-10 opacity-70", theme === 'light' ? "text-slate-600" : "text-pink-100")}>
              {t.ambientSoundscapesDesc}
            </p>
            <button 
              onClick={toggleAmbient}
              className={cn(
                "w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 ios-shadow inner-glow",
                ambientPlaying 
                  ? (theme === 'light' ? "bg-pink-300 text-white" : "bg-pink-400 text-white") 
                  : (theme === 'light' ? "bg-pink-50 text-pink-400 hover:bg-pink-100" : "bg-white/10 text-pink-200 hover:bg-white/20")
              )}
            >
              {ambientPlaying ? <><Pause className="w-5 h-5" /> {t.pauseSounds}</> : <><Play className="w-5 h-5" /> {t.listenNow}</>}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

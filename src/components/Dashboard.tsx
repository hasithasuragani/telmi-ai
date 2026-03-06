import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, Sparkles, Wind, BookOpen, Leaf } from 'lucide-react';
import { translations, Language } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const data = [
  { subject: 'Happiness', A: 80, fullMark: 100 },
  { subject: 'Calmness', A: 65, fullMark: 100 },
  { subject: 'Confidence', A: 70, fullMark: 100 },
  { subject: 'Anxiety', A: 40, fullMark: 100 },
  { subject: 'Stress', A: 55, fullMark: 100 },
  { subject: 'Sadness', A: 30, fullMark: 100 },
];

export const Dashboard = ({ setPage, theme, metrics, moodHistory }: { setPage: (p: any) => void, theme: 'light' | 'dark', metrics: any, moodHistory: any[] }) => {
  const t = translations.en;
  const [hovered, setHovered] = useState(false);

  const data = [
    { subject: t.emotionHappy, A: metrics.happiness, fullMark: 100 },
    { subject: t.calmness, A: metrics.calmness, fullMark: 100 },
    { subject: t.confidence || 'Confidence', A: metrics.confidence, fullMark: 100 },
    { subject: t.emotionAnxious, A: metrics.anxiety, fullMark: 100 },
    { subject: t.stress, A: metrics.stress, fullMark: 100 },
    { subject: t.emotionSad, A: metrics.sadness, fullMark: 100 },
  ];

  const getEmojiForEmotion = (emotion: string) => {
    switch(emotion) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'calm': return '😌';
      case 'overthinking': return '💭';
      case 'drained': return '😴';
      default: return '😌';
    }
  };

  const days = [
    { id: 'Mon', label: t.mon || 'Mon' },
    { id: 'Tue', label: t.tue || 'Tue' },
    { id: 'Wed', label: t.wed || 'Wed' },
    { id: 'Thu', label: t.thu || 'Thu' },
    { id: 'Fri', label: t.fri || 'Fri' },
    { id: 'Sat', label: t.sat || 'Sat' },
    { id: 'Sun', label: t.sun || 'Sun' },
  ];

  const weeklyMoods = days.map((day, index) => {
    // Get date for this day of current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    const diff = (index + 1) - (dayOfWeek === 0 ? 7 : dayOfWeek);
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    const dateStr = targetDate.toISOString().split('T')[0];

    const historyEntry = moodHistory.find(m => m.date === dateStr);
    
    // Default values if no entry
    const defaultMoods = [
      { emoji: '😌', summary: t.monSummary || 'Felt peaceful after morning walk.' },
      { emoji: '😰', summary: t.tueSummary || 'Work stress was high today.' },
      { emoji: '😊', summary: t.wedSummary || 'Great session with Telmi.' },
      { emoji: '😌', summary: t.thuSummary || 'Found focus in meditation.' },
      { emoji: '😴', summary: t.friSummary || 'Feeling a bit drained.' },
      { emoji: '😊', summary: t.satSummary || 'Relaxing weekend start.' },
      { emoji: '😌', summary: t.sunSummary || 'Ready for the new week.' },
    ];

    if (historyEntry) {
      return {
        day: day.label,
        emoji: getEmojiForEmotion(historyEntry.emotion),
        summary: `You felt ${historyEntry.emotion} today.`
      };
    }

    return {
      day: day.label,
      emoji: defaultMoods[index].emoji,
      summary: defaultMoods[index].summary
    };
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Radar Chart Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "lg:col-span-7 glass-card p-10 h-[550px] flex flex-col ios-shadow relative overflow-hidden",
            theme === 'dark' && "glass-dark"
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/20 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className={cn("text-2xl font-bold tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>{t.emotionalResonance}</h3>
              <p className={cn("text-sm opacity-60", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.innerLandscape}</p>
            </div>
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
              theme === 'light' ? "bg-pink-100 text-pink-700" : "bg-white/10 text-pink-200"
            )}>
              {t.liveMetrics}
            </div>
          </div>
          
          <div className="flex-1 min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke={theme === 'light' ? "#FFD6E0" : "#E8A7C2"} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: theme === 'light' ? '#C0859E' : '#FFD6E0', 
                    fontSize: 12, 
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }} 
                />
                <Radar
                  name="Emotions"
                  dataKey="A"
                  stroke="#FFC1CC"
                  strokeWidth={3}
                  fill="#FFC1CC"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insights Section */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "glass-card p-10 ios-shadow relative overflow-hidden",
              theme === 'light' ? "bg-gradient-to-br from-pink-50 to-white" : "glass-dark"
            )}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-xl">
                <Sparkles className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className={cn("text-xl font-bold tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>{t.weeklyInsight}</h3>
                <p className={cn("text-sm italic opacity-60", theme === 'light' ? "text-pink-800" : "text-pink-200")}>"{t.resilienceBlooming}"</p>
              </div>
            </div>
            <p className={cn(
              "text-lg leading-relaxed mb-10",
              theme === 'light' ? "text-slate-700" : "text-pink-100"
            )}>
              {t.weeklyInsightDesc || "You've navigated through stressful moments with remarkable grace. Your calmness score has stabilized, showing a beautiful trend of emotional regulation."}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className={cn(
                "p-6 rounded-[24px] ios-shadow inner-glow",
                theme === 'light' ? "bg-white/40 border-white/60" : "bg-white/5 border-white/10"
              )}>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.calmness}</div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-2xl font-bold", theme === 'light' ? "text-pink-600" : "text-pink-400")}>+15%</span>
                  <TrendingUp className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <div className={cn(
                "p-6 rounded-[24px] ios-shadow inner-glow",
                theme === 'light' ? "bg-white/40 border-white/60" : "bg-white/5 border-white/10"
              )}>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.stress}</div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-2xl font-bold", theme === 'light' ? "text-rose-600" : "text-rose-400")}>-8%</span>
                  <TrendingUp className="w-5 h-5 text-rose-500 rotate-180" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass-card p-10 ios-shadow",
              theme === 'dark' && "glass-dark"
            )}
          >
            <h3 className={cn("text-lg font-bold tracking-tight mb-8", theme === 'light' ? "text-slate-900" : "text-white")}>{t.selfCareRituals}</h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { id: 'breathing', icon: Wind, label: t.breathing, color: 'bg-pink-400' },
                { id: 'journal', icon: BookOpen, label: t.journal, color: 'bg-rose-500' },
                { id: 'meditation', icon: Leaf, label: t.meditation, color: 'bg-pink-600' },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => setPage(action.id as any)}
                  className="flex flex-col items-center gap-4 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn("w-16 h-16 rounded-[22px] flex items-center justify-center text-white shadow-xl transition-all duration-500", action.color)}
                  >
                    <action.icon className="w-7 h-7" />
                  </motion.div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-60", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass-card p-10 ios-shadow overflow-x-auto",
          theme === 'dark' && "glass-dark"
        )}
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className={cn("text-xl font-bold tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>{t.moodJourney}</h3>
        </div>
        
        <div className="flex justify-between min-w-[800px] relative px-4">
          <div className={cn(
            "absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 -z-10 opacity-20",
            theme === 'light' ? "bg-pink-300" : "bg-pink-100"
          )} />
          {weeklyMoods.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-6 group relative">
              <div className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{m.day}</div>
              <motion.div 
                whileHover={{ scale: 1.2, y: -8 }}
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-4xl ios-shadow inner-glow cursor-help border-white/40 transition-all duration-500",
                  theme === 'light' ? "glass" : "glass-dark"
                )}
              >
                {m.emoji}
              </motion.div>
              
              {/* Tooltip */}
              <div className={cn(
                "absolute bottom-full mb-6 w-56 p-6 rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-20 ios-shadow border-white/40 translate-y-2 group-hover:translate-y-0",
                theme === 'light' ? "glass" : "glass-dark"
              )}>
                <p className={cn("font-bold text-sm mb-2", theme === 'light' ? "text-slate-900" : "text-white")}>{m.day} {t.reflections}</p>
                <p className={cn("text-xs leading-relaxed opacity-70", theme === 'light' ? "text-slate-600" : "text-pink-100")}>{m.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Calendar as CalendarIcon, Plus, X, BookOpen } from 'lucide-react';
import { translations, Language } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Emotion = 'happy' | 'sad' | 'anxious' | 'calm' | 'overthinking' | 'drained';

interface JournalEntry {
  id: string;
  date: string;
  emotion: Emotion;
  content: string;
}

export const Journal = ({ theme }: { theme: 'light' | 'dark' }) => {
  const t = translations.en;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', emotion: 'calm' as Emotion });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const emotions: { id: Emotion, emoji: string, label: string }[] = [
    { id: 'happy', emoji: '😊', label: t.emotionHappy },
    { id: 'sad', emoji: '😔', label: t.emotionSad },
    { id: 'anxious', emoji: '😰', label: t.emotionAnxious },
    { id: 'calm', emoji: '😌', label: t.emotionCalm },
    { id: 'overthinking', emoji: '💭', label: t.emotionOverthinking },
    { id: 'drained', emoji: '😴', label: t.emotionDrained },
  ];

  const handleSave = () => {
    if (!newEntry.content.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      emotion: newEntry.emotion,
      content: newEntry.content,
    };

    setEntries([entry, ...entries]);
    setNewEntry({ content: '', emotion: 'calm' });
    setIsAdding(false);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-16 px-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-5xl font-bold tracking-tight mb-4", theme === 'light' ? "text-slate-900" : "text-white")}
          >
            {t.reflectiveJournal}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn("text-xl font-medium italic opacity-60", theme === 'light' ? "text-pink-800" : "text-pink-200")}
          >
            "{t.safeSanctuary}"
          </motion.p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAdding(true)}
          className={cn(
            "w-16 h-16 rounded-[22px] flex items-center justify-center text-white shadow-2xl transition-all duration-500",
            theme === 'light' ? "bg-pink-300" : "bg-pink-400 shadow-pink-900/40"
          )}
        >
          <Plus className="w-10 h-10" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={cn(
              "glass-card p-12 mb-16 relative overflow-hidden ios-shadow",
              theme === 'dark' && "glass-dark"
            )}
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-100 via-pink-300 to-pink-500" />
            
            <div className="flex items-center justify-between mb-10">
              <h3 className={cn("text-2xl font-bold tracking-tight", theme === 'light' ? "text-slate-800" : "text-white")}>{t.todaysReflection}</h3>
              <button 
                onClick={() => setIsAdding(false)} 
                className={cn("p-3 rounded-full transition-colors", theme === 'light' ? "hover:bg-pink-50 text-slate-400" : "hover:bg-white/5 text-pink-200")}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
              {emotions.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setNewEntry({ ...newEntry, emotion: e.id })}
                  className={cn(
                    "w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl transition-all duration-500 ios-shadow inner-glow",
                    newEntry.emotion === e.id 
                      ? (theme === 'light' ? "bg-pink-50 border-pink-100 scale-110" : "bg-pink-400/40 border-pink-200 scale-110") 
                      : (theme === 'light' ? "glass opacity-60 hover:opacity-100" : "glass-dark opacity-40 hover:opacity-100")
                  )}
                >
                  {e.emoji}
                </button>
              ))}
            </div>

            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              placeholder={t.journalPlaceholder}
              className={cn(
                "w-full h-64 rounded-[32px] p-8 focus:outline-none transition-all duration-500 text-lg ios-shadow inner-glow mb-10 resize-none",
                theme === 'light' 
                  ? "bg-white/40 border border-white/60 focus:bg-white/60 text-slate-800 placeholder:text-slate-400" 
                  : "bg-white/5 border border-white/10 focus:bg-white/10 text-white placeholder:text-pink-200/50"
              )}
            />

            <button
              onClick={handleSave}
              className={cn(
                "w-full py-5 text-white font-bold text-lg rounded-[24px] shadow-2xl transition-all duration-500 flex items-center justify-center gap-3",
                theme === 'light' ? "bg-pink-300 hover:bg-pink-400" : "bg-pink-400 hover:bg-pink-500 shadow-pink-900/40"
              )}
            >
              <Save className="w-6 h-6" />
              {t.preserveReflection}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              layoutId={entry.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedEntry(entry)}
              className={cn(
                "glass-card p-8 cursor-pointer group ios-shadow transition-all duration-500 hover:-translate-y-2",
                theme === 'dark' && "glass-dark"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ios-shadow inner-glow",
                    theme === 'light' ? "bg-pink-50" : "bg-white/5"
                  )}>
                    {emotions.find(e => e.id === entry.emotion)?.emoji}
                  </div>
                  <div>
                    <div className={cn("text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{entry.date}</div>
                    <div className={cn("text-base font-bold capitalize", theme === 'light' ? "text-slate-800" : "text-white")}>{emotions.find(e => e.id === entry.emotion)?.label}</div>
                  </div>
                </div>
                <CalendarIcon className={cn("w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-500", theme === 'light' ? "text-slate-400" : "text-pink-200")} />
              </div>
              <p className={cn(
                "text-base line-clamp-3 leading-relaxed opacity-70",
                theme === 'light' ? "text-slate-600" : "text-pink-100"
              )}>
                {entry.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {entries.length === 0 && !isAdding && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 opacity-30"
        >
          <BookOpen className={cn("w-20 h-20 mx-auto mb-6", theme === 'light' ? "text-slate-400" : "text-pink-200")} />
          <p className={cn("text-xl font-medium italic", theme === 'light' ? "text-slate-600" : "text-pink-100")}>
            {t.emptyJournal}
          </p>
        </motion.div>
      )}

      {/* Entry Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              layoutId={selectedEntry.id}
              className={cn(
                "glass-card w-full max-w-3xl p-12 relative z-10 max-h-[85vh] overflow-y-auto ios-shadow",
                theme === 'dark' && "glass-dark"
              )}
            >
              <button 
                onClick={() => setSelectedEntry(null)}
                className={cn("absolute top-8 right-8 p-3 rounded-full transition-colors", theme === 'light' ? "hover:bg-pink-50 text-slate-400" : "hover:bg-white/5 text-pink-200")}
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="flex items-center gap-6 mb-12">
                <div className={cn(
                  "w-20 h-20 rounded-[28px] flex items-center justify-center text-5xl ios-shadow inner-glow",
                  theme === 'light' ? "bg-pink-50" : "bg-white/5"
                )}>
                  {emotions.find(e => e.id === selectedEntry.emotion)?.emoji}
                </div>
                <div>
                  <div className={cn("text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-2", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{selectedEntry.date}</div>
                  <h3 className={cn("text-3xl font-bold capitalize tracking-tight", theme === 'light' ? "text-slate-900" : "text-white")}>{emotions.find(e => e.id === selectedEntry.emotion)?.label}</h3>
                </div>
              </div>
              
              <div className={cn(
                "text-xl leading-relaxed whitespace-pre-wrap",
                theme === 'light' ? "text-slate-700" : "text-pink-50"
              )}>
                {selectedEntry.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from '../services/gemini';
import { translations, Language, languages } from '../translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export const TextTherapy = ({ personality, theme }: { personality: string, theme: 'light' | 'dark' }) => {
  const t = translations.en;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => `${m.sender === 'user' ? 'User' : 'Telmi'}: ${m.text}`).join('\n');
      const prompt = `You are Telmi, a mental health companion with a ${personality} personality. 
      The user is speaking in English. Please respond in English.
      IMPORTANT: Your response MUST be under 100 words.
      
      Chat History:
      ${history}
      
      User: ${input}
      Telmi:`;
      const response = await getGeminiResponse(prompt, personality);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I'm here for you, but I'm having a little trouble finding the words right now. Can we try again?",
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-10 px-6 max-w-4xl mx-auto h-screen flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass-card flex-1 flex flex-col overflow-hidden mb-8 ios-shadow",
          theme === 'dark' && "glass-dark"
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-6 border-b flex items-center justify-between",
          theme === 'light' ? "border-pink-50 bg-white/20" : "border-white/10 bg-black/20"
        )}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center shadow-lg">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className={cn("font-bold text-lg", theme === 'light' ? "text-slate-800" : "text-white")}>Telmi</h3>
              <p className={cn("text-[10px] uppercase tracking-[0.2em] font-bold opacity-60", theme === 'light' ? "text-slate-500" : "text-pink-200")}>{t.online}</p>
            </div>
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
            theme === 'light' ? "bg-pink-50 text-pink-400" : "bg-white/10 text-pink-200"
          )}>
            {personality}
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <Sparkles className={cn("w-16 h-16 animate-pulse", theme === 'light' ? "text-pink-400" : "text-pink-200")} />
              <p className={cn("text-xl font-medium italic", theme === 'light' ? "text-slate-600" : "text-pink-100")}>
                "{t.textWelcome}"
              </p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full",
                  m.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[85%] p-5 rounded-[28px] ios-shadow transition-all duration-500",
                  m.sender === 'user' 
                    ? (theme === 'light' ? "bg-pink-300 text-white rounded-tr-none" : "bg-pink-400 text-white rounded-tr-none shadow-pink-900/40") 
                    : (theme === 'light' ? "glass text-slate-800 rounded-tl-none border-white/60" : "glass-dark text-pink-50 rounded-tl-none border-white/10")
                )}>
                  <div className="markdown-body text-base leading-relaxed">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={cn(
                "p-5 rounded-[28px] rounded-tl-none flex gap-2",
                theme === 'light' ? "glass" : "glass-dark"
              )}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2.5 h-2.5 bg-pink-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2.5 h-2.5 bg-pink-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2.5 h-2.5 bg-pink-400 rounded-full" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className={cn(
          "p-8 border-t",
          theme === 'light' ? "bg-white/10 border-pink-50" : "bg-black/10 border-white/10"
        )}>
          <div className="relative flex items-center max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.textPlaceholder}
              className={cn(
                "w-full rounded-full py-5 pl-8 pr-20 focus:outline-none transition-all duration-500 text-lg ios-shadow inner-glow",
                theme === 'light' 
                  ? "bg-white/40 border border-white/60 focus:bg-white/60 text-slate-800 placeholder:text-slate-400" 
                  : "bg-white/10 border border-white/10 focus:bg-white/20 text-white placeholder:text-pink-200/50"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2.5 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all duration-500 disabled:opacity-50 disabled:scale-100",
                theme === 'light' ? "bg-pink-300" : "bg-pink-400 shadow-pink-900/40"
              )}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

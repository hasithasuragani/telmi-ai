export type Page = 'home' | 'voice' | 'text' | 'meditation' | 'breathing' | 'journal' | 'dashboard' | 'lessons' | 'settings';

export type Emotion = 'happy' | 'sad' | 'anxious' | 'calm' | 'overthinking' | 'drained';

export interface JournalEntry {
  id: string;
  date: string;
  emotion: Emotion;
  content: string;
}

export interface UserState {
  currentEmotion?: Emotion;
  journalEntries: JournalEntry[];
  personality: string;
  theme: string;
}

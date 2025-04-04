import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FortuneCategory, fortunes } from '@/constants/fortunes';
import { FortuneHistory, FortuneReading } from '@/types/fortune';
import { format } from 'date-fns';

interface FortuneState {
  currentFortune: FortuneReading | null;
  history: FortuneHistory;
  hasReadToday: (category: FortuneCategory) => boolean;
  readFortune: (category: FortuneCategory) => FortuneReading;
  clearCurrentFortune: () => void;
  clearHistory: () => void;
}

export const useFortuneStore = create<FortuneState>()(
  persist(
    (set, get) => ({
      currentFortune: null,
      history: {},
      
      hasReadToday: (category: FortuneCategory) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { history } = get();
        return !!(history[today] && history[today][category]);
      },
      
      readFortune: (category: FortuneCategory) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { history } = get();
        
        // Check if already read today
        if (history[today] && history[today][category]) {
          const fortune = history[today][category]!;
          set({ currentFortune: fortune });
          return fortune;
        }
        
        // Generate new fortune
        const categoryFortunes = fortunes[category];
        const randomIndex = Math.floor(Math.random() * categoryFortunes.length);
        const fortune = categoryFortunes[randomIndex];
        
        const newFortune: FortuneReading = {
          id: `${category}-${today}-${Date.now()}`,
          category,
          ...fortune,
          date: today,
        };
        
        // Update history
        const updatedHistory = { ...history };
        if (!updatedHistory[today]) {
          updatedHistory[today] = {};
        }
        updatedHistory[today][category] = newFortune;
        
        set({ 
          currentFortune: newFortune,
          history: updatedHistory
        });
        
        return newFortune;
      },
      
      clearCurrentFortune: () => {
        set({ currentFortune: null });
      },
      
      clearHistory: () => {
        set({ history: {}, currentFortune: null });
      }
    }),
    {
      name: 'fortune-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
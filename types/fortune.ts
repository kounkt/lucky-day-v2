import { FortuneCategory } from '@/constants/fortunes';

export interface FortuneReading {
  id: string;
  category: FortuneCategory;
  message: string;
  advice: string;
  luckyColor: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
}

export interface FortuneHistory {
  [date: string]: {
    [category in FortuneCategory]?: FortuneReading;
  };
}
import React, { createContext, useContext, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { lightColors, ThemeColors } from '@/constants/colors';

interface ThemeContextType {
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 常にライトモードを使用
  const colors = lightColors;

  return (
    <ThemeContext.Provider value={{ colors }}>
      <StatusBar style="dark" />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
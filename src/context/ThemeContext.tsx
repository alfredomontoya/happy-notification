import {createContext, useContext, useState, useMemo, type ReactNode} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryBg: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  danger: string;
  border: string;
  white: string;
  notificationBg: string;
  notificationText: string;
  overlay: string;
  cardBg: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  primary: '#0D9488',
  primaryLight: '#14B8A6',
  primaryDark: '#0F766E',
  primaryBg: '#F0FDF4',
  surface: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#64748B',
  accent: '#F59E0B',
  danger: '#EF4444',
  border: '#E2E8F0',
  white: '#FFFFFF',
  notificationBg: '#FEF3C7',
  notificationText: '#92400E',
  overlay: 'rgba(0,0,0,0.5)',
  cardBg: '#FFFFFF',
};

const darkColors: ThemeColors = {
  primary: '#0D9488',
  primaryLight: '#14B8A6',
  primaryDark: '#0F766E',
  primaryBg: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  accent: '#FBBF24',
  danger: '#F87171',
  border: '#334155',
  white: '#FFFFFF',
  notificationBg: '#78350F',
  notificationText: '#FDE68A',
  overlay: 'rgba(0,0,0,0.7)',
  cardBg: '#1E293B',
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({children}: {children: ReactNode}) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const colors = useMemo(() => (mode === 'light' ? lightColors : darkColors), [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (m: ThemeMode) => setMode(m);

  return (
    <ThemeContext.Provider value={{mode, colors, toggleTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

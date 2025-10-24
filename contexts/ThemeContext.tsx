import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string[];
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

const THEMES: Record<string, ThemeColors> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#60A5FA',
    secondary: '#3B82F6',
    accent: '#0EA5E9',
    background: ['#001838', '#002855', '#003872', '#004D99'],
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: 'rgba(96, 165, 250, 0.3)',
    shadow: 'rgba(96, 165, 250, 0.5)',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    primary: '#FB923C',
    secondary: '#F97316',
    accent: '#EF4444',
    background: ['#1A0B05', '#2D1508', '#4A1F0A', '#6B2D0D'],
    text: '#FFFFFF',
    textSecondary: '#FCA5A5',
    border: 'rgba(251, 146, 60, 0.3)',
    shadow: 'rgba(251, 146, 60, 0.5)',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    primary: '#4ADE80',
    secondary: '#22C55E',
    accent: '#10B981',
    background: ['#051208', '#0A1F10', '#0F2F18', '#154020'],
    text: '#FFFFFF',
    textSecondary: '#86EFAC',
    border: 'rgba(74, 222, 128, 0.3)',
    shadow: 'rgba(74, 222, 128, 0.5)',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    primary: '#A78BFA',
    secondary: '#8B5CF6',
    accent: '#7C3AED',
    background: ['#150A2D', '#1E0F3F', '#2A1654', '#3B1E6B'],
    text: '#FFFFFF',
    textSecondary: '#C4B5FD',
    border: 'rgba(167, 139, 250, 0.3)',
    shadow: 'rgba(167, 139, 250, 0.5)',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    primary: '#FB7185',
    secondary: '#F43F5E',
    accent: '#E11D48',
    background: ['#1A0510', '#2D0A1A', '#450F25', '#5E1430'],
    text: '#FFFFFF',
    textSecondary: '#FDA4AF',
    border: 'rgba(251, 113, 133, 0.3)',
    shadow: 'rgba(251, 113, 133, 0.5)',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    primary: '#94A3B8',
    secondary: '#64748B',
    accent: '#475569',
    background: ['#020611', '#0F172A', '#1E293B', '#334155'],
    text: '#FFFFFF',
    textSecondary: '#CBD5E1',
    border: 'rgba(148, 163, 184, 0.3)',
    shadow: 'rgba(148, 163, 184, 0.5)',
  },
};

interface ThemeContextType {
  theme: ThemeColors;
  themeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeColors[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fashion_muse_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState('midnight'); // Default theme
  const [theme, setThemeState] = useState<ThemeColors>(THEMES.midnight);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && THEMES[savedTheme]) {
          setThemeId(savedTheme);
          setThemeState(THEMES[savedTheme]);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newThemeId: string) => {
    if (THEMES[newThemeId]) {
      setThemeId(newThemeId);
      setThemeState(THEMES[newThemeId]);

      // Save to AsyncStorage
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const availableThemes = Object.values(THEMES);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

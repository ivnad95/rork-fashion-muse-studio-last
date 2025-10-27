const COLORS = {
  // Deep Sea Glass background palette
  background: '#060D28',
  backgroundDeep: '#0A133B',
  backgroundMid: '#0D1A48',
  backgroundBase: '#0F2055',
  backgroundGradient: [
    '#060D28',
    '#0A133B',
    '#0D1A48',
    '#0F2055',
  ],

  // Glass surface colors (white-based for authentic glass)
  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.25)',
  glassWrapper: 'rgba(255, 255, 255, 0.03)',
  glassShadow: 'rgba(0, 0, 0, 0.45)',

  // Accent colors (single accent only)
  primary: '#0A76AF',
  primaryLight: '#38BDF8',
  primaryDark: '#075985',
  primaryGlow: 'rgba(10, 118, 175, 0.60)',

  accent: '#0A76AF',
  accentLight: '#38BDF8',
  accentDark: '#075985',
  accentGlow: 'rgba(10, 118, 175, 0.60)',

  // Text colors (silver/white spectrum for maximum contrast)
  text: '#F8FAFC',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDisabled: '#64748B',

  // State colors (used sparingly)
  success: '#4ADE80',
  successGlow: 'rgba(74, 222, 128, 0.50)',
  warning: '#FCD34D',
  warningGlow: 'rgba(252, 211, 77, 0.50)',
  error: '#F87171',
  errorGlow: 'rgba(248, 113, 113, 0.50)',

  // Shadow colors
  shadowBlack: 'rgba(0, 0, 0, 0.45)',
  shadowAccent: 'rgba(10, 118, 175, 0.70)',

  // UI utilities
  overlay: 'rgba(7, 10, 15, 0.96)',
  divider: 'rgba(255, 255, 255, 0.12)',

  // Silver palette (legacy support)
  silver: '#CBD5E1',
  silverLight: '#F8FAFC',
  silverMid: '#CBD5E1',
  silverDark: '#94A3B8',
  silverGlow: 'rgba(248, 250, 252, 0.40)',
};

export default {
  dark: COLORS,
  ...COLORS,
};

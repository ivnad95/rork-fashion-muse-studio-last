export default {
  dark: {
    // Premium dark background palette - deeper and more refined
    background: '#020611',               // bgDeepest - almost black
    backgroundDeep: '#030A1A',           // bgDeep - very dark blue
    backgroundMid: '#040D22',            // bgMid - dark blue
    backgroundBase: '#05102A',           // bgBase - base dark blue
    backgroundGradient: [
      '#020611',                         // Top - almost black
      '#030814',                         // Upper mid
      '#040C1E',                         // Lower mid
      '#05102A',                         // Bottom - base
    ],

    // Refined glass surface colors - more subtle
    glass: 'rgba(255, 255, 255, 0.02)',          // Base glass tint - more subtle
    glassBorder: 'rgba(255, 255, 255, 0.08)',    // Default border - softer
    glassHighlight: 'rgba(255, 255, 255, 0.12)', // Top highlight - refined
    glassWrapper: 'rgba(255, 255, 255, 0.02)',   // Wrapper tint
    glassShadow: 'rgba(0, 0, 0, 0.60)',          // Deeper shadows

    // Refined accent colors - more muted and premium
    primary: '#0EA5E9',                          // Refined sky blue
    primaryLight: '#38BDF8',                     // Hover state
    primaryDark: '#0284C7',                      // Pressed state
    primaryGlow: 'rgba(14, 165, 233, 0.45)',     // More subtle glow

    accent: '#0EA5E9',                           // Same as primary
    accentLight: '#38BDF8',                      // Lighter variant
    accentDark: '#0284C7',                       // Darker variant
    accentGlow: 'rgba(14, 165, 233, 0.45)',      // Accent glow

    // Refined text colors - better hierarchy
    text: '#FFFFFF',                             // Pure white for primary text
    textSecondary: '#E2E8F0',                    // Lighter secondary text
    textMuted: '#94A3B8',                        // Muted text
    textDisabled: '#64748B',                     // Disabled text

    // State colors - more refined
    success: '#10B981',
    successGlow: 'rgba(16, 185, 129, 0.40)',
    warning: '#F59E0B',
    warningGlow: 'rgba(245, 158, 11, 0.40)',
    error: '#EF4444',
    errorGlow: 'rgba(239, 68, 68, 0.40)',

    // Shadow colors - deeper for premium feel
    shadowBlack: 'rgba(0, 0, 0, 0.70)',
    shadowAccent: 'rgba(14, 165, 233, 0.50)',

    // UI utilities
    overlay: 'rgba(2, 6, 17, 0.97)',
    divider: 'rgba(255, 255, 255, 0.10)',

    // Silver palette (refined for minimalist aesthetic)
    silver: '#E2E8F0',                           // Lighter silver
    silverLight: '#FFFFFF',                      // Pure white
    silverMid: '#E2E8F0',                        // Light gray
    silverDark: '#94A3B8',                       // Muted gray
    silverGlow: 'rgba(255, 255, 255, 0.30)',     // Subtle text glow

    // Gradient utilities - more refined
    liquidGradient: ['#FFFFFF', '#E2E8F0', '#CBD5E1', '#E2E8F0'],
    liquidGradientAlt: ['#FFFFFF', '#E2E8F0', '#CBD5E1'],
    edgeGradient: ['#FFFFFF', '#E2E8F0', '#CBD5E1', '#E2E8F0', '#FFFFFF'],
    glowGradient: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)'],
  },
};

export default {
  dark: {
    // Deep Sea Glass background palette
    background: '#060D28',               // bgDeepest - darkest blue
    backgroundDeep: '#0A133B',           // bgDeep - primary dark blue
    backgroundMid: '#0D1A48',            // bgMid - midpoint blue
    backgroundBase: '#0F2055',           // bgBase - base blue
    backgroundGradient: [
      '#060D28',                         // Top - deepest
      '#091433',                         // Upper mid
      '#0C1A47',                         // Lower mid
      '#0F2055',                         // Bottom - base
    ],

    // Glass surface colors (white-based for authentic glass)
    glass: 'rgba(255, 255, 255, 0.03)',          // Base glass tint
    glassBorder: 'rgba(255, 255, 255, 0.1)',     // Default border
    glassHighlight: 'rgba(255, 255, 255, 0.1)',  // Top highlight shine
    glassWrapper: 'rgba(255, 255, 255, 0.03)',   // Wrapper tint
    glassShadow: 'rgba(0, 0, 0, 0.45)',          // Default shadow

    // Accent colors (single accent only - #0A76AF)
    primary: '#0A76AF',                          // Primary accent
    primaryLight: '#38BDF8',                     // Hover state
    primaryDark: '#075985',                      // Pressed state
    primaryGlow: 'rgba(10, 118, 175, 0.60)',     // Glow effect

    accent: '#0A76AF',                           // Same as primary
    accentLight: '#38BDF8',                      // Lighter variant
    accentDark: '#075985',                       // Darker variant
    accentGlow: 'rgba(10, 118, 175, 0.60)',      // Accent glow

    // Text colors (silver/white spectrum for maximum contrast)
    text: '#F8FAFC',                             // Primary text (silverLight)
    textSecondary: '#CBD5E1',                    // Secondary text (silverMid)
    textMuted: '#94A3B8',                        // Tertiary text (silverDark)
    textDisabled: '#64748B',                     // Disabled text

    // State colors (used sparingly)
    success: '#4ADE80',
    successGlow: 'rgba(74, 222, 128, 0.50)',
    warning: '#FCD34D',
    warningGlow: 'rgba(252, 211, 77, 0.50)',
    error: '#F87171',
    errorGlow: 'rgba(248, 113, 113, 0.50)',

    // Shadow colors (primarily black, accent for active states)
    shadowBlack: 'rgba(0, 0, 0, 0.45)',
    shadowAccent: 'rgba(10, 118, 175, 0.70)',

    // UI utilities
    overlay: 'rgba(7, 10, 15, 0.96)',
    divider: 'rgba(230, 238, 255, 0.16)',

    // Silver palette (legacy support - mapped to new values)
    silver: '#CBD5E1',                           // Mapped to textSecondary
    silverLight: '#F8FAFC',                      // Mapped to text
    silverMid: '#CBD5E1',                        // Mapped to textSecondary
    silverDark: '#94A3B8',                       // Mapped to textMuted
    silverGlow: 'rgba(248, 250, 252, 0.40)',     // Text glow effect

    // Gradient utilities
    liquidGradient: ['#F8FAFC', '#CBD5E1', '#94A3B8', '#CBD5E1'],
    liquidGradientAlt: ['#F8FAFC', '#CBD5E1', '#94A3B8'],
    edgeGradient: ['#F8FAFC', '#CBD5E1', '#94A3B8', '#CBD5E1', '#F8FAFC'],
    glowGradient: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)'],
  },
};

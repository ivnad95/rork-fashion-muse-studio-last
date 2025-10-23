import { StyleSheet } from 'react-native';

// Deep Sea Glass Color Constants
export const COLORS = {
  // Background colors
  bgDeepest: '#060D28',
  bgDeep: '#0A133B',
  bgMid: '#0D1A48',
  bgBase: '#0F2055',

  // Text colors (silver/white spectrum)
  silverLight: '#F8FAFC',              // Primary text
  silverMid: '#CBD5E1',                // Secondary text
  silverDark: '#94A3B8',               // Tertiary text
  silverGlow: 'rgba(248, 250, 252, 0.40)',

  // Accent color (single accent only)
  accent: '#0A76AF',
  accentLight: '#38BDF8',
  accentDark: '#075985',
  accentGlow: 'rgba(10, 118, 175, 0.60)',

  // Glass surface colors
  glassBase: 'rgba(255, 255, 255, 0.03)',
  glassHighlight: 'rgba(255, 255, 255, 0.35)',
  glassReflection: 'rgba(255, 255, 255, 0.05)',

  // Border colors (gradient from top to bottom)
  borderTop: 'rgba(255, 255, 255, 0.25)',
  borderLeft: 'rgba(255, 255, 255, 0.18)',
  borderRight: 'rgba(255, 255, 255, 0.08)',
  borderBottom: 'rgba(255, 255, 255, 0.04)',

  // Shadow colors
  shadowBlack: 'rgba(0, 0, 0, 0.45)',
  shadowAccent: 'rgba(10, 118, 175, 0.70)',

  // State colors
  success: '#4ADE80',
  warning: '#FCD34D',
  error: '#F87171',
};

// Standardized spacing constants
export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Standardized border radius
export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  full: 9999,
};

export const glassStyles = StyleSheet.create({
  // Main glass surface (panels, cards) with 3-layer shadow system
  glass3DSurface: {
    backgroundColor: COLORS.glassBase,
    borderWidth: 1.5,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    borderRadius: RADIUS.xl,                        // 24px for main panels
    // Layer 1: Ambient shadow (large, diffused)
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 24,
    overflow: 'hidden',
  },

  // Interactive button surface with medium elevation
  glass3DButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.xxl,                       // 28px for buttons
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.32)',
    borderLeftColor: 'rgba(255, 255, 255, 0.24)',
    borderRightColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    // Layer 2: Direct shadow (medium elevation)
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.60,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },

  // Default button text style
  buttonText: {
    color: COLORS.silverMid,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.60)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Active button state with accent glow
  activeButton: {
    backgroundColor: 'rgba(10, 118, 175, 0.15)',    // Accent background tint
    borderTopColor: 'rgba(10, 118, 175, 0.55)',
    borderLeftColor: 'rgba(10, 118, 175, 0.45)',
    borderRightColor: 'rgba(10, 118, 175, 0.30)',
    borderBottomColor: 'rgba(10, 118, 175, 0.20)',
    // Accent glow shadow
    shadowColor: COLORS.shadowAccent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.90,
    shadowRadius: 32,
    elevation: 16,
  },

  // Active button text with neon glow
  activeButtonText: {
    color: COLORS.silverLight,
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  // Count selector chip (inactive)
  numberChip: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.xxl,                       // 28px (circular)
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    borderLeftColor: 'rgba(255, 255, 255, 0.18)',
    borderRightColor: 'rgba(255, 255, 255, 0.10)',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    // Layer 3: Contact shadow (small elements)
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 16,
    elevation: 8,
  },

  // Count selector chip (active) - accent glow
  activeNumberChip: {
    backgroundColor: 'rgba(10, 118, 175, 0.15)',
    borderTopColor: 'rgba(10, 118, 175, 0.55)',
    borderLeftColor: 'rgba(10, 118, 175, 0.45)',
    borderRightColor: 'rgba(10, 118, 175, 0.30)',
    borderBottomColor: 'rgba(10, 118, 175, 0.20)',
    shadowColor: COLORS.shadowAccent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.80,
    shadowRadius: 24,
    elevation: 12,
  },

  // Active chip text
  activeNumberChipText: {
    color: COLORS.silverLight,
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  // Primary button dimensions
  primaryButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Primary button text
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },

  // Delete button (error state)
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },

  // Delete button text
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '600' as const,
  },
  // Screen layout styles
  screenContent: {
    flex: 1,
    padding: SPACING.lg,
    paddingBottom: 100,
  },

  // Title section
  titleContainer: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
  },

  // Title text with neon glow
  titleText: {
    color: COLORS.silverLight,
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -1.0,
    textShadowColor: COLORS.silverGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // Panel container
  panelContainer: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
  },

  // Image placeholder
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },

  // Image container
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading spinner
  loader: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopColor: COLORS.accent,
    borderRadius: 16,
  },

  // Loading overlay
  loadingPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
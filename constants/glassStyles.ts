import { StyleSheet } from 'react-native';

// Premium Glass Color Constants - Refined for minimalist aesthetic
export const COLORS = {
  // Background colors - premium dark palette
  bgDeepest: '#020611',
  bgDeep: '#030A1A',
  bgMid: '#040D22',
  bgBase: '#05102A',

  // Text colors (refined hierarchy)
  silverLight: '#FFFFFF',              // Pure white for primary text
  silverMid: '#E2E8F0',                // Light secondary text
  silverDark: '#94A3B8',               // Muted tertiary text
  silverGlow: 'rgba(255, 255, 255, 0.30)',

  // Refined accent color
  accent: '#0EA5E9',
  accentLight: '#38BDF8',
  accentDark: '#0284C7',
  accentGlow: 'rgba(14, 165, 233, 0.45)',

  // Simplified glass surface colors
  glassBase: 'rgba(255, 255, 255, 0.02)',
  glassHighlight: 'rgba(255, 255, 255, 0.12)',
  glassReflection: 'rgba(255, 255, 255, 0.06)',
  glassStroke: 'rgba(255, 255, 255, 0.10)',

  // Simplified border colors
  borderTop: 'rgba(255, 255, 255, 0.15)',
  borderLeft: 'rgba(255, 255, 255, 0.12)',
  borderRight: 'rgba(255, 255, 255, 0.06)',
  borderBottom: 'rgba(255, 255, 255, 0.04)',

  // Deeper shadows for premium depth
  shadowBlack: 'rgba(0, 0, 0, 0.70)',
  shadowAccent: 'rgba(14, 165, 233, 0.50)',

  // Refined state colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

// Refined spacing constants - more generous for minimalist aesthetic
export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,                // Increased from 20 for more breathing room
  xl: 32,                // Increased from 24
  xxl: 40,               // Increased from 32
  xxxl: 56,              // Increased from 48
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
  // Main glass surface - simplified and refined
  glass3DSurface: {
    backgroundColor: COLORS.glassBase,
    borderWidth: 1,                                 // Reduced from 1.5
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    borderRadius: RADIUS.xl,                        // 24px for main panels
    // Simplified shadow - single layer for cleaner look
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 16 },         // Reduced from 24
    shadowOpacity: 0.60,                            // Increased from 0.45
    shadowRadius: 32,                               // Reduced from 48
    elevation: 16,                                  // Reduced from 24
    overflow: 'hidden',
  },

  // Interactive button surface - cleaner and simpler
  glass3DButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',   // More subtle
    borderRadius: RADIUS.xxl,                       // 28px for buttons
    borderWidth: 1,                                 // Reduced from 2
    borderTopColor: 'rgba(255, 255, 255, 0.20)',    // Simplified borders
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    // Cleaner shadow
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 16,
    elevation: 8,
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
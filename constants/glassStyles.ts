import { StyleSheet, Platform } from 'react-native';

// ============================================================================
// UNIFIED GLASS DESIGN SYSTEM
// Premium Deep Blue Liquid Glass Aesthetic
// ============================================================================

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const COLORS = {
  // Deep Sea Glass palette aliases (for design parity with ManusAI reference)
  bgColor: '#0A133B',
  lightColor1: '#002857',
  lightColor2: '#004b93',
  lightColor3: '#0A76AF',

  // Background Gradients (Deep Blue Theme)
  bgDeepest: '#0A0F1C',        // Darkest - near black blue
  bgDeep: '#0D1929',           // Deep background - dark navy
  bgMid: '#1A2F4F',            // Mid background - medium blue
  bgLight: '#2A3F5F',          // Lighter surface - soft blue

  // Glass Surface Colors (Transparent with Blue Tint)
  glassUltraLight: 'rgba(58, 89, 130, 0.15)',     // Ultra-light glass overlay
  glassLight: 'rgba(42, 73, 114, 0.25)',          // Light glass surface
  glassMedium: 'rgba(26, 57, 98, 0.35)',          // Medium glass depth
  glassDark: 'rgba(13, 25, 42, 0.50)',            // Dark glass shadow

  // Minimal Glass Variants (Premium Subtle Aesthetic)
  glassMinimal: 'rgba(255, 255, 255, 0.03)',      // Barely-there glass
  glassMinimalLight: 'rgba(255, 255, 255, 0.05)', // Subtle glass surface
  glassMinimalMedium: 'rgba(255, 255, 255, 0.08)', // Soft glass depth
  glassMinimalDark: 'rgba(0, 0, 0, 0.20)',        // Minimal dark overlay

  // Glass Highlights & Reflections
  glassHighlight: 'rgba(255, 255, 255, 0.25)',    // Strong top highlight
  glassShine: 'rgba(255, 255, 255, 0.18)',        // Glossy shine effect
  glassReflection: 'rgba(200, 220, 255, 0.10)',   // Blue-tinted reflection
  glassStroke: 'rgba(255, 255, 255, 0.12)',       // Subtle edge stroke

  // Minimal Highlights (Softer, More Premium)
  glassHighlightMinimal: 'rgba(255, 255, 255, 0.10)', // Soft top highlight
  glassShineMinimal: 'rgba(255, 255, 255, 0.06)',     // Barely-visible shine
  glassStrokeMinimal: 'rgba(255, 255, 255, 0.06)',    // Ultra-subtle edge

  // Border Colors (Light-to-Shadow Gradient)
  borderTop: 'rgba(255, 255, 255, 0.25)',         // Brightest - top edge
  borderLeft: 'rgba(255, 255, 255, 0.18)',        // Bright - left edge
  borderRight: 'rgba(255, 255, 255, 0.08)',       // Subtle - right edge
  borderBottom: 'rgba(255, 255, 255, 0.04)',      // Darkest - bottom edge

  // Minimal Border Colors (Softer Gradient)
  borderMinimalTop: 'rgba(255, 255, 255, 0.10)',     // Soft top edge
  borderMinimalLeft: 'rgba(255, 255, 255, 0.08)',    // Soft left edge
  borderMinimalRight: 'rgba(255, 255, 255, 0.04)',   // Barely-visible right
  borderMinimalBottom: 'rgba(255, 255, 255, 0.02)',  // Almost invisible bottom

  // Text Colors (Silver/White Spectrum)
  textPrimary: '#F8FAFC',          // Primary text - almost white
  textSecondary: '#CBD5E1',        // Secondary text - light silver
  textMuted: '#94A3B8',            // Muted text - mid silver
  textGlow: 'rgba(248, 250, 252, 0.40)',  // Text glow effect

  // Legacy naming used by reference repo components
  silverLight: '#F5F7FA',
  silverMid: '#C8CDD5',
  silverDark: '#8A92A0',
  silverGlow: 'rgba(200, 205, 213, 0.4)',

  // Accent Colors (Bright Sky Blue with Glow)
  accent: '#38BDF8',               // Primary accent - bright sky blue
  accentLight: '#7DD3FC',          // Light accent
  accentDark: '#0EA5E9',           // Dark accent
  accentGlow: 'rgba(56, 189, 248, 0.70)',  // Accent glow effect
  accentShadow: 'rgba(56, 189, 248, 0.60)', // Accent shadow

  // Shadow Colors (Layered Depth)
  shadowLight: 'rgba(88, 122, 166, 0.40)',  // Ambient light shadow
  shadowMedium: 'rgba(58, 89, 130, 0.60)',  // Medium direct shadow
  shadowDark: 'rgba(13, 25, 42, 0.80)',     // Deep contact shadow
  shadowBlack: 'rgba(0, 0, 0, 0.50)',       // Pure black shadow
  shadowColor: 'rgba(0, 0, 0, 0.5)',

  // Inner Shadow (Inset/Pressed States)
  innerShadow: 'rgba(0, 0, 0, 0.35)',

  // State Colors
  success: '#4ADE80',              // Green
  warning: '#FCD34D',              // Yellow
  error: '#F87171',                // Red

  // Overlay Colors
  overlay: 'rgba(10, 15, 28, 0.92)',        // Dark overlay
  overlayLight: 'rgba(13, 25, 41, 0.85)',   // Lighter overlay

  // Legacy aliases (for backward compatibility - will be removed in future version)
  /** @deprecated Use glassLight instead */
  glassBase: 'rgba(42, 73, 114, 0.25)',
  /** @deprecated Use accentShadow instead */
  shadowAccent: 'rgba(56, 189, 248, 0.60)',
};

// ============================================================================
// SPACING SCALE
// ============================================================================

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

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const RADIUS = {
  sm: 12,      // Small chips/badges
  md: 16,      // Small cards
  lg: 20,      // Medium panels
  xl: 24,      // Large panels/cards
  xxl: 28,     // Buttons
  xxxl: 32,    // Extra large elements
  full: 9999,  // Circular
};

// ============================================================================
// BLUR INTENSITY (Standardized)
// ============================================================================

export const BLUR = {
  light: 18,       // Subtle blur for overlays
  medium: 28,      // Standard glass blur
  heavy: 40,       // Strong blur for modals

  // Minimal blur intensities
  minimal: 10,     // Ultra-subtle blur
  soft: 15,        // Soft minimal blur
};

// ============================================================================
// SHADOW ELEVATION (iOS & Android)
// ============================================================================

export const SHADOW = {
  // Low elevation (small elements like chips)
  low: {
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 12,
    elevation: 4,
  },
  // Medium elevation (buttons, small cards)
  medium: {
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 20,
    elevation: 8,
  },
  // High elevation (panels, large cards)
  high: {
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.60,
    shadowRadius: 32,
    elevation: 16,
  },
  // Accent glow shadow (for active/primary states)
  accentGlow: {
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.80,
    shadowRadius: 24,
    elevation: 12,
  },

  // Minimal shadow variants (softer, more premium)
  minimal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  minimalMedium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
  minimalHigh: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  accentGlowMinimal: {
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 6,
  },
};

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const ANIMATION = {
  // Duration (milliseconds)
  fast: 150,
  medium: 300,
  slow: 500,
  verySlow: 1000,

  // Spring Physics
  spring: {
    // Snappy bounce (buttons, chips)
    snappy: {
      friction: 8,
      tension: 300,
    },
    // Smooth bounce (panels, modals)
    smooth: {
      friction: 6,
      tension: 200,
    },
    // Gentle bounce (large elements)
    gentle: {
      friction: 10,
      tension: 150,
    },
  },
};

// ============================================================================
// PLATFORM-SPECIFIC HELPERS
// ============================================================================

/**
 * Returns blur configuration or fallback for platform
 * @param intensity - Blur intensity value (default: 28)
 * @returns BlurView props or fallback background color
 */
export const getBlurStyle = (intensity: number = BLUR.medium) => {
  if (Platform.OS === 'web') {
    return {
      backgroundColor: COLORS.glassMedium,
      backdropFilter: `blur(${intensity / 2}px)`, // CSS fallback
    };
  }
  return {
    intensity,
    tint: 'dark' as const,
  };
};

/**
 * Returns shadow style for platform
 * iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android: elevation (automatically converted)
 */
export const getPlatformShadow = (
  elevation: 'low' | 'medium' | 'high' | 'accentGlow'
) => {
  return SHADOW[elevation];
};

// ============================================================================
// COMPONENT STYLE TEMPLATES
// ============================================================================

export const glassStyles = StyleSheet.create({
  // --------------------------------------------------------------------------
  // GLASS PANELS & CARDS
  // --------------------------------------------------------------------------

  /**
   * Standard glass panel/card surface
   * Use for: Main content containers, cards, sections
   */
  glassPanel: {
    backgroundColor: COLORS.glassLight,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.high,
    overflow: 'hidden',
  },

  /**
   * Compact glass card (smaller padding, medium elevation)
   * Use for: List items, thumbnails, small info cards
   */
  glassCard: {
    backgroundColor: COLORS.glassLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.medium,
    overflow: 'hidden',
    padding: SPACING.md,
  },

  /**
   * Inset glass surface (for inputs, carved areas)
   * Use for: Text inputs, search bars, embedded content
   */
  glassInset: {
    backgroundColor: COLORS.glassDark,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderTopColor: 'rgba(0, 0, 0, 0.20)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: COLORS.glassHighlight,
    borderBottomColor: COLORS.glassHighlight,
    shadowColor: COLORS.innerShadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    padding: SPACING.sm,
  },

  // --------------------------------------------------------------------------
  // BUTTONS
  // --------------------------------------------------------------------------

  /**
   * Standard glass button
   * Use for: Primary actions, CTAs, navigation buttons
   */
  glassButton: {
    backgroundColor: COLORS.glassLight,
    borderRadius: RADIUS.xxl,
    borderWidth: 2,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.medium,
    overflow: 'hidden',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Active/selected button state with accent glow
   * Use for: Selected buttons, active tabs, primary CTAs
   */
  glassButtonActive: {
    backgroundColor: COLORS.glassUltraLight,
    borderTopColor: `${COLORS.accent}40`,  // 25% opacity
    borderLeftColor: `${COLORS.accent}30`,
    borderRightColor: `${COLORS.accent}20`,
    borderBottomColor: `${COLORS.accent}15`,
    ...SHADOW.accentGlow,
  },

  /**
   * Pressed button state (inset appearance)
   * Use for: onPressIn state, disabled state
   */
  glassButtonPressed: {
    backgroundColor: COLORS.glassDark,
    borderTopColor: 'rgba(0, 0, 0, 0.20)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: COLORS.glassHighlight,
    borderBottomColor: COLORS.glassHighlight,
    shadowColor: COLORS.innerShadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },

  /**
   * Small button variant
   * Use for: Secondary actions, chips, compact controls
   */
  glassButtonSmall: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },

  /**
   * Ghost button variant (ultra-minimal)
   * Use for: Tertiary actions, cancel buttons, subtle controls
   */
  glassButtonGhost: {
    backgroundColor: COLORS.glassUltraLight,
    borderWidth: 1,
    ...SHADOW.low,
  },

  // --------------------------------------------------------------------------
  // CHIPS & BADGES
  // --------------------------------------------------------------------------

  /**
   * Circular chip/badge (e.g., count selector)
   * Use for: Numeric selectors, circular icons, avatars
   */
  glassChip: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glassLight,
    borderWidth: 2,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.low,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Active chip with accent glow
   */
  glassChipActive: {
    backgroundColor: COLORS.glassUltraLight,
    borderTopColor: `${COLORS.accent}55`,
    borderLeftColor: `${COLORS.accent}45`,
    borderRightColor: `${COLORS.accent}30`,
    borderBottomColor: `${COLORS.accent}20`,
    ...SHADOW.accentGlow,
  },

  // --------------------------------------------------------------------------
  // LAYER EFFECTS (Absolute Positioned Overlays)
  // --------------------------------------------------------------------------

  /**
   * Top highlight gradient (glossy 3D effect)
   * Apply as absolute positioned child (top 35% of parent)
   */
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    pointerEvents: 'none',
  },

  /**
   * Light refraction layer (blue-tinted glass reflection)
   * Apply as absolute positioned child
   */
  lightRefraction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: COLORS.glassReflection,
    pointerEvents: 'none',
  },

  /**
   * Edge glow (soft inner glow for premium feel)
   * Apply as absolute positioned child matching parent bounds
   */
  edgeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.xl,
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    pointerEvents: 'none',
  },

  // --------------------------------------------------------------------------
  // TEXT STYLES
  // --------------------------------------------------------------------------

  textPrimary: {
    color: COLORS.textPrimary,
    fontWeight: '700' as const,
  },

  textSecondary: {
    color: COLORS.textSecondary,
    fontWeight: '600' as const,
  },

  textMuted: {
    color: COLORS.textMuted,
    fontWeight: '400' as const,
  },

  /**
   * Button text with subtle shadow
   */
  buttonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.60)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /**
   * Active button text with accent glow
   */
  buttonTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700' as const,
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  /**
   * Large title text with glow effect
   */
  titleText: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -1.0,
    textShadowColor: COLORS.textGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // --------------------------------------------------------------------------
  // LAYOUT HELPERS
  // --------------------------------------------------------------------------

  /**
   * Screen content container
   */
  screenContent: {
    flex: 1,
    padding: SPACING.lg,
    paddingBottom: 100, // Tab bar clearance
  },

  /**
   * Centered container
   */
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --------------------------------------------------------------------------
  // LOADING & OVERLAYS
  // --------------------------------------------------------------------------

  /**
   * Loading overlay (dark semi-transparent)
   */
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Modal backdrop
   */
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --------------------------------------------------------------------------
  // MINIMAL GLASS VARIANTS (Premium Subtle Aesthetic)
  // --------------------------------------------------------------------------

  /**
   * Minimal glass panel - ultra-subtle, premium look
   * Use for: Main content areas requiring minimal visual weight
   */
  glassPanelMinimal: {
    backgroundColor: COLORS.glassMinimal,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    ...SHADOW.minimal,
    overflow: 'hidden',
  },

  /**
   * Minimal glass card - compact with soft shadows
   * Use for: List items, small containers
   */
  glassCardMinimal: {
    backgroundColor: COLORS.glassMinimalLight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    ...SHADOW.minimalMedium,
    overflow: 'hidden',
    padding: SPACING.md,
  },

  /**
   * Minimal glass button - soft, premium feel
   * Use for: Primary actions with minimal aesthetic
   */
  glassButtonMinimal: {
    backgroundColor: COLORS.glassMinimalLight,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    ...SHADOW.minimalMedium,
    overflow: 'hidden',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Minimal glass button active state
   */
  glassButtonMinimalActive: {
    backgroundColor: COLORS.glassMinimalMedium,
    borderTopColor: `${COLORS.accent}30`,
    borderLeftColor: `${COLORS.accent}25`,
    borderRightColor: `${COLORS.accent}15`,
    borderBottomColor: `${COLORS.accent}10`,
    ...SHADOW.accentGlowMinimal,
  },

  /**
   * Glass pill - compact minimal button/chip
   * Use for: Filter tags, small selectors
   */
  glassPill: {
    backgroundColor: COLORS.glassMinimalLight,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    ...SHADOW.minimal,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Glass pill active state
   */
  glassPillActive: {
    backgroundColor: COLORS.glassMinimalMedium,
    borderTopColor: `${COLORS.accent}40`,
    borderLeftColor: `${COLORS.accent}30`,
    borderRightColor: `${COLORS.accent}20`,
    borderBottomColor: `${COLORS.accent}10`,
    ...SHADOW.accentGlowMinimal,
  },

  /**
   * Floating minimal glass container
   * Use for: Upload areas, large interactive zones
   */
  glassFloatingMinimal: {
    backgroundColor: COLORS.glassMinimal,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    ...SHADOW.minimalHigh,
    overflow: 'hidden',
  },

  // --------------------------------------------------------------------------
  // MINIMAL TEXT STYLES
  // --------------------------------------------------------------------------

  /**
   * Minimal section label - ultra-light weight
   */
  textSectionMinimal: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  /**
   * Minimal button text - lighter weight
   */
  buttonTextMinimal: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },

  /**
   * Minimal button text active
   */
  buttonTextMinimalActive: {
    color: COLORS.textPrimary,
    fontWeight: '600' as const,
  },

  // --------------------------------------------------------------------------
  // LEGACY COMPATIBILITY (For gradual migration)
  // --------------------------------------------------------------------------

  /**
   * @deprecated Use glassPanel instead
   */
  glass3DSurface: {
    backgroundColor: COLORS.glassLight,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.high,
    overflow: 'hidden',
  },

  /**
   * @deprecated Use glassButton instead
   */
  glass3DButton: {
    backgroundColor: COLORS.glassLight,
    borderRadius: RADIUS.xxl,
    borderWidth: 2,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    ...SHADOW.medium,
    overflow: 'hidden',
  },

  /**
   * @deprecated Use glassButtonActive instead
   */
  activeButton: {
    backgroundColor: COLORS.glassUltraLight,
    borderTopColor: `${COLORS.accent}40`,
    borderLeftColor: `${COLORS.accent}30`,
    borderRightColor: `${COLORS.accent}20`,
    borderBottomColor: `${COLORS.accent}15`,
    ...SHADOW.accentGlow,
  },

  /**
   * @deprecated Use buttonTextActive instead
   */
  activeButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700' as const,
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});

// ============================================================================
// GRADIENT PRESETS (For LinearGradient components)
// ============================================================================

export const GRADIENTS = {
  /**
   * Background gradient (full-screen)
   * Use with LinearGradient for app backgrounds
   */
  background: [COLORS.bgDeepest, COLORS.bgDeep, COLORS.bgMid] as const,

  /**
   * Glass panel gradient (top-to-bottom depth)
   * Use inside glass components for added depth
   */
  glassDepth: [
    COLORS.glassUltraLight,
    COLORS.glassLight,
    COLORS.glassMedium,
  ] as const,

  /**
   * Top highlight gradient (glossy shine)
   * Use for topHighlight layer
   */
  topShine: [
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.08)',
    'rgba(255, 255, 255, 0.02)',
    'transparent',
  ] as const,

  /**
   * Inner gradient (subtle depth within glass)
   */
  innerDepth: [
    'rgba(255, 255, 255, 0.04)',
    'transparent',
    'rgba(0, 0, 0, 0.15)',
  ] as const,

  /**
   * Accent gradient (for active/selected states)
   */
  accent: [COLORS.accentLight, COLORS.accent, COLORS.accentDark] as const,

  /**
   * Accent glow gradient (pulsing animation)
   */
  accentGlow: [
    COLORS.accentGlow,
    `${COLORS.accent}60`,
    COLORS.accentGlow,
  ] as const,
};

// ============================================================================
// USAGE EXAMPLES (for documentation)
// ============================================================================

/*
 * EXAMPLE 1: Glass Panel Component
 *
 * import { glassStyles, COLORS, RADIUS, BLUR, GRADIENTS } from '@/constants/glassStyles';
 * import { BlurView } from 'expo-blur';
 * import { LinearGradient } from 'expo-linear-gradient';
 *
 * <View style={glassStyles.glassPanel}>
 *   {Platform.OS !== 'web' && (
 *     <BlurView
 *       intensity={BLUR.medium}
 *       tint="dark"
 *       style={StyleSheet.absoluteFill}
 *     />
 *   )}
 *
 *   <LinearGradient
 *     colors={GRADIENTS.topShine}
 *     style={glassStyles.topHighlight}
 *   />
 *
 *   <View style={{ zIndex: 10 }}>
 *     {children}
 *   </View>
 * </View>
 *
 *
 * EXAMPLE 2: Glass Button Component
 *
 * <TouchableOpacity
 *   style={[
 *     glassStyles.glassButton,
 *     isActive && glassStyles.glassButtonActive
 *   ]}
 *   onPress={handlePress}
 * >
 *   <Text style={[
 *     glassStyles.buttonText,
 *     isActive && glassStyles.buttonTextActive
 *   ]}>
 *     {title}
 *   </Text>
 * </TouchableOpacity>
 *
 *
 * EXAMPLE 3: Glass Chip Component
 *
 * <View style={[
 *   glassStyles.glassChip,
 *   isSelected && glassStyles.glassChipActive
 * ]}>
 *   <Text style={glassStyles.textPrimary}>{count}</Text>
 * </View>
 */

import { StyleSheet } from 'react-native';

// Premium Glass Morphism Blue Color Palette - iOS 26 Liquid Glass Style
export const NEU_COLORS = {
  // Deep blue gradient backgrounds - ultra dark, premium
  bgDeepest: '#0D1929',         // Deepest background - near black blue
  bgDeep: '#1A2F4F',            // Deep background - dark deepsea blue
  bgMid: '#2A3F5F',             // Mid background - soft deep blue
  bgBase: '#3A4F6F',            // Base surface - lighter blue

  // Glass base colors - very transparent for light refraction
  glassBase: 'rgba(26, 47, 79, 0.4)',          // Deep blue, very transparent
  glassSurface: 'rgba(42, 63, 95, 0.35)',      // Surface layer, subtle
  glassLight: 'rgba(88, 122, 166, 0.2)',       // Light blue accent glass
  glassDeep: 'rgba(13, 25, 42, 0.6)',          // Deep shadow glass

  // Multi-layer gradient stops for 3D depth
  gradient1: 'rgba(58, 89, 130, 0.25)',        // Top gradient - lightest
  gradient2: 'rgba(42, 73, 114, 0.30)',        // Middle gradient
  gradient3: 'rgba(26, 57, 98, 0.35)',         // Bottom gradient - deepest

  // Light refraction colors - for realistic glass
  refractionLight: 'rgba(200, 220, 255, 0.08)', // White-blue light refraction
  refractionMid: 'rgba(150, 180, 230, 0.06)',   // Mid-tone refraction
  refractionDark: 'rgba(100, 140, 200, 0.05)',  // Dark refraction

  // Border highlights - gradient from light to shadow
  borderTop: 'rgba(255, 255, 255, 0.18)',      // Top edge - brightest
  borderLeft: 'rgba(255, 255, 255, 0.15)',     // Left edge - bright
  borderRight: 'rgba(255, 255, 255, 0.08)',    // Right edge - subtle
  borderBottom: 'rgba(255, 255, 255, 0.04)',   // Bottom edge - darkest

  // Glass highlights and shine
  glassHighlight: 'rgba(255, 255, 255, 0.25)',  // Strong highlight
  glassShine: 'rgba(255, 255, 255, 0.18)',      // Top shine effect
  glassReflection: 'rgba(200, 220, 255, 0.10)', // Glass surface reflection

  // Shadow colors - softer, more diffused
  shadowLight: 'rgba(88, 122, 166, 0.4)',      // Light shadow (ambient)
  shadowMid: 'rgba(58, 89, 130, 0.6)',         // Medium shadow
  shadowDark: 'rgba(13, 25, 42, 0.8)',         // Dark shadow (direct)
  shadowBlack: 'rgba(0, 0, 0, 0.5)',           // Deep black shadow

  // Inner shadows for inset/pressed states
  innerShadowLight: 'rgba(0, 0, 0, 0.15)',
  innerShadowDark: 'rgba(0, 0, 0, 0.35)',

  // Text colors - silver/white spectrum
  textPrimary: '#F8FAFC',       // Primary text - almost white
  textSecondary: '#CBD5E1',     // Secondary text - light silver
  textMuted: '#94A3B8',         // Muted text - mid silver
  textGlow: 'rgba(248, 250, 252, 0.40)', // Text glow effect

  // Accent colors - bright blue with glow
  accentStart: '#58A9E6',       // Gradient start - bright sky blue
  accentMiddle: '#3B82C9',      // Gradient middle - medium blue
  accentEnd: '#2563AB',         // Gradient end - deep blue
  accentGlow: 'rgba(88, 169, 230, 0.70)', // Accent glow - strong

  // State colors
  success: '#4ADE80',
  warning: '#FCD34D',
  error: '#F87171',

  // Overlays
  overlay: 'rgba(13, 25, 42, 0.92)',
  overlayLight: 'rgba(26, 47, 79, 0.85)',
};

// Spacing constants
export const NEU_SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Border radius (softer, rounder for neumorphic)
export const NEU_RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,
  full: 9999,
};

export const neumorphicStyles = StyleSheet.create({
  // Base neumorphic surface (raised/extruded)
  neuSurface: {
    backgroundColor: NEU_COLORS.base,
    borderRadius: NEU_RADIUS.xl,
    // Light shadow (top-left) - creates highlight
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // This will be layered with dark shadow in components
    elevation: 8,
  },

  // Dark shadow layer (bottom-right) - creates depth
  neuSurfaceDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },

  // Neumorphic button (raised)
  neuButton: {
    backgroundColor: NEU_COLORS.base,
    borderRadius: NEU_RADIUS.xxl,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // Light shadow
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  // Button dark shadow (apply as wrapper)
  neuButtonDarkShadow: {
    borderRadius: NEU_RADIUS.xxl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  // Pressed button state (inset/carved)
  neuButtonPressed: {
    backgroundColor: NEU_COLORS.baseDarker,
    // Invert shadows for pressed effect
    shadowColor: NEU_COLORS.innerShadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Active/selected button with gradient
  neuButtonActive: {
    backgroundColor: NEU_COLORS.accentStart,
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },

  // Card/panel container
  neuCard: {
    backgroundColor: NEU_COLORS.base,
    borderRadius: NEU_RADIUS.xl,
    padding: NEU_SPACING.lg,
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },

  // Card dark shadow layer
  neuCardDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },

  // Inset/carved panel (for inputs, displays)
  neuInset: {
    backgroundColor: NEU_COLORS.baseDarker,
    borderRadius: NEU_RADIUS.lg,
    padding: NEU_SPACING.md,
    // Inner shadows
    shadowColor: NEU_COLORS.innerShadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },

  // Small chip/badge
  neuChip: {
    backgroundColor: NEU_COLORS.base,
    borderRadius: NEU_RADIUS.full,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  neuChipDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.full,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Active chip
  neuChipActive: {
    backgroundColor: NEU_COLORS.accentStart,
  },

  // Pressed chip
  neuChipPressed: {
    backgroundColor: NEU_COLORS.baseDarker,
    shadowColor: NEU_COLORS.innerShadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },

  // Text styles
  neuTextPrimary: {
    color: NEU_COLORS.textPrimary,
    fontWeight: '600' as const,
  },

  neuTextSecondary: {
    color: NEU_COLORS.textSecondary,
    fontWeight: '500' as const,
  },

  neuTextMuted: {
    color: NEU_COLORS.textMuted,
    fontWeight: '400' as const,
  },

  // Button text
  neuButtonText: {
    color: NEU_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600' as const,
  },

  neuButtonTextLarge: {
    color: NEU_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700' as const,
  },

  // Title text
  neuTitle: {
    color: NEU_COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },

  // Container styles
  neuContainer: {
    flex: 1,
    backgroundColor: NEU_COLORS.base,
  },

  neuScrollContent: {
    padding: NEU_SPACING.lg,
    paddingBottom: 100,
  },

  // Gradient overlay for active states
  neuGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xxl,
  },

  // ===== LIQUID GLASS STYLES (NEW) =====

  // Glass panel with multi-layer depth
  glassPanel: {
    backgroundColor: NEU_COLORS.glassBase,
    borderRadius: NEU_RADIUS.xl,
    borderWidth: 1,
    borderTopColor: NEU_COLORS.glassHighlight,
    borderLeftColor: NEU_COLORS.glassHighlight,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },

  // Glass panel dark shadow (apply as separate layer)
  glassPanelDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },

  // Light refraction layer (top gradient for glass effect)
  lightRefraction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: NEU_RADIUS.xl,
    borderTopRightRadius: NEU_RADIUS.xl,
    backgroundColor: NEU_COLORS.glassReflection,
    pointerEvents: 'none',
  },

  // Glass depth layer 1 (lightest, top layer)
  glassDepth1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NEU_COLORS.depthLayer1,
    borderRadius: NEU_RADIUS.xl,
    pointerEvents: 'none',
  },

  // Glass depth layer 2 (medium layer)
  glassDepth2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%',
    backgroundColor: NEU_COLORS.depthLayer2,
    borderTopLeftRadius: NEU_RADIUS.xl,
    borderTopRightRadius: NEU_RADIUS.xl,
    pointerEvents: 'none',
  },

  // Glass depth layer 3 (shadow layer, bottom)
  glassDepth3: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NEU_COLORS.depthLayer3,
    borderBottomLeftRadius: NEU_RADIUS.xl,
    borderBottomRightRadius: NEU_RADIUS.xl,
    pointerEvents: 'none',
  },

  // Glass button with 3D effect
  glassButton: {
    backgroundColor: NEU_COLORS.glassBase,
    borderRadius: NEU_RADIUS.xxl,
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.glassShine,
    borderLeftColor: NEU_COLORS.glassShine,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  // Glass button dark shadow
  glassButtonDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xxl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },

  // Pressed glass button (inset)
  glassButtonPressed: {
    backgroundColor: NEU_COLORS.baseDarker,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: NEU_COLORS.glassHighlight,
    borderBottomColor: NEU_COLORS.glassHighlight,
    shadowColor: NEU_COLORS.innerShadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Glass inset (for inputs, carved areas)
  glassInset: {
    backgroundColor: NEU_COLORS.baseDarker,
    borderRadius: NEU_RADIUS.lg,
    borderWidth: 1.5,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: NEU_COLORS.glassHighlight,
    borderBottomColor: NEU_COLORS.glassHighlight,
    shadowColor: NEU_COLORS.innerShadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },

  // Glass shine effect (top highlight)
  glassShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: NEU_COLORS.glassShine,
    borderTopLeftRadius: NEU_RADIUS.xl,
    borderTopRightRadius: NEU_RADIUS.xl,
    pointerEvents: 'none',
  },

  // Glass card with premium effect
  glassCard: {
    backgroundColor: NEU_COLORS.glassBase,
    borderRadius: NEU_RADIUS.xl,
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.glassHighlight,
    borderLeftColor: NEU_COLORS.glassHighlight,
    borderRightColor: 'rgba(0, 0, 0, 0.12)',
    borderBottomColor: 'rgba(0, 0, 0, 0.18)',
    padding: NEU_SPACING.lg,
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },

  // Glass card dark shadow
  glassCardDarkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: NEU_RADIUS.xl,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
});

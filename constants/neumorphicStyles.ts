import { StyleSheet } from 'react-native';

// Neumorphic Deep Sea Blue Color Palette
export const NEU_COLORS = {
  // Base surface color - soft light dark blue (the foundation)
  base: '#2A3F5F',           // Primary surface - soft deep blue
  baseLighter: '#3A4F6F',    // Slightly lighter variant
  baseDarker: '#1A2F4F',     // Slightly darker variant

  // Gradient colors for depth
  gradientLight: '#3D5571',  // Top-left gradient
  gradientDark: '#1E3149',   // Bottom-right gradient

  // Shadow colors (dual shadows for neumorphic effect)
  shadowLight: 'rgba(88, 122, 166, 0.8)',    // Light shadow (top-left)
  shadowDark: 'rgba(13, 25, 42, 0.9)',       // Dark shadow (bottom-right)

  // Inner shadow colors (for pressed state)
  innerShadowLight: 'rgba(88, 122, 166, 0.5)',
  innerShadowDark: 'rgba(13, 25, 42, 0.7)',

  // Text colors
  textPrimary: '#E8F0FF',       // Primary text - very light blue-white
  textSecondary: '#B8CFEA',     // Secondary text - softer blue
  textMuted: '#88A2C4',         // Muted text - medium blue

  // Accent colors (gradient blue for active states)
  accentStart: '#4A90E2',       // Gradient start - bright blue
  accentMiddle: '#357ABD',      // Gradient middle
  accentEnd: '#2C6AA8',         // Gradient end - deeper blue
  accentGlow: 'rgba(74, 144, 226, 0.6)',

  // State colors
  success: '#5CB85C',
  warning: '#F0AD4E',
  error: '#D9534F',

  // Overlay
  overlay: 'rgba(26, 47, 79, 0.95)',
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
});

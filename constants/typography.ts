import { TextStyle } from 'react-native';
import { COLORS } from './glassStyles';

/**
 * Deep Sea Glass Typography System
 *
 * Type scale based on 4px grid with tight letter spacing for modern aesthetic.
 * All text includes subtle shadows for depth and neon glow effect.
 */

// Font weights
export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Refined type scale - better hierarchy for minimalist design
export const TYPE_SCALE = {
  // Display (hero text) - slightly reduced for elegance
  display1: {
    fontSize: 44,                                   // Reduced from 48
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 48,
    letterSpacing: -1.4,                           // Tighter
  },
  display2: {
    fontSize: 36,                                   // Reduced from 40
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 40,
    letterSpacing: -1.2,
  },

  // Headings - refined sizing
  h1: {
    fontSize: 30,                                   // Reduced from 32
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 36,
    letterSpacing: -1.0,
  },
  h2: {
    fontSize: 26,                                   // Reduced from 28
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  h3: {
    fontSize: 22,                                   // Reduced from 24
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 28,
    letterSpacing: -0.6,
  },
  h4: {
    fontSize: 18,                                   // Reduced from 20
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 24,
    letterSpacing: -0.4,
  },

  // Body text - better readability
  bodyLarge: {
    fontSize: 17,                                   // Reduced from 18
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 28,                                 // Increased for better readability (despite reduced font size)
    letterSpacing: -0.2,
  },
  bodyRegular: {
    fontSize: 15,                                   // Reduced from 16
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  bodySmall: {
    fontSize: 13,                                   // Reduced from 14
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // UI elements - cleaner sizing
  buttonLarge: {
    fontSize: 17,                                   // Reduced from 19
    fontWeight: FONT_WEIGHTS.bold,                 // Changed from extrabold
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  buttonRegular: {
    fontSize: 16,                                   // Reduced from 17
    fontWeight: FONT_WEIGHTS.semibold,             // Changed from bold
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,               // Changed from semibold
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  label: {
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.medium,               // Changed from semibold
    lineHeight: 18,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.regular,              // Changed from medium
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 10,                                   // Reduced from 11
    fontWeight: FONT_WEIGHTS.semibold,             // Changed from bold
    lineHeight: 16,
    letterSpacing: 1.2,                            // Reduced from 1.5
  },
};

// Refined text shadows - more subtle for minimalist design
export const TEXT_SHADOWS = {
  // Subtle glow (for headings)
  primaryGlow: {
    textShadowColor: COLORS.silverGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,                          // Reduced from 8
  },

  // Minimal depth (for body text)
  secondaryDepth: {
    textShadowColor: 'rgba(0, 0, 0, 0.40)',       // More subtle
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,                          // Reduced from 3
  },

  // Refined accent glow (for active states)
  accentGlow: {
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,                         // Reduced from 16
  },

  // Medium accent glow (for primary CTAs)
  strongGlow: {
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,                         // Reduced from 24
  },

  // No shadow (for clean minimalist text)
  none: {
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
};

// Complete text styles (type scale + colors + shadows)
export const TEXT_STYLES: Record<string, TextStyle> = {
  // Display styles
  display1Primary: {
    ...TYPE_SCALE.display1,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.primaryGlow,
  },
  display2Primary: {
    ...TYPE_SCALE.display2,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.primaryGlow,
  },

  // Heading styles
  h1Primary: {
    ...TYPE_SCALE.h1,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.primaryGlow,
  },
  h2Primary: {
    ...TYPE_SCALE.h2,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.primaryGlow,
  },
  h3Primary: {
    ...TYPE_SCALE.h3,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.primaryGlow,
  },
  h4Primary: {
    ...TYPE_SCALE.h4,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.secondaryDepth,
  },

  // Body styles
  bodyLargePrimary: {
    ...TYPE_SCALE.bodyLarge,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  bodyLargeSecondary: {
    ...TYPE_SCALE.bodyLarge,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  bodyRegularPrimary: {
    ...TYPE_SCALE.bodyRegular,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  bodyRegularSecondary: {
    ...TYPE_SCALE.bodyRegular,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  bodySmallSecondary: {
    ...TYPE_SCALE.bodySmall,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  bodySmallMuted: {
    ...TYPE_SCALE.bodySmall,
    color: COLORS.silverDark,
    ...TEXT_SHADOWS.secondaryDepth,
  },

  // Button styles
  buttonLargePrimary: {
    ...TYPE_SCALE.buttonLarge,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.accentGlow,
  },
  buttonRegularPrimary: {
    ...TYPE_SCALE.buttonRegular,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.accentGlow,
  },
  buttonRegularSecondary: {
    ...TYPE_SCALE.buttonRegular,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  buttonSmallSecondary: {
    ...TYPE_SCALE.buttonSmall,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },

  // Label styles
  labelPrimary: {
    ...TYPE_SCALE.label,
    color: COLORS.silverLight,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  labelSecondary: {
    ...TYPE_SCALE.label,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  labelMuted: {
    ...TYPE_SCALE.label,
    color: COLORS.silverDark,
    ...TEXT_SHADOWS.secondaryDepth,
  },

  // Caption styles
  captionSecondary: {
    ...TYPE_SCALE.caption,
    color: COLORS.silverMid,
    ...TEXT_SHADOWS.secondaryDepth,
  },
  captionMuted: {
    ...TYPE_SCALE.caption,
    color: COLORS.silverDark,
    ...TEXT_SHADOWS.secondaryDepth,
  },

  // Overline styles
  overlinePrimary: {
    ...TYPE_SCALE.overline,
    color: COLORS.silverLight,
    textTransform: 'uppercase',
    ...TEXT_SHADOWS.secondaryDepth,
  },
  overlineSecondary: {
    ...TYPE_SCALE.overline,
    color: COLORS.silverMid,
    textTransform: 'uppercase',
    ...TEXT_SHADOWS.secondaryDepth,
  },
};

// Helper function to create custom text style
export const createTextStyle = (
  typeScale: keyof typeof TYPE_SCALE,
  color: string = COLORS.silverLight,
  shadow: keyof typeof TEXT_SHADOWS = 'secondaryDepth'
): TextStyle => ({
  ...TYPE_SCALE[typeScale],
  color,
  ...TEXT_SHADOWS[shadow],
});

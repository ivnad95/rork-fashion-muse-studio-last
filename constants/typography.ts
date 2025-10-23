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

// Type scale definitions
export const TYPE_SCALE = {
  // Display (hero text)
  display1: {
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  display2: {
    fontSize: 40,
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 44,
    letterSpacing: -1.0,
  },

  // Headings
  h1: {
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  h2: {
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  h3: {
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 30,
    letterSpacing: -0.6,
  },
  h4: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 26,
    letterSpacing: -0.4,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  bodyRegular: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // UI elements
  buttonLarge: {
    fontSize: 19,
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 22,
    letterSpacing: -0.6,
  },
  buttonRegular: {
    fontSize: 17,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 18,
    letterSpacing: -0.3,
  },

  label: {
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  caption: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 16,
    letterSpacing: 0,
  },
  overline: {
    fontSize: 11,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 16,
    letterSpacing: 1.5,
  },
};

// Text shadow definitions
export const TEXT_SHADOWS = {
  // Primary glow (for headings and important text)
  primaryGlow: {
    textShadowColor: COLORS.silverGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // Secondary depth (for body text)
  secondaryDepth: {
    textShadowColor: 'rgba(0, 0, 0, 0.60)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Accent glow (for active states)
  accentGlow: {
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },

  // Strong neon glow (for primary CTAs)
  strongGlow: {
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
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

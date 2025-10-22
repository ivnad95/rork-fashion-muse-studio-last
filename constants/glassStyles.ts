import { StyleSheet } from 'react-native';

export const COLORS = {
  // Deep Sea Glass color palette
  bgColor: '#0A133B',        // Deep navy blue background
  lightColor1: '#002857',    // Gradient start
  lightColor2: '#004b93',    // Gradient midpoint
  lightColor3: '#0A76AF',    // Accent/Active state
  silverLight: '#F5F7FA',    // Primary text/icons
  silverMid: '#C8CDD5',      // Secondary text/icons
  silverDark: '#8A92A0',     // Tertiary text/chips
  silverGlow: 'rgba(245, 247, 250, 0.45)',
  shadowColor: 'rgba(0,0,0,0.6)',
  glassHighlight: 'rgba(255, 255, 255, 0.1)',
  glassReflection: 'rgba(255, 255, 255, 0.03)',
  glassShadow: 'rgba(0, 0, 0, 0.35)',
};

export const glassStyles = StyleSheet.create({
  glass3DSurface: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',  // Spec: extremely low opacity white
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',       // Spec: subtle light border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.65,
    shadowRadius: 35,                               // Multiple shadow layers for depth
    elevation: 20,
    overflow: 'hidden',
  },
  glass3DButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.32)',
    borderLeftColor: 'rgba(255, 255, 255, 0.24)',
    borderRightColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 22,
    elevation: 12,
    overflow: 'hidden',
  },
  buttonText: {
    color: COLORS.silverMid,
    fontWeight: '600' as const,
    textShadowColor: COLORS.shadowColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.28)',
    borderBottomColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: 'rgba(255, 255, 255, 0.85)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  activeButtonText: {
    color: COLORS.silverLight,
    textShadowColor: COLORS.silverGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  numberChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNumberChip: {
    backgroundColor: COLORS.silverDark,
  },
  activeNumberChipText: {
    color: '#333',
    textShadowColor: 'transparent',
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 80, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 150, 150, 0.15)'
  },
  deleteButtonText: {
    color: 'rgba(255, 150, 150, 1)',
  },
  screenContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  titleContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 40,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  panelContainer: {
    padding: 16,
    borderRadius: 24,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
    borderTopColor: COLORS.silverMid,
    borderRadius: 16,
  },
  loadingPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
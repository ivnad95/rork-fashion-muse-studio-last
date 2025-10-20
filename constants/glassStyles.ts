import { StyleSheet } from 'react-native';

export const COLORS = {
  bgColor: '#0A133B',
  lightColor1: '#002857',
  lightColor2: '#004b93',
  lightColor3: '#0A76AF',
  silverLight: '#F5F7FA',
  silverMid: '#C8CDD5',
  silverDark: '#8A92A0',
  silverGlow: 'rgba(200, 205, 213, 0.4)',
  shadowColor: 'rgba(0,0,0,0.5)'
};

export const glassStyles = StyleSheet.create({
  glass3DSurface: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 18,
    overflow: 'hidden',
  },
  glass3DButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  buttonText: {
    color: COLORS.silverMid,
    fontWeight: '600' as const,
    textShadowColor: COLORS.shadowColor,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeButton: {
    backgroundColor: 'rgba(90, 143, 214, 0.15)',
    borderColor: 'rgba(90, 143, 214, 0.4)',
    shadowColor: 'rgba(90, 143, 214, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
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
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
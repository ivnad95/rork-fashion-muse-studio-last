import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptic Feedback Utilities
 *
 * Provides consistent haptic feedback across the app
 * Automatically handles platform differences (web vs native)
 */

// Light impact - for subtle interactions like taps on tabs
export const light = () => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// Medium impact - for button presses and toggles
export const medium = () => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

// Heavy impact - for important actions like deletes
export const heavy = () => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

// Success notification - for successful operations
export const success = () => {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// Warning notification - for warnings
export const warning = () => {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

// Error notification - for errors
export const error = () => {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

// Selection changed - for picker/slider interactions
export const selection = () => {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync();
};

// Export all as default object
export default {
  light,
  medium,
  heavy,
  success,
  warning,
  error,
  selection,
};

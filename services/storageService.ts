import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_SESSION: '@fashion_ai_user_session',
  SELECTED_IMAGE: '@fashion_ai_selected_image',
  GENERATION_COUNT: '@fashion_ai_generation_count',
  ASPECT_RATIO: '@fashion_ai_aspect_ratio',
} as const;

/**
 * Storage service for AsyncStorage operations
 */
export const storageService = {
  /**
   * Save user session
   */
  async saveUserSession(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SESSION,
        JSON.stringify({ userId })
      );
    } catch (error) {
      console.error('Error saving user session:', error);
      throw new Error('Failed to save session');
    }
  },

  /**
   * Get user session
   */
  async getUserSession(): Promise<{ userId: string } | null> {
    try {
      const sessionJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (!sessionJson) return null;
      return JSON.parse(sessionJson);
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  },

  /**
   * Clear user session
   */
  async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Error clearing user session:', error);
      throw new Error('Failed to clear session');
    }
  },

  /**
   * Save selected image URI
   */
  async saveSelectedImage(uri: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_IMAGE, uri);
    } catch (error) {
      console.error('Error saving selected image:', error);
    }
  },

  /**
   * Get selected image URI
   */
  async getSelectedImage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_IMAGE);
    } catch (error) {
      console.error('Error getting selected image:', error);
      return null;
    }
  },

  /**
   * Clear selected image
   */
  async clearSelectedImage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_IMAGE);
    } catch (error) {
      console.error('Error clearing selected image:', error);
    }
  },

  /**
   * Save generation count preference
   */
  async saveGenerationCount(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GENERATION_COUNT, String(count));
    } catch (error) {
      console.error('Error saving generation count:', error);
    }
  },

  /**
   * Get generation count preference
   */
  async getGenerationCount(): Promise<number> {
    try {
      const count = await AsyncStorage.getItem(STORAGE_KEYS.GENERATION_COUNT);
      return count ? parseInt(count, 10) : 4;
    } catch (error) {
      console.error('Error getting generation count:', error);
      return 4;
    }
  },

  /**
   * Save aspect ratio preference
   */
  async saveAspectRatio(ratio: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASPECT_RATIO, ratio);
    } catch (error) {
      console.error('Error saving aspect ratio:', error);
    }
  },

  /**
   * Get aspect ratio preference
   */
  async getAspectRatio(): Promise<string> {
    try {
      const ratio = await AsyncStorage.getItem(STORAGE_KEYS.ASPECT_RATIO);
      return ratio || 'portrait';
    } catch (error) {
      console.error('Error getting aspect ratio:', error);
      return 'portrait';
    }
  },

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SESSION,
        STORAGE_KEYS.SELECTED_IMAGE,
        STORAGE_KEYS.GENERATION_COUNT,
        STORAGE_KEYS.ASPECT_RATIO,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  },
};

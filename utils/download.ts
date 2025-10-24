import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

/**
 * Download Utilities
 *
 * Provides cross-platform image download functionality
 * Handles web downloads and mobile media library saves
 */

export interface DownloadOptions {
  filename?: string;
  showToast?: boolean;
}

/**
 * Download a single image
 * On mobile: Saves to media library
 * On web: Triggers browser download
 */
export async function downloadImage(
  imageUri: string,
  options: DownloadOptions = {}
): Promise<boolean> {
  const { filename = `fashion-muse-${Date.now()}.jpg` } = options;

  try {
    if (Platform.OS === 'web') {
      // Web download
      return await downloadImageWeb(imageUri, filename);
    } else {
      // Mobile download
      return await downloadImageNative(imageUri, filename);
    }
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}

/**
 * Download multiple images
 * Downloads images sequentially
 */
export async function downloadImages(
  imageUris: string[],
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < imageUris.length; i++) {
    const result = await downloadImage(imageUris[i], {
      filename: `fashion-muse-${Date.now()}-${i + 1}.jpg`,
    });

    if (result) {
      success++;
    } else {
      failed++;
    }

    onProgress?.(i + 1, imageUris.length);
  }

  return { success, failed };
}

/**
 * Share an image
 * Uses native share sheet
 */
export async function shareImage(imageUri: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      // Web doesn't have native sharing, fallback to download
      return await downloadImage(imageUri);
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      // Fallback to download if sharing not available
      return await downloadImage(imageUri);
    }

    // For base64 images, save to temp file first
    if (imageUri.startsWith('data:')) {
      const fileUri = await saveBase64ToTemp(imageUri);
      await Sharing.shareAsync(fileUri);
    } else {
      await Sharing.shareAsync(imageUri);
    }

    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

// Helper: Download on web
async function downloadImageWeb(imageUri: string, filename: string): Promise<boolean> {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Web download failed:', error);
    return false;
  }
}

// Helper: Download on mobile
async function downloadImageNative(imageUri: string, filename: string): Promise<boolean> {
  try {
    // Request permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Media library permission denied');
      return false;
    }

    // Download to cache directory first
    let fileUri: string;

    if (imageUri.startsWith('data:')) {
      // Base64 image - save directly
      fileUri = await saveBase64ToTemp(imageUri, filename);
    } else if (imageUri.startsWith('http')) {
      // Remote image - download first
      const downloadResult = await FileSystem.downloadAsync(
        imageUri,
        FileSystem.cacheDirectory + filename
      );
      fileUri = downloadResult.uri;
    } else {
      // Local file
      fileUri = imageUri;
    }

    // Save to media library
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('Fashion Muse', asset, false);

    return true;
  } catch (error) {
    console.error('Native download failed:', error);
    return false;
  }
}

// Helper: Save base64 image to temp file
async function saveBase64ToTemp(base64Uri: string, filename?: string): Promise<string> {
  const name = filename || `temp-${Date.now()}.jpg`;
  const fileUri = FileSystem.cacheDirectory + name;

  // Extract base64 data from data URI
  const base64Data = base64Uri.split(',')[1];

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}

// Export all as default object
export default {
  downloadImage,
  downloadImages,
  shareImage,
};

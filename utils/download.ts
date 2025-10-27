import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface DownloadOptions {
  filename?: string;
  showToast?: boolean;
}

export async function downloadImage(
  imageUri: string,
  options: DownloadOptions = {}
): Promise<boolean> {
  const { filename = `fashion-muse-${Date.now()}.jpg` } = options;

  try {
    if (Platform.OS === 'web') {
      return await downloadImageWeb(imageUri, filename);
    } else {
      return await downloadImageNative(imageUri, filename);
    }
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}

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

export async function shareImage(imageUri: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      return await downloadImage(imageUri);
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return await downloadImage(imageUri);
    }

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

async function downloadImageWeb(imageUri: string, filename: string): Promise<boolean> {
  try {
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

async function downloadImageNative(imageUri: string, filename: string): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Media library permission denied');
      return false;
    }

    let fileUri: string;

    if (imageUri.startsWith('data:')) {
      fileUri = await saveBase64ToTemp(imageUri, filename);
    } else if (imageUri.startsWith('http')) {
      const cacheDir = FileSystem.Paths?.cache || FileSystem.Paths?.document || '';
      if (!cacheDir) {
        throw new Error('File system directories not available');
      }
      const downloadResult = await FileSystem.downloadAsync(
        imageUri,
        cacheDir + filename
      );
      fileUri = downloadResult.uri;
    } else {
      fileUri = imageUri;
    }

    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('Fashion Muse', asset, false);

    return true;
  } catch (error) {
    console.error('Native download failed:', error);
    return false;
  }
}

async function saveBase64ToTemp(base64Uri: string, filename?: string): Promise<string> {
  const cacheDir = FileSystem.Paths?.cache || FileSystem.Paths?.document || '';
  if (!cacheDir) {
    throw new Error('File system directories not available');
  }

  const name = filename || `temp-${Date.now()}.jpg`;
  const fileUri = cacheDir + name;

  const base64Data = base64Uri.split(',')[1];

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: 'base64' as any,
  });

  return fileUri;
}

export default {
  downloadImage,
  downloadImages,
  shareImage,
};

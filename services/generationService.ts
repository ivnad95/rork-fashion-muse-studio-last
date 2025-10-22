import {
  saveImage,
  saveHistory,
  getUserHistory,
  deleteHistory as dbDeleteHistory,
  getUserImages,
} from '@/lib/database';

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  count: number;
  thumbnail: string;
  results: string[];
}

const FASHION_PROMPTS = [
  'Create a professional fashion photoshoot image. CRITICAL REQUIREMENTS: 1) Keep the EXACT SAME person - preserve their face, gender, age, ethnicity, hair color, hair style, and all facial features identically. 2) Keep their EXACT SAME clothing - same outfit, same colors, same style, same accessories. 3) ONLY CHANGE: the pose and body position to create a professional model pose. Use professional studio lighting with soft key light and subtle shadows. Clean, elegant background. The person should be in a confident, professional modeling pose while wearing their original outfit.',

  'Transform into a professional model pose photoshoot. MUST PRESERVE: 1) The exact same person - identical face, gender, skin tone, hair, and all features. 2) The exact same outfit they are wearing - same clothing items, colors, patterns, and style. ONLY MODIFY: Change the pose to a dynamic fashion model stance. Use three-point studio lighting. Professional photography composition with proper depth of field. The same person in the same clothes, just in a different professional modeling pose.',

  'Create a high-end fashion photography shot. STRICT REQUIREMENTS: 1) Same person - do not change gender, face, age, ethnicity, or any physical features. 2) Same exact clothing - keep all garments, colors, and accessories identical to the original. 3) CHANGE ONLY THE POSE: Position them in an elegant, professional model pose. Implement cinematic studio lighting with soft diffused key light and gentle rim light. Neutral, upscale background. The identical person wearing their original outfit, posed professionally.',

  'Professional fashion editorial photograph. MANDATORY: 1) Preserve the person completely - same gender, same face, same hair, same everything about them. 2) Keep their clothing exactly as shown - same outfit, same colors, same style. 3) ONLY ALTER: The body pose and positioning for a professional fashion model look. Use professional beauty lighting setup. Sophisticated background with subtle depth. The same person in the same clothes, just repositioned in a confident modeling pose with proper posture.',
];

const RORK_API_URL = 'https://toolkit.rork.com/images/edit/';
const TIMEOUT_MS = 180000; // 180 seconds (3 minutes)
const MAX_RETRIES = 2; // Number of retry attempts
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB max image size

/**
 * Generation service
 * Handles AI image generation and history management
 */
export const generationService = {
  /**
   * Generate images using Rork AI API
   */
  async generateImages(
    userId: string,
    imageUri: string,
    count: number
  ): Promise<string[]> {
    try {
      // Convert image URI to base64
      const base64Image = await this.convertImageToBase64(imageUri);

      const results: string[] = [];

      // Generate each image
      for (let i = 0; i < count; i++) {
        const prompt = FASHION_PROMPTS[i % FASHION_PROMPTS.length];

        try {
          const generatedImage = await this.callRorkAPI(base64Image, prompt);
          results.push(generatedImage);
        } catch (error) {
          console.error(`Error generating image ${i + 1}:`, error);
          // Continue with other generations even if one fails
        }
      }

      if (results.length === 0) {
        throw new Error('Failed to generate any images');
      }

      // Save images to database
      await this.saveGeneratedImages(userId, results);

      // Save to history
      await this.saveToHistory(userId, results, count);

      return results;
    } catch (error: any) {
      console.error('Error in generateImages:', error);
      throw error;
    }
  },

  /**
   * Convert image URI to base64
   */
  async convertImageToBase64(uri: string): Promise<string> {
    try {
      // If already base64, return as is
      if (uri.startsWith('data:image')) {
        const base64 = uri.split(',')[1];
        // Check size
        const sizeInBytes = (base64.length * 3) / 4;
        if (sizeInBytes > MAX_IMAGE_SIZE) {
          throw new Error('Image is too large. Please use a smaller image (max 4MB).');
        }
        return base64;
      }

      // For file:// URIs, use FileReader (web) or expo-file-system (native)
      if (typeof window !== 'undefined' && uri.startsWith('file://')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Check size before converting
        if (blob.size > MAX_IMAGE_SIZE) {
          throw new Error('Image is too large. Please use a smaller image (max 4MB).');
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // For http/https URIs
      if (uri.startsWith('http')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Check size before converting
        if (blob.size > MAX_IMAGE_SIZE) {
          throw new Error('Image is too large. Please use a smaller image (max 4MB).');
        }

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      throw new Error('Unsupported image URI format');
    } catch (error) {
      console.error('Error converting image to base64:', error);
      if (error instanceof Error && error.message.includes('too large')) {
        throw error;
      }
      throw new Error('Failed to process image');
    }
  },

  /**
   * Call Rork AI API with retry logic
   */
  async callRorkAPI(base64Image: string, prompt: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Request timeout after ${TIMEOUT_MS}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
        controller.abort();
      }, TIMEOUT_MS);

      try {
        console.log(`API call attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
        
        const response = await fetch(RORK_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            images: [
              {
                type: 'image',
                image: base64Image,
              },
            ],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few moments.');
          }
          if (response.status === 413) {
            throw new Error('Image too large. Please use a smaller image.');
          }
          if (response.status >= 500 && attempt < MAX_RETRIES) {
            console.log(`Server error (${response.status}), retrying...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
            continue;
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.image || !data.image.base64Data) {
          throw new Error('Invalid API response');
        }

        // Return as data URI
        const mimeType = data.image.mimeType || 'image/jpeg';
        return `data:${mimeType};base64,${data.image.base64Data}`;
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;

        if (error.name === 'AbortError') {
          if (attempt < MAX_RETRIES) {
            console.log(`Request timed out, retrying (${attempt + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          throw new Error('Request timed out after multiple attempts. Please try with a smaller image.');
        }

        // Don't retry for user errors
        if (error.message.includes('too large') || error.message.includes('Rate limit')) {
          throw error;
        }

        // Retry for network errors
        if (attempt < MAX_RETRIES && (error.message.includes('network') || error.message.includes('fetch'))) {
          console.log(`Network error, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Failed to generate image after multiple attempts');
  },

  /**
   * Save generated images to database
   */
  async saveGeneratedImages(userId: string, images: string[]): Promise<void> {
    try {
      for (const imageUri of images) {
        await saveImage(userId, imageUri, 'image/jpeg', true);
      }
    } catch (error) {
      console.error('Error saving generated images:', error);
      // Don't throw - images are already generated, saving is secondary
    }
  },

  /**
   * Save generation to history
   */
  async saveToHistory(userId: string, images: string[], count: number): Promise<void> {
    try {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();

      const imageIds: string[] = [];
      for (const imageUri of images) {
        const savedImage = await saveImage(userId, imageUri, 'image/jpeg', true);
        imageIds.push(savedImage.id);
      }

      await saveHistory(userId, date, time, imageIds);
    } catch (error) {
      console.error('Error saving to history:', error);
      // Don't throw - generation succeeded, history is secondary
    }
  },

  /**
   * Load user history
   */
  async loadHistory(userId: string): Promise<HistoryItem[]> {
    try {
      return await getUserHistory(userId);
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  /**
   * Delete history item
   */
  async deleteHistoryItem(historyId: string): Promise<void> {
    try {
      await dbDeleteHistory(historyId);
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw new Error('Failed to delete history item');
    }
  },

  /**
   * Get user images
   */
  async getUserImages(userId: string): Promise<any[]> {
    try {
      return await getUserImages(userId);
    } catch (error) {
      console.error('Error getting user images:', error);
      return [];
    }
  },
};

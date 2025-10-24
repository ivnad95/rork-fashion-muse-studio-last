import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  saveImage,
  saveHistory,
  getUserHistory,
  deleteHistory as dbDeleteHistory
} from '@/lib/database';
import { getStylePrompt } from '@/constants/styles';

type AspectRatio = 'portrait' | 'square' | 'landscape';

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  count: number;
  thumbnail: string;
  results: string[];
  imageIds: string[];
}

interface GenerationState {
  selectedImage: string | null;
  generationCount: number;
  aspectRatio: AspectRatio;
  selectedStyleId: string;
  generatedImages: string[];
  generatedImageIds: string[];
  isGenerating: boolean;
  error: string | null;
  history: HistoryItem[];
}

interface GenerationContextType extends GenerationState {
  setSelectedImage: (uri: string | null) => void;
  setGenerationCount: (count: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setSelectedStyleId: (styleId: string) => void;
  generateImages: (userId: string) => Promise<void>;
  clearResults: () => void;
  deleteImage: (index: number) => void;
  saveToHistory: (userId: string) => Promise<void>;
  loadHistory: (userId: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

const FASHION_PROMPTS = [
  'Create a professional fashion photoshoot image. CRITICAL REQUIREMENTS: 1) Keep the EXACT SAME person - preserve their face, gender, age, ethnicity, hair color, hair style, and all facial features identically. 2) Keep their EXACT SAME clothing - same outfit, same colors, same style, same accessories. 3) ONLY CHANGE: the pose and body position to create a professional model pose. Use professional studio lighting with soft key light and subtle shadows. Clean, elegant background. The person should be in a confident, professional modeling pose while wearing their original outfit.',
  
  'Transform into a professional model pose photoshoot. MUST PRESERVE: 1) The exact same person - identical face, gender, skin tone, hair, and all features. 2) The exact same outfit they are wearing - same clothing items, colors, patterns, and style. ONLY MODIFY: Change the pose to a dynamic fashion model stance. Use three-point studio lighting. Professional photography composition with proper depth of field. The same person in the same clothes, just in a different professional modeling pose.',
  
  'Create a high-end fashion photography shot. STRICT REQUIREMENTS: 1) Same person - do not change gender, face, age, ethnicity, or any physical features. 2) Same exact clothing - keep all garments, colors, and accessories identical to the original. 3) CHANGE ONLY THE POSE: Position them in an elegant, professional model pose. Implement cinematic studio lighting with soft diffused key light and gentle rim light. Neutral, upscale background. The identical person wearing their original outfit, posed professionally.',
  
  'Professional fashion editorial photograph. MANDATORY: 1) Preserve the person completely - same gender, same face, same hair, same everything about them. 2) Keep their clothing exactly as shown - same outfit, same colors, same style. 3) ONLY ALTER: The body pose and positioning for a professional fashion model look. Use professional beauty lighting setup. Sophisticated background with subtle depth. The same person in the same clothes, just repositioned in a confident modeling pose with proper posture.',
];

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GenerationState>({
    selectedImage: null,
    generationCount: 4,
    aspectRatio: 'portrait',
    selectedStyleId: 'casual',
    generatedImages: [],
    generatedImageIds: [],
    isGenerating: false,
    error: null,
    history: [],
  });

  const setSelectedImage = useCallback((uri: string | null) => {
    setState((prev) => ({ ...prev, selectedImage: uri, error: null }));
  }, []);

  const setGenerationCount = useCallback((count: number) => {
    setState((prev) => ({ ...prev, generationCount: count }));
  }, []);

  const setAspectRatio = useCallback((ratio: AspectRatio) => {
    setState((prev) => ({ ...prev, aspectRatio: ratio }));
  }, []);

  const setSelectedStyleId = useCallback((styleId: string) => {
    setState((prev) => ({ ...prev, selectedStyleId: styleId }));
  }, []);

  const clearResults = useCallback(() => {
    setState((prev) => ({ ...prev, generatedImages: [], generatedImageIds: [], error: null }));
  }, []);

  const deleteImage = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      generatedImages: prev.generatedImages.filter((_, i) => i !== index),
      generatedImageIds: prev.generatedImageIds.filter((_, i) => i !== index),
    }));
  }, []);

  const loadHistory = useCallback(async (userId: string) => {
    try {
      const historyItems = await getUserHistory(userId);
      setState((prev) => ({ ...prev, history: historyItems }));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  const deleteHistoryItem = useCallback(async (id: string) => {
    try {
      await dbDeleteHistory(id);
      setState((prev) => ({
        ...prev,
        history: prev.history.filter(item => item.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting history:', error);
      throw error;
    }
  }, []);

  const saveToHistory = useCallback(async (userId: string) => {
    if (state.generatedImages.length === 0) return;

    try {
      // Save all generated images to database
      const imageIds: string[] = [];
      for (const imageData of state.generatedImages) {
        const savedImage = await saveImage(userId, imageData);
        imageIds.push(savedImage.id);
      }

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      // Save history record
      await saveHistory(userId, date, time, imageIds);

      // Reload history
      await loadHistory(userId);
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }, [state.generatedImages, loadHistory]);

  const generateImages = useCallback(async (userId: string) => {
    if (!state.selectedImage) {
      setState((prev) => ({ ...prev, error: 'Please select an image first' }));
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true, error: null, generatedImages: [], generatedImageIds: [] }));

    try {
      const results: string[] = [];
      const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
      const TIMEOUT_MS = 180000; // 3 minutes
      const MAX_RETRIES = 2;
      
      for (let i = 0; i < state.generationCount; i++) {
        console.log(`Generating image ${i + 1}/${state.generationCount}...`);

        // Get style-specific prompt and combine with pose variation
        const stylePrompt = getStylePrompt(state.selectedStyleId);
        const posePrompt = FASHION_PROMPTS[i % FASHION_PROMPTS.length];
        const prompt = `${stylePrompt}. ${posePrompt}`;
        
        let base64Image = state.selectedImage;
        if (base64Image.startsWith('file://')) {
          try {
            const response = await fetch(base64Image);
            const blob = await response.blob();
            
            if (blob.size > MAX_IMAGE_SIZE) {
              throw new Error('Image is too large. Please use a smaller image (max 4MB).');
            }
            
            base64Image = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const result = reader.result as string;
                if (result) {
                  resolve(result.split(',')[1]);
                } else {
                  reject(new Error('Failed to read image'));
                }
              };
              reader.onerror = () => reject(new Error('FileReader error'));
              reader.readAsDataURL(blob);
            });
          } catch (err) {
            console.error('Error reading local image:', err);
            if (err instanceof Error && err.message.includes('too large')) {
              throw err;
            }
            throw new Error('Failed to process image. Please try another image.');
          }
        } else if (base64Image.includes('base64,')) {
          base64Image = base64Image.split('base64,')[1];
        }
        
        // Check base64 size
        const sizeInBytes = (base64Image.length * 3) / 4;
        if (sizeInBytes > MAX_IMAGE_SIZE) {
          throw new Error('Image is too large. Please use a smaller image (max 4MB).');
        }

        const requestBody = {
          prompt,
          images: [
            {
              type: 'image',
              image: base64Image,
            },
          ],
        };

        console.log('Sending request to image edit API...');
        console.log('Image size (base64):', base64Image.length, 'bytes');
        
        let lastError: Error | null = null;
        let generatedImageUri: string | null = null;
        
        for (let attempt = 0; attempt <= MAX_RETRIES && !generatedImageUri; attempt++) {
          try {
            console.log(`API call attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
              console.log(`Request timeout after ${TIMEOUT_MS}ms`);
              controller.abort();
            }, TIMEOUT_MS);
            
            const response = await fetch('https://toolkit.rork.com/images/edit/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            console.log('Response status:', response.status);

            if (!response.ok) {
              if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a few moments.');
              } else if (response.status === 413) {
                throw new Error('Image is too large. Please try a smaller image.');
              } else if (response.status >= 500 && attempt < MAX_RETRIES) {
                console.log(`Server error (${response.status}), retrying...`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                continue;
              } else {
                throw new Error(`Request failed (${response.status}). Please try again.`);
              }
            }

            const data = await response.json();
            
            if (data.image && data.image.base64Data) {
              generatedImageUri = `data:${data.image.mimeType || 'image/jpeg'};base64,${data.image.base64Data}`;
              results.push(generatedImageUri);
              
              setState((prev) => ({
                ...prev,
                generatedImages: [...results],
              }));
              
              console.log('Successfully generated image');
              break;
            } else {
              throw new Error('Invalid response format from API');
            }
          } catch (fetchError) {
            console.error('Request error:', fetchError);
            lastError = fetchError instanceof Error ? fetchError : new Error('Unknown error');
            
            const errorName = fetchError instanceof Error ? fetchError.name : '';
            const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
            
            if (errorName === 'AbortError') {
              if (attempt < MAX_RETRIES) {
                console.log(`Request timed out, retrying (${attempt + 1}/${MAX_RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              }
              throw new Error('Request timed out after multiple attempts. Please try with a smaller image.');
            }
            
            // Don't retry for user errors
            if (errorMessage.includes('too large') || errorMessage.includes('Rate limit')) {
              throw fetchError;
            }
            
            // Retry for network errors
            if (attempt < MAX_RETRIES && (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch'))) {
              console.log(`Network error, retrying (${attempt + 1}/${MAX_RETRIES})...`);
              await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
              continue;
            }
            
            throw fetchError;
          }
        }
        
        if (!generatedImageUri) {
          throw lastError || new Error('Failed to generate image after multiple attempts');
        }
      }

      // Save all generated images to database
      const imageIds: string[] = [];
      for (const imageData of results) {
        const savedImage = await saveImage(userId, imageData);
        imageIds.push(savedImage.id);
      }

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      // Save history record
      await saveHistory(userId, date, time, imageIds);

      // Load updated history
      const historyItems = await getUserHistory(userId);

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedImages: results,
        generatedImageIds: imageIds,
        history: historyItems,
      }));
      
      console.log(`Successfully generated ${results.length} images`);
    } catch (error) {
      console.error('Generation error:', error);
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate images',
      }));
    }
  }, [state.selectedImage, state.generationCount]);

  const value = useMemo(
    () => ({
      ...state,
      setSelectedImage,
      setGenerationCount,
      setAspectRatio,
      setSelectedStyleId,
      generateImages,
      clearResults,
      deleteImage,
      saveToHistory,
      loadHistory,
      deleteHistoryItem,
    }),
    [state, setSelectedImage, setGenerationCount, setAspectRatio, setSelectedStyleId, generateImages, clearResults, deleteImage, saveToHistory, loadHistory, deleteHistoryItem]
  );

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error('useGeneration must be used within GenerationProvider');
  }
  return context;
}

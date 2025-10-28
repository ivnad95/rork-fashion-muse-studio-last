import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  saveImage,
  saveHistory,
  getUserHistory,
  deleteHistory as dbDeleteHistory
} from '@/lib/database';
import { trpcClient } from '@/lib/trpc';

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

const CATALOG_POSES = [
  "Standing confidently with hands on hips, looking directly at the camera.",
  "A relaxed standing pose, one hand in a pocket, with a slight, natural smile.",
  "Three-quarter view, looking over the shoulder towards the camera.",
  "Full body shot, standing straight with feet slightly apart, arms relaxed at the sides.",
  "Leaning casually against an invisible wall, one leg crossed in front of the other.",
  "A dynamic walking pose, captured mid-stride as if walking towards the viewer.",
  "Hands clasped gently in front, with a soft and approachable expression.",
  "Profile view, standing straight and looking forward, highlighting the silhouette of the outfit.",
  "Adjusting a cuff or a collar, creating a natural, candid moment.",
  "A simple pose with one hand gently touching the chin or side of the face.",
  "Sitting elegantly on a simple stool or block, legs crossed, looking at the camera.",
  "A casual seated pose on the floor, knees bent, leaning back on one hand.",
  "Sitting on a low bench, leaning forward with elbows on knees, looking thoughtful.",
  "Profile view while seated, showcasing the drape and fit of the clothing from the side.",
  "A close-up shot from the waist up, focusing on the details of the upper garment.",
  "A pose showing movement, like a gentle twirl to show the flow of a skirt or dress.",
  "A pose that highlights a specific feature, like putting a hand in a pocket to show its placement.",
  "Looking down at their shoes, as if admiring them, good for full outfit shots.",
  "A laughing, candid pose, looking slightly away from the camera.",
  "Arms crossed over the chest with a confident and strong stance.",
  "A 'contrapposto' pose, with weight shifted to one foot, creating a natural S-curve in the body.",
  "Reaching for something just out of frame, creating a sense of action.",
  "A simple, elegant pose with hands held behind the back.",
  "A dynamic pose as if just turning around to face the camera."
];

const NEGATIVE_PROMPT = "text, watermark, signature, logo, blurry, fuzzy, low-quality, out of focus, distorted, disfigured, ugly, bad anatomy, extra limbs, missing limbs, poorly drawn hands, poorly drawn feet, mutated hands, long neck, tiling, artifacts, jpeg artifacts, compression artifacts, error, duplicate, AI-generated, cartoon, illustration, painting, 3d render, cgi, video game, artstation, deviantart, oversmoothing, airbrushed skin, plastic skin, uncanny valley, synthetic appearance, unrealistic";

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
      const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
      
      const aspectRatioMap: Record<AspectRatio, string> = {
        portrait: '3:4',
        square: '1:1',
        landscape: '4:3',
      };
      
      const aspectRatio = aspectRatioMap[state.aspectRatio];
      
      const themeMap: Record<string, string> = {
        casual: 'studio',
        formal: 'business',
        streetwear: 'urban',
        luxury: 'millionaire',
        vintage: 'vintage',
        sporty: 'studio',
        bohemian: 'beach',
        minimalist: 'studio',
        cyberpunk: 'urban',
        gothic: 'urban',
        summer: 'beach',
        winter: 'studio',
        glamour: 'red_carpet',
        grunge: 'urban',
      };
      
      const theme = themeMap[state.selectedStyleId] || 'studio';
      
      let base64Image = state.selectedImage;
      let mimeType = 'image/jpeg';
      
      if (base64Image.startsWith('file://')) {
        try {
          const response = await fetch(base64Image);
          const blob = await response.blob();
          
          if (blob.size > MAX_IMAGE_SIZE) {
            throw new Error('Image is too large. Please use a smaller image (max 4MB).');
          }
          
          mimeType = blob.type;
          
          base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              if (result) {
                resolve(result);
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
        const parts = base64Image.split(';');
        if (parts[0].includes(':')) {
          mimeType = parts[0].split(':')[1];
        }
      }
      
      const selectedPoses = CATALOG_POSES
        .sort(() => 0.5 - Math.random())
        .slice(0, state.generationCount);
      
      for (let i = 0; i < state.generationCount; i++) {
        console.log(`Generating image ${i + 1}/${state.generationCount}...`);

        const pose = selectedPoses[i];
        
        try {
          const result = await trpcClient.generation.generate.mutate({
            image: base64Image,
            mimeType,
            pose,
            aspectRatio,
            negativePrompt: NEGATIVE_PROMPT,
            theme,
          });
          
          if (result.status === 'success') {
            results.push(result.data);
            setState((prev) => ({
              ...prev,
              generatedImages: [...results],
            }));
            console.log('Successfully generated image');
          } else {
            console.error(`Failed to generate image ${i + 1}:`, result.data);
          }
        } catch (error) {
          console.error(`Error generating image ${i + 1}:`, error);
        }
      }

      if (results.length === 0) {
        throw new Error('Failed to generate any images');
      }

      const imageIds: string[] = [];
      for (const imageData of results) {
        const savedImage = await saveImage(userId, imageData);
        imageIds.push(savedImage.id);
      }

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      await saveHistory(userId, date, time, imageIds);

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
  }, [state.selectedImage, state.generationCount, state.aspectRatio, state.selectedStyleId]);

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

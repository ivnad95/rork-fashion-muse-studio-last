import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { 
  saveImage, 
  saveHistory, 
  getUserHistory, 
  deleteHistory as dbDeleteHistory 
} from '@/lib/database';

type AspectRatio = 'portrait' | 'square' | 'landscape';

export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  count: number;
  thumbnail: string;
  results: string[];
}

interface GenerationState {
  selectedImage: string | null;
  generationCount: number;
  aspectRatio: AspectRatio;
  generatedImages: string[];
  isGenerating: boolean;
  error: string | null;
  history: HistoryItem[];
}

interface GenerationContextType extends GenerationState {
  setSelectedImage: (uri: string | null) => void;
  setGenerationCount: (count: number) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  generateImages: (userId: string) => Promise<void>;
  clearResults: () => void;
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
    generatedImages: [],
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

  const clearResults = useCallback(() => {
    setState((prev) => ({ ...prev, generatedImages: [], error: null }));
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

    setState((prev) => ({ ...prev, isGenerating: true, error: null, generatedImages: [] }));

    try {
      const results: string[] = [];
      
      for (let i = 0; i < state.generationCount; i++) {
        console.log(`Generating image ${i + 1}/${state.generationCount}...`);
        
        const prompt = FASHION_PROMPTS[i % FASHION_PROMPTS.length];
        
        let base64Image = state.selectedImage;
        if (base64Image.startsWith('file://')) {
          try {
            const response = await fetch(base64Image);
            const blob = await response.blob();
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
            throw new Error('Failed to process image. Please try another image.');
          }
        } else if (base64Image.includes('base64,')) {
          base64Image = base64Image.split('base64,')[1];
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
        console.log('Image size (base64):', base64Image.length);
        
        let response;
        try {
          console.log('Making request to:', 'https://toolkit.rork.com/images/edit/');
          console.log('Request body size:', JSON.stringify(requestBody).length);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 120000);
          
          response = await fetch('https://toolkit.rork.com/images/edit/', {
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
          console.log('Response ok:', response.ok);
        } catch (fetchError) {
          console.error('Network fetch error:', fetchError);
          const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
          const errorName = fetchError instanceof Error ? fetchError.name : '';
          
          console.log('Error name:', errorName);
          console.log('Error message:', errorMessage);
          
          if (errorName === 'AbortError' || errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
            throw new Error('Request timed out. The image might be too large or the connection is slow.');
          } else if (errorMessage.includes('Network request failed')) {
            throw new Error('Network error: Please check your internet connection and try again.');
          } else if (errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
          } else {
            throw new Error(`Request failed: ${errorMessage}`);
          }
        }

        if (!response.ok) {
          let errorText = '';
          try {
            errorText = await response.text();
          } catch {
            errorText = 'Unable to read error response';
          }
          console.error('API Error:', response.status, response.statusText, errorText);
          
          if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else if (response.status === 413) {
            throw new Error('Image is too large. Please try a smaller image.');
          } else {
            throw new Error(`Request failed (${response.status}). Please try again.`);
          }
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid response from server. Please try again.');
        }
        
        console.log('Received response from API');
        
        if (data.image && data.image.base64Data) {
          const imageUri = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
          results.push(imageUri);
          
          setState((prev) => ({
            ...prev,
            generatedImages: [...results],
          }));
        } else {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format from API');
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
      generateImages,
      clearResults,
      saveToHistory,
      loadHistory,
      deleteHistoryItem,
    }),
    [state, setSelectedImage, setGenerationCount, setAspectRatio, generateImages, clearResults, saveToHistory, loadHistory, deleteHistoryItem]
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

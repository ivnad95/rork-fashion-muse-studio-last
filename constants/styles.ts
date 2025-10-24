/**
 * Fashion Style Presets
 * Defines different fashion styles users can select for image generation
 */

export interface FashionStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  color: string;
}

export const FASHION_STYLES: FashionStyle[] = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed everyday style',
    prompt: 'casual everyday fashion, comfortable and relaxed style, natural lighting, modern casual wear',
    icon: '👕',
    color: '#60A5FA',
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Elegant business attire',
    prompt: 'formal business fashion, elegant professional attire, sophisticated style, studio lighting',
    icon: '👔',
    color: '#8B5CF6',
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    description: 'Urban street fashion',
    prompt: 'urban streetwear fashion, contemporary street style, bold and edgy, urban background',
    icon: '🧢',
    color: '#F59E0B',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'High-end designer look',
    prompt: 'luxury high-end fashion, designer clothing, premium materials, editorial photography',
    icon: '💎',
    color: '#EC4899',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro style',
    prompt: 'vintage retro fashion, classic timeless style, nostalgic aesthetic, warm tones',
    icon: '🕰️',
    color: '#EF4444',
  },
  {
    id: 'sporty',
    name: 'Sporty',
    description: 'Athletic activewear',
    prompt: 'sporty athletic fashion, activewear and sportswear, dynamic and energetic, fitness aesthetic',
    icon: '⚡',
    color: '#10B981',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Free-spirited boho style',
    prompt: 'bohemian boho fashion, free-spirited artistic style, flowing fabrics, natural outdoor setting',
    icon: '🌸',
    color: '#F97316',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple',
    prompt: 'minimalist fashion, clean simple lines, monochromatic palette, modern minimalism',
    icon: '⚪',
    color: '#6B7280',
  },
];

export const getStyleById = (id: string): FashionStyle | undefined => {
  return FASHION_STYLES.find(style => style.id === id);
};

export const getStylePrompt = (styleId: string): string => {
  const style = getStyleById(styleId);
  return style ? style.prompt : FASHION_STYLES[0].prompt;
};

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
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic tech style',
    prompt: 'cyberpunk futuristic fashion, neon colors, tech-wear aesthetic, dramatic lighting, dystopian urban setting',
    icon: '🤖',
    color: '#06B6D4',
  },
  {
    id: 'gothic',
    name: 'Gothic',
    description: 'Dark and mysterious',
    prompt: 'gothic dark fashion, dramatic black clothing, elegant and mysterious, moody atmospheric lighting',
    icon: '🖤',
    color: '#7C3AED',
  },
  {
    id: 'summer',
    name: 'Summer',
    description: 'Light and breezy',
    prompt: 'summer beach fashion, light airy fabrics, tropical vibes, bright natural lighting, coastal setting',
    icon: '🌊',
    color: '#14B8A6',
  },
  {
    id: 'winter',
    name: 'Winter',
    description: 'Cozy and layered',
    prompt: 'winter cozy fashion, layered clothing, warm textures, soft lighting, snowy or indoor setting',
    icon: '❄️',
    color: '#3B82F6',
  },
  {
    id: 'glamour',
    name: 'Glamour',
    description: 'Red carpet elegance',
    prompt: 'glamorous red carpet fashion, evening gowns and suits, luxurious fabrics, professional photography lighting',
    icon: '✨',
    color: '#D946EF',
  },
  {
    id: 'grunge',
    name: 'Grunge',
    description: 'Alternative 90s vibe',
    prompt: 'grunge alternative fashion, layered vintage pieces, edgy and rebellious, natural outdoor lighting',
    icon: '🎸',
    color: '#64748B',
  },
];

export const getStyleById = (id: string): FashionStyle | undefined => {
  return FASHION_STYLES.find(style => style.id === id);
};

export const getStylePrompt = (styleId: string): string => {
  const style = getStyleById(styleId);
  return style ? style.prompt : FASHION_STYLES[0].prompt;
};

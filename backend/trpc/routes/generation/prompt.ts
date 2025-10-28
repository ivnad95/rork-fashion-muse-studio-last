import { z } from "zod";

export const aspectRatioDescriptions: Record<string, string> = {
  "3:4": "portrait (taller than it is wide)",
  "1:1": "square",
  "4:3": "landscape (wider than it is tall)",
};

export const OutfitChangingThemes = [
  "business",
  "millionaire",
  "vip_star",
  "red_carpet",
] as const;

export type Theme =
  | "studio"
  | "urban"
  | "beach"
  | "vintage"
  | typeof OutfitChangingThemes[number];

export const BuildPromptInput = z.object({
  pose: z.string(),
  aspectRatio: z.string(),
  negativePrompt: z.string().optional().default(""),
  theme: z.string(),
});
export type BuildPromptInput = z.infer<typeof BuildPromptInput>;

export function buildPrompt({
  pose,
  aspectRatio,
  negativePrompt,
  theme,
}: BuildPromptInput): string {
  const negativePromptSection = negativePrompt.trim()
    ? `\n**5. Exclusions (Negative Prompt):** Do NOT include any of the following: ${negativePrompt}.`
    : "";

  const aspectRatioDescription =
    aspectRatioDescriptions[aspectRatio] ?? "square";

  const outfitChangingThemes = new Set<string>(OutfitChangingThemes as unknown as string[]);
  const isOutfitChangingTheme = outfitChangingThemes.has(theme);

  const themeInstructions: Record<string, string> = {
    studio:
      `**Scene & Lighting:** Place the model on a solid, seamless, neutral-colored studio background (e.g., light grey, off-white). The background must be simple and non-distracting. Use bright, even, and soft studio lighting. The lighting should be flattering and commercial, eliminating harsh shadows and clearly showing the clothing details.`,
    urban:
      `**Scene & Lighting:** Place the model in a realistic urban environment like a graffiti-covered alley, a modern city crosswalk at dusk, or against brutalist architecture. The lighting should be dynamic, with potential for neon glows or harsh sunlight creating long shadows. The overall mood should be edgy and cool.`,
    beach:
      `**Scene & Lighting:** Generate a scene with the model on a beautiful, sunny beach. The background should feature white sand, turquoise water, and possibly some distant palm trees. The lighting must be bright and natural, evoking a warm, relaxed, and joyful vacation vibe.`,
    vintage:
      `**Scene & Lighting:** Recreate the aesthetic of a vintage film photograph from the 1970s. Use warm, slightly faded colors with a subtle film grain. The lighting should be soft and nostalgic. The background could be a retro-styled interior or a sun-drenched outdoor scene. The pose should feel candid and timeless.`,
    business:
      `**New Outfit & Scene:** Transform the model's outfit into a sharp, modern, and professional business suit or attire. For men, a well-tailored dark suit, crisp shirt, and tie. For women, a stylish pantsuit, blazer with a blouse, or a sophisticated business dress. The clothing must look high-end. The background should be a modern office interior with soft, professional lighting.`,
    millionaire:
      `**New Outfit & Scene:** Dress the model in an outfit that signifies 'quiet luxury' and wealth. Use high-end designer styles, luxurious fabrics (cashmere, silk), and tasteful, expensive accessories (e.g., a classic luxury watch). Avoid garish logos. The setting should be opulent, like a luxury penthouse apartment, a private jet, or a modern villa with a pool. The mood is sophisticated and powerful.`,
    vip_star:
      `**New Outfit & Scene:** Style the model as a VIP star at an exclusive, high-fashion event. The outfit must be glamorous, trendy, and eye-catching—a designer cocktail dress, a custom-tailored jacket, or a chic, edgy ensemble. The background should be a dimly lit, exclusive lounge or a rooftop party at night with city lights.`,
    red_carpet:
      `**New Outfit & Scene:** Dress the model in a breathtaking, formal gown or a bespoke tuxedo suitable for a major awards ceremony like the Oscars. The outfit must be haute couture, elegant, and dramatic. The background must be a classic red carpet setting with the soft glow of paparazzi camera flashes in the distance, creating a prestigious atmosphere.`,
  };

  const fidelityInstruction = isOutfitChangingTheme
    ? `**Identity Lock:** The model's face, identity, hair, and body type from the source image **must be perfectly replicated with 100% accuracy**. This is the most important rule. The clothing **must be completely replaced** by a new outfit according to the theme description below. Do not copy the original clothing.`
    : `**Identity & Clothing Lock:** The model's face, identity, hair, AND the exact clothing (including color, texture, and fit) from the source image **must be perfectly replicated with 100% accuracy**. Do not change the outfit.`;

  const selectedThemeInstruction =
    themeInstructions[theme] ?? themeInstructions.studio;

  const prompt = `
            **//-- ABSOLUTE MANDATE: PHOTOREALISM & IDENTITY PRESERVATION --//**
            **Primary Objective:** Generate a single, ultra-realistic photograph. The output *must* be indistinguishable from a photo taken by a world-class portrait photographer using professional equipment. The most critical, non-negotiable rule is to perfectly preserve the facial identity of the person in the source image. Any deviation is a failure.

            **//-- STRICT GENERATION DIRECTIVES --//**

            **1. Fidelity (CRITICAL):**
                *   ${fidelityInstruction}
                *   **Skin Texture:** Render skin with natural, high-resolution texture. Avoid any airbrushed, plastic, or overly smooth appearance. Pores and subtle imperfections must be visible for realism.

            **2. Photographic Emulation:**
                *   **Camera & Lens:** Emulate the output of a professional full-frame DSLR camera (e.g., Sony A7R IV) with a high-quality prime lens (e.g., 85mm f/1.4). This means sharp focus on the subject, natural depth of field (bokeh), and no digital artifacts.
                *   **Realism:** Absolutely NO digital art, illustration, 3D rendering, or "AI" aesthetic. The final image must look like a real-life photograph, not a digital creation.
                *   **No Defects:** Ensure there are no anatomical defects, distorted features, extra limbs, or poorly rendered hands/feet.

            **3. Pose & Composition:**
                *   **New Pose:** The model's new pose is: "${pose}". The pose must look natural and appropriate for the theme.
                *   **Aspect Ratio:** The photo must have a ${aspectRatioDescription} aspect ratio.

            **4. Scene & Style (Theme: ${theme}):**
                *   ${selectedThemeInstruction}
            
            ${negativePromptSection}

            **//-- FINAL CHECK --//**
            **Final Mandate:** Before outputting, verify: Is the person's face an exact match to the source? Does the image look like a genuine photograph? If not, regenerate.
        `;

  return prompt;
}

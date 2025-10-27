# 8 Fashion Photography Prompts for Rork API

## Overview

This document contains the 8 specialized fashion photography prompts designed for the Rork API integration. Each prompt is crafted to generate professional fashion photography while preserving the person's identity and clothing.

## Prompt Categories

### 1. Professional Studio Photoshoot

**Prompt:** "Create a professional fashion photoshoot image. CRITICAL REQUIREMENTS: 1) Keep the EXACT SAME person - preserve their face, gender, age, ethnicity, hair color, hair style, and all facial features identically. 2) Keep their EXACT SAME clothing - same outfit, same colors, same style, same accessories. 3) ONLY CHANGE: the pose and body position to create a professional model pose. Use professional studio lighting with soft key light and subtle shadows. Clean, elegant background. The person should be in a confident, professional modeling pose while wearing their original outfit."

**Use Case:** Corporate headshots, business attire, professional portfolios
**Lighting:** Professional studio lighting with soft key light and subtle shadows
**Background:** Clean, elegant, professional
**Pose:** Confident, professional modeling pose

### 2. Dynamic Model Pose

**Prompt:** "Transform into a professional model pose photoshoot. MUST PRESERVE: 1) The exact same person - identical face, gender, skin tone, hair, and all features. 2) The exact same outfit they are wearing - same clothing items, colors, patterns, and style. ONLY MODIFY: Change the pose to a dynamic fashion model stance. Use three-point studio lighting. Professional photography composition with proper depth of field. The same person in the same clothes, just in a different professional modeling pose."

**Use Case:** Fashion catalogs, lifestyle shots, dynamic advertising
**Lighting:** Three-point studio lighting
**Background:** Professional photography composition
**Pose:** Dynamic fashion model stance

### 3. High-End Fashion Photography

**Prompt:** "Create a high-end fashion photography shot. STRICT REQUIREMENTS: 1) Same person - do not change gender, face, age, ethnicity, or any physical features. 2) Same exact clothing - keep all garments, colors, and accessories identical to the original. 3) CHANGE ONLY THE POSE: Position them in an elegant, professional model pose. Implement cinematic studio lighting with soft diffused key light and gentle rim light. Neutral, upscale background. The identical person wearing their original outfit, posed professionally."

**Use Case:** Luxury brands, high-end fashion magazines, premium advertising
**Lighting:** Cinematic studio lighting with soft diffused key light and gentle rim light
**Background:** Neutral, upscale, sophisticated
**Pose:** Elegant, professional model pose

### 4. Editorial Fashion

**Prompt:** "Professional fashion editorial photograph. MANDATORY: 1) Preserve the person completely - same gender, same face, same hair, same everything about them. 2) Keep their clothing exactly as shown - same outfit, same colors, same style. 3) ONLY ALTER: The body pose and positioning for a professional fashion model look. Use professional beauty lighting setup. Sophisticated background with subtle depth. The same person in the same clothes, just repositioned in a confident modeling pose with proper posture."

**Use Case:** Fashion magazines, editorial spreads, artistic fashion photography
**Lighting:** Professional beauty lighting setup
**Background:** Sophisticated background with subtle depth
**Pose:** Confident modeling pose with proper posture

### 5. Runway Glamour

**Prompt:** "Transform into a runway glamour fashion photograph. ESSENTIAL: 1) Keep the person completely unchanged - same face, gender, age, ethnicity, hair, and all physical features. 2) Preserve their outfit exactly - same clothing, same colors, same style, same accessories. 3) MODIFY ONLY THE POSE: Position them in a glamorous runway model pose. Use dramatic stage lighting with strong key light and accent lighting. Showy, glamorous background. The same person in their original outfit, presented in a confident, high-fashion runway pose."

**Use Case:** Fashion shows, runway photography, glamorous advertising
**Lighting:** Dramatic stage lighting with strong key light and accent lighting
**Background:** Showy, glamorous, theatrical
**Pose:** Glamorous runway model pose

### 6. Street Style Fashion

**Prompt:** "Create a street style fashion photograph. REQUIRED: 1) Same person must remain identical - preserve face, gender, age, ethnicity, hair, and all characteristics. 2) Same outfit must be kept exactly - same clothes, same colors, same style, same accessories. 3) CHANGE ONLY THE POSE: Arrange them in a casual street fashion model pose. Use natural, candid lighting that mimics outdoor conditions. Urban, street photography background. The identical person wearing their original outfit, captured in a relaxed, street-style modeling pose."

**Use Case:** Street fashion, casual lifestyle, urban photography
**Lighting:** Natural, candid lighting mimicking outdoor conditions
**Background:** Urban, street photography setting
**Pose:** Casual, relaxed street-style modeling pose

### 7. Couture Editorial

**Prompt:** "Produce a couture editorial fashion photograph. CRITICAL: 1) Person must be exactly the same - no changes to face, gender, age, ethnicity, hair, or any features. 2) Outfit must remain unchanged - same clothing, same colors, same style, same accessories. 3) ALTER ONLY THE POSE: Place them in an elegant couture model pose. Use dramatic high-fashion lighting with professional beauty setup. Artistic, avant-garde background. The same person in their original outfit, posed in sophisticated, high-fashion editorial style."

**Use Case:** Couture fashion, high-end editorial, artistic fashion
**Lighting:** Dramatic high-fashion lighting with professional beauty setup
**Background:** Artistic, avant-garde, sophisticated
**Pose:** Elegant couture model pose

### 8. Studio Portrait Beauty

**Prompt:** "Create a studio portrait beauty photograph. MANDATE: 1) Person must stay completely identical - same face, gender, age, ethnicity, hair, and all traits. 2) Clothing must remain exactly the same - same outfit, same colors, same style, same accessories. 3) MODIFY ONLY THE POSE: Position them in a graceful studio portrait pose. Use soft, flattering beauty lighting that enhances features. Clean, minimalist studio background. The identical person wearing their original outfit, captured in an elegant, beauty-focused studio pose."

**Use Case:** Beauty photography, portrait sessions, cosmetic advertising
**Lighting:** Soft, flattering beauty lighting that enhances features
**Background:** Clean, minimalist studio background
**Pose:** Graceful, beauty-focused studio pose

## Implementation Details

### Rotation Strategy
The prompts are cycled through based on the image count:
- Image 1: Professional Studio
- Image 2: Dynamic Model Pose
- Image 3: High-End Fashion
- Image 4: Editorial Fashion
- Image 5: Runway Glamour
- Image 6: Street Style
- Image 7: Couture Editorial
- Image 8: Studio Portrait Beauty
- Image 9+: Cycle back to Professional Studio

### Key Features
- **Identity Preservation**: Each prompt explicitly preserves the person's face, gender, age, ethnicity, hair, and all physical features
- **Clothing Preservation**: Each prompt ensures the exact same clothing, colors, style, and accessories
- **Pose Transformation**: Only the pose and body positioning are modified
- **Professional Lighting**: Each prompt includes specific lighting instructions for professional results
- **Background Guidance**: Each prompt provides background recommendations for the style

### Usage in Rork API
These prompts are implemented in the `generate-image` edge function and are automatically selected based on the image count requested. The prompts ensure consistent, professional fashion photography results while maintaining the subject's identity and clothing.

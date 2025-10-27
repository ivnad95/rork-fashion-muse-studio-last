Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const requestData = await req.json();
        const { 
            userId, 
            originalImage, 
            style, 
            camera_angle: cameraAngle, 
            lighting, 
            imageCount,
            prompt 
        } = requestData;

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        if (!userId || !originalImage) {
            throw new Error('User ID and original image are required');
        }

        const count = imageCount || 1;

        // Extract base64 data from data URL
        const base64Data = originalImage.split(',')[1];
        const mimeType = originalImage.split(';')[0].split(':')[1];

        // Upload original image to storage
        const timestamp = Date.now();
        const originalFileName = `original-${userId}-${timestamp}.jpg`;
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/fashion-images/${originalFileName}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const originalUrl = `${supabaseUrl}/storage/v1/object/public/fashion-images/${originalFileName}`;

        // Create generation record
        const generationResponse = await fetch(`${supabaseUrl}/rest/v1/generations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                image_count: count,
                original_image_url: originalUrl,
                status: 'processing'
            })
        });

        if (!generationResponse.ok) {
            const errorText = await generationResponse.text();
            throw new Error(`Failed to create generation record: ${errorText}`);
        }

        const generationData = await generationResponse.json();
        const generationId = generationData[0].id;

        // Deduct credits
        await fetch(`${supabaseUrl}/functions/v1/deduct-credits`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                amount: count
            })
        });

        // Generate images using Rork API
        const generatedImages = [];
        
        // Define 8 fashion photography prompts for Rork API
        const fashionPrompts = [
            'Create a professional fashion photoshoot image. CRITICAL REQUIREMENTS: 1) Keep the EXACT SAME person - preserve their face, gender, age, ethnicity, hair color, hair style, and all facial features identically. 2) Keep their EXACT SAME clothing - same outfit, same colors, same style, same accessories. 3) ONLY CHANGE: the pose and body position to create a professional model pose. Use professional studio lighting with soft key light and subtle shadows. Clean, elegant background. The person should be in a confident, professional modeling pose while wearing their original outfit.',
            
            'Transform into a professional model pose photoshoot. MUST PRESERVE: 1) The exact same person - identical face, gender, skin tone, hair, and all features. 2) The exact same outfit they are wearing - same clothing items, colors, patterns, and style. ONLY MODIFY: Change the pose to a dynamic fashion model stance. Use three-point studio lighting. Professional photography composition with proper depth of field. The same person in the same clothes, just in a different professional modeling pose.',
            
            'Create a high-end fashion photography shot. STRICT REQUIREMENTS: 1) Same person - do not change gender, face, age, ethnicity, or any physical features. 2) Same exact clothing - keep all garments, colors, and accessories identical to the original. 3) CHANGE ONLY THE POSE: Position them in an elegant, professional model pose. Implement cinematic studio lighting with soft diffused key light and gentle rim light. Neutral, upscale background. The identical person wearing their original outfit, posed professionally.',
            
            'Professional fashion editorial photograph. MANDATORY: 1) Preserve the person completely - same gender, same face, same hair, same everything about them. 2) Keep their clothing exactly as shown - same outfit, same colors, same style. 3) ONLY ALTER: The body pose and positioning for a professional fashion model look. Use professional beauty lighting setup. Sophisticated background with subtle depth. The same person in the same clothes, just repositioned in a confident modeling pose with proper posture.',
            
            'Transform into a runway glamour fashion photograph. ESSENTIAL: 1) Keep the person completely unchanged - same face, gender, age, ethnicity, hair, and all physical features. 2) Preserve their outfit exactly - same clothing, same colors, same style, same accessories. 3) MODIFY ONLY THE POSE: Position them in a glamorous runway model pose. Use dramatic stage lighting with strong key light and accent lighting. Showy, glamorous background. The same person in their original outfit, presented in a confident, high-fashion runway pose.',
            
            'Create a street style fashion photograph. REQUIRED: 1) Same person must remain identical - preserve face, gender, age, ethnicity, hair, and all characteristics. 2) Same outfit must be kept exactly - same clothes, same colors, same style, same accessories. 3) CHANGE ONLY THE POSE: Arrange them in a casual street fashion model pose. Use natural, candid lighting that mimics outdoor conditions. Urban, street photography background. The identical person wearing their original outfit, captured in a relaxed, street-style modeling pose.',
            
            'Produce a couture editorial fashion photograph. CRITICAL: 1) Person must be exactly the same - no changes to face, gender, age, ethnicity, hair, or any features. 2) Outfit must remain unchanged - same clothing, same colors, same style, same accessories. 3) ALTER ONLY THE POSE: Place them in an elegant couture model pose. Use dramatic high-fashion lighting with professional beauty setup. Artistic, avant-garde background. The same person in their original outfit, posed in sophisticated, high-fashion editorial style.',
            
            'Create a studio portrait beauty photograph. MANDATE: 1) Person must stay completely identical - same face, gender, age, ethnicity, hair, and all traits. 2) Clothing must remain exactly the same - same outfit, same colors, same style, same accessories. 3) MODIFY ONLY THE POSE: Position them in a graceful studio portrait pose. Use soft, flattering beauty lighting that enhances features. Clean, minimalist studio background. The identical person wearing their original outfit, captured in an elegant, beauty-focused studio pose.'
        ];

        const RORK_API_URL = 'https://toolkit.rork.com/images/edit/';
        const TIMEOUT_MS = 180000; // 180 seconds
        const MAX_RETRIES = 2;

        for (let i = 0; i < count; i++) {
            try {
                const fashionPrompt = fashionPrompts[i % fashionPrompts.length];
                
                // Call Rork API with retry logic
                let generatedImageData = null;
                let lastError = null;

                for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => {
                        console.log(`Request timeout after ${TIMEOUT_MS}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
                        controller.abort();
                    }, TIMEOUT_MS);

                    try {
                        console.log(`Rork API call attempt ${attempt + 1}/${MAX_RETRIES + 1} for image ${i + 1}`);
                        
                        const rorkResponse = await fetch(RORK_API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                prompt: fashionPrompt,
                                images: [
                                    {
                                        type: 'image',
                                        image: base64Data
                                    }
                                ]
                            }),
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);

                        if (!rorkResponse.ok) {
                            if (rorkResponse.status === 429) {
                                throw new Error('Rate limit exceeded. Please try again in a few moments.');
                            }
                            if (rorkResponse.status === 413) {
                                throw new Error('Image too large. Please use a smaller image.');
                            }
                            if (rorkResponse.status >= 500 && attempt < MAX_RETRIES) {
                                console.log(`Server error (${rorkResponse.status}), retrying...`);
                                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                                continue;
                            }
                            const errorText = await rorkResponse.text();
                            throw new Error(`Rork API error: ${rorkResponse.status} - ${errorText}`);
                        }

                        const rorkData = await rorkResponse.json();

                        if (!rorkData.image || !rorkData.image.base64Data) {
                            throw new Error('Invalid API response - missing image data');
                        }

                        generatedImageData = rorkData.image.base64Data;
                        const generatedMimeType = rorkData.image.mimeType || 'image/jpeg';

                        // Upload generated image to storage
                        const generatedFileName = `generated-${generationId}-${i}.jpg`;
                        const generatedBinaryData = Uint8Array.from(atob(generatedImageData), c => c.charCodeAt(0));
                        
                        const generatedUploadResponse = await fetch(
                            `${supabaseUrl}/storage/v1/object/fashion-images/${generatedFileName}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'Content-Type': generatedMimeType,
                                    'x-upsert': 'true'
                                },
                                body: generatedBinaryData
                            }
                        );

                        if (!generatedUploadResponse.ok) {
                            const errorText = await generatedUploadResponse.text();
                            console.error(`Upload failed for generated image ${i + 1}:`, errorText);
                            throw new Error(`Failed to upload generated image: ${errorText}`);
                        }

                        const generatedImageUrl = `${supabaseUrl}/storage/v1/object/public/fashion-images/${generatedFileName}`;

                        // Save generated image record
                        const imageRecordResponse = await fetch(`${supabaseUrl}/rest/v1/generated_images`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json',
                                'Prefer': 'return=representation'
                            },
                            body: JSON.stringify({
                                generation_id: generationId,
                                image_url: generatedImageUrl,
                                pose_type: `pose_${i}`
                            })
                        });

                        if (imageRecordResponse.ok) {
                            generatedImages.push({
                                url: generatedImageUrl,
                                index: i
                            });
                            console.log(`Successfully generated and saved image ${i + 1}`);
                        }

                        break; // Success, exit retry loop
                    } catch (error) {
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

                if (!generatedImageData && lastError) {
                    throw lastError;
                }

            } catch (imageError) {
                console.error(`Error generating image ${i + 1}:`, imageError);
                // Continue with next image even if one fails
            }
        }

        // Update generation status
        const finalStatus = generatedImages.length > 0 ? 'completed' : 'failed';
        await fetch(`${supabaseUrl}/rest/v1/generations?id=eq.${generationId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: finalStatus
            })
        });

        return new Response(JSON.stringify({
            data: {
                generation: {
                    id: generationId,
                    status: finalStatus,
                    generatedImages: generatedImages,
                    totalGenerated: generatedImages.length,
                    requested: count
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Image generation error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'IMAGE_GENERATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

import { handleCors, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const requestData = await req.json();
        const { userId, imageData, fileName } = requestData;

        if (!userId || !imageData) {
            throw new Error('User ID and image data are required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Extract base64 data from data URL
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];

        // Generate unique filename
        const timestamp = Date.now();
        const finalFileName = fileName || `upload-${userId}-${timestamp}.jpg`;
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to storage
        const uploadResponse = await fetch(
            `${supabaseUrl}/storage/v1/object/fashion-images/${finalFileName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': mimeType,
                    'x-upsert': 'true'
                },
                body: binaryData
            }
        );

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const imageUrl = `${supabaseUrl}/storage/v1/object/public/fashion-images/${finalFileName}`;

        return createSuccessResponse({
            url: imageUrl,
            fileName: finalFileName,
            mimeType,
            uploadedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Upload image error:', error);
        return createErrorResponse(error.message);
    }
});

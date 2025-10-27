import { handleCors, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId') || url.searchParams.get('user_id');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        if (!userId) {
            throw new Error('User ID is required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Get user generations with pagination
        const response = await fetch(
            `${supabaseUrl}/rest/v1/generations?user_id=eq.${userId}&order=created_at.desc&limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get generations: ${errorText}`);
        }

        const generations = await response.json();

        return createSuccessResponse({
            generations,
            pagination: {
                limit,
                offset,
                count: generations.length
            }
        });

    } catch (error) {
        console.error('List generations error:', error);
        return createErrorResponse(error.message);
    }
});

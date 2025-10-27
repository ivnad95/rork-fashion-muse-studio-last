import { handleCors, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId') || url.searchParams.get('user_id');

        if (!userId) {
            throw new Error('User ID is required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get user: ${errorText}`);
        }

        const users = await response.json();
        if (users.length === 0) {
            throw new Error('User not found');
        }

        return createSuccessResponse(users[0]);

    } catch (error) {
        console.error('Get user error:', error);
        return createErrorResponse(error.message);
    }
});

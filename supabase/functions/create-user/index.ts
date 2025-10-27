import { handleCors, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const requestData = await req.json();
        const { email, name } = requestData;

        if (!email) {
            throw new Error('Email is required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Generate a simple user ID (in production, you'd use proper UUID generation)
        const userId = crypto.randomUUID();

        // Create user
        const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                id: userId,
                email: email,
                name: name || '',
                credits: 10, // Give new users 10 free credits
                subscription_tier: 'free',
                created_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create user: ${errorText}`);
        }

        const user = await response.json();

        return createSuccessResponse(user[0]);

    } catch (error) {
        console.error('Create user error:', error);
        return createErrorResponse(error.message);
    }
});

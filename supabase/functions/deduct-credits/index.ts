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
        const { userId, amount } = requestData;

        if (!userId || amount === undefined) {
            throw new Error('User ID and amount are required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Get current user data
        const userResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!userResponse.ok) {
            const errorText = await userResponse.text();
            throw new Error(`Failed to get user: ${errorText}`);
        }

        const users = await userResponse.json();
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const currentCredits = users[0].credits || 0;

        if (currentCredits < amount) {
            throw new Error('Insufficient credits');
        }

        // Deduct credits
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                credits: currentCredits - amount
            })
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to deduct credits: ${errorText}`);
        }

        // Record transaction
        await fetch(`${supabaseUrl}/rest/v1/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                type: 'deduction',
                amount: amount,
                description: `Image generation - ${amount} credits deducted`,
                created_at: new Date().toISOString()
            })
        });

        const updatedUser = await updateResponse.json();

        return new Response(JSON.stringify({
            data: {
                user: updatedUser[0],
                message: `${amount} credits deducted successfully`,
                remainingCredits: currentCredits - amount
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Deduct credits error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'DEDUCT_CREDITS_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

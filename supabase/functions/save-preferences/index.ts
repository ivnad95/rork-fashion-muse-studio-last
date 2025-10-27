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
            defaultStyle,
            defaultCameraAngle,
            defaultLighting,
            preferredPoseTypes,
            quality
        } = requestData;

        if (!userId) {
            throw new Error('User ID is required');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Check if preferences already exist
        const existingResponse = await fetch(`${supabaseUrl}/rest/v1/user_preferences?user_id=eq.${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        const existing = await existingResponse.json();
        
        let response;
        if (existing.length > 0) {
            // Update existing preferences
            response = await fetch(`${supabaseUrl}/rest/v1/user_preferences?user_id=eq.${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    default_style: defaultStyle || existing[0].default_style,
                    default_camera_angle: defaultCameraAngle || existing[0].default_camera_angle,
                    default_lighting: defaultLighting || existing[0].default_lighting,
                    preferred_pose_types: preferredPoseTypes || existing[0].preferred_pose_types,
                    quality: quality || existing[0].quality,
                    updated_at: new Date().toISOString()
                })
            });
        } else {
            // Create new preferences
            response = await fetch(`${supabaseUrl}/rest/v1/user_preferences`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    user_id: userId,
                    default_style: defaultStyle || 'professional',
                    default_camera_angle: defaultCameraAngle || 'front',
                    default_lighting: defaultLighting || 'studio',
                    preferred_pose_types: preferredPoseTypes || ['professional', 'dynamic', 'editorial'],
                    quality: quality || 'high'
                })
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save preferences: ${errorText}`);
        }

        const savedPreferences = await response.json();

        return new Response(JSON.stringify({
            data: savedPreferences[0] || savedPreferences,
            message: 'Preferences saved successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Save preferences error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'SAVE_PREFERENCES_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

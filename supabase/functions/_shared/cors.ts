export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
};

export function handleCors(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }
    return null;
}

export function createErrorResponse(message: string, status: number = 500) {
    return new Response(JSON.stringify({
        error: {
            code: 'FUNCTION_ERROR',
            message
        }
    }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

export function createSuccessResponse(data: any) {
    return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

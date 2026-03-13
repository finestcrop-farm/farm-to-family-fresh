import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const ALLOWED_BUCKETS = ['product-images', 'admin-documents'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: Record<string, unknown>) => {
  console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](
    JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...data })
  );
};

const checkRateLimit = (clientId: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return { allowed: false, remaining: 0 };
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
};

const isValidPath = (path: string): boolean => {
  return !path.includes('..') && !path.startsWith('/') && /^[a-zA-Z0-9_\-./]+$/.test(path);
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: 'Too many upload requests' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    // Verify JWT and check admin role
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { bucket, path, file, contentType } = await req.json();

    if (!bucket || !path || !file) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return new Response(JSON.stringify({ error: `Upload to bucket '${bucket}' is not allowed` }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!isValidPath(path)) {
      return new Response(JSON.stringify({ error: 'Invalid file path' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fileData = decode(file);

    if (fileData.length > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    log('INFO', 'Storage upload', { requestId, bucket, path, fileSize: fileData.length, userId: user.id });

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, fileData, { contentType: contentType || 'application/octet-stream', upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    log('INFO', 'Upload completed', { requestId, bucket, path, duration: `${Date.now() - startTime}ms` });

    return new Response(JSON.stringify({ publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log('ERROR', 'Storage upload error', { requestId, error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

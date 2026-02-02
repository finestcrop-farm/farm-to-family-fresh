import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-admin-key',
};

// Dev admin phone for verification
const DEV_ADMIN_PHONE = '9989835113';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Lower limit for uploads

// In-memory rate limit store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Allowed buckets for security
const ALLOWED_BUCKETS = ['product-images', 'admin-documents'];

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Logging helper
const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, ...data };
  console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](JSON.stringify(logEntry));
};

// Rate limiting check
const checkRateLimit = (clientId: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    log('WARN', 'Rate limit exceeded for uploads', { clientId, count: record.count });
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
};

// Validate file path to prevent path traversal
const isValidPath = (path: string): boolean => {
  return !path.includes('..') && !path.startsWith('/') && /^[a-zA-Z0-9_\-./]+$/.test(path);
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      log('WARN', 'Upload blocked by rate limit', { requestId, clientIp });
      return new Response(
        JSON.stringify({ error: 'Too many upload requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Remaining': '0'
          } 
        }
      );
    }

    // Verify dev admin key
    const devAdminKey = req.headers.get('x-dev-admin-key');
    if (devAdminKey !== DEV_ADMIN_PHONE) {
      log('WARN', 'Unauthorized upload attempt', { requestId, clientIp });
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid dev admin key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { bucket, path, file, contentType } = await req.json();

    if (!bucket || !path || !file) {
      log('WARN', 'Missing required fields', { requestId, hasBucket: !!bucket, hasPath: !!path, hasFile: !!file });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: bucket, path, file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate bucket name
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      log('WARN', 'Blocked upload to unauthorized bucket', { requestId, bucket, clientIp });
      return new Response(
        JSON.stringify({ error: `Upload to bucket '${bucket}' is not allowed` }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate path to prevent path traversal attacks
    if (!isValidPath(path)) {
      log('WARN', 'Invalid file path detected', { requestId, path, clientIp });
      return new Response(
        JSON.stringify({ error: 'Invalid file path' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode base64 file
    const fileData = decode(file);

    // Check file size
    if (fileData.length > MAX_FILE_SIZE) {
      log('WARN', 'File too large', { requestId, size: fileData.length, maxSize: MAX_FILE_SIZE });
      return new Response(
        JSON.stringify({ error: `File size exceeds maximum allowed (${MAX_FILE_SIZE / 1024 / 1024}MB)` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('INFO', 'Storage upload request', { 
      requestId, 
      bucket, 
      path, 
      contentType, 
      fileSize: fileData.length,
      clientIp 
    });

    // Upload file using service role
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, fileData, {
        contentType: contentType || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      log('ERROR', 'Upload failed', { requestId, bucket, path, error: uploadError.message });
      return new Response(
        JSON.stringify({ error: uploadError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);

    const duration = Date.now() - startTime;
    log('INFO', 'Upload completed successfully', { 
      requestId, 
      bucket, 
      path, 
      duration: `${duration}ms`,
      publicUrl 
    });

    return new Response(
      JSON.stringify({ publicUrl }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Request-Id': requestId,
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        } 
      }
    );

  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log('ERROR', 'Storage upload error', { requestId, error: errorMessage, duration: `${duration}ms` });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Request-Id': requestId } }
    );
  }
});

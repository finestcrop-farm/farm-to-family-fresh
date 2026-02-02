import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-admin-key',
};

// Dev admin phone for verification
const DEV_ADMIN_PHONE = '9989835113';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Allowed tables for security
const ALLOWED_TABLES = ['products', 'orders', 'subscriptions', 'profiles', 'admin_documents', 'notifications', 'promotional_notification_history'];

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
    log('WARN', 'Rate limit exceeded', { clientId, count: record.count });
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
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
      log('WARN', 'Request blocked by rate limit', { requestId, clientIp });
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
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
      log('WARN', 'Unauthorized access attempt', { requestId, clientIp });
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

    const { action, table, data, id, filters } = await req.json();

    // Validate table name to prevent SQL injection
    if (!ALLOWED_TABLES.includes(table)) {
      log('WARN', 'Blocked access to unauthorized table', { requestId, table, clientIp });
      return new Response(
        JSON.stringify({ error: `Access to table '${table}' is not allowed` }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('INFO', 'Admin proxy request', { requestId, action, table, hasId: !!id, clientIp });

    let result;

    switch (action) {
      case 'select':
        const selectQuery = supabaseAdmin.from(table).select(data?.columns || '*');
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            selectQuery.eq(key, value);
          });
        }
        if (data?.order) {
          selectQuery.order(data.order.column, { ascending: data.order.ascending ?? false });
        }
        if (data?.limit) {
          selectQuery.limit(data.limit);
        }
        result = await selectQuery;
        break;

      case 'insert':
        result = await supabaseAdmin.from(table).insert(data).select();
        break;

      case 'update':
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID required for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await supabaseAdmin.from(table).update(data).eq('id', id).select();
        break;

      case 'delete':
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID required for delete' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await supabaseAdmin.from(table).delete().eq('id', id);
        break;

      case 'upsert':
        result = await supabaseAdmin.from(table).upsert(data).select();
        break;

      default:
        log('WARN', 'Invalid action attempted', { requestId, action, clientIp });
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      log('ERROR', 'Database operation failed', { requestId, action, table, error: result.error.message });
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const duration = Date.now() - startTime;
    log('INFO', 'Admin proxy request completed', { 
      requestId, 
      action, 
      table, 
      duration: `${duration}ms`,
      resultCount: Array.isArray(result.data) ? result.data.length : 1
    });

    return new Response(
      JSON.stringify({ data: result.data }),
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
    log('ERROR', 'Admin proxy error', { requestId, error: errorMessage, duration: `${duration}ms` });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Request-Id': requestId } }
    );
  }
});

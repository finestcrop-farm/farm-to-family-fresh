import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 100;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const ALLOWED_TABLES = [
  'products', 'orders', 'subscriptions', 'profiles', 'admin_documents',
  'notifications', 'promotional_notification_history', 'admin_audit_logs',
];

const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](
    JSON.stringify({ timestamp, level, message, ...data })
  );
};

const checkRateLimit = (clientId: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
};

const createAuditLog = async (data: {
  action: string; table: string; recordId?: string; adminIdentifier: string;
  details?: Record<string, unknown>; ipAddress: string; requestId: string; durationMs: number;
}) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    await fetch(`${supabaseUrl}/rest/v1/admin_audit_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        action: data.action, table_name: data.table, record_id: data.recordId,
        admin_identifier: data.adminIdentifier, details: data.details,
        ip_address: data.ipAddress, request_id: data.requestId, duration_ms: data.durationMs,
      }),
    });
  } catch (error) {
    log('ERROR', 'Failed to create audit log', { error: String(error) });
  }
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
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
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

    // Verify the user's JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      log('WARN', 'Invalid token', { requestId });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      log('WARN', 'Non-admin access attempt', { requestId, userId: user.id });
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, table, data, id, filters } = await req.json();

    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(JSON.stringify({ error: `Access to table '${table}' is not allowed` }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    log('INFO', 'Admin proxy request', { requestId, action, table, userId: user.id });

    let result;
    switch (action) {
      case 'select': {
        const q = supabaseAdmin.from(table).select(data?.columns || '*');
        if (filters) Object.entries(filters).forEach(([k, v]) => q.eq(k, v));
        if (data?.order) q.order(data.order.column, { ascending: data.order.ascending ?? false });
        if (data?.limit) q.limit(data.limit);
        result = await q;
        break;
      }
      case 'insert':
        result = await supabaseAdmin.from(table).insert(data).select();
        break;
      case 'update':
        if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        result = await supabaseAdmin.from(table).update(data).eq('id', id).select();
        break;
      case 'delete':
        if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        result = await supabaseAdmin.from(table).delete().eq('id', id);
        break;
      case 'upsert':
        result = await supabaseAdmin.from(table).upsert(data).select();
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const duration = Date.now() - startTime;
    if (action !== 'select' && table !== 'admin_audit_logs') {
      await createAuditLog({
        action, table, recordId: id || (result.data?.[0]?.id as string),
        adminIdentifier: user.email || user.id, details: action === 'delete' ? undefined : { data_preview: JSON.stringify(data).slice(0, 500) },
        ipAddress: clientIp, requestId, durationMs: duration,
      });
    }

    return new Response(JSON.stringify({ data: result.data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Request-Id': requestId },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log('ERROR', 'Admin proxy error', { requestId, error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

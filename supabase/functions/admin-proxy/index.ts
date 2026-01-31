import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-dev-admin-key',
};

// Dev admin phone for verification
const DEV_ADMIN_PHONE = '9989835113';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify dev admin key
    const devAdminKey = req.headers.get('x-dev-admin-key');
    if (devAdminKey !== DEV_ADMIN_PHONE) {
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
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ data: result.data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

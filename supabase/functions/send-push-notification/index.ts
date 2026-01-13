import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushNotificationRequest {
  title: string;
  message: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const firebaseServerKey = Deno.env.get("FIREBASE_SERVER_KEY");

    if (!firebaseServerKey) {
      return new Response(
        JSON.stringify({ 
          error: "Firebase not configured", 
          pushSent: false,
          successCount: 0,
          failureCount: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const { title, message, data } = await req.json() as PushNotificationRequest;

    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: "Title and message are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Fetch all FCM tokens
    const { data: tokens, error: tokensError } = await supabase
      .from("fcm_tokens")
      .select("token");

    if (tokensError) {
      console.error("Error fetching tokens:", tokensError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch tokens" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ 
          pushSent: false, 
          message: "No registered devices",
          successCount: 0,
          failureCount: 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send to FCM (using legacy HTTP API for simplicity)
    const tokenList = tokens.map(t => t.token);
    let successCount = 0;
    let failureCount = 0;

    // Send in batches of 500 (FCM limit)
    const batchSize = 500;
    for (let i = 0; i < tokenList.length; i += batchSize) {
      const batch = tokenList.slice(i, i + batchSize);
      
      const fcmPayload = {
        registration_ids: batch,
        notification: {
          title,
          body: message,
          icon: "/pwa-192x192.png",
          click_action: "/notifications",
        },
        data: {
          ...data,
          title,
          message,
          type: "promotion",
        },
      };

      const fcmResponse = await fetch(
        "https://fcm.googleapis.com/fcm/send",
        {
          method: "POST",
          headers: {
            "Authorization": `key=${firebaseServerKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fcmPayload),
        }
      );

      if (fcmResponse.ok) {
        const result = await fcmResponse.json();
        successCount += result.success || 0;
        failureCount += result.failure || 0;

        // Remove invalid tokens
        if (result.results) {
          const invalidTokens: string[] = [];
          result.results.forEach((res: { error?: string }, idx: number) => {
            if (res.error === "InvalidRegistration" || res.error === "NotRegistered") {
              invalidTokens.push(batch[idx]);
            }
          });

          if (invalidTokens.length > 0) {
            await supabase
              .from("fcm_tokens")
              .delete()
              .in("token", invalidTokens);
          }
        }
      } else {
        failureCount += batch.length;
        console.error("FCM error:", await fcmResponse.text());
      }
    }

    return new Response(
      JSON.stringify({
        pushSent: true,
        successCount,
        failureCount,
        totalTokens: tokenList.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-push-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

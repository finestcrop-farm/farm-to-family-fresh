 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response("ok", { headers: corsHeaders });
   }
 
   try {
     const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
     
     if (!RAZORPAY_KEY_SECRET) {
       return new Response(
         JSON.stringify({ error: "Razorpay credentials not configured" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();
 
     // Verify signature
     const body = razorpay_order_id + "|" + razorpay_payment_id;
     const encoder = new TextEncoder();
     const key = encoder.encode(RAZORPAY_KEY_SECRET);
     const data = encoder.encode(body);
     
     const cryptoKey = await crypto.subtle.importKey(
       "raw",
       key,
       { name: "HMAC", hash: "SHA-256" },
       false,
       ["sign"]
     );
     
     const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
     const expectedSignature = Array.from(new Uint8Array(signature))
       .map(b => b.toString(16).padStart(2, '0'))
       .join('');
 
     if (expectedSignature !== razorpay_signature) {
       return new Response(
         JSON.stringify({ verified: false, error: "Invalid signature" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Update order payment status in database
     const supabaseClient = createClient(
       Deno.env.get("SUPABASE_URL") ?? "",
       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
     );
 
     if (order_id) {
       const { error: updateError } = await supabaseClient
         .from("orders")
         .update({ 
           payment_status: "completed",
           updated_at: new Date().toISOString()
         })
         .eq("id", order_id);
 
       if (updateError) {
         console.error("Error updating order:", updateError);
       }
     }
 
     return new Response(
       JSON.stringify({ 
         verified: true, 
         paymentId: razorpay_payment_id,
         orderId: razorpay_order_id
       }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     const errorMessage = error instanceof Error ? error.message : "Unknown error";
     console.error("Error:", errorMessage);
     return new Response(
       JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });
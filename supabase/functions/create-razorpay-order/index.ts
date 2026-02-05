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
     const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
     const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
 
     if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
       return new Response(
         JSON.stringify({ error: "Razorpay credentials not configured" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { amount, currency = "INR", receipt, notes } = await req.json();
 
     if (!amount || amount <= 0) {
       return new Response(
         JSON.stringify({ error: "Invalid amount" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Create Razorpay order
     const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
     
     const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
       method: "POST",
       headers: {
         "Authorization": `Basic ${auth}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         amount: Math.round(amount * 100), // Razorpay expects amount in paise
         currency,
         receipt: receipt || `rcpt_${Date.now()}`,
         notes: notes || {},
       }),
     });
 
     if (!razorpayResponse.ok) {
       const errorData = await razorpayResponse.json();
       console.error("Razorpay error:", errorData);
       return new Response(
         JSON.stringify({ error: "Failed to create Razorpay order", details: errorData }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const order = await razorpayResponse.json();
 
     return new Response(
       JSON.stringify({ 
         orderId: order.id,
         amount: order.amount,
         currency: order.currency,
         keyId: RAZORPAY_KEY_ID,
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
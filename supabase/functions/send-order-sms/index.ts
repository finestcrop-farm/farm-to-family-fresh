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
     const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
     const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
     const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
 
     if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
       console.log("Twilio not configured, skipping SMS");
       return new Response(
         JSON.stringify({ success: false, message: "SMS not configured" }),
         { headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { to, orderNumber, type, estimatedTime, amount } = await req.json();
 
     if (!to || !orderNumber || !type) {
       return new Response(
         JSON.stringify({ error: "Missing required fields" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     let message = "";
     
     switch (type) {
       case "confirmation":
         message = `🛒 Farm to Family: Your order ${orderNumber} is confirmed! Total: ₹${amount}. Estimated delivery: ${estimatedTime}. Track your order in the app.`;
         break;
       case "preparing":
         message = `👨‍🍳 Farm to Family: Your order ${orderNumber} is being prepared. Get ready to receive fresh groceries soon!`;
         break;
       case "out_for_delivery":
         message = `🚚 Farm to Family: Your order ${orderNumber} is out for delivery! Our delivery partner will reach you in ${estimatedTime}.`;
         break;
       case "delivered":
         message = `✅ Farm to Family: Your order ${orderNumber} has been delivered. Thank you for shopping with us! Rate your experience in the app.`;
         break;
       case "cancelled":
         message = `❌ Farm to Family: Your order ${orderNumber} has been cancelled. Refund (if applicable) will be processed within 5-7 business days.`;
         break;
       default:
         message = `Farm to Family: Update on your order ${orderNumber}.`;
     }
 
     // Format phone number for India
     let formattedPhone = to.replace(/\s+/g, "").replace(/-/g, "");
     if (!formattedPhone.startsWith("+")) {
       if (formattedPhone.startsWith("91")) {
         formattedPhone = "+" + formattedPhone;
       } else {
         formattedPhone = "+91" + formattedPhone;
       }
     }
 
     const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
     const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
 
     const twilioResponse = await fetch(twilioUrl, {
       method: "POST",
       headers: {
         "Authorization": `Basic ${auth}`,
         "Content-Type": "application/x-www-form-urlencoded",
       },
       body: new URLSearchParams({
         To: formattedPhone,
         From: TWILIO_PHONE_NUMBER,
         Body: message,
       }),
     });
 
     if (!twilioResponse.ok) {
       const errorData = await twilioResponse.json();
       console.error("Twilio error:", errorData);
       return new Response(
         JSON.stringify({ success: false, error: errorData }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const result = await twilioResponse.json();
 
     return new Response(
       JSON.stringify({ success: true, messageId: result.sid }),
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
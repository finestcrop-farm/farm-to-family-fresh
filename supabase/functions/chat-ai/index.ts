import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { message, history } = await req.json();

    const systemPrompt = `You are FreshMart's helpful customer support AI assistant. You help customers with:
- Order status and tracking questions
- Product recommendations and availability
- Payment, refund, and billing queries
- Delivery schedules and slot information
- Subscription management
- General store FAQs

Key store info:
- Delivery hours: 6 AM - 10 PM daily
- Free delivery on orders above ₹199
- Express delivery: 2-4 hours, Standard: same day
- Accepted payments: UPI, Cards, Net Banking, Wallets, COD
- Refunds processed in 5-7 business days
- Products sourced fresh daily from local farms

Be friendly, concise, and helpful. Use emojis sparingly. If you can't help, suggest the user talk to a human agent.
Format responses with markdown for readability.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-8),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai.lovable.dev/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API call failed [${response.status}]: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat AI error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ reply: "I'm having trouble right now. Please try again shortly.", error: errorMessage }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

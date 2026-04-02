import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { keywords, niche, audience, angle, vslScript } = await req.json();

    if (!keywords || !niche) {
      return new Response(JSON.stringify({ error: "keywords and niche are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const baseSystemPrompt = `You are an expert Google Ads copywriter. You create high-performance search ads that drive conversions.

Your writing style is:
- Strong, emotional, and direct
- Simple, commercial language
- Focused on conversion
- Creates curiosity and urgency

You MUST respect Google Ads character limits strictly:
- Headlines: max 30 characters each
- Descriptions: max 90 characters each
- Sitelink titles: max 25 characters each
- Sitelink descriptions: max 35 characters each
- Structured snippets: max 25 characters each
- Callout extensions: max 25 characters each

You MUST naturally incorporate the provided keywords.

IMPORTANT: ALWAYS generate ALL ad copy in ENGLISH, regardless of the language of the user's input. The output must always be in English because it will be used in Google Ads campaigns.`;

    const vslSystemAddition = vslScript ? `

CRITICAL: You have been given a VSL (Video Sales Letter) script. You MUST extract the following from the VSL to create the ads:
- Main pains and symptoms mentioned
- The mechanism / root cause explained
- Curiosity hooks and claims
- Emotional triggers (fear, urgency, hope)
- Unique selling points (rituals, ingredients, discoveries)

Your ads MUST be based on the actual language, angles, and emotional drivers from the VSL. Do NOT invent claims outside of what the VSL says.` : '';

    const systemPrompt = baseSystemPrompt + vslSystemAddition;

    let userPrompt = `Generate a complete Google Ads campaign for:

Keywords: ${keywords}
Niche/Product: ${niche}
${audience ? `Target Audience: ${audience}` : ''}
${angle ? `Copy Angle: ${angle}` : ''}`;

    if (vslScript) {
      userPrompt += `

=== VSL SCRIPT (use this as the primary source for angles, hooks, and claims) ===
${vslScript.substring(0, 15000)}
=== END VSL SCRIPT ===`;
    }

    userPrompt += `

Generate the ad following 3 campaign angles:
1. Extreme pain / fear
2. Immediate benefit
3. Natural / scientific solution

Use these keywords naturally throughout.${vslScript ? ' Base all angles on the VSL content.' : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_google_ad",
              description: "Generate a complete Google Ads campaign with all required components",
              parameters: {
                type: "object",
                properties: {
                  headlines: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 15 headlines, each max 30 characters",
                  },
                  descriptions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 4 descriptions, each max 90 characters",
                  },
                  sitelinks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Sitelink title, max 25 characters" },
                        desc1: { type: "string", description: "First description, max 35 characters" },
                        desc2: { type: "string", description: "Second description, max 35 characters" },
                      },
                      required: ["title", "desc1", "desc2"],
                      additionalProperties: false,
                    },
                    description: "Exactly 4 sitelinks",
                  },
                  structured_snippets: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 structured snippets, each max 25 characters",
                  },
                  callout_extensions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 6 callout extensions, each max 25 characters",
                  },
                  campaign_angles: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        angle_name: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["angle_name", "description"],
                      additionalProperties: false,
                    },
                    description: "3 campaign angles: pain/fear, immediate benefit, natural/scientific",
                  },
                },
                required: ["headlines", "descriptions", "sitelinks", "structured_snippets", "callout_extensions", "campaign_angles"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_google_ad" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return structured data" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(adData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ad error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

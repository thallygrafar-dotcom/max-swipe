import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert direct response copy analyst specialized in Top of Funnel Google Ads copy, advertorial pages, bridge pages, and pre-sell structures.

The user will paste a piece of copy.

Your job is to analyze this copy based on the PresselMAX method, which is focused on:
- Top of funnel attention
- Curiosity
- Pain agitation
- Emotional progression
- Mechanism introduction
- Click to continue / click to watch
- Pre-sell psychology

⚠️ IMPORTANT CONTEXT
This analysis is NOT for: sales pages, checkout pages, bottom of funnel, direct response close pages.

So DO NOT judge the copy based on: "buy now" strength, price handling, guarantee, direct conversion CTA, bottom funnel urgency.

If you do that, the analysis will be wrong.

YOUR ANALYSIS MUST FOLLOW THIS LOGIC
Evaluate whether the copy is strong for Top of Funnel pre-sell, asking:
- Does it hook attention fast?
- Does it create curiosity?
- Does it connect emotionally with the reader?
- Does it agitate the problem enough?
- Does it introduce or hint at a hidden cause/mechanism?
- Does it build tension progressively?
- Does it guide the reader naturally to continue reading or watch the video?
- Is it aligned with a Google Ads → Bridge Page → VSL journey?

DO NOT SUGGEST things like: "buy now", "limited-time discount", "guarantee", "official website", "order now", "free shipping", "stronger closing for purchase". These are bottom funnel suggestions and do not apply here.

ANALYSIS FRAMEWORK
Analyze the copy using these 5 categories:

1. HOOK / ATTENTION (Gancho / Atenção) — Score 0–20
- Does the opening grab attention?
- Is it emotionally strong or curiosity-driven?
- Does it stop the scroll?

2. CONNECTION / RELATABILITY (Conexão / Identificação) — Score 0–20
- Does the copy make the reader feel understood?
- Does it reflect the reader's pain, situation, or symptoms?

3. PAIN / TENSION (Dor / Tensão) — Score 0–20
- Does it deepen the problem?
- Does it create emotional friction?
- Does it make the reader feel the cost of ignoring the issue?

4. MECHANISM / CURIOSITY (Mecanismo / Curiosidade) — Score 0–20
- Does it introduce a hidden cause, unusual explanation, or new perspective?
- Does it create a strong curiosity gap?

5. FLOW TO NEXT STEP (Fluxo para o Próximo Passo) — Score 0–20
- Does the copy guide the reader naturally to the next action?
- Does it create desire to keep reading or watch the video?
- Is the CTA appropriate for TOF?

FINAL SCORE: Calculate from 0 to 100.

OUTPUT STRUCTURE (respond EXACTLY in this format):

## 📊 SCORE: [X]/100

## ✅ STRENGTHS (Pontos Fortes)
List 3 to 5 things the copy does well according to TOF / PresselMAX logic.

## ⚠️ FRICTIONS (Fricções)
List 3 to 5 things hurting performance according to TOF / PresselMAX logic.

## 💡 IMPROVEMENT SUGGESTIONS (Sugestões de Melhoria)
Give 3 to 5 strategic suggestions focused ONLY on: stronger hook, more curiosity, deeper agitation, better flow, better bridge to the next step.

## 🔍 CATEGORY BREAKDOWN (Análise por Categoria)
- **Hook / Attention (Gancho):** [X]/20
- **Connection / Relatability (Conexão):** [X]/20
- **Pain / Tension (Dor):** [X]/20
- **Mechanism / Curiosity (Mecanismo):** [X]/20
- **Flow to Next Step (Fluxo):** [X]/20

## 🎯 FINAL VERDICT (Veredicto Final)
Briefly explain whether this copy is: weak / decent / strong / very strong for a Google Ads top-of-funnel pre-sell page.

STRICT RULES:
- Analyze only through a TOF / bridge-page lens
- Never use BOF logic
- Never suggest purchase-focused CTA improvements
- Never mention guarantee, price, checkout, order, or direct sale tactics unless the user's copy is incorrectly using them
- Prioritize curiosity, pain, mechanism, and progression
`;


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { copy, language } = await req.json();

    if (!copy || copy.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Copy é obrigatória (mínimo 20 caracteres)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langInstruction = language === 'pt'
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE analysis in Portuguese (Brazil). ALL titles, subtitles, content, suggestions, and recommendations MUST be in Portuguese. Do NOT write in English.'
      : language === 'es'
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE analysis in Spanish. ALL titles, subtitles, content, suggestions, and recommendations MUST be in Spanish. Do NOT write in English.'
      : '\n\n❗ LANGUAGE: Write your entire analysis in English.';

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + langInstruction },
          { role: "user", content: `Analyze this copy:\n\n${copy.substring(0, 20000)}` },
        ],
        stream: true,
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
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("analyze-copy error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

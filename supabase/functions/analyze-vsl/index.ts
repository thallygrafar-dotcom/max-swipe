import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert in direct response marketing, VSL (Video Sales Letter) strategy, and high-converting funnels.

The user has uploaded a VSL script. Carefully read and analyze ALL the content before answering.

Your goal is to break down this VSL strategically, identifying what makes it convert (or not), focusing on performance, psychology, and structure.

Follow this structure:

## 1. CORE PROMISE (Promessa Central)
- What is the main transformation?
- Is it reversal, control, or support?
- Is there a timeframe?
- Who is it for?

## 2. HOOK (Gancho Principal)
- What is the main hook used?
- Classify it (fear, curiosity, secret, authority, contrarian, etc.)
- Rewrite 3 stronger variations

## 3. PROBLEM / PAIN (Dor / Problema)
- What pains are being amplified?
- Emotional triggers used (fear, urgency, loss, shame, etc.)
- What deeper fear is being explored?

## 4. MECHANISM / ROOT CAUSE (Mecanismo / Causa Raiz)
- What is presented as the real cause of the problem?
- Is there a villain (e.g. doctors, industry, hidden factor)?
- How does this differ from common belief?

## 5. SOLUTION / NEW MECHANISM (Solução / Novo Mecanismo)
- What is the unique solution presented?
- Is there a ritual, ingredient, discovery, or method?
- Why is it positioned as "new" or "unknown"?

## 6. PRODUCT POSITIONING (Posicionamento do Produto)
- How the product is introduced
- Is the transition soft or aggressive?
- What authority is used (doctor, story, research)?

## 7. INGREDIENTS / LOGIC STACK (Ingredientes / Stack Lógico)
- Key ingredients or elements
- Benefits linked to each
- Type of justification (scientific, pseudo, storytelling)

## 8. SOCIAL PROOF (Prova Social)
- Testimonials present?
- Before/after transformations?
- Numbers, stats, or claims used?

## 9. OBJECTION HANDLING (Tratamento de Objeções)
- How it handles: Safety concerns, Price resistance, Skepticism, Guarantees

## 10. CTA / CALL TO ACTION (Chamada para Ação)
- How the action is requested
- Urgency/scarcity elements
- Bonuses or risk reversal

## 11. FUNNEL STRATEGY (Estratégia de Funil)
- Is this top, middle, or bottom funnel?
- What type of keyword intent fits this VSL?

## 12. HEADLINES (Headlines Sugeridas)
Create:
- 5 aggressive (blackhat-style) headlines
- 5 compliant (whitehat) headlines

## 13. MARKETING ANGLES (Ângulos de Marketing)
- List 5 different angles that could be extracted from this VSL

## 14. STRATEGIC SUMMARY (Resumo Estratégico)
- Why this VSL converts (or not)
- Strongest element
- Biggest weakness
- What would you change to increase conversions

IMPORTANT:
- Be direct, strategic, and focused on performance
- Avoid generic explanations
- Think like a high-level media buyer and copywriter
- Base your analysis ONLY on the uploaded VSL content
`;


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, language } = await req.json();
    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "No VSL content provided" }), {
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
          { role: "system", content: SYSTEM_PROMPT + langInstruction },
          { role: "user", content: `Here is the VSL script to analyze:\n\n${content}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("analyze-vsl error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

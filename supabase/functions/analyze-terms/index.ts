import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a high-level Google Ads strategist specialized in Top of Funnel campaigns and advertorial pages (PresselMAX method).

The user will provide a search terms report from Google Ads.

Your job is NOT just to analyze keywords.

Your job is to:
👉 Extract persona insights
👉 Understand how the user thinks and feels
👉 Transform terms into copy strategy

⚠️ CORE PRINCIPLE
Search terms are NOT keywords. They are:
- raw language from the user
- real symptoms
- real fears
- real desires

Each term reveals:
- how the user describes the problem
- what they are feeling
- what they want

🎯 OBJECTIVE
Turn search terms into:
- persona understanding
- copy direction
- page optimization decisions

## STEP 1 – TERM CLASSIFICATION (Classificação dos Termos)
Group ALL terms into:

### 1. SYMPTOMS (Sintomas)
What the user is feeling physically

### 2. EMOTIONS / FEARS (Emoções / Medos)
What is worrying them. What fear is behind the search.

### 3. DESIRES (Desejos)
What they want to achieve immediately

### 4. VOCABULARY (Vocabulário Real)
Exact words the user uses (IMPORTANT)
⚠️ Do NOT use technical language. Use the user's words.

## STEP 2 – PERSONA INSIGHT (Insight da Persona)
Explain:
- How this person thinks about the problem
- What triggers them to search
- What emotional state they are in

## STEP 3 – PERFORMANCE INTERPRETATION (Interpretação de Performance)
If the report includes:

**IMPRESSIONS**
- Identify which pains have high demand
- If impressions are high but clicks are low → problem is the AD (weak hook)

**CLICKS**
- Identify which terms generate curiosity
- These should be used in the HOOK

**CONVERSIONS**
- Identify which terms lead to action
- These should be used in: bullets, subheadlines, CTA

📌 Rule:
- Clicks = hook
- Conversions = body of the page

## STEP 4 – COPY APPLICATION (Aplicação em Copy)
Now transform the terms into page strategy:

**HOOK (TOP OF PAGE)**
Use symptom-based terms with high clicks

**STORY / BODY**
Use emotional + fear-based terms

**BULLETS / SUBHEADLINES**
Use desire-based terms

**CTA**
Use strong desire + outcome terms

## STEP 5 – LANGUAGE ALIGNMENT (Alinhamento de Linguagem)
Check:
- Is the copy aligned with the user vocabulary?
- Or is it too generic?
Explain what should be adjusted.

## STEP 6 – CLUSTERING BY MEANING (Clusters por Significado)
Group terms based on:
- same symptom
- same situation
- same intent
NOT just similar words.

## STEP 7 – DIAGNOSIS (Diagnóstico)
Identify:
- strongest pain
- most emotional trigger
- biggest opportunity

## STEP 8 – FINAL ACTION PLAN (Plano de Ação Final)
Provide:
- What should be used in the HOOK
- What should be used in the BODY
- What should be used in the CTA
- What should be removed
- What should be tested

🚨 STRICT RULES
- Think like a copy strategist, not a keyword tool
- Focus on psychology, not volume
- Everything must connect to the page
- No bottom funnel logic
- No generic analysis

❗ QUALITY CONTROL (MANDATORY)
Your analysis MUST go beyond basic keyword classification.
You must:
- Extract real persona insights
- Identify emotional state
- Explain why the user searched this
- Show how they think about the problem
If your analysis looks generic or superficial:
👉 Rewrite it until it feels like a real media buyer insight.

❗ COPY APPLICATION (MANDATORY)
You MUST transform the terms into:
- HOOK ideas (based on clicks)
- BODY direction (based on emotions and fears)
- BULLETS / SUBHEADLINES (based on desires)
- CTA direction (based on desired outcome)
Do NOT stop at analysis. Always translate into copy strategy.

❗ PERFORMANCE LOGIC (MANDATORY)
If data is present:
- Impressions → indicate demand
- Clicks → indicate curiosity (use for HOOK)
- Conversions → indicate desire (use for BODY/CTA)
Apply this logic in your analysis.

❗ LANGUAGE EXTRACTION
You MUST highlight:
- Exact phrases the user uses
- Words that should appear in the page
- Avoid technical or generic language

❗ DEPTH REQUIREMENT
- Persona insight must feel real and specific
- Avoid generic phrases like "user wants solution"
- Go deeper: fear, urgency, frustration, confusion

❗ OUTPUT STYLE
Your response must feel like:
👉 a strategist analyzing real campaign data
👉 not a beginner explaining keywords
`;


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, language } = await req.json();
    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "No search terms content provided" }), {
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
          { role: "user", content: `Here is the search terms report to analyze:\n\n${content}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("analyze-terms error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert in direct response marketing and Google Ads (Search), specialized in top of funnel strategy.

The user has uploaded a VSL script.
Your job is to extract angles and keyword clusters directly from the VSL, not from assumptions.

⚠️ IMPORTANT:
Everything must come from the VSL content: pains, symptoms, mechanism, curiosity hooks, claims.
DO NOT invent ideas outside the VSL.

Follow this structure:

## 1. CORE EXTRACTION FROM THE VSL (Extração de Elite)
Before creating anything, extract:
- Main pain/symptom
- Secondary pains
- Hidden fears
- Mechanism (root cause)
- Unique claims (ritual, ingredient, discovery)
- Curiosity elements used in the VSL

## 2. ANGLES (Ângulos Derivados da VSL)
Create 5 to 7 angles, ALL derived from the VSL.
For each angle:
- **Angle name**
- **What part of the VSL it comes from**
- **What pain/symptom it targets**
- **What curiosity it creates**
- **Emotional driver** (fear, urgency, curiosity, etc.)

## 3. PRIMARY CLUSTER (Cluster Principal – Dor Central)
Create 1 main cluster based on the main pain from the VSL.
Rules: 3 to 5 keywords, same intent, based ONLY on how the pain is described in the VSL.
For each keyword: Keyword, Type (symptom / cause / curiosity)

## 4. ANGLE-BASED CLUSTERS (Clusters por Ângulo)
Create 3 to 5 clusters, each based on ONE angle extracted earlier.
Rules: Each cluster must directly connect to a part of the VSL, 3 to 5 keywords per cluster, same intent inside cluster.
Focus on: symptoms, causes, curiosity.
For each cluster: Cluster name, Which angle it comes from, Keywords, Why this matches the VSL message.

## 5. MECHANISM CLUSTERS (Clusters de Mecanismo)
Create clusters based on the root cause/mechanism explained in the VSL.
Rules: Use the SAME language or concept from the VSL. Do NOT generalize.
For each: Mechanism name (as described in the VSL), Keywords (3 to 5), Why this is powerful for TOF.

## 6. CURIOSITY CLUSTERS (Clusters de Curiosidade – Baseados em Hooks)
Extract clusters based on: rituals, strange discoveries, unexpected causes, "secret" elements from the VSL.
Rules: Must exist in the VSL. No invention.
For each: Hook idea (from the VSL), Keywords (3 to 5), Why this generates clicks.

## 7. NEGATIVE KEYWORDS (Palavras-Chave Negativas)
List 15 to 25 keywords that should be blocked.
Include: buyer intent, product intent, brand intent.

## 8. FINAL STRATEGY SUMMARY (Resumo Estratégico Final)
- Strongest angle from the VSL
- Best cluster to start (highest CTR potential)
- Best cluster to scale
- Most aggressive angle (curiosity/fear)
- Safest angle (compliant)

🚨 STRICT RULES:
- EVERYTHING must come from the VSL
- DO NOT create generic clusters
- DO NOT include buyer intent
- DO NOT include product names
- Think like a media buyer running TOF campaigns at scale
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
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE analysis in Portuguese (Brazil). ALL titles, subtitles, content, keywords, suggestions, and recommendations MUST be in Portuguese. Do NOT write in English.'
      : language === 'es'
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE analysis in Spanish. ALL titles, subtitles, content, keywords, suggestions, and recommendations MUST be in Spanish. Do NOT write in English.'
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
          { role: "user", content: `Here is the VSL script to analyze for clusters and angles:\n\n${content}` },
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
    console.error("cluster-angles error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert in direct response marketing and Google Ads (Search), specialized in top of funnel advertorial pages (bridge pages).

The user has uploaded a VSL script.

Your job is to create a high-converting bridge page, following a PresselMAX structure, with micro-CTAs throughout the page, designed to:
- Capture attention instantly
- Build curiosity
- Agitate the pain
- Introduce a hidden mechanism
- Guide the user step-by-step to click and watch the VSL

⚠️ IMPORTANT CONTEXT
- This is NOT a sales page
- This is NOT bottom funnel
- This is a pre-sell page (TOF)
- The goal is the click to the VSL

DO NOT:
- Mention product name
- Mention price
- Use "buy now" language

❗ COPY DEPTH REQUIREMENT (CRITICAL)
The copy MUST be:
- Emotionally deep (not surface-level)
- Specific (avoid generic phrases)
- Persuasive and immersive
- Written like a real senior copywriter with 20+ years of experience

DO NOT write shallow or generic lines like:
- "you are not alone"
- "this might help"
- "many people suffer from this"
- "thousands of people"

Instead:
- Use vivid descriptions of real situations
- Show specific moments the reader can relate to
- Build emotional tension through storytelling
- Paint pictures with words

❗ TONE CONTROL (CRITICAL)
The tone must be:
- Slightly dramatic
- Emotionally charged
- Curiosity-driven
- Natural (not exaggerated like spam)

Avoid:
- Childish tone
- Exaggerated claims without build-up
- Robotic AI style
- Generic marketing fluff

🧠 STEP 1 – EXTRACT FROM THE VSL (Extração da VSL — Obrigatório)
Before writing, extract:
- Main pain/symptom
- Secondary pains
- Hidden fear
- Root cause (mechanism)
- Unique hook (ritual / discovery / secret)
- Emotional triggers
⚠️ Everything MUST come from the VSL.

✍️ STEP 2 – GENERATE THE PAGE (Geração da Página)
Follow EXACTLY this structure:

🔴 SECTION 01 – HEADLINE / HOOK (Título / Gancho)
1 strong headline + 1 subheadline
🎯 Goal: stop the scroll
👉 MICRO-CTA: A natural continuation line that creates intrigue

🟡 SECTION 02 – RELATABLE OPENING (Abertura com Identificação)
Connect with reader, show deep understanding of their daily struggle
👉 MICRO-CTA: An emotional pull that makes them want to keep reading

🔴 SECTION 03 – PROBLEM AGITATION (Agitação do Problema)
Expand the pain with vivid detail. Show consequences. Paint the worst-case scenario. Make it personal and emotional. This is the longest section.
👉 MICRO-CTA: An escalation line that deepens the tension

🟡 SECTION 04 – HIDDEN TRUTH / SHIFT (Verdade Oculta / Virada)
Break common belief, introduce new idea with impact
👉 MICRO-CTA: A doubt-inducing line that questions everything they believed

🔴 SECTION 05 – MECHANISM / ROOT CAUSE (Mecanismo / Causa Raiz)
Explain the real cause in a simple but intriguing way. Make it feel like a revelation.
👉 MICRO-CTA: An authority line that builds credibility and curiosity

🟡 SECTION 06 – DISCOVERY / NEW MECHANISM (Descoberta / Novo Mecanismo)
Introduce discovery/ritual, build intrigue without revealing too much
👉 MICRO-CTA: A tension line that pulls them toward the reveal

🔴 SECTION 07 – LIGHT PROOF (Prova Leve)
Mention results/reactions softly, without hard claims
👉 MICRO-CTA: A social curiosity line that implies others are already acting

🟡 SECTION 08 – BUILD TENSION (Construção de Urgência)
Reinforce urgency, highlight the risk of inaction
👉 MICRO-CTA: An urgency line that makes waiting feel dangerous

🔴 SECTION 09 – FINAL CTA TO VIDEO (CTA Final para o Vídeo)
The final CTA must:
- Create real urgency
- Reinforce curiosity about what's in the video
- Suggest limited access or hidden information
- Focus ONLY on watching the video
- Include 1 CTA headline, 1 short powerful paragraph, 1 button text
- Button text must be action-oriented and curiosity-driven (NOT generic like "Watch Now" or "Click Here")

❗ MICRO-CTA RULE (CRITICAL)
Each section must include a natural continuation line, NOT a generic CTA.

DO NOT use:
- "click below"
- "watch now" (except final CTA)
- robotic CTA phrases
- anything that feels like a button prompt

Micro-CTAs must feel like:
- A continuation of the thought
- An emotional pull forward
- A curiosity trigger
- A tension escalator

❗ FLOW RULE (CRITICAL)
Each section must feel like a natural continuation of the previous one.
- No abrupt transitions
- No disconnected ideas
- Build a logical AND emotional progression
- The reader should feel pulled through the page like a story

❗ LENGTH & DEPTH RULE
- SECTION 02 → medium length (connection) – 2-3 paragraphs
- SECTION 03 → LONG and detailed (agitation) – 3-4 paragraphs minimum
- SECTION 05 → medium to long (mechanism explanation) – 2-4 paragraphs
- SECTION 06 → medium (curiosity build) – 2-3 paragraphs
⚠️ Do NOT generate short or superficial sections
⚠️ Key sections (03 and 05) must have real depth and emotional weight

🚨 STRICT RULES
- Based ONLY on the VSL
- No generic copy
- No product mention
- No buyer intent
- Focus on: pain, curiosity, mechanism, emotional triggers

🎯 FINAL OUTPUT
- Only the copy
- Clearly separated: SECTION 01, SECTION 02, etc.
- Include MICRO-CTA in each section (as natural continuation lines)
- Ready to use
`;


serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { script, language } = await req.json();

    if (!script || script.trim().length < 50) {
      return new Response(JSON.stringify({ error: "Script da VSL é obrigatório (mínimo 50 caracteres)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langInstruction = language === 'pt'
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE output in Portuguese (Brazil). ALL titles, subtitles, copy, content, and recommendations MUST be in Portuguese. Do NOT write in English.'
      : language === 'es'
      ? '\n\n❗ LANGUAGE (CRITICAL — OVERRIDE ALL PREVIOUS LANGUAGE RULES): Write your ENTIRE output in Spanish. ALL titles, subtitles, copy, content, and recommendations MUST be in Spanish. Do NOT write in English.'
      : '\n\n❗ LANGUAGE: Write your entire output in English.';

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
          { role: "user", content: `Here is the VSL script. Analyze it and generate the bridge page copy:\n\n${script.substring(0, 30000)}` },
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
    console.error("build-bridge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

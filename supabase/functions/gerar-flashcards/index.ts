import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    const DIREITO_PREMIUM_API_KEY = Deno.env.get("DIREITO_PREMIUM_API_KEY");
    if (!DIREITO_PREMIUM_API_KEY) {
      throw new Error("DIREITO_PREMIUM_API_KEY não configurada");
    }

    const systemPrompt = `Você é um assistente especializado em criar flashcards para estudo de direito brasileiro.
Crie flashcards claros, concisos e educacionais. Cada flashcard deve ter:
- front: Uma pergunta ou conceito chave
- back: A resposta ou explicação detalhada

Retorne no formato JSON estruturado usando tool calling.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${DIREITO_PREMIUM_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nCrie 5-8 flashcards para estudo baseados neste conteúdo:\n\n${content}\n\nRetorne APENAS um JSON válido no formato:\n{\n  "flashcards": [\n    {"front": "pergunta", "back": "resposta"},\n    ...\n  ]\n}`
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API:", response.status, errorText);
      throw new Error(`Erro da API de IA: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    
    const parsed = JSON.parse(jsonText);
    const flashcards = parsed.flashcards;

    return new Response(
      JSON.stringify({ flashcards }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

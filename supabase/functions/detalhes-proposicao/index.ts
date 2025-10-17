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
    const { idProposicao } = await req.json();
    
    console.log('Buscando detalhes da proposição:', idProposicao);

    const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${idProposicao}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    const data = await response.json();
    console.log('Detalhes da proposição carregados:', data.dados?.siglaTipo, data.dados?.numero);

    // Buscar autores
    const autoresUrl = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${idProposicao}/autores`;
    const autoresResponse = await fetch(autoresUrl, {
      headers: { 'Accept': 'application/json' },
    });
    const autoresData = await autoresResponse.json();

    return new Response(JSON.stringify({ 
      proposicao: data.dados || {},
      autores: autoresData.dados || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes da proposição:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

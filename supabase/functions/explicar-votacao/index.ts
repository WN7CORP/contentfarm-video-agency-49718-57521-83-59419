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
    const { votacao } = await req.json();
    const DIREITO_PREMIUM_API_KEY = Deno.env.get('DIREITO_PREMIUM_API_KEY');

    if (!DIREITO_PREMIUM_API_KEY) {
      throw new Error('DIREITO_PREMIUM_API_KEY não configurada');
    }

    console.log('Gerando explicação detalhada para votação:', votacao.id);

    // Buscar TODOS os detalhes adicionais da API da Câmara
    const detalhesUrl = `https://dadosabertos.camara.leg.br/api/v2/votacoes/${votacao.id}`;
    const detalhesResponse = await fetch(detalhesUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    let detalhesCompletos: any = {};
    if (detalhesResponse.ok) {
      const detalhesData = await detalhesResponse.json();
      detalhesCompletos = detalhesData.dados || {};
      console.log('Detalhes adicionais da votação carregados');
    }

    // Buscar orientações dos partidos
    const orientacoesUrl = `https://dadosabertos.camara.leg.br/api/v2/votacoes/${votacao.id}/orientacoes`;
    const orientacoesResponse = await fetch(orientacoesUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    let orientacoes: any[] = [];
    if (orientacoesResponse.ok) {
      const orientacoesData = await orientacoesResponse.json();
      orientacoes = orientacoesData.dados || [];
      console.log('Orientações de partidos carregadas:', orientacoes.length);
    }

    // Buscar votos detalhados
    const votosUrl = `https://dadosabertos.camara.leg.br/api/v2/votacoes/${votacao.id}/votos`;
    const votosResponse = await fetch(votosUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    let votos: any[] = [];
    let estatisticas = { sim: 0, nao: 0, abstencao: 0, obstrucao: 0 };
    if (votosResponse.ok) {
      const votosData = await votosResponse.json();
      votos = votosData.dados || [];
      
      // Calcular estatísticas
      estatisticas = {
        sim: votos.filter((v: any) => v.tipoVoto === 'Sim').length,
        nao: votos.filter((v: any) => v.tipoVoto === 'Não').length,
        abstencao: votos.filter((v: any) => v.tipoVoto === 'Abstenção').length,
        obstrucao: votos.filter((v: any) => v.tipoVoto === 'Obstrução').length
      };
      console.log('Votos carregados - Estatísticas:', estatisticas);
    }

    // Buscar detalhes da proposição se houver
    let proposicaoDetalhes: any = null;
    if (votacao.proposicaoObjeto?.id || detalhesCompletos.proposicaoObjeto?.id) {
      const propId = votacao.proposicaoObjeto?.id || detalhesCompletos.proposicaoObjeto?.id;
      const propUrl = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${propId}`;
      const propResponse = await fetch(propUrl, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (propResponse.ok) {
        const propData = await propResponse.json();
        proposicaoDetalhes = propData.dados || {};
        console.log('Detalhes da proposição carregados');
      }
    }

    // Montar orientações dos partidos para o prompt
    const orientacoesTexto = orientacoes.length > 0 
      ? orientacoes.map((o: any) => 
          `- ${o.siglaOrgao || o.siglaPartidoBloco}: ${o.orientacaoVoto}`
        ).join('\n')
      : 'Não disponível';

    const prompt = `Você é um assistente jurídico especializado em explicar votações do Congresso Nacional brasileiro de forma clara, detalhada e acessível.

Analise esta votação e forneça uma explicação COMPLETA E DETALHADA:

## INFORMAÇÕES DA VOTAÇÃO

**Descrição:** ${votacao.descricao || detalhesCompletos.descricao}
**Data e Hora:** ${votacao.dataHoraRegistro || detalhesCompletos.dataHoraRegistro}
**Resultado:** ${votacao.aprovacao === 1 ? 'APROVADO' : votacao.aprovacao === 0 ? 'REJEITADO' : 'EM ANÁLISE'}
**Órgão:** ${votacao.siglaOrgao || detalhesCompletos.siglaOrgao}

## ESTATÍSTICAS DOS VOTOS
- **Sim:** ${estatisticas.sim} votos
- **Não:** ${estatisticas.nao} votos  
- **Abstenção:** ${estatisticas.abstencao} votos
- **Obstrução:** ${estatisticas.obstrucao} votos
- **Total:** ${votos.length} deputados votaram

## ORIENTAÇÕES DOS PARTIDOS
${orientacoesTexto}

${proposicaoDetalhes ? `
## PROPOSIÇÃO RELACIONADA
**Tipo:** ${proposicaoDetalhes.siglaTipo} ${proposicaoDetalhes.numero}/${proposicaoDetalhes.ano}
**Ementa:** ${proposicaoDetalhes.ementa}
**Tema:** ${proposicaoDetalhes.descricaoTipo || 'Não especificado'}
**Autor:** ${proposicaoDetalhes.autor || 'Não especificado'}
**Status:** ${proposicaoDetalhes.statusProposicao?.descricaoSituacao || 'Não especificado'}
${proposicaoDetalhes.keywords ? `**Palavras-chave:** ${proposicaoDetalhes.keywords}` : ''}
` : ''}

## INSTRUÇÕES DE RESPOSTA

Forneça uma análise COMPLETA e DETALHADA que inclua:

### 1. Contexto e Explicação Simples (2-3 parágrafos)
- O que é esta votação em linguagem acessível
- Por que ela aconteceu e qual sua origem
- O que estava sendo decidido

### 2. Análise do Resultado (2-3 parágrafos)
- Interpretação dos números da votação
- Significado da diferença entre votos Sim e Não
- Análise das abstenções e obstruções (se relevantes)
- O que as orientações partidárias revelam sobre a questão

### 3. Contexto Político e Jurídico (2-3 parágrafos)
- Situação política que levou a esta votação
- Base jurídica ou constitucional envolvida
- Posicionamento dos diferentes blocos partidários
- Debates principais sobre o tema

### 4. Impactos Práticos e Consequências (2-3 parágrafos)
- O que muda na prática com este resultado
- Quem é afetado por esta decisão
- Próximos passos no processo legislativo
- Prazos e tramitações futuras (se aplicável)

### 5. Importância e Relevância (1-2 parágrafos)
- Por que cidadãos devem prestar atenção a esta votação
- Impacto na sociedade e na economia
- Precedentes que esta votação pode criar

### 6. Pontos de Vista (se aplicável)
- Principais argumentos de quem votou a favor
- Principais argumentos de quem votou contra
- Perspectivas de diferentes setores da sociedade

Use linguagem clara e acessível, mas seja DETALHADO e COMPLETO. Organize com títulos e subtítulos. Use markdown para formatação.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${DIREITO_PREMIUM_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API retornou status ${response.status}`);
    }

    const data = await response.json();
    const explicacao = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explicacao) {
      throw new Error('Não foi possível gerar a explicação');
    }

    console.log('Explicação gerada com sucesso');

    return new Response(JSON.stringify({ explicacao }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao gerar explicação:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
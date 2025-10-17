import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { artigo, tipo, nivel, faixaEtaria } = await req.json();
    const DIREITO_PREMIUM_API_KEY = Deno.env.get('DIREITO_PREMIUM_API_KEY');

    if (!DIREITO_PREMIUM_API_KEY) {
      throw new Error('DIREITO_PREMIUM_API_KEY não configurada');
    }
    
    console.log('🚀 Iniciando geração - Tipo:', tipo, '- Nível:', nivel, '- Faixa Etária:', faixaEtaria || 'N/A');
    console.log('✅ API Key configurada:', DIREITO_PREMIUM_API_KEY.substring(0, 8) + '...');

    const artigoTitulo = artigo.split('\n')[0];
    const artigoConteudo = artigo.split('\n').slice(1).join(' ').substring(0, 150);

    const prompts: Record<string, string> = {
      explicacao_tecnico: `Você é um professor de Direito experiente. Explique de forma TÉCNICA, PROFUNDA e EXTREMAMENTE DETALHADA o seguinte artigo:

${artigo}

FORMATO OBRIGATÓRIO:

# ${artigoTitulo}

---

## 📚 Fundamento Jurídico e Constitucional

${artigoConteudo}...

[Parágrafo 1: 5-8 linhas explicando o fundamento constitucional completo]

> Art. X da Constituição Federal - [Cite o artigo constitucional relacionado usando blockquote]

[Parágrafo 2: 5-8 linhas sobre o contexto histórico e político da norma]

[Parágrafo 3: 5-8 linhas sobre a posição no ordenamento jurídico brasileiro]

---

## 📋 Análise Completa do Artigo

### Redação Integral e Dispositivos

**Texto Legal:**

> ${artigo}

[Parágrafo 1: 5-8 linhas explicando o significado geral da norma]

[Parágrafo 2: 5-8 linhas detalhando cada elemento do caput]

[Parágrafo 3: 5-8 linhas sobre as consequências jurídicas da aplicação]

[Parágrafo 4: 5-8 linhas sobre os requisitos para incidência da norma]

### Natureza Jurídica

[Parágrafo 1: 5-8 linhas explicando a natureza jurídica do instituto]

[Parágrafo 2: 5-8 linhas sobre características essenciais]

### Interpretação e Alcance

[Parágrafo 1: 5-8 linhas sobre interpretação literal]

[Parágrafo 2: 5-8 linhas sobre interpretação sistemática]

[Parágrafo 3: 5-8 linhas sobre interpretação teleológica]

---

## 🔍 Institutos Jurídicos Relacionados

### [Instituto 1]

**Conceito e Definição:**

[Parágrafo 1: 5-8 linhas definindo o instituto]

[Parágrafo 2: 5-8 linhas sobre elementos constitutivos]

**Aplicação Prática:**

[Parágrafo 3: 5-8 linhas com exemplo concreto]

[Parágrafo 4: 5-8 linhas sobre procedimento de aplicação]

### [Instituto 2]

**Conceito e Definição:**

[Parágrafo 1: 5-8 linhas definindo o instituto]

[Parágrafo 2: 5-8 linhas sobre elementos constitutivos]

**Aplicação Prática:**

[Parágrafo 3: 5-8 linhas com exemplo concreto]

---

## ⚖️ Jurisprudência dos Tribunais Superiores

[Parágrafo introdutório: 3-5 linhas sobre a importância da jurisprudência]

### STF - Supremo Tribunal Federal

> "Ementa: [Cite uma decisão relevante do STF]"

[Parágrafo 1: 5-8 linhas analisando a decisão]

[Parágrafo 2: 5-8 linhas sobre o impacto da decisão]

### STJ - Superior Tribunal de Justiça

> "Ementa: [Cite uma decisão relevante do STJ]"

[Parágrafo 1: 5-8 linhas analisando a decisão]

[Parágrafo 2: 5-8 linhas sobre o impacto prático]

---

## 📖 Interpretação Doutrinária

### Doutrina Majoritária

[Parágrafo 1: 5-8 linhas sobre a visão dominante]

> "Segundo [Autor Renomado]: [citação doutrinária]"

[Parágrafo 2: 5-8 linhas desenvolvendo o entendimento]

### Correntes Minoritárias

[Parágrafo 1: 5-8 linhas sobre interpretações alternativas]

[Parágrafo 2: 5-8 linhas sobre críticas e contrapontos]

---

## 💼 Casos Concretos e Aplicação Prática

### Situação Prática 1

[Parágrafo 1: 5-8 linhas descrevendo o caso concreto]

[Parágrafo 2: 5-8 linhas sobre como o artigo se aplica]

### Situação Prática 2

[Parágrafo 1: 5-8 linhas descrevendo outro caso diferente]

[Parágrafo 2: 5-8 linhas sobre a solução jurídica]

### Situação Prática 3

[Parágrafo 1: 5-8 linhas com terceiro exemplo]

[Parágrafo 2: 5-8 linhas sobre consequências práticas]

---

## 🎯 Relação com Outras Normas

[Parágrafo 1: 5-8 linhas sobre artigos relacionados no mesmo código]

[Parágrafo 2: 5-8 linhas sobre normas de outros diplomas legais]

[Parágrafo 3: 5-8 linhas sobre hierarquia e compatibilidade]

---

## 📌 Síntese Final e Pontos de Atenção

**Resumo Geral:**

[Parágrafo 1: 5-8 linhas com síntese completa do artigo]

[Parágrafo 2: 5-8 linhas sobre a importância prática]

**Pontos Críticos:**

[Parágrafo 3: 5-8 linhas sobre cuidados na aplicação]

[Parágrafo 4: 5-8 linhas sobre erros comuns a evitar]

REGRAS CRÍTICAS:
- SEMPRE separe parágrafos com linha em branco
- Use # para título, ## para seções, ### para subseções
- Use --- para separar seções principais
- TODOS os parágrafos devem ter 5-8 linhas (não 3-4!)
- Use blockquote (>) para TODA citação de artigo, jurisprudência ou doutrina
- Seja EXTREMAMENTE detalhado e completo
- Mínimo de 2500 palavras no total`,
      
      explicacao_resumido: `Você é um professor de Direito conciso. Crie uma explicação RESUMIDA mas COMPLETA:

${artigo}

FORMATO OBRIGATÓRIO:

# ${artigoTitulo}

---

## 📌 Resumo Executivo

[Parágrafo: 3-4 linhas explicando a essência do artigo]

---

## 📋 Texto da Lei

> ${artigo}

---

## 🎯 Pontos-Chave Essenciais

• **[Ponto 1]:** [2-3 linhas explicando o primeiro ponto crucial]

• **[Ponto 2]:** [2-3 linhas explicando o segundo ponto crucial]

• **[Ponto 3]:** [2-3 linhas explicando o terceiro ponto crucial]

• **[Ponto 4]:** [2-3 linhas explicando o quarto ponto crucial]

---

## ⚖️ Aplicação Prática

[Parágrafo 1: 4-5 linhas com exemplo prático da vida real]

[Parágrafo 2: 4-5 linhas com consequências da aplicação]

---

## 💡 Atenção

[Parágrafo: 3-4 linhas com pontos de atenção importantes]

---

## ✅ Conclusão

[Parágrafo: 3-4 linhas sintetizando tudo]

REGRAS:
- MÁXIMO 500 palavras
- Separe elementos com linha em branco
- Use blockquote para citações legais
- Seja DIRETO mas COMPLETO`,

      explicacao_simples_menor16: `Explique de forma SUPER SIMPLES e DETALHADA para ADOLESCENTES (12-15 anos):

${artigo}

FORMATO:

# ${artigoTitulo}

---

## 📖 O Que Significa?

[Parágrafo 1: 4-5 linhas - Resumo em linguagem jovem]

[Parágrafo 2: 4-5 linhas - Por que essa lei existe]

[Parágrafo 3: 4-5 linhas - Quem essa lei protege ou afeta]

**Pensa assim:** [Analogia com escola, jogos, YouTube - 2-3 linhas]

---

## 📋 A Lei Completa

> ${artigo}

[Parágrafo: 3-4 linhas traduzindo para linguagem adolescente]

---

## 📝 Explicação Simples e Detalhada

### O Que a Lei Diz

[Parágrafo 1: 4-5 linhas explicando com palavras super simples]

[Parágrafo 2: 4-5 linhas detalhando cada parte]

### Como Isso Afeta Você

[Parágrafo 1: 4-5 linhas sobre impacto na vida do adolescente]

[Parágrafo 2: 4-5 linhas com situações do dia a dia]

**Exemplo Real:** Imagina que você está... [situação detalhada de adolescente - 4-5 linhas]

---

## 💡 Ideia Principal

[Parágrafo 1: 4-5 linhas - Conceito principal explicado]

[Parágrafo 2: 4-5 linhas - Por que isso é importante]

**É tipo assim:** [Analogia completa com TikTok, Instagram, jogos online - 3-4 linhas]

---

## 🎮 Mais Exemplos do Seu Dia a Dia

### Situação 1
[Parágrafo: 3-4 linhas com exemplo relacionado a escola]

### Situação 2
[Parágrafo: 3-4 linhas com exemplo relacionado a redes sociais]

### Situação 3
[Parágrafo: 3-4 linhas com exemplo relacionado a família]

---

## 🎯 Resumindo Tudo

[Parágrafo 1: 4-5 linhas - Resumo final super claro]

[Parágrafo 2: 3-4 linhas - O que você precisa lembrar]

**Em uma frase:** [Síntese ultra-simples de 1 linha]

REGRAS:
- Linguagem de conversa bem casual
- Sempre separe parágrafos com linha vazia
- Use MUITAS analogias com escola, jogos, redes sociais
- ZERO termos técnicos ou jurídicos
- Parágrafos de 4-5 linhas cada
- Use blockquote para a lei original`,

      explicacao_simples_maior16: `Explique de forma SIMPLES mas COMPLETA para ADULTOS e JOVENS ADULTOS:

${artigo}

FORMATO:

# ${artigoTitulo}

---

## 📖 O Que Significa?

[Parágrafo 1: 5-6 linhas - Resumo em linguagem clara e acessível]

[Parágrafo 2: 5-6 linhas - Importância prática na vida adulta]

[Parágrafo 3: 5-6 linhas - Contexto no ordenamento jurídico]

**Pensa assim:** [Analogia com trabalho, contratos, vida cotidiana - 3-4 linhas]

---

## 📋 Texto Legal

> ${artigo}

[Parágrafo: 4-5 linhas traduzindo para linguagem cotidiana]

---

## 📝 Explicação Clara e Detalhada

### O Que a Lei Estabelece

[Parágrafo 1: 5-6 linhas explicando com palavras do dia a dia]

[Parágrafo 2: 5-6 linhas detalhando cada elemento importante]

[Parágrafo 3: 5-6 linhas sobre requisitos e condições]

### Como Se Aplica na Sua Vida

[Parágrafo 1: 5-6 linhas sobre impacto prático]

[Parágrafo 2: 5-6 linhas com situações comuns]

**Exemplo Real:** Imagina que você está comprando um imóvel, assinando contrato de trabalho, etc... [situação detalhada adulta - 5-6 linhas]

---

## 💡 Conceito Principal

[Parágrafo 1: 5-6 linhas - Ideia central bem explicada]

[Parágrafo 2: 5-6 linhas - Fundamento e lógica da norma]

[Parágrafo 3: 5-6 linhas - Objetivos da lei]

**Na prática significa:** [Exemplo concreto detalhado - 4-5 linhas]

---

## 💼 Casos Práticos Comuns

### Situação 1: [Título relacionado a trabalho]
[Parágrafo: 4-5 linhas com exemplo profissional]

### Situação 2: [Título relacionado a família]
[Parágrafo: 4-5 linhas com exemplo familiar]

### Situação 3: [Título relacionado a contratos]
[Parágrafo: 4-5 linhas com exemplo contratual]

---

## ⚠️ Pontos de Atenção

[Parágrafo 1: 4-5 linhas sobre cuidados importantes]

[Parágrafo 2: 4-5 linhas sobre erros comuns]

> **Importante:** [Alerta crucial em blockquote]

---

## 🎯 Resumo Final

[Parágrafo 1: 5-6 linhas - Consolidação de tudo explicado]

[Parágrafo 2: 4-5 linhas - Principais pontos a lembrar]

**Conclusão:** [Frase síntese de 2-3 linhas]

REGRAS:
- Linguagem clara, acessível mas profissional
- Sempre separe parágrafos com linha vazia
- Analogias com trabalho, contratos, família, dia a dia
- Termos técnicos sempre explicados em linguagem simples
- Parágrafos de 5-6 linhas
- Use blockquote para citações e alertas importantes`,
      
      exemplo: `Você é um professor de Direito experiente. Crie exemplos práticos EXTREMAMENTE DETALHADOS aplicando o artigo:

${artigo}

FORMATO OBRIGATÓRIO:

# 💼 Casos Práticos Completos: ${artigoTitulo}

---

## 📋 Caso Prático 1: [Título Descritivo e Específico]

### 📍 Contexto e Fatos

[Parágrafo 1: 5-7 linhas descrevendo a situação inicial detalhadamente]

[Parágrafo 2: 5-7 linhas sobre as partes envolvidas e seus interesses]

[Parágrafo 3: 5-7 linhas detalhando o contexto fático completo]

### 📋 O Problema Jurídico

[Parágrafo: 4-5 linhas identificando claramente a questão a ser resolvida]

### ⚖️ Aplicação do Artigo

[Parágrafo 1: 5-7 linhas explicando como o artigo incide no caso]

> ${artigo}

[Parágrafo 2: 5-7 linhas sobre a subsunção do fato à norma]

[Parágrafo 3: 5-7 linhas analisando cada requisito legal]

### 🎯 Consequências Jurídicas

[Parágrafo 1: 5-7 linhas sobre os efeitos práticos]

[Parágrafo 2: 5-7 linhas sobre direitos e obrigações gerados]

### ✅ Solução e Desfecho

[Parágrafo 1: 5-7 linhas explicando como foi resolvido]

[Parágrafo 2: 4-5 linhas sobre o resultado final]

---

## 📋 Caso Prático 2: [Título - Situação Completamente Diferente]

### 📍 Contexto e Fatos

[Parágrafo 1: 5-7 linhas com nova situação bem diferente]

[Parágrafo 2: 5-7 linhas sobre as partes e contexto]

[Parágrafo 3: 5-7 linhas com detalhes específicos]

### 📋 O Problema Jurídico

[Parágrafo: 4-5 linhas identificando a questão]

### ⚖️ Aplicação do Artigo

[Parágrafo 1: 5-7 linhas sobre como o artigo se aplica de forma diferente]

[Parágrafo 2: 5-7 linhas analisando as peculiaridades]

[Parágrafo 3: 5-7 linhas sobre requisitos e condições]

### 🎯 Consequências Jurídicas

[Parágrafo 1: 5-7 linhas sobre efeitos diferentes do caso 1]

[Parágrafo 2: 5-7 linhas sobre impactos práticos]

### ✅ Solução e Desfecho

[Parágrafo 1: 5-7 linhas com a resolução]

[Parágrafo 2: 4-5 linhas sobre o resultado]

---

## 📋 Caso Prático 3: [Título - Terceira Situação Distinta]

### 📍 Contexto e Fatos

[Parágrafo 1: 5-7 linhas com terceiro cenário]

[Parágrafo 2: 5-7 linhas sobre contexto específico]

[Parágrafo 3: 5-7 linhas com detalhes]

### 📋 O Problema Jurídico

[Parágrafo: 4-5 linhas identificando a questão]

### ⚖️ Aplicação do Artigo

[Parágrafo 1: 5-7 linhas sobre aplicação neste caso]

[Parágrafo 2: 5-7 linhas analisando especificidades]

### 🎯 Consequências Jurídicas

[Parágrafo: 5-7 linhas sobre efeitos]

### ✅ Solução e Desfecho

[Parágrafo: 5-7 linhas com resolução]

---

## 📋 Caso Prático 4: [Título - Situação Complexa]

### 📍 Contexto e Fatos

[Parágrafo 1: 5-7 linhas com caso mais complexo]

[Parágrafo 2: 5-7 linhas sobre múltiplas partes]

### 📋 O Problema Jurídico

[Parágrafo: 4-5 linhas com questão complexa]

### ⚖️ Aplicação do Artigo

[Parágrafo 1: 5-7 linhas sobre aplicação complexa]

[Parágrafo 2: 5-7 linhas sobre interação com outras normas]

### 🎯 Consequências Jurídicas

[Parágrafo: 5-7 linhas sobre múltiplos efeitos]

### ✅ Solução e Desfecho

[Parágrafo: 5-7 linhas com resolução]

---

## 🎯 Análise Comparativa dos Casos

[Parágrafo 1: 5-7 linhas comparando semelhanças]

[Parágrafo 2: 5-7 linhas destacando diferenças]

[Parágrafo 3: 5-7 linhas sobre padrões identificados]

---

## 💡 Lições e Conclusões Importantes

### Lição 1: [Título]

[Parágrafo: 5-6 linhas com primeira lição crucial]

### Lição 2: [Título]

[Parágrafo: 5-6 linhas com segunda lição]

### Lição 3: [Título]

[Parágrafo: 5-6 linhas com terceira lição]

---

## ⚠️ Erros Comuns a Evitar

[Parágrafo 1: 5-6 linhas sobre erros frequentes]

[Parágrafo 2: 5-6 linhas sobre como evitá-los]

---

## 📌 Síntese Final

[Parágrafo: 5-7 linhas consolidando todos os aprendizados]

REGRAS CRÍTICAS:
- Sempre separe parágrafos com linha vazia
- Crie 4 casos práticos MUITO diferentes entre si
- Parágrafos de 5-7 linhas (não 3-4!)
- Use # para título, ## para casos, ### para subsections
- Use blockquote para citar o artigo
- Seja EXTREMAMENTE detalhado em cada caso
- Mínimo de 2000 palavras no total`
    };

    let promptKey: string;
    if (tipo === "explicacao") {
      if (nivel === "resumido") {
        promptKey = "explicacao_resumido";
      } else if (nivel === "simples") {
        promptKey = faixaEtaria === "menor16" ? "explicacao_simples_menor16" : "explicacao_simples_maior16";
      } else {
        promptKey = "explicacao_tecnico";
      }
    } else {
      promptKey = "exemplo";
    }
    
    const prompt = prompts[promptKey] || prompts.explicacao_tecnico;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${DIREITO_PREMIUM_API_KEY}`,
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
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 6000,
          }
        }),
      }
    );
    
    console.log('📡 Resposta da API Gemini - Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API:', response.status, errorText);
      throw new Error(`Erro da API Gemini: ${response.status}`);
    }

    // Transform Gemini stream to SSE format
    console.log('🔄 Iniciando processamento do stream...');
    let buffer = '';
    let totalContentSent = 0;
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        buffer += text;
        
        // Try to extract complete JSON objects from buffer
        let startIdx = 0;
        while (startIdx < buffer.length) {
          // Find start of JSON object
          const objStart = buffer.indexOf('{', startIdx);
          if (objStart === -1) break;
          
          // Try to find matching closing brace
          let braceCount = 0;
          let objEnd = -1;
          for (let i = objStart; i < buffer.length; i++) {
            if (buffer[i] === '{') braceCount++;
            if (buffer[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                objEnd = i + 1;
                break;
              }
            }
          }
          
          // If we found a complete JSON object
          if (objEnd !== -1) {
            const jsonStr = buffer.substring(objStart, objEnd);
            try {
              const data = JSON.parse(jsonStr);
              const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
              
              if (content && content.trim().length > 0) {
                totalContentSent++;
                if (totalContentSent === 1) {
                  console.log('✅ Primeiro conteúdo enviado:', content.substring(0, 100));
                }
                if (totalContentSent % 10 === 0) {
                  console.log(`📤 ${totalContentSent} chunks enviados`);
                }
                const sseData = JSON.stringify({
                  choices: [{ delta: { content } }]
                });
                controller.enqueue(new TextEncoder().encode(`data: ${sseData}\n\n`));
              }
            } catch (e) {
              console.error('❌ Erro ao parsear JSON:', e);
            }
            
            // Remove processed part from buffer
            buffer = buffer.substring(objEnd);
            startIdx = 0;
          } else {
            // No complete object found, wait for more data
            break;
          }
        }
        
        // Keep buffer manageable
        if (buffer.length > 50000) {
          console.error('⚠️ Buffer muito grande, limpando:', buffer.length);
          buffer = buffer.substring(buffer.length - 10000);
        }
      },
      
      flush(controller) {
        // Send [DONE] marker
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        console.log('✅ Stream finalizado - Total de chunks:', totalContentSent);
      }
    });

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        conteudo: 'Desculpe, ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

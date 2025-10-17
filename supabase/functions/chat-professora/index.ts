import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, files, mode } = await req.json();
    const DIREITO_PREMIUM_API_KEY = Deno.env.get('DIREITO_PREMIUM_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!DIREITO_PREMIUM_API_KEY) {
      throw new Error('DIREITO_PREMIUM_API_KEY não configurada');
    }

    // Criar cliente Supabase para buscar dados da CF
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Detectar menções a artigos da CF
    const lastUserMessage = messages[messages.length - 1];
    let cfContext = '';
    
    // Regex para detectar artigos (art. 5º, artigo 5, art 5, etc)
    const articleRegex = /art(?:igo)?\.?\s*(\d+)/gi;
    const articleMatches = lastUserMessage?.content?.match(articleRegex);
    
    if (articleMatches) {
      console.log('Artigos detectados:', articleMatches);
      
      // Buscar cada artigo mencionado
      for (const match of articleMatches) {
        const articleNum = match.replace(/art(?:igo)?\.?\s*/gi, '').trim();
        
        const { data: articles } = await supabase
          .from('CF - Constituição Federal')
          .select('*')
          .ilike('Número do Artigo', `%${articleNum}%`)
          .limit(1);
        
        if (articles && articles.length > 0) {
          const article = articles[0];
          cfContext += `\n\n[ARTIGO ${article['Número do Artigo']} DA CF]\n`;
          cfContext += `${article.Artigo}\n`;
          if (article.Narração) cfContext += `Narração: ${article.Narração}\n`;
          if (article.Comentario) cfContext += `Comentário: ${article.Comentario}\n`;
        }
      }
    }

    // Preparar o prompt do sistema baseado no modo
    const systemPrompt = mode === 'realcase'
      ? `Você é uma assistente jurídica especializada em orientar pessoas em situações do dia a dia envolvendo direito brasileiro.

SEU OBJETIVO:
Ajudar pessoas comuns a entenderem seus direitos e saberem como proceder em situações reais da vida cotidiana.

COMO RESPONDER:
1. **Entenda a Situação**: Ouça atentamente o problema relatado
2. **Explique os Direitos**: Diga claramente quais são os direitos da pessoa, SEMPRE citando os artigos específicos das leis brasileiras
3. **Dê o Passo a Passo**: Instrua sobre o que fazer, em ordem de ações
4. **Sugira Documentos**: Liste documentos que podem ser necessários
5. **Mencione Prazos**: Alerte sobre prazos importantes, se houver
6. **Cite a Lei**: SEMPRE mencione a base legal completa:
   - Código Civil (CC): cite artigos quando aplicável
   - Código de Defesa do Consumidor (CDC): cite artigos quando aplicável
   - Consolidação das Leis do Trabalho (CLT): cite artigos quando aplicável
   - Código de Trânsito Brasileiro (CTB): cite artigos quando aplicável
   - Código Penal (CP): cite artigos quando aplicável
   - Constituição Federal: cite artigos quando aplicável
7. **Seja Prático**: Foque em ações concretas que a pessoa pode tomar

IMPORTANTE - CITAÇÃO DE ARTIGOS:
- SEMPRE cite os números dos artigos específicos (Ex: "Art. 186 do Código Civil", "Art. 18 do CDC")
- Explique brevemente o que cada artigo diz
- Use múltiplos artigos quando relevante para fundamentar a resposta
- Cite artigos de diferentes códigos se aplicável ao caso

ESTILO:
- Linguagem clara e acessível (sem juridiquês)
- Tom acolhedor e empático
- Respostas estruturadas e organizadas
- Use exemplos práticos
- Sempre reforce: "Procure um advogado para orientação completa"

${cfContext ? `\n\nCONTEXTO DA CONSTITUIÇÃO FEDERAL:${cfContext}` : ''}`
      : `Você é uma assistente jurídica especializada em Direito brasileiro, conversando de forma natural e dinâmica.

ACESSO À CONSTITUIÇÃO FEDERAL:
Você tem acesso direto aos artigos da Constituição Federal brasileira. Quando relevante, cite os artigos específicos e explique seu conteúdo de forma clara.

ESTILO DE CONVERSA:
- Seja conversacional e próxima, como uma colega que está ajudando
- Não use saudações repetidas ("Olá", "Oi") em cada mensagem - vá direto ao ponto
- Fale de forma direta e envolvente, criando intimidade
- Use uma linguagem clara mas profissional
- Seja didática e use exemplos práticos do cotidiano jurídico brasileiro

ANÁLISE DE DOCUMENTOS E IMAGENS:
Quando receber imagens ou PDFs:
1. OBSERVE ATENTAMENTE o conteúdo real da imagem/documento
2. DESCREVA exatamente o que você vê - não invente nada
3. Se for texto legal, identifique artigos, parágrafos e incisos
4. Se for caderno/anotações, descreva o conteúdo escrito
5. Se for foto de pessoa, descreva apenas isso
6. Se for documento jurídico, identifique tipo e conteúdo principal
7. NUNCA invente informações que não estejam visíveis

FORMATO DE RESPOSTA:
- Seja concisa mas completa
- Use parágrafos curtos
- Destaque termos importantes em negrito quando relevante
- Sempre cite a base legal quando aplicável

**CRÍTICO - Sugestões de Perguntas:**
Ao final de CADA resposta, você DEVE incluir 2-3 sugestões de perguntas/tópicos que a pessoa pode explorar, no formato:

[SUGESTÕES]
Pergunta relevante 1 baseada no contexto?
Pergunta relevante 2 que aprofunda o assunto?
Pergunta relevante 3 relacionada ao tema?
[/SUGESTÕES]

As sugestões devem:
- Ser relevantes ao que a pessoa perguntou
- Aprofundar a conversa
- Oferecer novas perspectivas
- Ser escritas de forma clara e convidativa
${cfContext ? `\n\nCONTEXTO DA CONSTITUIÇÃO FEDERAL:${cfContext}` : ''}`;

    // Preparar conteúdo para API do Gemini
    const parts: any[] = [];
    
    // Adicionar prompt do sistema e histórico
    let conversationText = systemPrompt + '\n\n';
    
    // Se houver arquivos, adicionar instrução especial
    if (files && files.length > 0) {
      conversationText += '\n**INSTRUÇÃO CRÍTICA**: Arquivos foram anexados. Você DEVE analisar o conteúdo REAL destes arquivos. NÃO invente ou suponha nada. Leia e descreva exatamente o que está nos documentos/imagens.\n\n';
    }
    
    for (const msg of messages) {
      conversationText += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}\n\n`;
    }
    
    parts.push({ text: conversationText });

    // Detectar se é apenas arquivo sem texto
    const isFileOnly = files && files.length > 0 && (!lastUserMessage?.content || lastUserMessage.content === 'Por favor, analise o arquivo anexado.');
    
    // Adicionar imagens/PDFs se houver
    if (files && files.length > 0) {
      for (const file of files) {
        const base64Data = file.data.includes('base64,') 
          ? file.data.split('base64,')[1] 
          : file.data;
        
        if (file.type.startsWith('image/')) {
          let mimeType = 'image/jpeg';
          if (file.data.includes('image/png')) mimeType = 'image/png';
          else if (file.data.includes('image/webp')) mimeType = 'image/webp';
          else if (file.data.includes('image/gif')) mimeType = 'image/gif';
          
          parts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          });
        } else if (file.type === 'application/pdf' || file.name?.endsWith('.pdf')) {
          // Gemini suporta PDFs nativamente
          parts.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          });
        }
      }
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + DIREITO_PREMIUM_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API Gemini:', response.status, errorText);
      
      // Tratamento especial para erro 429 (quota excedida)
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'quota_exceeded',
            message: '⏱️ Limite de perguntas atingido. Por favor, aguarde alguns minutos e tente novamente.'
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Erro da API Gemini: ${response.status}`);
    }

    const data = await response.json();
    let assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      throw new Error('Resposta inválida da API Gemini');
    }

    // Extrair sugestões de perguntas
    const suggestionsMatch = assistantMessage.match(/\[SUGESTÕES\]([\s\S]*?)\[\/SUGESTÕES\]/);
    let suggestions = null;
    if (suggestionsMatch) {
      const suggestionsText = suggestionsMatch[1].trim();
      suggestions = suggestionsText.split('\n').filter((s: string) => s.trim().length > 0);
      // Remover as tags de sugestões da mensagem
      assistantMessage = assistantMessage.replace(/\[SUGESTÕES\][\s\S]*?\[\/SUGESTÕES\]/g, '').trim();
    }

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        showActions: isFileOnly || assistantMessage.length > 200,
        suggestions
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro no chat-professora:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Desculpe, ocorreu um erro. Por favor, tente novamente.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

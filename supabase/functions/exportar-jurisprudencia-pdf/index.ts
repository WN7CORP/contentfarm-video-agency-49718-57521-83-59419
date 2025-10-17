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
    const { jurisprudencia, explicacao, incluirExplicacao = false } = await req.json();

    console.log(`Exportando PDF: ${jurisprudencia.numeroProcesso}`);

    // Construir conteúdo HTML para PDF
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 2cm; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
    }
    h1 {
      color: #1e40af;
      font-size: 24px;
      margin: 20px 0;
    }
    h2 {
      color: #1e40af;
      font-size: 20px;
      margin: 20px 0 10px 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
    }
    .metadata {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .metadata-item {
      margin: 8px 0;
    }
    .metadata-label {
      font-weight: bold;
      color: #374151;
    }
    .ementa {
      background-color: #eff6ff;
      padding: 20px;
      border-left: 4px solid #1e40af;
      margin: 20px 0;
      text-align: justify;
    }
    .explicacao {
      margin: 30px 0;
      padding: 20px;
      background-color: #fefce8;
      border-radius: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    p {
      margin: 10px 0;
      text-align: justify;
    }
    .link {
      color: #1e40af;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">⚖️ App Direito</div>
    <p>Jurisprudência</p>
  </div>

  <h1>${jurisprudencia.tribunal} - ${jurisprudencia.numeroProcesso}</h1>

  <div class="metadata">
    <div class="metadata-item">
      <span class="metadata-label">Processo:</span> ${jurisprudencia.numeroProcesso}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Tribunal:</span> ${jurisprudencia.tribunal}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Órgão Julgador:</span> ${jurisprudencia.orgaoJulgador || 'Não informado'}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Data do Julgamento:</span> ${jurisprudencia.dataJulgamento || 'Não informada'}
    </div>
    ${jurisprudencia.temaJuridico ? `
    <div class="metadata-item">
      <span class="metadata-label">Tema:</span> ${jurisprudencia.temaJuridico}
    </div>
    ` : ''}
    <div class="metadata-item">
      <span class="metadata-label">Link:</span> <a href="${jurisprudencia.link}" class="link">${jurisprudencia.link}</a>
    </div>
  </div>

  <h2>📋 Ementa</h2>
  <div class="ementa">
    ${jurisprudencia.ementa.replace(/\n/g, '<br>')}
  </div>

  ${incluirExplicacao && explicacao ? `
  <h2>💡 Explicação com IA</h2>
  <div class="explicacao">
    ${converterMarkdownParaHTML(explicacao)}
  </div>
  ` : ''}

  <div class="footer">
    <p>Documento gerado pelo App Direito em ${new Date().toLocaleDateString('pt-BR')}</p>
    <p>Este documento é apenas informativo e não substitui consulta jurídica especializada.</p>
  </div>
</body>
</html>
    `;

    // Usar API do Supabase Storage para gerar PDF
    // Por enquanto, retornar o HTML formatado
    // Em produção, integrar com serviço de geração de PDF

    const filename = `jurisprudencia-${jurisprudencia.numeroProcesso.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

    // Retornar HTML que pode ser convertido para PDF no cliente
    return new Response(
      JSON.stringify({
        success: true,
        htmlContent,
        filename,
        message: 'HTML gerado com sucesso. Use print para salvar como PDF.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function converterMarkdownParaHTML(markdown: string): string {
  let html = markdown;
  
  // Cabeçalhos
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Negrito
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Itálico
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap em parágrafos
  html = `<p>${html}</p>`;
  
  return html;
}

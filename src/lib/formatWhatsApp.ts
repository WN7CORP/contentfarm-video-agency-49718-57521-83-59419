/**
 * Converte Markdown para formatação do WhatsApp
 * 
 * Formatação WhatsApp:
 * *texto* = negrito
 * _texto_ = itálico
 * ~texto~ = tachado
 * ```texto``` = monoespaçado
 */
export function formatForWhatsApp(markdown: string): string {
  let text = markdown;

  // Remover separadores horizontais ---
  text = text.replace(/^---+$/gm, '━━━━━━━━━━━━━━');

  // Converter títulos em texto com emojis e formatação
  text = text.replace(/^#\s+(.+)$/gm, '📋 *$1*\n');
  text = text.replace(/^##\s+(.+)$/gm, '\n📖 *$1*\n');
  text = text.replace(/^###\s+(.+)$/gm, '\n→ *$1*\n');

  // Converter negrito do markdown (** ou __) para WhatsApp (*)
  text = text.replace(/\*\*(.+?)\*\*/g, '*$1*');
  text = text.replace(/__(.+?)__/g, '*$1*');

  // Converter itálico do markdown (* ou _) para WhatsApp (_)
  // Mas primeiro precisamos proteger os negritos já convertidos
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '_$1_');
  text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '_$1_');

  // Converter blockquotes (>) para formato WhatsApp
  text = text.replace(/^>\s*(.+)$/gm, '💬 _"$1"_');

  // Converter code blocks
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```(\w*)\n?/g, '').replace(/```/g, '');
  });

  // Converter inline code
  text = text.replace(/`(.+?)`/g, '```$1```');

  // Converter listas não ordenadas
  text = text.replace(/^\s*[-*+]\s+(.+)$/gm, '• $1');

  // Converter listas ordenadas
  text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '→ $1');

  // Converter links para formato simples
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '$1: $2');

  // Adicionar espaços entre seções
  text = text.replace(/\n{3,}/g, '\n\n');

  // Limpar espaços extras
  text = text.trim();

  return text;
}

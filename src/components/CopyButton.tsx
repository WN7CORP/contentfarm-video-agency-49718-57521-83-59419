import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatForWhatsApp } from "@/lib/formatWhatsApp";

interface CopyButtonProps {
  text: string;
  articleNumber: string;
}

export const CopyButton = ({ text, articleNumber }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const fullText = `Art. ${articleNumber}\n\n${text}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast({
        title: "Texto copiado!",
        description: "O artigo foi copiado para a área de transferência."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

  const handleShareWhatsApp = () => {
    const fullText = `*Art. ${articleNumber}*\n\n${text}`;
    const formattedText = formatForWhatsApp(fullText);
    const encodedText = encodeURIComponent(formattedText);
    
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-lg transition-all hover:scale-105 border border-border"
            title="Opções de compartilhamento"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-medium">Compartilhar</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-2" />
            Copiar texto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareWhatsApp} className="cursor-pointer">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

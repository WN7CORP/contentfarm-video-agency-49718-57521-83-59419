import { useState } from "react";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { DotLottiePlayer } from "@dotlottie/react-player";

interface ExplicacaoDetalhadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  conteudo: string;
}

const ExplicacaoDetalhadaModal = ({
  isOpen,
  onClose,
  conteudo,
}: ExplicacaoDetalhadaModalProps) => {
  const [explicacao, setExplicacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPart, setCurrentPart] = useState<1 | 2 | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const { toast } = useToast();

  const gerarExplicacaoDetalhada = async () => {
    setLoading(true);
    setCurrentPart(1);
    setExplicacao("");

    try {
      // Primeira parte da explicação
      const parte1Response = await fetch(
        `https://izspjvegxdfgkgibpyst.supabase.co/functions/v1/gerar-explicacao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6c3BqdmVneGRmZ2tnaWJweXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDA2MTQsImV4cCI6MjA2MDcxNjYxNH0.LwTMbDH-S0mBoiIxfrSH2BpUMA7r4upOWWAb5a_If0Y`,
          },
          body: JSON.stringify({
            artigo: conteudo,
            tipo: "explicacao",
            nivel: "tecnico",
            parte: 1,
          }),
        }
      );

      if (!parte1Response.ok || !parte1Response.body) {
        throw new Error("Falha na primeira requisição");
      }

      let parte1Conteudo = "";
      const reader1 = parte1Response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader1.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                parte1Conteudo += content;
                setExplicacao(parte1Conteudo);
              }
            } catch (e) {
              console.error("Erro ao parsear chunk:", e);
            }
          }
        }
      }

      // Segunda parte da explicação
      setCurrentPart(2);

      const parte2Response = await fetch(
        `https://izspjvegxdfgkgibpyst.supabase.co/functions/v1/gerar-explicacao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6c3BqdmVneGRmZ2tnaWJweXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDA2MTQsImV4cCI6MjA2MDcxNjYxNH0.LwTMbDH-S0mBoiIxfrSH2BpUMA7r4upOWWAb5a_If0Y`,
          },
          body: JSON.stringify({
            artigo: conteudo,
            tipo: "explicacao",
            nivel: "tecnico",
            parte: 2,
            contexto: parte1Conteudo,
          }),
        }
      );

      if (!parte2Response.ok || !parte2Response.body) {
        throw new Error("Falha na segunda requisição");
      }

      let conteudoCompleto = parte1Conteudo + "\n\n";
      const reader2 = parte2Response.body.getReader();

      while (true) {
        const { done, value } = await reader2.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                conteudoCompleto += content;
                setExplicacao(conteudoCompleto);
              }
            } catch (e) {
              console.error("Erro ao parsear chunk:", e);
            }
          }
        }
      }

      setCurrentPart(null);
    } catch (error) {
      console.error("Erro ao gerar explicação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a explicação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setExplicacao("");
    setCurrentPart(null);
    setLoading(false);
    onClose();
  };

  const compartilharWhatsApp = () => {
    const { formatForWhatsApp } = require('@/lib/formatWhatsApp');
    const textoFormatado = formatForWhatsApp(explicacao);

    const mensagem = `*Explicação Detalhada*\n\n${textoFormatado}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const { data, error } = await supabase.functions.invoke(
        "exportar-pdf-educacional",
        {
          body: {
            content: explicacao,
            filename: `explicacao-detalhada-${Date.now()}`,
            title: "Explicação Detalhada",
            darkMode: true,
          },
        }
      );

      if (error) throw error;

      if (data?.pdfUrl) {
        if (isMobile) {
          window.open(data.pdfUrl, "_blank");
          toast({
            title: "PDF gerado!",
            description: "O link foi aberto em uma nova aba. Válido por 24 horas.",
          });
        } else {
          const link = document.createElement("a");
          link.href = data.pdfUrl;
          link.download = `explicacao-detalhada-${Date.now()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast({
            title: "PDF baixado com sucesso!",
            description: "O arquivo foi salvo no seu dispositivo.",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setExportingPDF(false);
    }
  };

  const customComponents: Components = {
    p: ({ children }) => (
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-accent mb-6 mt-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-accent mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-foreground mb-3 mt-6">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 pr-4 py-4 my-6 bg-secondary/40 rounded-r-lg text-foreground/95 text-[15px] leading-relaxed shadow-sm">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => {
      const text = String(children);
      const isArtigo = /^(Art\.|Artigo)\s*\d+/.test(text);
      return (
        <strong className={isArtigo ? "text-primary font-extrabold" : "text-foreground font-bold"}>
          {children}
        </strong>
      );
    },
    code: ({ children }) => (
      <code className="bg-secondary/60 px-2 py-0.5 rounded text-sm text-accent">
        {children}
      </code>
    ),
    ul: ({ children }) => (
      <ul className="space-y-2 my-4 list-disc list-inside">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-2 my-4 list-decimal list-inside">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-[15px] text-foreground/90 leading-relaxed ml-2">
        {children}
      </li>
    ),
    hr: ({ children }) => (
      <hr className="border-border/40 my-8" />
    )
  };

  if (!isOpen) return null;

  // Gerar automaticamente ao abrir
  if (isOpen && !loading && !explicacao && currentPart === null) {
    setTimeout(() => gerarExplicacaoDetalhada(), 100);
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/95 backdrop-blur-lg px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-sm font-bold">Explicação Detalhada</h1>
            <p className="text-xs text-muted-foreground">
              Análise completa em duas partes
            </p>
          </div>
        </div>

        {!loading && explicacao && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={compartilharWhatsApp}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {exportingPDF ? "Gerando..." : "Exportar PDF"}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <DotLottiePlayer
                src="https://lottie.host/542f6e8e-cbf1-4d80-ad7a-ed9584c815c6/yfYXOPUtbr.lottie"
                autoplay
                loop
                style={{ width: 280, height: 280 }}
              />
              <div className="text-center space-y-2">
                <p className="text-base font-semibold text-foreground">
                  {currentPart === 1
                    ? "Gerando primeira parte da explicação..."
                    : "Gerando segunda parte da explicação..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPart === 1
                    ? "Analisando o conteúdo e estruturando a explicação"
                    : "Completando com detalhes avançados e exemplos práticos"}
                </p>
              </div>
            </div>
          ) : explicacao ? (
            <div className="animate-fade-in">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={customComponents}
              >
                {explicacao}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ExplicacaoDetalhadaModal;

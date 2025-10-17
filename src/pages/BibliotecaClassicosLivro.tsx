import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2, BookOpen } from "lucide-react";
import { useState } from "react";
import PDFViewerModal from "@/components/PDFViewerModal";

const BibliotecaClassicosLivro = () => {
  const { livroId } = useParams();
  const navigate = useNavigate();
  const [showPDF, setShowPDF] = useState(false);
  const [searchParams] = useSearchParams();
  const fromSearch = searchParams.get('fromSearch') === 'true';

  const { data: livro, isLoading } = useQuery({
    queryKey: ["biblioteca-classicos-livro", livroId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("BIBLIOTECA-CLASSICOS")
        .select("*")
        .eq("id", livroId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!livro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Livro não encontrado</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 pb-20">
      {fromSearch && (
        <div className="bg-accent/10 border-b border-accent/20 py-2 px-4 text-sm text-muted-foreground animate-fade-in">
          🔍 Busca → Bibliotecas → Clássicos → {livro?.livro}
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className={`w-56 md:w-72 mb-8 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${fromSearch ? 'animate-pulse ring-4 ring-accent/50' : 'hover:shadow-accent/50'}`}>
            {livro.imagem ? (
              <img
                src={livro.imagem}
                alt={livro.livro || ""}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-accent/50" />
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl text-center space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{livro.livro}</h1>
              {livro.autor && (
                <p className="text-lg text-muted-foreground">{livro.autor}</p>
              )}
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {livro.link && (
                <Button
                  onClick={() => setShowPDF(true)}
                  size="lg"
                  className="min-w-[160px] shadow-lg hover:shadow-accent/50 transition-all"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Ler agora
                </Button>
              )}
              {livro.download && (
                <Button
                  onClick={() => window.open(livro.download!, "_blank")}
                  variant="outline"
                  size="lg"
                  className="min-w-[160px] shadow-lg hover:shadow-accent/50 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {livro.sobre && (
              <div className="mt-8 text-left bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
                <h2 className="text-xl font-semibold mb-4">Sobre o livro</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {livro.sobre}
                </p>
              </div>
            )}

            {livro.beneficios && (
              <div className="mt-4 text-left bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
                <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {livro.beneficios}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPDF && livro.link && (
        <PDFViewerModal
          isOpen={showPDF}
          pdfUrl={livro.link}
          onClose={() => setShowPDF(false)}
          title={livro.livro || "Livro"}
        />
      )}
    </div>
  );
};

export default BibliotecaClassicosLivro;

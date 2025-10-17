import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Aula {
  id: number;
  aula: number;
  tema: string;
  assunto: string;
  capa: string;
}

const CursosAulas = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");
  const modulo = searchParams.get("modulo");
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAulas = async () => {
      if (!area || !modulo) {
        navigate(-1);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("CURSOS" as any)
        .select("id, Aula, Tema, Assunto, capa")
        .eq("Area", area)
        .eq("Modulo", parseInt(modulo))
        .order("Aula", { ascending: true });

      if (error) {
        console.error("Erro ao buscar aulas:", error);
      } else if (data) {
        const aulasFormatted = data.map((item: any) => ({
          id: item.id,
          aula: item.Aula,
          tema: item.Tema || "",
          assunto: item.Assunto || "",
          capa: item.capa || "",
        }));
        setAulas(aulasFormatted);
      }
      setLoading(false);
    };

    fetchAulas();
  }, [area, modulo, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Content */}
      <div className="px-4 max-w-6xl mx-auto py-8">
        {/* Header Info */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{area}</span>
            <span>•</span>
            <span>Módulo {modulo}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Aulas do Módulo</h1>
          <p className="text-muted-foreground">
            {aulas.length} {aulas.length === 1 ? 'aula disponível' : 'aulas disponíveis'}
          </p>
        </div>

        <div className="space-y-4">
          {aulas.map((aula, index) => (
            <Card
              key={aula.id}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden border border-border/50 hover:border-accent/50 group animate-fade-in"
              style={{ 
                animationDelay: `${0.1 + index * 0.1}s`,
                animationFillMode: 'backwards'
              }}
              onClick={() => navigate(`/cursos/aula?id=${aula.id}`)}
            >
              <div className="flex flex-col md:flex-row gap-0">
                <div className="relative w-full md:w-72 aspect-video bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 overflow-hidden">
                  {aula.capa ? (
                    <img
                      src={aula.capa}
                      alt={aula.assunto}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground rounded-full p-4">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold">
                      Aula {aula.aula}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors duration-300">
                    {aula.tema}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {aula.assunto}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="text-accent">▶️</span>
                      <span>Vídeo aula</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="text-accent">📝</span>
                      <span>Material didático</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CursosAulas;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Modulo {
  modulo: number;
  capa: string;
  totalAulas: number;
  nome: string;
}

const CursosModulos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModulos = async () => {
      if (!area) {
        navigate(-1);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("CURSOS" as any)
        .select("Modulo, Aula, Tema, \"capa-modulo\"")
        .eq("Area", area)
        .order("Modulo", { ascending: true })
        .order("Aula", { ascending: true });

      if (error) {
        console.error("Erro ao buscar módulos:", error);
      } else if (data) {
        // Agrupar por módulo e contar aulas
        const modulosMap = new Map<number, { capa: string; totalAulas: number; nome: string }>();
        data.forEach((item: any) => {
          if (item.Modulo) {
            if (!modulosMap.has(item.Modulo)) {
              modulosMap.set(item.Modulo, {
                capa: item["capa-modulo"] || "",
                totalAulas: 0,
                nome: item.Tema || `Módulo ${item.Modulo}`
              });
            }
            const moduloData = modulosMap.get(item.Modulo)!;
            if (item.Aula) moduloData.totalAulas++;
          }
        });
        
        const modulosArray = Array.from(modulosMap.entries()).map(([modulo, data]) => ({
          modulo,
          capa: data.capa,
          totalAulas: data.totalAulas,
          nome: data.nome,
        }));
        setModulos(modulosArray);
      }
      setLoading(false);
    };

    fetchModulos();
  }, [area, navigate]);

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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{area}</h1>
          <p className="text-muted-foreground">
            {modulos.length} {modulos.length === 1 ? 'módulo disponível' : 'módulos disponíveis'} • 
            {' '}{modulos.reduce((sum, m) => sum + m.totalAulas, 0)} aulas totais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {modulos.map((modulo, index) => (
            <Card
              key={modulo.modulo}
              className="cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border/50 hover:border-accent/50 group animate-fade-in"
              style={{ 
                animationDelay: `${0.1 + index * 0.1}s`,
                animationFillMode: 'backwards'
              }}
              onClick={() =>
                navigate(
                  `/cursos/aulas?area=${encodeURIComponent(area!)}&modulo=${modulo.modulo}`
                )
              }
            >
              <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {modulo.capa ? (
                  <img
                    src={modulo.capa}
                    alt={`Módulo ${modulo.modulo}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-16 h-16 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    Módulo {modulo.modulo}
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-3 group-hover:text-accent transition-colors duration-300">
                  {modulo.nome}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                      <BookOpen className="w-3.5 h-3.5 text-accent" />
                      <span className="font-medium">{modulo.totalAulas}</span>
                      <span className="text-muted-foreground">{modulo.totalAulas === 1 ? 'aula' : 'aulas'}</span>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-300" style={{ width: '0%' }} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CursosModulos;

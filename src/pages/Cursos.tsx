import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Area {
  area: string;
  capa: string;
  totalModulos: number;
  totalAulas: number;
}

const Cursos = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("CURSOS" as any)
        .select("Area, Modulo, Aula, \"capa-area\"")
        .order("Area", { ascending: true });

      if (error) {
        console.error("Erro ao buscar áreas:", error);
      } else if (data) {
        // Agrupar por área e contar módulos e aulas
        const areasMap = new Map<string, { capa: string; modulos: Set<number>; totalAulas: number }>();
        data.forEach((item: any) => {
          if (item.Area) {
            if (!areasMap.has(item.Area)) {
              areasMap.set(item.Area, {
                capa: item["capa-area"] || "",
                modulos: new Set(),
                totalAulas: 0
              });
            }
            const areaData = areasMap.get(item.Area)!;
            if (item.Modulo) areaData.modulos.add(item.Modulo);
            if (item.Aula) areaData.totalAulas++;
          }
        });
        
        const areasArray = Array.from(areasMap.entries()).map(([area, data]) => ({
          area,
          capa: data.capa,
          totalModulos: data.modulos.size,
          totalAulas: data.totalAulas,
        }));
        setAreas(areasArray);
      }
      setLoading(false);
    };

    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-3 py-6 md:py-8">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-br from-primary to-codes rounded-2xl p-4 mb-4 shadow-lg animate-scale-in">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in-down">
            Cursos Completos
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            Trilhas de aprendizagem estruturadas para dominar cada área do direito
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {areas.map((area, index) => (
            <button
              key={area.area}
              onClick={() => navigate(`/cursos/modulos?area=${encodeURIComponent(area.area)}`)}
              className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-0 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group border border-border/50 hover:border-accent/50 animate-fade-in overflow-hidden"
              style={{ 
                animationDelay: `${0.2 + index * 0.1}s`,
                animationFillMode: 'backwards'
              }}
            >
              <div className="flex flex-col h-full">
                {/* Course Image or Icon */}
                <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  {area.capa ? (
                    <img
                      src={area.capa}
                      alt={area.area}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  {/* Course Title */}
                  <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                    {area.area}
                  </h2>

                  {/* Course Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                        <BookOpen className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium">{area.totalModulos}</span>
                        <span>{area.totalModulos === 1 ? 'módulo' : 'módulos'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                        <span className="text-accent">🎓</span>
                        <span className="font-medium">{area.totalAulas}</span>
                        <span>{area.totalAulas === 1 ? 'aula' : 'aulas'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (placeholder) */}
                  <div className="mb-4">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-300" style={{ width: '0%' }} />
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="flex items-center justify-between text-accent font-medium text-sm transition-all duration-300">
                    <span>Começar curso</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cursos;

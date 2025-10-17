import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
const SimuladosPersonalizado = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState<number>(20);
  const {
    data: areas,
    isLoading
  } = useQuery({
    queryKey: ["simulados-areas"],
    queryFn: async () => {
      const {
        data,
        error
      } = (await supabase.from("SIMULADO-OAB" as any).select("area").not("area", "is", null).neq("area", "").neq("area", "Erro na API")) as any;
      if (error) throw error;

      // Get unique areas with counts
      const areaMap = new Map<string, number>();
      data.forEach(item => {
        if (item.area && item.area.trim()) {
          areaMap.set(item.area, (areaMap.get(item.area) || 0) + 1);
        }
      });
      return Array.from(areaMap.entries()).map(([area, count]) => ({
        area,
        count
      })).sort((a, b) => a.area.localeCompare(b.area));
    }
  });
  const toggleArea = (area: string) => {
    setSelectedAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };
  const toggleAll = () => {
    if (selectedAreas.length === areas?.length) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas(areas?.map(a => a.area) || []);
    }
  };
  const handleIniciar = () => {
    if (selectedAreas.length === 0) {
      toast({
        title: "Selecione pelo menos uma área",
        description: "Escolha uma ou mais áreas para criar seu simulado",
        variant: "destructive"
      });
      return;
    }
    navigate(`/simulados/realizar?areas=${encodeURIComponent(selectedAreas.join(","))}&quantidade=${quantidade}`);
  };
  return <div className="px-3 py-4 max-w-4xl mx-auto pb-24">
      

      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">
          Simulado Personalizado
        </h1>
        <p className="text-sm text-muted-foreground">
          Escolha as áreas e quantidade de questões
        </p>
      </div>

      <div className="space-y-6">
        {/* Seleção de Quantidade */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Quantidade de Questões</h3>
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 30, 50].map(qtd => <Button key={qtd} variant={quantidade === qtd ? "default" : "outline"} onClick={() => setQuantidade(qtd)} className="flex-1 min-w-[70px]">
                {qtd}
              </Button>)}
          </div>
        </Card>

        {/* Seleção de Áreas */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Áreas do Direito</h3>
            {areas && areas.length > 0 && <Button variant="link" onClick={toggleAll} className="h-auto p-0">
                {selectedAreas.length === areas.length ? "Desmarcar Todas" : "Selecionar Todas"}
              </Button>}
          </div>

          {isLoading ? <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div> : areas && areas.length > 0 ? <div className="space-y-3">
              {areas.map(item => <div key={item.area} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                  <Checkbox id={item.area} checked={selectedAreas.includes(item.area)} onCheckedChange={() => toggleArea(item.area)} />
                  <Label htmlFor={item.area} className="flex-1 cursor-pointer text-sm">
                    <span className="font-medium">{item.area}</span>
                    <span className="text-muted-foreground ml-2">
                      ({item.count} questões)
                    </span>
                  </Label>
                </div>)}
            </div> : <p className="text-center text-muted-foreground py-8">
              Nenhuma área disponível. Os dados da coluna "area" precisam ser
              corrigidos.
            </p>}
        </Card>

        {/* Botão Iniciar */}
        <Button onClick={handleIniciar} className="w-full" size="lg" disabled={selectedAreas.length === 0}>
          <Play className="w-4 h-4 mr-2" />
          Iniciar Simulado ({selectedAreas.length}{" "}
          {selectedAreas.length === 1 ? "área" : "áreas"})
        </Button>
      </div>
    </div>;
};
export default SimuladosPersonalizado;
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, ChevronRight, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const SimuladosExames = () => {
  const navigate = useNavigate();
  const {
    data: exames,
    isLoading
  } = useQuery({
    queryKey: ["simulados-exames"],
    queryFn: async () => {
      const {
        data,
        error
      } = (await supabase.from("SIMULADO-OAB" as any).select("Exame, Ano, Banca").not("Exame", "is", null).not("Ano", "is", null)) as any;
      if (error) throw error;

      // Group by exam and year
      const exameMap = new Map<string, {
        exame: string;
        ano: number;
        banca: string;
        count: number;
      }>();
      data.forEach(item => {
        const key = `${item.Exame}-${item.Ano}`;
        if (!exameMap.has(key)) {
          exameMap.set(key, {
            exame: item.Exame || "",
            ano: item.Ano || 0,
            banca: item.Banca || "N/A",
            count: 0
          });
        }
        const exam = exameMap.get(key)!;
        exam.count++;
      });
      return Array.from(exameMap.values()).sort((a, b) => b.ano - a.ano || a.exame.localeCompare(b.exame));
    }
  });
  return <div className="px-3 py-4 max-w-4xl mx-auto pb-24">
      

      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Exames da OAB</h1>
        <p className="text-sm text-muted-foreground">
          Escolha um exame completo para praticar
        </p>
      </div>

      {isLoading ? <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div> : <div className="space-y-3">
          {exames?.map((exame, index) => <Card key={`${exame.exame}-${exame.ano}`} className="cursor-pointer hover:scale-[1.02] transition-all border-accent/20 hover:border-accent/50 bg-card group" onClick={() => navigate(`/simulados/realizar?exame=${encodeURIComponent(exame.exame)}&ano=${exame.ano}`)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20">
                  <Gavel className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-foreground mb-1">
                    {exame.exame} - {exame.ano}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Banca: {exame.banca} • {exame.count} questões
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>)}
        </div>}
    </div>;
};
export default SimuladosExames;
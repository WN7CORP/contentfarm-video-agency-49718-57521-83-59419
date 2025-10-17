import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sparkles, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const FlashcardsTemas = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const area = searchParams.get("area");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: temas,
    isLoading
  } = useQuery({
    queryKey: ["flashcards-temas", area],
    queryFn: async () => {
      if (!area) return [];
      const {
        data,
        error
      } = await supabase.rpc("get_flashcard_temas", {
        p_area: area
      });
      if (error) throw error;
      return data.map(row => ({
        tema: row.tema,
        count: Number(row.count)
      }));
    },
    enabled: !!area
  });
  const glowColors = ["rgb(59, 130, 246)", "rgb(239, 68, 68)", "rgb(16, 185, 129)", "rgb(245, 158, 11)", "rgb(139, 92, 246)", "rgb(236, 72, 153)", "rgb(20, 184, 166)", "rgb(251, 146, 60)", "rgb(168, 85, 247)", "rgb(14, 165, 233)"];
  const filteredTemas = temas?.filter(tema => tema.tema.toLowerCase().includes(searchTerm.toLowerCase()));
  if (!area) {
    navigate("/flashcards");
    return null;
  }
  return <div className="min-h-screen bg-background pb-20">
      

      <div className="max-w-4xl mx-auto px-3 py-4">

        {/* Campo de Busca */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input placeholder="Buscar tema..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="text-base" />
              <Button variant="outline" size="icon" className="shrink-0">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Temas */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Temas Disponíveis
          </h2>

          {isLoading ? <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[100px] w-full rounded-lg" />)}
            </div> : <div className="space-y-3">
              {filteredTemas?.map((item, index) => {
            const glowColor = glowColors[index % glowColors.length];
            return <Card key={item.tema} className="cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/50 bg-gradient-to-br from-card to-card/80 group overflow-hidden relative" onClick={() => navigate(`/flashcards/estudar?area=${encodeURIComponent(area)}&tema=${encodeURIComponent(item.tema)}`)}>
                    <div className="absolute top-0 left-0 right-0 h-1 opacity-80" style={{
                background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
                boxShadow: `0 0 20px ${glowColor}`
              }} />
                    
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base mb-1">
                          {item.tema}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.count} questõe{item.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>}
        </div>
      </div>
    </div>;
};
export default FlashcardsTemas;
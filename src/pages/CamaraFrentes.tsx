import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentGenerationLoader } from "@/components/ContentGenerationLoader";
import { FrenteCard } from "@/components/FrenteCard";

const CamaraFrentes = () => {
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [frentes, setFrentes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    handleBuscar();
  }, []);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "buscar-frentes",
        { body: { idLegislatura: 57, keywords: keywords || undefined } }
      );

      if (error) throw error;
      setFrentes(data.frentes || []);
      
      if (data.frentes?.length === 0) {
        toast({
          title: "Nenhuma frente encontrada",
          description: "Tente ajustar os filtros",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na busca",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Frentes Parlamentares</h1>
        <p className="text-sm text-muted-foreground">Frentes temáticas da Câmara</p>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle>Buscar Frentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave (Opcional)</Label>
            <Input
              id="keywords"
              placeholder="Ex: educação, saúde..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <Button onClick={handleBuscar} className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Frentes
          </Button>
        </CardContent>
      </Card>

      {loading && <ContentGenerationLoader message="Buscando frentes..." />}

      {frentes.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{frentes.length} frente(s) encontrada(s)</p>
          {frentes.map((frente) => (
            <FrenteCard key={frente.id} frente={frente} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CamaraFrentes;
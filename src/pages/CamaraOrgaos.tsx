import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentGenerationLoader } from "@/components/ContentGenerationLoader";
import { OrgaoCard } from "@/components/OrgaoCard";

const CamaraOrgaos = () => {
  const [sigla, setSigla] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgaos, setOrgaos] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    handleBuscar();
  }, []);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "buscar-orgaos",
        { body: { sigla: sigla || undefined } }
      );

      if (error) throw error;
      setOrgaos(data.orgaos || []);
      
      if (data.orgaos?.length === 0) {
        toast({
          title: "Nenhum órgão encontrado",
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
        <h1 className="text-xl md:text-2xl font-bold mb-1">Órgãos e Comissões</h1>
        <p className="text-sm text-muted-foreground">Comissões permanentes e temporárias</p>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle>Buscar Órgãos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sigla">Sigla (Opcional)</Label>
            <Input
              id="sigla"
              placeholder="Ex: CCJC"
              value={sigla}
              onChange={(e) => setSigla(e.target.value.toUpperCase())}
            />
          </div>

          <Button onClick={handleBuscar} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Órgãos
          </Button>
        </CardContent>
      </Card>

      {loading && <ContentGenerationLoader message="Buscando órgãos..." />}

      {orgaos.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{orgaos.length} órgão(s) encontrado(s)</p>
          {orgaos.map((orgao) => (
            <OrgaoCard key={orgao.id} orgao={orgao} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CamaraOrgaos;
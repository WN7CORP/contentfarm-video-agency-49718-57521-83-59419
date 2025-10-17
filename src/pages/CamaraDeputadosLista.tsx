import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentGenerationLoader } from "@/components/ContentGenerationLoader";
import { DeputadoCard } from "@/components/DeputadoCard";
import { useNavigate } from "react-router-dom";

const CamaraDeputadosLista = () => {
  const [nome, setNome] = useState("");
  const [siglaUf, setSiglaUf] = useState("");
  const [siglaPartido, setSiglaPartido] = useState("");
  const [loading, setLoading] = useState(false);
  const [deputados, setDeputados] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    handleBuscar();
  }, []);

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "buscar-deputados",
        {
          body: { 
            nome, 
            siglaUf: siglaUf === "todos" ? undefined : siglaUf, 
            siglaPartido: siglaPartido || undefined,
            idLegislatura: 57 // Legislatura atual
          },
        }
      );

      if (error) throw error;

      setDeputados(data.deputados || []);
      
      if (data.deputados?.length === 0) {
        toast({
          title: "Nenhum deputado encontrado",
          description: "Tente ajustar os filtros de busca",
        });
      }
    } catch (error: any) {
      console.error("Erro ao buscar:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Não foi possível buscar deputados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Deputados Federais</h1>
        <p className="text-sm text-muted-foreground">
          Lista completa de deputados em exercício
        </p>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle>Buscar Deputados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Deputado</Label>
            <Input
              id="nome"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado (UF)</Label>
              <Select value={siglaUf} onValueChange={setSiglaUf}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {estados.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Partido</Label>
              <Input
                placeholder="Ex: PT, PL..."
                value={siglaPartido}
                onChange={(e) => setSiglaPartido(e.target.value.toUpperCase())}
                maxLength={10}
              />
            </div>
          </div>

          <Button onClick={handleBuscar} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Deputados
          </Button>
        </CardContent>
      </Card>

      {loading && <ContentGenerationLoader message="Buscando deputados..." />}

      {deputados.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {deputados.length} deputado(s) encontrado(s)
          </p>
          {deputados.map((deputado) => (
            <DeputadoCard 
              key={deputado.id} 
              deputado={deputado}
              onClick={() => navigate(`/camara-deputados/deputado/${deputado.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CamaraDeputadosLista;

import { useState, useMemo } from "react";
import { Book, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DicionarioTermo {
  Letra: string | null;
  Palavra: string | null;
  Significado: string | null;
  "Exemplo de Uso 1": string | null;
  "Exemplo de Uso 2": string | null;
}

const Dicionario = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const { data: dicionario, isLoading } = useQuery({
    queryKey: ["dicionario"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("DICIONARIO" as any)
        .select("*")
        .order("Letra", { ascending: true })
        .order("Palavra", { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as DicionarioTermo[];
    },
  });

  const filteredTermos = useMemo(() => {
    if (!dicionario) return [];
    
    // Primeiro filtra por letra se uma foi selecionada
    let filtered = dicionario;
    if (selectedLetter) {
      filtered = dicionario.filter(termo => termo.Letra === selectedLetter);
    }
    
    // Depois filtra pela busca se houver
    if (!searchQuery) return filtered;

    const searchLower = searchQuery.toLowerCase().trim();
    
    // Busca exata primeiro
    const exactMatch = filtered.filter((termo) => {
      const palavra = termo.Palavra?.toLowerCase() || "";
      return palavra === searchLower;
    });
    
    // Se houver match exato, retorna apenas ele
    if (exactMatch.length > 0) return exactMatch;
    
    // Senão, busca parcial
    return filtered.filter((termo) => {
      const palavra = termo.Palavra?.toLowerCase() || "";
      const significado = termo.Significado?.toLowerCase() || "";
      
      return palavra.includes(searchLower) || significado.includes(searchLower);
    });
  }, [dicionario, searchQuery, selectedLetter]);

  // Agrupar por letra
  const termosPorLetra = useMemo(() => {
    const grouped: { [key: string]: typeof filteredTermos } = {};
    filteredTermos.forEach((termo) => {
      const letra = termo.Letra || "Outros";
      if (!grouped[letra]) {
        grouped[letra] = [];
      }
      grouped[letra].push(termo);
    });
    return grouped;
  }, [filteredTermos]);

  const letras = Object.keys(termosPorLetra).sort();
  
  // Todas as letras do alfabeto
  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letrasDisponiveis = useMemo(() => {
    if (!dicionario) return [];
    return [...new Set(dicionario.map(t => t.Letra).filter(Boolean))].sort() as string[];
  }, [dicionario]);

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Dicionário Jurídico</h1>
        <p className="text-sm text-muted-foreground">
          Consulte termos e definições do direito
        </p>
      </div>

      {/* Seletor de Letras */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5 justify-center">
          <Badge
            variant={selectedLetter === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all",
              selectedLetter === null && "bg-accent text-accent-foreground"
            )}
            onClick={() => setSelectedLetter(null)}
          >
            Todas
          </Badge>
          {alfabeto.map((letra) => {
            const disponivel = letrasDisponiveis.includes(letra);
            return (
              <Badge
                key={letra}
                variant={selectedLetter === letra ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all min-w-[32px] justify-center",
                  selectedLetter === letra && "bg-accent text-accent-foreground",
                  !disponivel && "opacity-30 cursor-not-allowed"
                )}
                onClick={() => disponivel && setSelectedLetter(letra)}
              >
                {letra}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar termo jurídico exato..."
          className="pl-10 h-11 bg-card border-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredTermos.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary mb-3">
            <Book className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Nenhum termo encontrado" : "Nenhum termo disponível"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {letras.map((letra) => (
            <div key={letra}>
              <h2 className="text-2xl font-bold text-accent mb-3">{letra}</h2>
              <div className="space-y-3">
                {termosPorLetra[letra].map((termo, index) => (
                  <Card key={`${letra}-${index}`}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-accent">
                        {termo.Palavra}
                      </h3>
                      <p className="text-sm text-foreground mb-3">
                        {termo.Significado}
                      </p>
                      {(termo["Exemplo de Uso 1"] || termo["Exemplo de Uso 2"]) && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground">
                            Exemplos de uso:
                          </p>
                          {termo["Exemplo de Uso 1"] && (
                            <p className="text-sm text-muted-foreground italic">
                              • {termo["Exemplo de Uso 1"]}
                            </p>
                          )}
                          {termo["Exemplo de Uso 2"] && (
                            <p className="text-sm text-muted-foreground italic">
                              • {termo["Exemplo de Uso 2"]}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dicionario;

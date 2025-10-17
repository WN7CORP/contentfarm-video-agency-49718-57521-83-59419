import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BibliotecaIntro } from "@/components/BibliotecaIntro";
import { BibliotecaCard } from "@/components/BibliotecaCard";
import { LivroCard } from "@/components/LivroCard";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
interface BibliotecaItem {
  id: number;
  Área: string | null;
  Ordem: number | null;
  Tema: string | null;
  Download: string | null;
  Link: string | null;
  "Capa-area": string | null;
  "Capa-livro": string | null;
  Sobre: string | null;
}
const BibliotecaEstudos = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: items,
    isLoading
  } = useQuery({
    queryKey: ["biblioteca-estudos"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("BIBLIOTECA-ESTUDOS").select("*").order("Ordem", {
        ascending: true
      });
      if (error) throw error;
      return data as BibliotecaItem[];
    }
  });

  // Agrupar por área
  const areaGroups = items?.reduce((acc, item) => {
    const area = item.Área || "Sem Área";
    if (!acc[area]) {
      acc[area] = {
        capa: item["Capa-area"],
        livros: []
      };
    }
    acc[area].livros.push(item);
    return acc;
  }, {} as Record<string, {
    capa: string | null;
    livros: BibliotecaItem[];
  }>);
  const sobreTexto = `A Biblioteca de Estudos é o coração do seu aprendizado jurídico. Aqui você encontrará materiais didáticos cuidadosamente selecionados e organizados por área do Direito para otimizar seus estudos.

Cada obra foi escolhida pensando nas necessidades de estudantes de Direito, desde o início da graduação até a preparação para concursos e exames da OAB. O conteúdo abrange todas as principais disciplinas jurídicas com profundidade e didática.

Esta biblioteca é sua ferramenta essencial para construir uma base sólida de conhecimento jurídico e alcançar a excelência acadêmica e profissional.`;
  if (showIntro) {
    return <BibliotecaIntro titulo="Biblioteca de Estudos" sobre={sobreTexto} capaUrl={items?.[0]?.["Capa-area"] || null} onAcessar={() => setShowIntro(false)} />;
  }
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>;
  }

  // Se uma área foi selecionada, mostrar os livros dessa área
  if (selectedArea && areaGroups) {
    const areaData = areaGroups[selectedArea];
    const livrosFiltrados = areaData.livros.filter(livro => (livro.Tema || "").toLowerCase().includes(searchTerm.toLowerCase()));
    return <div className="px-3 py-4 max-w-4xl mx-auto pb-20 animate-fade-in">
        <div className="mb-6">
          
          <h1 className="text-xl md:text-2xl font-bold mb-1">{selectedArea}</h1>
          <p className="text-sm text-muted-foreground">
            {areaData.livros.length} {areaData.livros.length === 1 ? "livro disponível" : "livros disponíveis"}
          </p>
        </div>

        {/* Barra de Pesquisa de Livros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input placeholder="Buscar livro..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="text-base" />
              <Button variant="outline" size="icon" className="shrink-0">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {livrosFiltrados.map((livro, idx) => <LivroCard key={idx} titulo={livro.Tema || "Sem título"} subtitulo={selectedArea} capaUrl={livro["Capa-livro"]} sobre={livro.Sobre} onClick={() => navigate(`/biblioteca-estudos/${livro.id}`)} />)}
        </div>
      </div>;
  }

  // Mostrar lista de áreas
  const areasFiltradas = areaGroups ? Object.keys(areaGroups).filter(area => area.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => a.localeCompare(b, 'pt-BR', {
    sensitivity: 'base'
  })) : [];
  return <div className="px-3 py-4 max-w-4xl mx-auto pb-20 animate-fade-in">
      
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Biblioteca de Estudos</h1>
        <p className="text-sm text-muted-foreground">
          Acesse livros e materiais organizados por área do Direito
        </p>
      </div>

      {/* Barra de Pesquisa de Áreas */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input placeholder="Buscar área..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="text-base" />
            <Button variant="outline" size="icon" className="shrink-0">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areasFiltradas.map(area => {
        const data = areaGroups![area];
        return <BibliotecaCard key={area} area={area} capaUrl={data.capa} livrosCount={data.livros.length} onClick={() => setSelectedArea(area)} />;
      })}
      </div>
    </div>;
};
export default BibliotecaEstudos;
import { Search, ChevronRight, BookOpen, PlayCircle, GraduationCap, Layers, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

interface BibliotecaResult {
  id: number;
  livro: string;
  autor: string;
  imagem: string;
  biblioteca: string;
  bibliotecaId: string;
}

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  area?: string;
  playlistLink?: string;
}

interface CursoResult {
  id: number;
  tema: string;
  assunto: string;
  area: string;
  modulo: number;
  aula: number;
}

interface FlashcardResult {
  area: string;
  tema: string;
  count: number;
}

// Cache em memória para resultados
const searchCache = new Map<string, any>();

const Pesquisar = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<any>({ bibliotecas: [], videoaulas: [], cursos: [], flashcards: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTab, setSelectedTab] = useState("todos");
  const navigate = useNavigate();

  // Pre-carregar todos os dados uma vez
  const { data: allCursos } = useQuery({
    queryKey: ["all-cursos"],
    queryFn: async () => {
      const { data } = await supabase.from('CURSOS' as any).select('*');
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos (antes cacheTime)
    refetchOnWindowFocus: false
  });

  const { data: allFlashcards } = useQuery({
    queryKey: ["all-flashcards"],
    queryFn: async () => {
      const { data } = await supabase.from('FLASHCARDS' as any).select('area, tema');
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (query.length >= 3) {
      const timer = setTimeout(() => handleSearch(query), 300); // Reduzido de 500ms para 300ms
      return () => clearTimeout(timer);
    } else if (query.length === 0) {
      setResults({ bibliotecas: [], videoaulas: [], cursos: [], flashcards: [] });
      setHasSearched(false);
    }
  }, [query, allCursos, allFlashcards]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 3) return;
    
    // Verificar cache primeiro
    const cacheKey = searchQuery.toLowerCase().trim();
    if (searchCache.has(cacheKey)) {
      setResults(searchCache.get(cacheKey)!);
      setHasSearched(true);
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);

    try {
      const searchLower = searchQuery.toLowerCase().trim();
      
      const [bibliotecasData, cursosData, flashcardsData, videosData] = await Promise.all([
        searchBibliotecas(searchLower),
        searchCursosOptimized(searchLower),
        searchFlashcardsOptimized(searchLower),
        searchVideoaulas(searchLower)
      ]);

      const resultData = { 
        bibliotecas: bibliotecasData, 
        videoaulas: videosData, 
        cursos: cursosData, 
        flashcards: flashcardsData 
      };
      
      // Armazenar em cache
      searchCache.set(cacheKey, resultData);
      setResults(resultData);
    } catch (error) {
      toast.error("Erro ao realizar a busca");
    } finally {
      setIsSearching(false);
    }
  };
  
  // Função otimizada que busca em memória quando possível
  const searchCursosOptimized = (searchTerm: string): CursoResult[] => {
    if (allCursos && allCursos.length > 0) {
      return allCursos
        .filter((item: any) => 
          item.Area?.toLowerCase().includes(searchTerm) ||
          item.Tema?.toLowerCase().includes(searchTerm) ||
          item.Assunto?.toLowerCase().includes(searchTerm)
        )
        .slice(0, 10)
        .map((item: any) => ({
          id: item.id,
          tema: item.Tema || '',
          assunto: item.Assunto || '',
          area: item.Area || '',
          modulo: item.Modulo || 1,
          aula: item.Aula || 1
        }));
    }
    return [];
  };
  
  const searchFlashcardsOptimized = (searchTerm: string): FlashcardResult[] => {
    if (allFlashcards && allFlashcards.length > 0) {
      const filtered = allFlashcards.filter((item: any) =>
        item.area?.toLowerCase().includes(searchTerm) ||
        item.tema?.toLowerCase().includes(searchTerm)
      ).slice(0, 50);
      
      const grouped = filtered.reduce((acc: any, item: any) => {
        const key = `${item.area}|${item.tema}`;
        if (!acc[key]) acc[key] = { area: item.area, tema: item.tema, count: 0 };
        acc[key].count++;
        return acc;
      }, {});
      
      return Object.values(grouped);
    }
    return [];
  };

  const searchBibliotecas = async (searchTerm: string): Promise<BibliotecaResult[]> => {
    const bibliotecas = [
      { tabela: 'BIBLIOTECA-CLASSICOS', nome: 'Clássicos', id: 'classicos' },
      { tabela: 'BIBLIOTECA-ESTUDOS', nome: 'Estudos', id: 'estudos' },
      { tabela: 'BIBILIOTECA-OAB', nome: 'OAB', id: 'oab' }
    ];

    const allResults: BibliotecaResult[] = [];
    for (const bib of bibliotecas) {
      try {
        const { data } = await supabase.from(bib.tabela as any).select('*')
          .or(`livro.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%`).limit(5);
        if (data) {
          allResults.push(...data.map((item: any) => ({
            id: item.id,
            livro: item.livro || item.Tema || '',
            autor: item.autor || '',
            imagem: item.imagem || item['capa-livro'] || '',
            biblioteca: bib.nome,
            bibliotecaId: bib.id
          })));
        }
      } catch (err) {}
    }
    return allResults;
  };


  const searchVideoaulas = async (searchTerm: string): Promise<VideoResult[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('buscar-videos-globalmente', {
        body: { searchTerm, limit: 10 }
      });
      
      if (error) throw error;
      
      return (data?.videos || []).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        thumbnail: v.thumbnail,
        area: v.playlistArea,
        playlistLink: v.playlistLink
      }));
    } catch (err) {
      console.error('Erro ao buscar videoaulas:', err);
      return [];
    }
  };

  const totalResults = results.bibliotecas.length + results.videoaulas.length + results.cursos.length + results.flashcards.length;

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Pesquisar</h1>
        <p className="text-sm text-muted-foreground">Busque em bibliotecas, cursos e flashcards</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Digite pelo menos 3 caracteres..." className="pl-10 h-11" value={query}
          onChange={(e) => setQuery(e.target.value)} autoFocus />
      </div>

      {isSearching && <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" /></div>}

      {!isSearching && hasSearched && totalResults === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary mb-3">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
        </div>
      )}

      {!isSearching && !hasSearched && (
        <div className="text-center py-16">
          <Search className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {query.length === 0 ? 'Digite algo para iniciar' : `Digite mais ${3 - query.length} caractere${3 - query.length > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {!isSearching && totalResults > 0 && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-5 mb-6 h-auto gap-1.5 bg-secondary/50 p-2">
            <TabsTrigger value="todos" className="text-xs">Todos ({totalResults})</TabsTrigger>
            <TabsTrigger value="bibliotecas" disabled={!results.bibliotecas.length} className="text-xs">📚 ({results.bibliotecas.length})</TabsTrigger>
            <TabsTrigger value="videoaulas" disabled={!results.videoaulas.length} className="text-xs">🎥 ({results.videoaulas.length})</TabsTrigger>
            <TabsTrigger value="cursos" disabled={!results.cursos.length} className="text-xs">📖 ({results.cursos.length})</TabsTrigger>
            <TabsTrigger value="flashcards" disabled={!results.flashcards.length} className="text-xs">⚡ ({results.flashcards.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {results.bibliotecas.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />Bibliotecas ({results.bibliotecas.length})
                </h2>
                <div className="space-y-2">
                  {results.bibliotecas.slice(0, 3).map((item: BibliotecaResult) => (
                    <button key={item.id} onClick={() => navigate(`/biblioteca-${item.bibliotecaId}/${item.id}`)}
                      className="w-full bg-card hover:bg-accent/10 border rounded-lg p-3 text-left transition-all group">
                      <div className="flex gap-3">
                        {item.imagem && <img src={item.imagem} alt={item.livro} className="w-12 h-16 object-cover rounded" />}
                        <div className="flex-1">
                          <p className="text-xs text-accent mb-1">{item.biblioteca}</p>
                          <h3 className="font-semibold text-sm">{item.livro}</h3>
                          {item.autor && <p className="text-xs text-muted-foreground">{item.autor}</p>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.videoaulas.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-red-500" />Videoaulas ({results.videoaulas.length})
                </h2>
                <div className="space-y-2">
                  {results.videoaulas.slice(0, 3).map((item: VideoResult) => (
                    <button key={item.id} onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(item.playlistLink || '')}&videoId=${item.id}&fromSearch=true`)}
                      className="w-full bg-card hover:bg-accent/10 border rounded-lg p-3 text-left transition-all group">
                      <div className="flex gap-3">
                        <img src={item.thumbnail} alt={item.title} className="w-24 aspect-video object-cover rounded" />
                        <div className="flex-1">
                          {item.area && <p className="text-xs text-red-500 mb-1">{item.area}</p>}
                          <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.cursos.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />Cursos ({results.cursos.length})
                </h2>
                <div className="space-y-2">
                  {results.cursos.slice(0, 3).map((item: CursoResult) => (
                    <button key={item.id} onClick={() => navigate(`/cursos/aula?id=${item.id}&fromSearch=true`)}
                      className="w-full bg-card hover:bg-accent/10 border rounded-lg p-3 text-left transition-all group relative">
                      <p className="text-xs text-blue-500 mb-1">{item.area} • M{item.modulo} • A{item.aula}</p>
                      <h3 className="font-semibold text-sm">{item.tema}</h3>
                      <ChevronRight className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-accent" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.flashcards.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />Flashcards ({results.flashcards.length})
                </h2>
                <div className="space-y-2">
                  {results.flashcards.slice(0, 3).map((item: FlashcardResult) => (
                    <button key={`${item.area}-${item.tema}`}
                      onClick={() => navigate(`/flashcards/estudar?area=${encodeURIComponent(item.area)}&tema=${encodeURIComponent(item.tema)}&fromSearch=true`)}
                      className="w-full bg-card hover:bg-accent/10 border rounded-lg p-3 text-left transition-all">
                      <p className="text-xs text-purple-500 mb-1">{item.area}</p>
                      <h3 className="font-semibold text-sm">{item.tema}</h3>
                      <p className="text-xs text-muted-foreground">{item.count} flashcards</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bibliotecas" className="space-y-2">
            {results.bibliotecas.map((item: BibliotecaResult) => (
              <button key={item.id} onClick={() => navigate(`/biblioteca-${item.bibliotecaId}/${item.id}`)}
                className="w-full bg-card hover:bg-accent/10 border rounded-lg p-4 text-left transition-all">
                <div className="flex gap-4">
                  {item.imagem && <img src={item.imagem} alt={item.livro} className="w-16 h-20 object-cover rounded" />}
                  <div className="flex-1">
                    <p className="text-sm text-accent font-medium">{item.biblioteca}</p>
                    <h3 className="font-bold">{item.livro}</h3>
                    {item.autor && <p className="text-sm text-muted-foreground">{item.autor}</p>}
                  </div>
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="videoaulas" className="space-y-2">
            {results.videoaulas.map((item: VideoResult) => (
              <button key={item.id} onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(item.playlistLink || '')}&videoId=${item.id}&fromSearch=true`)}
                className="w-full bg-card hover:bg-accent/10 border rounded-lg p-4 text-left transition-all">
                <div className="flex gap-4">
                  <div className="relative w-32 aspect-video flex-shrink-0 rounded overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    {item.area && <p className="text-sm text-red-500 mb-1 font-medium">{item.area}</p>}
                    <h3 className="font-bold line-clamp-3">{item.title}</h3>
                  </div>
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="cursos" className="space-y-2">
            {results.cursos.map((item: CursoResult) => (
              <button key={item.id} onClick={() => navigate(`/cursos/aula?id=${item.id}&fromSearch=true`)}
                className="w-full bg-card hover:bg-accent/10 border rounded-lg p-4 text-left transition-all">
                <p className="text-sm text-blue-500 mb-2">{item.area} • Módulo {item.modulo} • Aula {item.aula}</p>
                <h3 className="font-bold">{item.tema}</h3>
                <p className="text-sm text-muted-foreground">{item.assunto}</p>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-2">
            {results.flashcards.map((item: FlashcardResult) => (
              <button key={`${item.area}-${item.tema}`}
                onClick={() => navigate(`/flashcards/estudar?area=${encodeURIComponent(item.area)}&tema=${encodeURIComponent(item.tema)}&fromSearch=true`)}
                className="w-full bg-card hover:bg-accent/10 border rounded-lg p-4 text-left transition-all">
                <p className="text-sm text-purple-500 mb-2">{item.area}</p>
                <h3 className="font-bold">{item.tema}</h3>
                <p className="text-sm text-muted-foreground">{item.count} flashcards disponíveis</p>
              </button>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Pesquisar;

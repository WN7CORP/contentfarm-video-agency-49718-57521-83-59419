import { useEffect, useState } from "react";
import { Video, Search, Loader2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoPlaylistCarousel } from "@/components/VideoPlaylistCarousel";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Area {
  categoria: string;
  playlists: Playlist[];
}

interface Playlist {
  id: number;
  area: string;
  link: string;
  thumbnail?: string;
}

const VideoaulasAreas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");

  useEffect(() => {
    fetchAreas();
  }, []);

  // Busca otimizada com cache e debounce reduzido
  useEffect(() => {
    if (searchTerm.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      buscarVideos();
    }, 200); // Reduzido de 500ms para 200ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Carregar TODAS as thumbnails em PARALELO instantaneamente quando uma aba é selecionada
  useEffect(() => {
    if (activeTab === "todos") return;
    
    const loadCategoryThumbnails = async () => {
      const activeArea = areas.find(a => a.categoria === activeTab);
      if (!activeArea) return;

      const playlistsToLoad = activeArea.playlists.filter(p => !p.thumbnail);
      if (playlistsToLoad.length === 0) return;

      // Carrega TODAS as thumbnails simultaneamente usando Promise.allSettled
      await Promise.allSettled(
        playlistsToLoad.map(async (playlist) => {
          try {
            const { data, error } = await supabase.functions.invoke(
              'buscar-videos-playlist',
              { body: { playlistLink: playlist.link } }
            );

            if (!error && data?.videos?.[0]?.thumbnail) {
              setAreas(prevAreas => 
                prevAreas.map(area => 
                  area.categoria === activeTab
                    ? {
                        ...area,
                        playlists: area.playlists.map(p =>
                          p.id === playlist.id
                            ? { ...p, thumbnail: data.videos[0].thumbnail }
                            : p
                        )
                      }
                    : area
                )
              );
            }
          } catch (err) {
            console.error('Erro ao carregar thumbnail:', err);
          }
        })
      );
    };

    loadCategoryThumbnails();
  }, [activeTab]);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('VIDEO AULAS')
        .select('*');

      if (error) throw error;

      // Agrupar por categoria
      const grouped = data.reduce((acc: { [key: string]: any[] }, curr: any) => {
        const cat = curr.categoria || 'Outros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(curr);
        return acc;
      }, {});

      // Organizar por categoria com thumbnails lazy
      const areasWithPlaylists = Object.entries(grouped).map(([categoria, playlists]) => ({
        categoria,
        playlists: (playlists as any[]).map((playlist) => ({
          id: playlist.id,
          area: playlist.area,
          link: playlist.link,
          thumbnail: null // Lazy loading via VideoPlaylistCarousel
        }))
      }));

      setAreas(areasWithPlaylists);
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as áreas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarVideos = async () => {
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "buscar-videos-globalmente",
        { body: { searchTerm } }
      );

      if (error) throw error;

      setSearchResults(data?.videos || []);
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar os vídeos",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  // Obter categorias únicas para as abas
  const categorias = ["todos", ...areas.map(a => a.categoria)];
  
  // Filtrar playlists pela categoria ativa
  const activeArea = areas.find(a => a.categoria === activeTab);
  const activePlaylists = activeArea?.playlists || [];

  if (loading) {
    return (
      <div className="px-3 py-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1">Videoaulas</h1>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Videoaulas</h1>
        <p className="text-sm text-muted-foreground">
          Selecione uma playlist para assistir
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl mb-4">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por área ou tema..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menu de Abas Horizontal (apenas quando não está buscando) */}
      {searchTerm.length < 3 && (
        <ScrollArea className="w-full mb-4">
          <div className="flex gap-2 pb-2">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setActiveTab(categoria)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === categoria 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {categoria === "todos" && <Home className="w-4 h-4" />}
                {categoria === "todos" ? "Todos" : categoria}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Resultados da Busca ou Áreas */}
      {searchTerm.length >= 3 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Buscando vídeos...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {searchResults.length} vídeo{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
              </>
            )}
          </div>

          {searching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((video) => (
                <Card
                  key={video.videoId}
                  className="cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all group"
                  onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(video.playlistLink)}&startVideo=${video.videoId}`)}
                >
                  <CardContent className="p-3 flex gap-3">
                    <div className="relative w-40 min-w-40 aspect-video bg-secondary rounded overflow-hidden">
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Video className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {video.area}
                        </Badge>
                        {video.categoria && (
                          <Badge variant="outline" className="text-xs">
                            {video.categoria}
                          </Badge>
                        )}
                      </div>
                      {video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum vídeo encontrado para "{searchTerm}"</p>
              <p className="text-sm mt-2">Tente outros termos de busca</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Digite pelo menos 3 caracteres para buscar
            </p>
          )}
          
          {/* Conteúdo baseado na aba ativa */}
          {activeTab === "todos" ? (
            /* Áreas com Carrosséis de Playlists */
            <div className="space-y-6">
              {areas.map((area) => (
                <div key={area.categoria} className="space-y-3">
                  {/* Cabeçalho da Categoria */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg shadow-red-500/50">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{area.categoria}</h2>
                        <p className="text-xs text-muted-foreground">
                          {area.playlists.length} playlist{area.playlists.length !== 1 ? 's' : ''} disponíve{area.playlists.length !== 1 ? 'is' : 'l'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carrossel de Playlists */}
                  <VideoPlaylistCarousel playlists={area.playlists} />
                </div>
              ))}
            </div>
          ) : (
            /* Lista vertical da categoria específica */
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg shadow-red-500/50">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{activeTab}</h2>
                  <p className="text-xs text-muted-foreground">
                    {activePlaylists.length} playlist{activePlaylists.length !== 1 ? 's' : ''} disponíve{activePlaylists.length !== 1 ? 'is' : 'l'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activePlaylists.map((playlist) => (
                  <Card
                    key={playlist.id}
                    className="cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all border border-accent/20 hover:border-accent/50 bg-card group shadow-xl overflow-hidden"
                    onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(playlist.link)}`)}
                  >
                    <div className="relative aspect-video bg-secondary">
                      {playlist.thumbnail && (
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.area}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {!playlist.thumbnail && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-12 h-12 text-accent" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-3 shadow-lg">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base text-foreground break-words leading-tight">
                        {playlist.area}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoaulasAreas;

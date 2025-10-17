import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Crown, Gavel, FileText, Scale, GraduationCap, BookOpen as BookOpenIcon, Library, Hammer, Target, Search, Headphones, Play, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from 'embla-carousel-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AudioAula } from "@/types/database.types";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  const [emblaRefAudio] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  const [emblaRefVideo] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  const {
    data: livrosClassicos
  } = useQuery({
    queryKey: ["livros-classicos"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("BIBLIOTECA-CLASSICOS" as any).select("*");
      if (error) throw error;
      // Randomizar a ordem dos livros
      return data ? [...data].sort(() => Math.random() - 0.5) : [];
    }
  });
  const {
    data: videoaulasDestaque
  } = useQuery({
    queryKey: ["videoaulas-destaque"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("VIDEO AULAS" as any).select("*").eq("categoria", "Faculdade");
      if (error) throw error;
      
      // Buscar todos os vídeos de todas as playlists
      const todosVideos: any[] = [];
      
      for (const playlist of (data || []) as any[]) {
        try {
          const { data: videoData } = await supabase.functions.invoke(
            'buscar-videos-playlist',
            { body: { playlistLink: playlist.link } }
          );
          
          if (videoData?.videos && Array.isArray(videoData.videos)) {
            // Adicionar informações da playlist a cada vídeo
            const videosComPlaylist = videoData.videos.map((video: any) => ({
              ...video,
              playlistArea: playlist.area,
              playlistLink: playlist.link
            }));
            todosVideos.push(...videosComPlaylist);
          }
        } catch (err) {
          console.error('Erro ao buscar vídeos da playlist:', err);
        }
      }
      
      // Randomizar a ordem dos vídeos
      return todosVideos.sort(() => Math.random() - 0.5);
    }
  });
  const vadeMecumCategories = [{
    id: "constituicao",
    title: "Constituição",
    description: "Acesse a Constituição Federal",
    icon: Crown,
    color: "bg-[hsl(30,95%,55%)]",
    route: "/constituicao"
  }, {
    id: "codigos",
    title: "Códigos e Leis",
    description: "Explore códigos e legislação",
    icon: Scale,
    color: "bg-[hsl(0,65%,45%)]",
    route: "/codigos"
  }, {
    id: "estatutos",
    title: "Estatutos",
    description: "Consulte estatutos especiais",
    icon: Gavel,
    color: "bg-[hsl(280,70%,50%)]",
    route: "/estatutos"
  }, {
    id: "sumulas",
    title: "Súmulas",
    description: "Súmulas do STF e STJ",
    icon: FileText,
    color: "bg-[hsl(200,75%,45%)]",
    route: "/sumulas"
  }];
  const academicCategories = [{
    id: "aprender",
    title: "Aprender",
    description: "Professora IA e cursos completos",
    icon: GraduationCap,
    gradient: "from-[hsl(260,80%,60%)] to-[hsl(240,90%,55%)]",
    route: "/aprender"
  }, {
    id: "bibliotecas",
    title: "Bibliotecas",
    description: "Livros e materiais da OAB",
    icon: Library,
    gradient: "from-[hsl(0,75%,55%)] to-[hsl(340,80%,50%)]",
    route: "/bibliotecas"
  }, {
    id: "ferramentas",
    title: "Ferramentas",
    description: "Dicionário jurídico completo",
    icon: Gavel,
    gradient: "from-[hsl(160,70%,45%)] to-[hsl(150,75%,40%)]",
    route: "/ferramentas"
  }, {
    id: "simulados",
    title: "Simulados",
    description: "Pratique com questões da OAB",
    icon: Target,
    gradient: "from-[hsl(320,75%,55%)] to-[hsl(280,80%,60%)]",
    route: "/simulados"
  }];
  return <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      

      <div className="flex-1 px-3 md:px-6 py-4 md:py-6 space-y-5 md:space-y-6">
        {/* Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim().length >= 3) {
              navigate(`/pesquisar?q=${encodeURIComponent(searchQuery)}`);
            } else {
              toast.error("Digite pelo menos 3 caracteres");
            }
          }}
          className="flex items-center gap-2 w-full"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2.5 bg-muted rounded-xl">
            <Search className="w-5 h-5 md:w-4 md:h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você quer buscar?"
              className="flex-1 bg-transparent outline-none text-foreground text-sm md:text-xs placeholder:text-foreground/60"
            />
          </div>
          <button
            type="submit"
            disabled={searchQuery.trim().length < 3}
            className="px-6 py-3 md:py-2.5 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm md:text-xs whitespace-nowrap"
          >
            Buscar
          </button>
        </form>

        {/* Vade Mecum Elite Section - Carrossel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-lg font-semibold text-foreground">Vade mecum Elite</h2>
              <span className="px-2.5 py-0.5 md:px-2 md:py-0.5 bg-accent rounded-full text-xs md:text-[10px] font-bold text-accent-foreground">PRO</span>
            </div>
            <button onClick={() => navigate("/vade-mecum")} className="text-accent font-medium flex items-center text-sm md:text-xs">
              Todas <span className="text-lg md:text-base ml-0.5">›</span>
            </button>
          </div>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 md:gap-4">
              {vadeMecumCategories.map(category => {
              const Icon = category.icon;
              return <button key={category.id} onClick={() => navigate(category.route)} className="flex-[0_0_42%] md:flex-[0_0_28%] lg:flex-[0_0_22%] min-w-0 bg-card rounded-xl p-4 md:p-3 text-left transition-all hover:scale-105 hover:shadow-lg">
                    <div className={`${category.color} rounded-xl p-3 md:p-2 w-fit mb-3 md:mb-2`}>
                      <Icon className="w-6 h-6 md:w-5 md:h-5 text-white" />
                    </div>
                    <h3 className="text-base md:text-sm font-bold text-foreground mb-1 line-clamp-1">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-[11px] line-clamp-2">
                      {category.description}
                    </p>
                  </button>;
            })}
            </div>
          </div>
        </div>

        {/* Academic Environment Section */}
        <div className="space-y-3">
          <h2 className="text-xl md:text-lg font-semibold text-foreground px-1">Ambiente Acadêmico</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {academicCategories.map(category => {
            const Icon = category.icon;
            return <button key={category.id} onClick={() => navigate(category.route)} className={`bg-gradient-to-br ${category.gradient} rounded-2xl md:rounded-xl p-5 md:p-4 text-left transition-all hover:scale-105 hover:shadow-xl min-h-[160px] md:min-h-[140px] flex flex-col relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-tl from-black/60 via-black/30 to-transparent pointer-events-none" />
                  <div className="bg-white/20 rounded-xl md:rounded-lg p-2.5 md:p-2 w-fit relative z-10 shadow-lg mb-3 md:mb-2">
                    <Icon className="w-6 h-6 md:w-5 md:h-5 text-white" />
                  </div>
                  <h3 className="text-lg md:text-base font-bold text-white mb-2 md:mb-1 relative z-10" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    {category.title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-[11px] line-clamp-2 relative z-10" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                    {category.description}
                  </p>
                </button>;
          })}
          </div>
        </div>

        {/* Livros em Destaque */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl md:text-lg font-semibold text-foreground">Livros em Destaque</h2>
            <button onClick={() => navigate("/biblioteca-classicos")} className="text-accent font-medium flex items-center text-sm md:text-xs">
              Ver todos <span className="text-lg md:text-base ml-0.5">›</span>
            </button>
          </div>
          
          {livrosClassicos && livrosClassicos.length > 0 ? <div className="overflow-hidden" ref={emblaRefAudio}>
              <div className="flex gap-3 md:gap-4">
                {livrosClassicos.map((livro: any) => <div key={livro.id} className="flex-[0_0_33%] md:flex-[0_0_20%] lg:flex-[0_0_16%] min-w-0">
                    <Card className="cursor-pointer hover:scale-105 transition-transform overflow-hidden group h-full" onClick={() => navigate("/biblioteca-classicos")}>
                      <div className="aspect-[3/4] relative bg-gradient-to-br from-accent/20 to-accent/5">
                        {livro.imagem ? <img src={livro.imagem} alt={livro.livro || ""} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                            <BookOpenIcon className="w-12 h-12 md:w-10 md:h-10 text-accent/50" />
                          </div>}
                      </div>
                      <CardContent className="p-2 md:p-1.5">
                        <h3 className="font-semibold text-xs md:text-[11px] line-clamp-2 mb-2 md:mb-1">
                          {livro.livro || "Sem título"}
                        </h3>
                        
                      </CardContent>
                    </Card>
                  </div>)}
              </div>
            </div> : <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 md:w-5 md:h-5 animate-spin text-accent" />
            </div>}
        </div>

        {/* Videoaulas em Destaque */}
        {videoaulasDestaque && videoaulasDestaque.length > 0 && <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl md:text-lg font-semibold text-foreground">Videoaulas em Destaque</h2>
              <button onClick={() => navigate("/videoaulas")} className="text-red-400 font-medium flex items-center text-sm md:text-xs">
                Ver todas <span className="text-lg md:text-base ml-0.5">›</span>
              </button>
            </div>
            
            <div className="overflow-hidden" ref={emblaRefVideo}>
              <div className="flex gap-3 md:gap-4">
                {videoaulasDestaque.map((video: any, index: number) => <button key={`${video.videoId}-${index}`} onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(video.playlistLink)}&videoId=${video.videoId}`)} className="flex-[0_0_70%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0 bg-card rounded-xl overflow-hidden text-left transition-all hover:scale-105 hover:shadow-lg">
                    <div className="aspect-video relative bg-secondary">
                      {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 md:w-10 md:h-10 text-accent" />
                        </div>}
                      <div className="absolute inset-0 bg-black/20 flex items-end p-3 md:p-2">
                        <div className="bg-red-600 rounded-lg p-2 md:p-1.5 shadow-lg">
                          <Play className="w-5 h-5 md:w-4 md:h-4 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 md:p-2">
                      <h3 className="text-base md:text-sm font-bold text-foreground line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs md:text-[11px] text-muted-foreground mt-1">
                        {video.playlistArea}
                      </p>
                    </div>
                  </button>)}
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default Index;
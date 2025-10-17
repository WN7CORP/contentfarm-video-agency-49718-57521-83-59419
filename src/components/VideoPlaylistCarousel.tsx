import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Playlist {
  id: number;
  area: string;
  link: string;
  thumbnail?: string | null;
}

interface VideoPlaylistCarouselProps {
  playlists: Playlist[];
}

export const VideoPlaylistCarousel = ({ playlists }: VideoPlaylistCarouselProps) => {
  const navigate = useNavigate();
  const [playlistsWithThumbnails, setPlaylistsWithThumbnails] = useState<Playlist[]>(playlists);
  const [loadingThumbnails, setLoadingThumbnails] = useState<Set<number>>(new Set());
  
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  // Carregar TODAS as thumbnails em PARALELO instantaneamente
  useEffect(() => {
    const loadThumbnails = async () => {
      const playlistsToLoad = playlists.filter(p => !p.thumbnail);
      
      if (playlistsToLoad.length === 0) return;
      
      // Carrega TODAS as thumbnails simultaneamente usando Promise.allSettled
      await Promise.allSettled(
        playlistsToLoad.map(async (playlist) => {
          setLoadingThumbnails(prev => new Set(prev).add(playlist.id));
          
          try {
            const { data, error } = await supabase.functions.invoke(
              'buscar-videos-playlist',
              { body: { playlistLink: playlist.link } }
            );

            if (!error && data?.videos?.[0]?.thumbnail) {
              setPlaylistsWithThumbnails(prev => 
                prev.map(p => 
                  p.id === playlist.id 
                    ? { ...p, thumbnail: data.videos[0].thumbnail }
                    : p
                )
              );
            }
          } catch (err) {
            console.error('Erro ao carregar thumbnail:', err);
          } finally {
            setLoadingThumbnails(prev => {
              const newSet = new Set(prev);
              newSet.delete(playlist.id);
              return newSet;
            });
          }
        })
      );
    };

    loadThumbnails();
  }, [playlists]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-3 md:gap-4">
        {playlistsWithThumbnails.map((playlist) => (
          <div key={playlist.id} className="flex-[0_0_70%] md:flex-[0_0_25%] min-w-0">
            <Card
              className="cursor-pointer hover:scale-105 hover:shadow-2xl transition-all border border-accent/20 hover:border-accent/50 bg-card group shadow-xl overflow-hidden"
              onClick={() => navigate(`/videoaulas/player?link=${encodeURIComponent(playlist.link)}`)}
            >
              <div className="relative aspect-video bg-secondary">
                {playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.area}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {loadingThumbnails.has(playlist.id) ? (
                      <div className="animate-pulse">
                        <Video className="w-12 h-12 text-accent/50" />
                      </div>
                    ) : (
                      <Video className="w-12 h-12 text-accent" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 shadow-lg">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm text-foreground break-words leading-tight min-h-[2.5rem]">
                  {playlist.area}
                </h3>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

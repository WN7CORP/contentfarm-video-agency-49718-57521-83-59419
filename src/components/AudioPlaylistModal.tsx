import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Music2 } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { AudioAula } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";

interface AudioPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArea: string;
}

const AudioPlaylistModal = ({ isOpen, onClose, currentArea }: AudioPlaylistModalProps) => {
  const { playAudio, currentAudio, isPlaying } = useAudioPlayer();

  const { data: audios, isLoading } = useQuery({
    queryKey: ["audioaulas-playlist", currentArea],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("AUDIO-AULA" as any)
        .select("*")
        .eq("area", currentArea)
        .order("sequencia", { ascending: true });

      if (error) throw error;
      return data as unknown as AudioAula[];
    },
    enabled: isOpen && !!currentArea,
  });

  const handleAudioClick = (audio: AudioAula) => {
    playAudio({
      id: audio.id,
      titulo: audio.titulo,
      url_audio: audio.url_audio,
      imagem_miniatura: audio.imagem_miniatura,
      descricao: audio.descricao,
      area: audio.area,
      tema: audio.tema,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gradient-to-br from-gray-900/98 to-gray-800/98 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Music2 className="w-5 h-5 text-purple-400" />
            Playlist: {currentArea}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {audios?.map((audio) => {
                const isCurrentAudio = currentAudio?.id === audio.id;
                return (
                  <div
                    key={audio.id}
                    onClick={() => handleAudioClick(audio)}
                    className={`cursor-pointer p-3 rounded-lg transition-all hover:bg-white/10 border ${
                      isCurrentAudio
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Número/Ícone */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrentAudio
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 text-gray-400"
                      }`}>
                        {isCurrentAudio && isPlaying ? (
                          <div className="flex gap-0.5 items-center">
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                            <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                            <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                          </div>
                        ) : audio.sequencia ? (
                          <span className="text-sm font-bold">{audio.sequencia}</span>
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold text-sm truncate ${
                            isCurrentAudio ? "text-purple-300" : "text-white"
                          }`}>
                            {audio.titulo}
                          </h4>
                          {audio.tag && (
                            <Badge variant="outline" className="text-xs shrink-0 border-purple-500/30 text-purple-300">
                              {audio.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {audio.tema}
                        </p>
                      </div>

                      {/* Indicador Tocando */}
                      {isCurrentAudio && (
                        <div className="shrink-0">
                          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AudioPlaylistModal;

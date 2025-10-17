import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import SpotifyLikePlayer from "./SpotifyLikePlayer";

const GlobalAudioPlayer = () => {
  const { currentAudio, closePlayer } = useAudioPlayer();

  if (!currentAudio) return null;

  return (
    <SpotifyLikePlayer
      isOpen={!!currentAudio}
      onClose={closePlayer}
      audioUrl={currentAudio.url_audio}
      title={currentAudio.titulo}
      area={currentAudio.area}
      tema={currentAudio.tema}
      descricao={currentAudio.descricao}
      imagem_miniatura={currentAudio.imagem_miniatura}
    />
  );
};

export default GlobalAudioPlayer;

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface AudioItem {
  id: number;
  titulo: string;
  url_audio: string;
  imagem_miniatura: string;
  descricao: string;
  area: string;
  tema: string;
}

interface AudioPlayerContextType {
  currentAudio: AudioItem | null;
  isPlaying: boolean;
  playlist: AudioItem[];
  currentIndex: number;
  playAudio: (audio: AudioItem) => void;
  pauseAudio: () => void;
  togglePlayPause: () => void;
  closePlayer: () => void;
  setPlaylist: (audios: AudioItem[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylistState] = useState<AudioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentAudio]);

  const playAudio = (audio: AudioItem) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const closePlayer = () => {
    setCurrentAudio(null);
    setIsPlaying(false);
    setPlaylistState([]);
    setCurrentIndex(0);
  };

  const setPlaylist = (audios: AudioItem[]) => {
    setPlaylistState(audios);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    playAudio(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playAudio(playlist[prevIndex]);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAudio,
        isPlaying,
        playlist,
        currentIndex,
        playAudio,
        pauseAudio,
        togglePlayPause,
        closePlayer,
        setPlaylist,
        playNext,
        playPrevious,
        audioRef,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
};

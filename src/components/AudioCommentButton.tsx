import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioCommentButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const AudioCommentButton = ({ isPlaying, onClick }: AudioCommentButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm shadow-md hover:shadow-lg hover:scale-105 animate-fade-in relative overflow-hidden bg-secondary/50 hover:bg-secondary text-foreground"
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <AudioLines className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
        <span className="font-medium">{isPlaying ? "Comentando" : "Comentário"}</span>
      </div>
    </button>
  );
};

export default AudioCommentButton;

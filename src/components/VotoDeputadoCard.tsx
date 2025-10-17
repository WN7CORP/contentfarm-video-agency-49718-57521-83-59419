import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MinusCircle, Ban } from "lucide-react";

interface VotoDeputadoCardProps {
  voto: {
    deputado_: {
      id?: string;
      nome?: string;
      siglaPartido?: string;
      siglaUf?: string;
    };
    tipoVoto?: string;
  };
}

export const VotoDeputadoCard = ({ voto }: VotoDeputadoCardProps) => {
  const getVotoIcon = () => {
    switch (voto.tipoVoto) {
      case "Sim":
        return { icon: ThumbsUp, color: "text-green-400", bg: "bg-green-600/20" };
      case "Não":
        return { icon: ThumbsDown, color: "text-red-400", bg: "bg-red-600/20" };
      case "Abstenção":
        return { icon: MinusCircle, color: "text-gray-400", bg: "bg-gray-600/20" };
      case "Obstrução":
        return { icon: Ban, color: "text-orange-400", bg: "bg-orange-600/20" };
      default:
        return { icon: MinusCircle, color: "text-gray-400", bg: "bg-gray-600/20" };
    }
  };

  const { icon: Icon, color, bg } = getVotoIcon();

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {voto.deputado_?.nome}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">
                {voto.deputado_?.siglaPartido}/{voto.deputado_?.siglaUf}
              </span>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 ${bg} rounded-lg px-3 py-2`}>
            <Icon className={`w-4 h-4 ${color}`} />
            <span className={`text-xs font-bold ${color}`}>
              {voto.tipoVoto}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
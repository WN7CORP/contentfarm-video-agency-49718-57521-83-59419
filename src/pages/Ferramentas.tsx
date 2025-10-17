import { useNavigate } from "react-router-dom";
import { Gavel, ArrowRight, Headphones, Film, Scale, ScanText, Vote, Landmark, BookOpen, FileSearch, Newspaper, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Ferramentas = () => {
  const navigate = useNavigate();

  const ferramentas = [
    {
      id: "advogado",
      titulo: "Advogado",
      descricao: "Modelos e criação de petições com IA",
      icon: Scale,
      path: "/advogado",
      iconBg: "bg-blue-600 shadow-lg shadow-blue-500/50",
      glowColor: "rgb(37, 99, 235)",
    },
    {
      id: "camara-deputados",
      titulo: "Câmara dos Deputados",
      descricao: "Dados da Câmara, deputados e proposições",
      icon: Landmark,
      path: "/camara-deputados",
      iconBg: "bg-green-600 shadow-lg shadow-green-500/50",
      glowColor: "rgb(22, 163, 74)",
    },
    {
      id: "analisar",
      titulo: "Analisar",
      descricao: "Analise documentos com IA",
      icon: ScanText,
      path: "/analisar",
      iconBg: "bg-amber-600 shadow-lg shadow-amber-500/50",
      glowColor: "rgb(245, 158, 11)",
    },
    {
      id: "dicionario",
      titulo: "Dicionário Jurídico",
      descricao: "Consulte termos e definições do direito",
      icon: Gavel,
      path: "/dicionario",
      iconBg: "bg-emerald-600 shadow-lg shadow-emerald-500/50",
      glowColor: "rgb(5, 150, 105)",
    },
    {
      id: "juriflix",
      titulo: "JuriFlix",
      descricao: "Filmes e séries jurídicas",
      icon: Film,
      path: "/juriflix",
      iconBg: "bg-red-600 shadow-lg shadow-red-500/50",
      glowColor: "rgb(220, 38, 38)",
    },
    {
      id: "eleicoes",
      titulo: "Eleições",
      descricao: "Dados do TSE, candidatos e resultados",
      icon: Vote,
      path: "/eleicoes",
      iconBg: "bg-pink-600 shadow-lg shadow-pink-500/50",
      glowColor: "rgb(219, 39, 119)",
    },
    {
      id: "noticias-juridicas",
      titulo: "Notícias Jurídicas",
      descricao: "Fique por dentro das últimas notícias",
      icon: Newspaper,
      path: "/noticias-juridicas",
      iconBg: "bg-orange-600 shadow-lg shadow-orange-500/50",
      glowColor: "rgb(234, 88, 12)",
    },
    {
      id: "ranking-faculdades",
      titulo: "Ranking Faculdades",
      descricao: "Melhores faculdades de Direito do Brasil",
      icon: GraduationCap,
      path: "/ranking-faculdades",
      iconBg: "bg-violet-600 shadow-lg shadow-violet-500/50",
      glowColor: "rgb(139, 92, 246)",
    },
  ];

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Ferramentas</h1>
        <p className="text-sm text-muted-foreground">
          Recursos úteis para seus estudos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ferramentas.map((ferramenta) => {
          const Icon = ferramenta.icon;
          return (
            <Card
              key={ferramenta.id}
              className="cursor-pointer hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-accent/50 bg-gradient-to-br from-gray-900/95 to-gray-800/95 group shadow-xl overflow-hidden relative"
            >
              {/* Brilho colorido no topo */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ferramenta.glowColor}, transparent)`,
                  boxShadow: `0 0 20px ${ferramenta.glowColor}`
                }}
              />
              
              <CardContent className="p-5 flex flex-col items-center text-center min-h-[180px] justify-center"
                onClick={() => navigate(ferramenta.path)}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${ferramenta.iconBg} transition-transform group-hover:scale-110 mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{ferramenta.titulo}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{ferramenta.descricao}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Ferramentas;

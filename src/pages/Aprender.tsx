import { useNavigate } from "react-router-dom";
import { GraduationCap, Video, Sparkles, Scale, FileText, Calendar, Monitor, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Aprender = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const opcoes = [
    {
      id: "professora",
      titulo: "Professora IA",
      descricao: "Perguntar, explicar e aprender com inteligência artificial",
      icon: GraduationCap,
      path: "/professora",
      iconBg: "bg-purple-600 shadow-lg shadow-purple-500/50",
      glowColor: "rgb(147, 51, 234)",
    },
    {
      id: "cursos",
      titulo: "Cursos",
      descricao: "Acesse cursos completos de direito organizados por área",
      icon: Scale,
      path: "/cursos",
      iconBg: "bg-green-600 shadow-lg shadow-green-500/50",
      glowColor: "rgb(22, 163, 74)",
    },
    {
      id: "flashcards",
      titulo: "Flashcards",
      descricao: "Estude com flashcards interativos por área e tema",
      icon: Sparkles,
      path: "/flashcards",
      iconBg: "bg-blue-600 shadow-lg shadow-blue-500/50",
      glowColor: "rgb(37, 99, 235)",
    },
    {
      id: "videoaulas",
      titulo: "Videoaulas",
      descricao: "Assista videoaulas organizadas por área do direito",
      icon: Video,
      path: "/videoaulas",
      iconBg: "bg-red-600 shadow-lg shadow-red-500/50",
      glowColor: "rgb(220, 38, 38)",
    },
    {
      id: "resumos",
      titulo: "Resumos Jurídicos",
      descricao: "Crie resumos estruturados de textos e documentos",
      icon: FileText,
      path: "/resumos-juridicos",
      iconBg: "bg-orange-600 shadow-lg shadow-orange-500/50",
      glowColor: "rgb(234, 88, 12)",
    },
    {
      id: "acesso-desktop",
      titulo: "Acesso Desktop",
      descricao: "Solicite acesso à plataforma completa para desktop",
      icon: Monitor,
      path: "/acesso-desktop",
      iconBg: "bg-cyan-600 shadow-lg shadow-cyan-500/50",
      glowColor: "rgb(8, 145, 178)",
      mobileOnly: true,
    },
    {
      id: "audioaulas",
      titulo: "Audioaulas",
      descricao: "Aprenda ouvindo em qualquer lugar",
      icon: Headphones,
      path: "/audioaulas",
      iconBg: "bg-purple-600 shadow-lg shadow-purple-500/50",
      glowColor: "rgb(147, 51, 234)",
    },
    {
      id: "plano",
      titulo: "Plano de Estudos",
      descricao: "Organize seu cronograma de estudos personalizado",
      icon: Calendar,
      path: "/plano-estudos",
      iconBg: "bg-indigo-600 shadow-lg shadow-indigo-500/50",
      glowColor: "rgb(79, 70, 229)",
    },
  ];

  return (
    <div className="px-3 py-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Aprender</h1>
        <p className="text-sm text-muted-foreground">
          Recursos para seus estudos e aprendizado
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {opcoes
          .filter((opcao) => !opcao.mobileOnly || isMobile)
          .map((opcao) => {
          const Icon = opcao.icon;
          return (
            <Card
              key={opcao.id}
              className="cursor-pointer hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-accent/50 bg-gradient-to-br from-gray-900/95 to-gray-800/95 group shadow-xl overflow-hidden relative"
            >
              {/* Brilho colorido no topo */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{
                  background: `linear-gradient(90deg, transparent, ${opcao.glowColor}, transparent)`,
                  boxShadow: `0 0 20px ${opcao.glowColor}`
                }}
              />
              
              <CardContent className="p-5 flex flex-col items-center text-center min-h-[180px] justify-center"
                onClick={() => navigate(opcao.path)}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${opcao.iconBg} transition-transform group-hover:scale-110 mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-2 text-white">{opcao.titulo}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{opcao.descricao}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Aprender;

import { useNavigate } from "react-router-dom";
import { Crown, Gavel, FileText, Scale, Search } from "lucide-react";
import { useState } from "react";

const VadeMecumTodas = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "constituicao",
      title: "Constituição",
      description: "Acesse a Constituição Federal",
      icon: Crown,
      color: "from-[hsl(170,100%,42%)] to-[hsl(170,100%,42%)]/80",
      borderColor: "border-t-[hsl(170,100%,42%)]",
      iconBg: "bg-[hsl(170,100%,42%)]/10",
      iconColor: "text-[hsl(170,100%,42%)]",
      shadowColor: "hover:shadow-[hsl(170,100%,42%)]/20",
      route: "/constituicao"
    },
    {
      id: "codigos",
      title: "Códigos e Leis",
      description: "Explore códigos e legislação",
      icon: Scale,
      color: "from-[hsl(217,91%,60%)] to-[hsl(217,91%,60%)]/80",
      borderColor: "border-t-[hsl(217,91%,60%)]",
      iconBg: "bg-[hsl(217,91%,60%)]/10",
      iconColor: "text-[hsl(217,91%,60%)]",
      shadowColor: "hover:shadow-[hsl(217,91%,60%)]/20",
      route: "/codigos"
    },
    {
      id: "estatutos",
      title: "Estatutos",
      description: "Consulte estatutos especiais",
      icon: FileText,
      color: "from-[hsl(239,84%,67%)] to-[hsl(239,84%,67%)]/80",
      borderColor: "border-t-[hsl(239,84%,67%)]",
      iconBg: "bg-[hsl(239,84%,67%)]/10",
      iconColor: "text-[hsl(239,84%,67%)]",
      shadowColor: "hover:shadow-[hsl(239,84%,67%)]/20",
      route: "/estatutos"
    },
    {
      id: "sumulas",
      title: "Súmulas",
      description: "Súmulas do STF e STJ",
      icon: Gavel,
      color: "from-[hsl(174,72%,56%)] to-[hsl(174,72%,56%)]/80",
      borderColor: "border-t-[hsl(174,72%,56%)]",
      iconBg: "bg-[hsl(174,72%,56%)]/10",
      iconColor: "text-[hsl(174,72%,56%)]",
      shadowColor: "hover:shadow-[hsl(174,72%,56%)]/20",
      route: "/sumulas"
    }
  ];

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Vade mecum Elite</h1>
        
        {/* Caixa de Pesquisa */}
        <div className="flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur-sm border border-accent/20 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar em códigos, leis, estatutos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => navigate(category.route)}
              className={`bg-gradient-to-br from-card to-card/50 border-t-4 ${category.borderColor} rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${category.shadowColor}`}
            >
              <div className={`${category.iconBg} rounded-full p-4 w-fit mb-4`}>
                <Icon className={`w-8 h-8 ${category.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VadeMecumTodas;

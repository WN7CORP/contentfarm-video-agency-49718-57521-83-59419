import { useState, useRef, useEffect } from "react";
import { Send, Upload, X, Loader2, GraduationCap, Eraser, ArrowLeft, Image, FileText, BookOpen, Scale, Brain, FileCheck, Home, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageActions } from "@/components/MessageActions";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { QuizViewer } from "@/components/QuizViewer";
import BookRecommendationCard from "@/components/BookRecommendationCard";
import { FileUploadModal } from "@/components/FileUploadModal";
import { AppSidebar } from "@/components/AppSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
  showActions?: boolean;
  flashcards?: Array<{ front: string; back: string }>;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  bookRecommendation?: {
    id: number;
    title: string;
    author: string;
    cover?: string;
    about?: string;
  };
  suggestions?: string[];
}

interface UploadedFile {
  name: string;
  type: string;
  data: string;
}

type AssistantMode = "study" | "realcase" | "psychologist" | "tcc" | "refutacao" | "audiencia" | null;

const assistantConfigs = {
  study: {
    name: "Assistente de Estudo",
    icon: Scale,
    gradient: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500/30",
    hoverShadow: "shadow-blue-500/30",
    hoverBorder: "border-blue-500/60",
    bgIcon: "bg-blue-500/30",
    hoverBgIcon: "bg-blue-500/40",
    textColor: "text-blue-100",
    description: "Perfeito para estudantes e concurseiros. Tire dúvidas sobre direito, analise documentos, gere flashcards e questões.",
    features: [
      "Explicações didáticas de conceitos jurídicos",
      "Análise de documentos e legislação",
      "Geração de flashcards e questões"
    ],
    welcomeTitle: "Olá! Sou sua assistente de estudos 📚",
    welcomeDescription: "Estou aqui para te ajudar a estudar direito de forma mais eficiente. Posso explicar conceitos, analisar documentos, gerar flashcards e questões.",
    suggestedQuestions: [
      "Explique o princípio da legalidade",
      "Qual a diferença entre dolo e culpa?",
      "Me ajude a entender a hierarquia das leis"
    ]
  },
  realcase: {
    name: "Assistente de Caso Real",
    icon: Scale,
    gradient: "from-emerald-500 to-emerald-600",
    borderColor: "border-emerald-500/30",
    hoverShadow: "shadow-emerald-500/30",
    hoverBorder: "border-emerald-500/60",
    bgIcon: "bg-emerald-500/30",
    hoverBgIcon: "bg-emerald-500/40",
    textColor: "text-emerald-100",
    description: "Para situações do dia a dia. Entenda seus direitos e receba orientações práticas sobre como proceder.",
    features: [
      "Orientações sobre direitos e deveres",
      "Análise de situações práticas",
      "Sugestões de encaminhamentos legais"
    ],
    welcomeTitle: "Olá! Sou sua assistente para casos reais ⚖️",
    welcomeDescription: "Descreva sua situação e vou te orientar sobre seus direitos e possíveis caminhos legais. Lembre-se: não substituo um advogado, mas posso te ajudar a entender melhor seu caso.",
    suggestedQuestions: [
      "Fui demitido sem justa causa. Quais meus direitos?",
      "Comprei um produto com defeito. O que fazer?",
      "Meu vizinho faz barulho excessivo. Como proceder?"
    ]
  },
  psychologist: {
    name: "Assistente Psicóloga",
    icon: Scale,
    gradient: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
    hoverShadow: "shadow-purple-500/30",
    hoverBorder: "border-purple-500/60",
    bgIcon: "bg-purple-500/30",
    hoverBgIcon: "bg-purple-500/40",
    textColor: "text-purple-100",
    description: "Suporte emocional e psicológico para estudantes. Técnicas de bem-estar, gestão de ansiedade e recomendações de leitura.",
    features: [
      "Suporte emocional e acolhimento",
      "Técnicas de gerenciamento de ansiedade",
      "Recomendações personalizadas de livros"
    ],
    welcomeTitle: "Olá! Sou a Dra. Sofia, sua psicóloga 💜",
    welcomeDescription: "Estou aqui para te ajudar a cuidar da sua saúde mental durante os estudos. Vamos conversar sobre como você está se sentindo e encontrar formas de melhorar seu bem-estar.",
    suggestedQuestions: [
      "Estou me sentindo muito sobrecarregado com os estudos",
      "Tenho muita ansiedade antes das provas",
      "Não consigo me concentrar direito"
    ]
  },
  tcc: {
    name: "Assistente de TCC",
    icon: Scale,
    gradient: "from-orange-500 to-amber-500",
    borderColor: "border-orange-500/30",
    hoverShadow: "shadow-orange-500/30",
    hoverBorder: "border-orange-500/60",
    bgIcon: "bg-orange-500/30",
    hoverBgIcon: "bg-orange-500/40",
    textColor: "text-orange-100",
    description: "Orientação completa para seu TCC jurídico. Desde a escolha do tema até a finalização do trabalho.",
    features: [
      "Auxílio na delimitação de tema",
      "Orientações sobre metodologia científica",
      "Dicas de formatação ABNT e estrutura"
    ],
    welcomeTitle: "Olá! Sou a Profa. Dra. Helena 📝",
    welcomeDescription: "Vou te orientar em todas as etapas do seu TCC jurídico. Desde a escolha do tema até a defesa final. Vamos juntos construir um trabalho de excelência!",
    suggestedQuestions: [
      "Preciso de ajuda para definir o tema do meu TCC",
      "Como estruturar os capítulos do meu TCC?",
      "Quais são os passos para fazer uma boa revisão bibliográfica?"
    ]
  },
  refutacao: {
    name: "Assistente de Refutação",
    icon: Scale,
    gradient: "from-red-500 to-rose-600",
    borderColor: "border-red-500/30",
    hoverShadow: "shadow-red-500/30",
    hoverBorder: "border-red-500/60",
    bgIcon: "bg-red-500/30",
    hoverBgIcon: "bg-red-500/40",
    textColor: "text-red-100",
    description: "Especialista em refutação jurídica. Analise argumentos e receba contra-argumentos fundamentados.",
    features: [
      "Análise de falácias e erros lógicos",
      "Contra-argumentos jurídicos sólidos",
      "Versões curtas e formais de refutação"
    ],
    welcomeTitle: "Olá! Sou seu Assistente de Refutação ⚖️",
    welcomeDescription: "Apresente um argumento, texto ou comentário e vou refutá-lo de forma lógica e fundamentada, mostrando falhas e apresentando contra-argumentos.",
    suggestedQuestions: [
      "Analise este argumento: 'Pena de morte resolve a criminalidade'",
      "Como refutar: 'Lei trabalhista prejudica emprego'",
      "Mostre falhas neste raciocínio jurídico [insira texto]"
    ]
  },
  audiencia: {
    name: "Simulação de Audiência",
    icon: Scale,
    gradient: "from-indigo-500 to-violet-600",
    borderColor: "border-indigo-500/30",
    hoverShadow: "shadow-indigo-500/30",
    hoverBorder: "border-indigo-500/60",
    bgIcon: "bg-indigo-500/30",
    hoverBgIcon: "bg-indigo-500/40",
    textColor: "text-indigo-100",
    description: "Simule audiências realistas. Pratique oratória jurídica e receba feedback profissional.",
    features: [
      "Simulação de todos os papéis da audiência",
      "Feedback sobre desempenho jurídico",
      "Treinamento de oratória forense"
    ],
    welcomeTitle: "Bem-vindo à Simulação de Audiência ⚖️",
    welcomeDescription: "Descreva o caso e vou simular uma audiência realista. Você será o advogado e eu representarei juiz, promotor e outras partes.",
    suggestedQuestions: [
      "Quero simular uma audiência de ação trabalhista",
      "Preciso treinar para uma audiência criminal",
      "Como me preparar para interrogatório de testemunha?"
    ]
  }
};

const Professora = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Ler modo da URL
  const searchParams = new URLSearchParams(location.search);
  const urlMode = searchParams.get('mode') as AssistantMode;
  const [mode, setMode] = useState<AssistantMode>(urlMode);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Desktop navigation items
  const desktopNavItems = [
    { label: "Início", icon: Home, path: "/" },
    { label: "Assistente", icon: GraduationCap, path: "/professora" },
    { label: "Ferramentas", icon: Wrench, path: "/ferramentas" },
    { label: "Novidades", icon: Sparkles, path: "/novidades" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleFileSelect = async (file: File) => {
    if (file.type.includes("image/") || file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: base64
        }]);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Por favor, envie apenas imagens ou PDFs",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      handleFileSelect(file);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearConversation = () => {
    setMessages([]);
    setUploadedFiles([]);
    setConversationId(null);
    toast({
      title: "Conversa limpa",
      description: "O histórico foi apagado"
    });
  };

  const resetToModeSelection = () => {
    setMode(null);
    setMessages([]);
    setUploadedFiles([]);
    setConversationId(null);
    navigate('/professora'); // Remove modo da URL
  };
  
  const selectMode = (selectedMode: AssistantMode) => {
    setMode(selectedMode);
    navigate(`/professora?mode=${selectedMode}`); // Adiciona modo à URL
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      role: "user",
      content: input || "Por favor, analise o arquivo anexado."
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let functionName = "chat-professora";
      if (mode === "psychologist") functionName = "chat-psicologa";
      if (mode === "tcc") functionName = "chat-tcc";
      if (mode === "refutacao") functionName = "chat-refutacao";
      if (mode === "audiencia") functionName = "chat-audiencia";

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          messages: [...messages, userMessage],
          files: uploadedFiles,
          mode: mode
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        showActions: data.showActions,
        bookRecommendation: data.bookRecommendation,
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setUploadedFiles([]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Removed auto-submit on Enter - only submit via button click

  const handleGenerateFlashcards = async (content: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar-flashcards", {
        body: { content }
      });

      if (error) throw error;

      const flashcardMessage: Message = {
        role: "assistant",
        content: "Flashcards gerados com sucesso! Use as setas para navegar.",
        flashcards: data.flashcards,
        showActions: false
      };

      setMessages(prev => [...prev, flashcardMessage]);
      
      toast({
        title: "Sucesso!",
        description: "Flashcards gerados com sucesso"
      });
    } catch (error) {
      console.error("Erro ao gerar flashcards:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar os flashcards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async (content: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar-questoes", {
        body: { content }
      });

      if (error) throw error;

      const quizMessage: Message = {
        role: "assistant",
        content: "Questões geradas com sucesso! Teste seus conhecimentos:",
        quiz: data.questions,
        showActions: false
      };

      setMessages(prev => [...prev, quizMessage]);
      
      toast({
        title: "Sucesso!",
        description: "Questões geradas com sucesso"
      });
    } catch (error) {
      console.error("Erro ao gerar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar as questões",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainMore = async (content: string) => {
    const userMsg: Message = {
      role: "user",
      content: `Explique de forma mais detalhada e didática: "${content.substring(0, 100)}..."`
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let functionName = "chat-professora";
      if (mode === "psychologist") functionName = "chat-psicologa";
      if (mode === "tcc") functionName = "chat-tcc";
      if (mode === "refutacao") functionName = "chat-refutacao";
      if (mode === "audiencia") functionName = "chat-audiencia";

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          messages: [...messages, userMsg],
          files: [],
          mode: mode
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        showActions: data.showActions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao explicar mais:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a explicação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async (content: string) => {
    const userMsg: Message = {
      role: "user",
      content: `Faça um resumo mais conciso deste conteúdo: "${content.substring(0, 100)}..."`
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let functionName = "chat-professora";
      if (mode === "psychologist") functionName = "chat-psicologa";
      if (mode === "tcc") functionName = "chat-tcc";
      if (mode === "refutacao") functionName = "chat-refutacao";
      if (mode === "audiencia") functionName = "chat-audiencia";

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          messages: [...messages, userMsg],
          files: [],
          mode: mode
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        showActions: data.showActions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao resumir:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o resumo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  useEffect(() => {
    const handleSuggestion = (e: any) => {
      setInput(e.detail);
      setTimeout(() => sendMessage(), 100);
    };
    
    window.addEventListener('send-suggestion', handleSuggestion);
    return () => window.removeEventListener('send-suggestion', handleSuggestion);
  }, []);

  // Mode selection screen
  if (!mode) {
    return (
      <div className="fixed inset-0 bg-background z-30 flex">
        {/* Desktop Sidebar - Only on desktop */}
        <div className="hidden md:block w-64 border-r border-border">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header - Only on desktop */}
          <div className="hidden md:flex border-b border-border bg-card/50 backdrop-blur-lg px-6 py-3 items-center justify-between">
            <div className="flex items-center gap-4">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Header - Only on mobile */}
          <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-lg px-3 py-3 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-sm font-bold ml-3">Escolha o Assistente</h1>
          </div>

          <div className="flex-1 flex items-center justify-center p-3 overflow-auto pb-20 md:pb-3">
          <div className="max-w-4xl w-full grid grid-cols-2 md:grid-cols-3 gap-3">
            {(["study", "realcase", "psychologist", "tcc", "refutacao", "audiencia"] as const).map((assistantKey, index) => {
              const config = assistantConfigs[assistantKey];
              const Icon = config.icon;
              
              return (
                <button
                  key={assistantKey}
                  onClick={() => selectMode(assistantKey)}
                  className={cn(
                    "group bg-gradient-to-br border rounded-xl p-4 text-center transition-all hover:shadow-lg hover:scale-[1.02] animate-fade-in flex flex-col items-center justify-center gap-2",
                    config.gradient,
                    config.borderColor,
                    `hover:${config.hoverShadow}`,
                    `hover:${config.hoverBorder}`
                  )}
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
                >
                  <div className={cn("rounded-lg p-3 transition-colors", config.bgIcon, `group-hover:${config.hoverBgIcon}`)}>
                    <Icon className={cn("w-8 h-8", config.textColor)} />
                  </div>
                  <h2 className="text-base font-bold text-white">{config.name}</h2>
                  <p className="text-xs text-white/75 leading-snug line-clamp-3">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    );
  }

  const currentConfig = mode ? assistantConfigs[mode] : null;
  const CurrentIcon = currentConfig?.icon || GraduationCap;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar - Only on desktop */}
      <div className="hidden md:block w-64 border-r border-border">
        <AppSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header - Only on desktop */}
        <div className="hidden md:flex border-b border-border bg-card/50 backdrop-blur-lg px-6 py-3 items-center justify-between">
          <div className="flex items-center gap-4">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToModeSelection}
              className="text-xs"
            >
              Trocar Assistente
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              title="Limpar conversa"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Header - Only on mobile */}
        <div className={cn(
          "md:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-gradient-to-r backdrop-blur-lg px-3 py-3 flex items-center justify-between",
          currentConfig?.gradient
        )}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetToModeSelection}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className={cn("p-2 rounded-lg shrink-0", currentConfig?.bgIcon)}>
              <CurrentIcon className={cn("w-5 h-5", currentConfig?.textColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold truncate">{currentConfig?.name}</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            className="shrink-0"
            title="Limpar conversa"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 space-y-4 max-w-4xl mx-auto pb-44 md:pb-44 pt-16 md:pt-4">
          {messages.length === 0 && currentConfig && (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className={cn("inline-flex p-6 rounded-2xl", currentConfig.bgIcon)}>
                <CurrentIcon className={cn("w-16 h-16", currentConfig.textColor)} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{currentConfig.welcomeTitle}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {currentConfig.welcomeDescription}
                </p>
              </div>
              <div className="space-y-3 max-w-xl mx-auto">
                <p className="text-sm font-semibold text-muted-foreground">Perguntas sugeridas:</p>
                <div className="space-y-2">
                  {currentConfig.suggestedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(question)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.02]",
                        currentConfig.borderColor,
                        "hover:bg-card"
                      )}
                    >
                      <p className="text-sm">{question}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center", currentConfig?.bgIcon)}>
                  <CurrentIcon className={cn("w-4 h-4", currentConfig?.textColor)} />
                </div>
              )}
              
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] text-[14px] leading-[1.4]",
                  message.role === "user"
                    ? "bg-primary/30 border border-primary/40 ml-auto"
                    : "bg-card border border-border"
                )}
              >
                {message.flashcards ? (
                  <FlashcardViewer flashcards={message.flashcards} />
                ) : message.quiz ? (
                  <QuizViewer questions={message.quiz} />
                ) : (
                  <>
                    <div className="prose prose-sm max-w-none text-[14px] leading-[1.4]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    
                    {message.bookRecommendation && (
                      <BookRecommendationCard book={message.bookRecommendation} />
                    )}

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-border/50 space-y-3">
                        <p className="text-sm font-semibold text-foreground/90">💬 Continue explorando:</p>
                        <div className="space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInput(suggestion);
                                setTimeout(() => sendMessage(), 100);
                              }}
                              className="w-full text-left px-4 py-3 rounded-xl border-2 border-accent/30 bg-accent/5 hover:bg-accent/15 hover:border-accent/50 transition-all text-sm shadow-sm hover:shadow-md"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && mode === "refutacao" && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">📝 Ações rápidas:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              const userMsg: Message = {
                                role: "user",
                                content: `Reescreva a refutação acima em primeira pessoa, como se eu estivesse falando diretamente com a pessoa. Deixe em tom natural e coloquial, pronto para eu copiar e enviar como comentário.`
                              };
                              setMessages(prev => [...prev, userMsg]);
                              setIsLoading(true);
                              setTimeout(async () => {
                                try {
                                  const { data, error } = await supabase.functions.invoke("chat-refutacao", {
                                    body: {
                                      messages: [...messages, userMsg],
                                      files: [],
                                      mode: "refutacao"
                                    }
                                  });
                                  if (error) throw error;
                                  setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: data.message,
                                    suggestions: data.suggestions
                                  }]);
                                } catch (error) {
                                  console.error("Erro:", error);
                                  toast({
                                    title: "Erro",
                                    description: "Não foi possível gerar a resposta.",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50 transition-all text-xs font-medium"
                          >
                            💬 Reescrever em 1ª pessoa
                          </button>
                          <button
                            onClick={() => {
                              const userMsg: Message = {
                                role: "user",
                                content: `Resuma a refutação acima em apenas um parágrafo, mantendo os pontos principais.`
                              };
                              setMessages(prev => [...prev, userMsg]);
                              setIsLoading(true);
                              setTimeout(async () => {
                                try {
                                  const { data, error } = await supabase.functions.invoke("chat-refutacao", {
                                    body: {
                                      messages: [...messages, userMsg],
                                      files: [],
                                      mode: "refutacao"
                                    }
                                  });
                                  if (error) throw error;
                                  setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: data.message,
                                    suggestions: data.suggestions
                                  }]);
                                } catch (error) {
                                  console.error("Erro:", error);
                                  toast({
                                    title: "Erro",
                                    description: "Não foi possível gerar a resposta.",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50 transition-all text-xs font-medium"
                          >
                            📄 Resumir em 1 parágrafo
                          </button>
                          <button
                            onClick={() => {
                              const userMsg: Message = {
                                role: "user",
                                content: `Crie uma versão ainda mais curta da refutação, em 2-3 frases, para usar em redes sociais.`
                              };
                              setMessages(prev => [...prev, userMsg]);
                              setIsLoading(true);
                              setTimeout(async () => {
                                try {
                                  const { data, error } = await supabase.functions.invoke("chat-refutacao", {
                                    body: {
                                      messages: [...messages, userMsg],
                                      files: [],
                                      mode: "refutacao"
                                    }
                                  });
                                  if (error) throw error;
                                  setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: data.message,
                                    suggestions: data.suggestions
                                  }]);
                                } catch (error) {
                                  console.error("Erro:", error);
                                  toast({
                                    title: "Erro",
                                    description: "Não foi possível gerar a resposta.",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50 transition-all text-xs font-medium"
                          >
                            ✂️ Versão para redes sociais
                          </button>
                          <button
                            onClick={() => {
                              const userMsg: Message = {
                                role: "user",
                                content: `Torne a refutação mais técnica e formal, adequada para um parecer jurídico ou texto acadêmico.`
                              };
                              setMessages(prev => [...prev, userMsg]);
                              setIsLoading(true);
                              setTimeout(async () => {
                                try {
                                  const { data, error } = await supabase.functions.invoke("chat-refutacao", {
                                    body: {
                                      messages: [...messages, userMsg],
                                      files: [],
                                      mode: "refutacao"
                                    }
                                  });
                                  if (error) throw error;
                                  setMessages(prev => [...prev, {
                                    role: "assistant",
                                    content: data.message,
                                    suggestions: data.suggestions
                                  }]);
                                } catch (error) {
                                  console.error("Erro:", error);
                                  toast({
                                    title: "Erro",
                                    description: "Não foi possível gerar a resposta.",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50 transition-all text-xs font-medium"
                          >
                            📚 Versão formal/acadêmica
                          </button>
                        </div>
                      </div>
                    )}

                    {message.showActions && message.role === "assistant" && mode !== "refutacao" && (
                      <MessageActions
                        content={message.content}
                        onGenerateFlashcards={() => handleGenerateFlashcards(message.content)}
                        onGenerateQuestions={() => handleGenerateQuestions(message.content)}
                        onExplainMore={() => handleExplainMore(message.content)}
                        onSummarize={() => handleSummarize(message.content)}
                      />
                    )}
                  </>
                )}
              </div>

              {message.role === "user" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center", currentConfig?.bgIcon)}>
                <CurrentIcon className={cn("w-4 h-4", currentConfig?.textColor)} />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            </div>
          )}
          </div>
        </ScrollArea>

        {/* Uploaded Files Preview - Fixed at bottom */}
        {uploadedFiles.length > 0 && (
          <div className="fixed bottom-[72px] left-0 right-0 md:left-64 border-t border-border bg-card/95 backdrop-blur-lg p-3 z-20">
            <div className="flex gap-2 overflow-x-auto max-w-4xl mx-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 bg-secondary/50 rounded-lg p-2 flex items-center gap-2 min-w-0"
              >
                {file.type.includes("image") ? (
                  <Image className="w-4 h-4 text-accent shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                )}
                <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="shrink-0 hover:bg-destructive/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Input - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border bg-card/95 backdrop-blur-lg p-3 pb-3 md:pb-3 z-20">
          <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowUploadModal(true)}
            disabled={isLoading}
            className="shrink-0"
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          <FileUploadModal
            open={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onFileSelect={handleFileSelect}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 text-[14px] placeholder:text-[14px]"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
            className="shrink-0 px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-sm font-medium">Enviar</span>
            )}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Professora;
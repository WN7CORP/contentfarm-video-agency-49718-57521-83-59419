import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { DesktopTopNav } from "./DesktopTopNav";
import { AppSidebar } from "./AppSidebar";
import { DesktopChatPanel } from "./DesktopChatPanel";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Esconder BottomNav em páginas de conteúdo jurídico e simulados
  const hideBottomNav = 
    location.pathname === "/vade-mecum" ||
    location.pathname.startsWith("/codigo/") ||
    location.pathname === "/codigos" ||
    location.pathname === "/constituicao" ||
    location.pathname === "/estatutos" ||
    location.pathname.startsWith("/estatuto/") ||
    location.pathname === "/sumulas" ||
    location.pathname.startsWith("/sumula/") ||
    location.pathname === "/simulados/realizar" ||
    location.pathname === "/simulados/personalizado";
  
  // Para /professora: esconder BottomNav quando estiver no chat ativo
  // (quando há parâmetro na URL indicando modo selecionado)
  const isProfessoraChat = location.pathname === "/professora" && location.search.includes("mode=");
  
  // Esconder Header na página de assistentes (ela tem header próprio)
  const hideHeader = location.pathname === "/professora";

  // DESKTOP LAYOUT (>= 768px)
  if (!isMobile) {
    return (
      <div className="h-screen flex flex-col w-full bg-background text-foreground">
        <DesktopTopNav />
        
        <div className="flex-1 flex overflow-hidden w-full">
          {/* Sidebar Esquerda */}
          <div className="w-64 flex-shrink-0">
            <AppSidebar />
          </div>

          {/* Conteúdo Central */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Chat Panel Direita */}
          <DesktopChatPanel />
        </div>
      </div>
    );
  }
  
  // MOBILE LAYOUT (< 768px) - mantém como está
  const shouldHideBottomNav = hideBottomNav || isProfessoraChat;
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!hideHeader && <Header />}
      <main className={shouldHideBottomNav ? "flex-1 w-full max-w-7xl mx-auto" : "flex-1 pb-20 w-full max-w-7xl mx-auto"}>
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
};

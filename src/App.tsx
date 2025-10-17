import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";
import Index from "./pages/Index";
import Codigos from "./pages/Codigos";
import CodigoView from "./pages/CodigoView";
import VideoAula from "./pages/VideoAula";
import Cursos from "./pages/Cursos";
import CursosModulos from "./pages/CursosModulos";
import CursosAulas from "./pages/CursosAulas";
import CursoAulaView from "./pages/CursoAulaView";
import Constituicao from "./pages/Constituicao";
import Estatutos from "./pages/Estatutos";
import EstatutoView from "./pages/EstatutoView";
import Sumulas from "./pages/Sumulas";
import SumulaView from "./pages/SumulaView";
import Pesquisar from "./pages/Pesquisar";
import Professora from "./pages/Professora";
import Dicionario from "./pages/Dicionario";
import Ferramentas from "./pages/Ferramentas";
import Advogado from "./pages/Advogado";
import AdvogadoModelos from "./pages/AdvogadoModelos";
import AdvogadoCriar from "./pages/AdvogadoCriar";
import Novidades from "./pages/Novidades";
import NotFound from "./pages/NotFound";
import VadeMecumTodas from "./pages/VadeMecumTodas";
import BibliotecaOAB from "./pages/BibliotecaOAB";
import BibliotecaOABLivro from "./pages/BibliotecaOABLivro";
import BibliotecaEstudos from "./pages/BibliotecaEstudos";
import BibliotecaEstudosLivro from "./pages/BibliotecaEstudosLivro";
import BibliotecaClassicos from "./pages/BibliotecaClassicos";
import BibliotecaClassicosLivro from "./pages/BibliotecaClassicosLivro";
import BibliotecaForaDaToga from "./pages/BibliotecaForaDaToga";
import BibliotecaForaDaTogaLivro from "./pages/BibliotecaForaDaTogaLivro";
import BibliotecaOratoria from "./pages/BibliotecaOratoria";
import BibliotecaOratoriaLivro from "./pages/BibliotecaOratoriaLivro";
import BibliotecaLideranca from "./pages/BibliotecaLideranca";
import BibliotecaLiderancaLivro from "./pages/BibliotecaLiderancaLivro";
import Bibliotecas from "./pages/Bibliotecas";
import Aprender from "./pages/Aprender";
import AcessoDesktop from "./pages/AcessoDesktop";
import Analisar from "./pages/Analisar";
import AnalisarResultado from "./pages/AnalisarResultado";
import ResumosJuridicos from "./pages/ResumosJuridicos";
import ResumosResultado from "./pages/ResumosResultado";
import PlanoEstudos from "./pages/PlanoEstudos";
import PlanoEstudosResultado from "./pages/PlanoEstudosResultado";
import FlashcardsAreas from "./pages/FlashcardsAreas";
import FlashcardsTemas from "./pages/FlashcardsTemas";
import FlashcardsEstudar from "./pages/FlashcardsEstudar";
import Simulados from "./pages/Simulados";
import SimuladosExames from "./pages/SimuladosExames";
import SimuladosPersonalizado from "./pages/SimuladosPersonalizado";
import SimuladosRealizar from "./pages/SimuladosRealizar";
import SimuladosResultado from "./pages/SimuladosResultado";
import Audioaulas from "./pages/Audioaulas";
import AudioaulasTema from "./pages/AudioaulasTema";
import JuriFlix from "./pages/JuriFlix";
import JuriFlixDetalhes from "./pages/JuriFlixDetalhes";
import VideoaulasAreas from "./pages/VideoaulasAreas";
import VideoaulasPlaylists from "./pages/VideoaulasPlaylists";
import VideoaulasPlayer from "./pages/VideoaulasPlayer";
import Eleicoes from "./pages/Eleicoes";
import EleicoesSituacao from "./pages/EleicoesSituacao";
import EleicoesCandidatos from "./pages/EleicoesCandidatos";
import EleicoesResultados from "./pages/EleicoesResultados";
import EleicoesEleitorado from "./pages/EleicoesEleitorado";
import EleicoesHistorico from "./pages/EleicoesHistorico";
import EleicoesPrestacaoContas from "./pages/EleicoesPrestacaoContas";
import EleicoesLegislacao from "./pages/EleicoesLegislacao";
import EleicoesCalendario from "./pages/EleicoesCalendario";
import CamaraDeputados from "./pages/CamaraDeputados";
import CamaraDeputadosLista from "./pages/CamaraDeputadosLista";
import CamaraDeputadoDetalhes from "./pages/CamaraDeputadoDetalhes";
import CamaraProposicoes from "./pages/CamaraProposicoes";
import CamaraProposicoesLista from "./pages/CamaraProposicoesLista";
import CamaraVotacoes from "./pages/CamaraVotacoes";
import CamaraDespesas from "./pages/CamaraDespesas";
import CamaraEventos from "./pages/CamaraEventos";
import CamaraOrgaos from "./pages/CamaraOrgaos";
import CamaraFrentes from "./pages/CamaraFrentes";
import CamaraPartidos from "./pages/CamaraPartidos";
import CamaraVotacaoDetalhes from "./pages/CamaraVotacaoDetalhes";
import CamaraProposicaoDetalhes from "./pages/CamaraProposicaoDetalhes";
import Jurisprudencia from "./pages/Jurisprudencia";
import JurisprudenciaResultados from "./pages/JurisprudenciaResultados";
import JurisprudenciaDetalhes from "./pages/JurisprudenciaDetalhes";
import JurisprudenciaTemas from "./pages/JurisprudenciaTemas";
import Processo from "./pages/Processo";
import NoticiasJuridicas from "./pages/NoticiasJuridicas";
import NoticiaDetalhes from "./pages/NoticiaDetalhes";
import RankingFaculdades from "./pages/RankingFaculdades";
import RankingFaculdadeDetalhes from "./pages/RankingFaculdadeDetalhes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AudioPlayerProvider>
            <Layout>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vade-mecum" element={<VadeMecumTodas />} />
              <Route path="/codigos" element={<Codigos />} />
              <Route path="/codigo/:id" element={<CodigoView />} />
              <Route path="/video-aula" element={<VideoAula />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/cursos/modulos" element={<CursosModulos />} />
              <Route path="/cursos/aulas" element={<CursosAulas />} />
              <Route path="/cursos/aula" element={<CursoAulaView />} />
              <Route path="/constituicao" element={<Constituicao />} />
              <Route path="/estatutos" element={<Estatutos />} />
              <Route path="/estatuto/:id" element={<EstatutoView />} />
              <Route path="/sumulas" element={<Sumulas />} />
              <Route path="/sumula/:id" element={<SumulaView />} />
              <Route path="/pesquisar" element={<Pesquisar />} />
              <Route path="/professora" element={<Professora />} />
              <Route path="/ferramentas" element={<Ferramentas />} />
              <Route path="/dicionario" element={<Dicionario />} />
              <Route path="/bibliotecas" element={<Bibliotecas />} />
            <Route path="/biblioteca-oab" element={<BibliotecaOAB />} />
            <Route path="/biblioteca-oab/:livroId" element={<BibliotecaOABLivro />} />
            <Route path="/biblioteca-estudos" element={<BibliotecaEstudos />} />
            <Route path="/biblioteca-estudos/:livroId" element={<BibliotecaEstudosLivro />} />
            <Route path="/biblioteca-classicos" element={<BibliotecaClassicos />} />
            <Route path="/biblioteca-classicos/:livroId" element={<BibliotecaClassicosLivro />} />
            <Route path="/biblioteca-fora-da-toga" element={<BibliotecaForaDaToga />} />
            <Route path="/biblioteca-fora-da-toga/:livroId" element={<BibliotecaForaDaTogaLivro />} />
            <Route path="/biblioteca-oratoria" element={<BibliotecaOratoria />} />
            <Route path="/biblioteca-oratoria/:livroId" element={<BibliotecaOratoriaLivro />} />
            <Route path="/biblioteca-lideranca" element={<BibliotecaLideranca />} />
            <Route path="/biblioteca-lideranca/:livroId" element={<BibliotecaLiderancaLivro />} />
              <Route path="/aprender" element={<Aprender />} />
              <Route path="/acesso-desktop" element={<AcessoDesktop />} />
              <Route path="/analisar" element={<Analisar />} />
              <Route path="/analisar/resultado" element={<AnalisarResultado />} />
              <Route path="/resumos-juridicos" element={<ResumosJuridicos />} />
              <Route path="/resumos-juridicos/resultado" element={<ResumosResultado />} />
              <Route path="/plano-estudos" element={<PlanoEstudos />} />
              <Route path="/plano-estudos/resultado" element={<PlanoEstudosResultado />} />
              <Route path="/flashcards" element={<FlashcardsAreas />} />
              <Route path="/flashcards/temas" element={<FlashcardsTemas />} />
              <Route path="/flashcards/estudar" element={<FlashcardsEstudar />} />
              <Route path="/simulados" element={<Simulados />} />
              <Route path="/simulados/exames" element={<SimuladosExames />} />
              <Route path="/simulados/personalizado" element={<SimuladosPersonalizado />} />
              <Route path="/simulados/realizar" element={<SimuladosRealizar />} />
              <Route path="/simulados/resultado" element={<SimuladosResultado />} />
              <Route path="/audioaulas" element={<Audioaulas />} />
              <Route path="/audioaulas/:area" element={<AudioaulasTema />} />
              <Route path="/juriflix" element={<JuriFlix />} />
              <Route path="/juriflix/:id" element={<JuriFlixDetalhes />} />
              <Route path="/advogado" element={<Advogado />} />
              <Route path="/advogado/modelos" element={<AdvogadoModelos />} />
              <Route path="/advogado/criar" element={<AdvogadoCriar />} />
              <Route path="/videoaulas" element={<VideoaulasAreas />} />
              <Route path="/videoaulas/:area" element={<VideoaulasPlaylists />} />
              <Route path="/videoaulas/player" element={<VideoaulasPlayer />} />
              <Route path="/eleicoes" element={<Eleicoes />} />
              <Route path="/eleicoes/situacao" element={<EleicoesSituacao />} />
              <Route path="/eleicoes/candidatos" element={<EleicoesCandidatos />} />
              <Route path="/eleicoes/resultados" element={<EleicoesResultados />} />
              <Route path="/eleicoes/eleitorado" element={<EleicoesEleitorado />} />
              <Route path="/eleicoes/historico" element={<EleicoesHistorico />} />
              <Route path="/eleicoes/prestacao-contas" element={<EleicoesPrestacaoContas />} />
              <Route path="/eleicoes/legislacao" element={<EleicoesLegislacao />} />
              <Route path="/eleicoes/calendario" element={<EleicoesCalendario />} />
              <Route path="/camara-deputados" element={<CamaraDeputados />} />
              <Route path="/camara-deputados/deputados" element={<CamaraDeputadosLista />} />
              <Route path="/camara-deputados/deputado/:id" element={<CamaraDeputadoDetalhes />} />
              <Route path="/camara-deputados/proposicoes" element={<CamaraProposicoes />} />
              <Route path="/camara-deputados/proposicoes/:tipo" element={<CamaraProposicoesLista />} />
              <Route path="/camara-deputados/proposicao/:id" element={<CamaraProposicaoDetalhes />} />
              <Route path="/camara-deputados/votacoes" element={<CamaraVotacoes />} />
              <Route path="/camara-deputados/votacao/:id" element={<CamaraVotacaoDetalhes />} />
              <Route path="/camara-deputados/despesas" element={<CamaraDespesas />} />
              <Route path="/camara-deputados/eventos" element={<CamaraEventos />} />
              <Route path="/camara-deputados/orgaos" element={<CamaraOrgaos />} />
              <Route path="/camara-deputados/frentes" element={<CamaraFrentes />} />
              <Route path="/camara-deputados/partidos" element={<CamaraPartidos />} />
              <Route path="/processo" element={<Processo />} />
              <Route path="/jurisprudencia" element={<Jurisprudencia />} />
              <Route path="/jurisprudencia/resultados" element={<JurisprudenciaResultados />} />
              <Route path="/jurisprudencia/detalhes/:numeroProcesso" element={<JurisprudenciaDetalhes />} />
              <Route path="/jurisprudencia/temas" element={<JurisprudenciaTemas />} />
              <Route path="/jurisprudencia/temas/:tema" element={<JurisprudenciaResultados />} />
              <Route path="/noticias-juridicas" element={<NoticiasJuridicas />} />
              <Route path="/noticias-juridicas/:noticiaId" element={<NoticiaDetalhes />} />
              <Route path="/ranking-faculdades" element={<RankingFaculdades />} />
              <Route path="/ranking-faculdades/:id" element={<RankingFaculdadeDetalhes />} />
              <Route path="/novidades" element={<Novidades />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GlobalAudioPlayer />
          </Layout>
          </AudioPlayerProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Trophy, Medal, Award, TrendingUp, Star, GraduationCap, Users, BookOpen, Target, Sparkles, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Faculdade {
  id: number;
  universidade: string;
  estado: string;
  posicao: number;
  tipo: string;
  nota_geral: number;
  nota_doutores: number;
  nota_concluintes: number;
  avaliacao_cn: number;
  avaliacao_mec: number;
  qualidade: number;
  quantidade_doutores: number;
  qualidade_doutores: number;
}

const RankingFaculdades = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("todos");

  const { data: faculdades, isLoading } = useQuery({
    queryKey: ["ranking-faculdades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("RANKING-FACULDADES")
        .select("*")
        .order("posicao", { ascending: true });
      
      if (error) throw error;
      return data as Faculdade[];
    },
  });

  const faculdadesFiltradas = faculdades?.filter((f) => {
    const matchBusca = f.universidade.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = abaAtiva === "todos" || f.tipo === abaAtiva;
    return matchBusca && matchTipo;
  });

  // Categorias de Liderança
  const getLideres = () => {
    if (!faculdades) return null;

    return {
      melhorNotaGeral: [...faculdades].sort((a, b) => (b.nota_geral || 0) - (a.nota_geral || 0))[0],
      melhorAvaliacaoMEC: [...faculdades].sort((a, b) => (b.avaliacao_mec || 0) - (a.avaliacao_mec || 0))[0],
      melhorAvaliacaoCN: [...faculdades].sort((a, b) => a.avaliacao_cn - b.avaliacao_cn)[0],
      melhorQualidadeEnsino: [...faculdades].sort((a, b) => a.qualidade - b.qualidade)[0],
      melhorNotaDoutores: [...faculdades].sort((a, b) => (b.nota_doutores || 0) - (a.nota_doutores || 0))[0],
      melhorQualidadeDoutores: [...faculdades].sort((a, b) => a.qualidade_doutores - b.qualidade_doutores)[0],
      melhorNotaConcluintes: [...faculdades].sort((a, b) => (b.nota_concluintes || 0) - (a.nota_concluintes || 0))[0],
      maisDoutores: [...faculdades].sort((a, b) => (b.quantidade_doutores || 0) - (a.quantidade_doutores || 0))[0],
    };
  };

  const lideres = getLideres();

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Federal":
        return "bg-green-600 shadow-lg shadow-green-500/50 border-green-500";
      case "Estadual":
        return "bg-blue-600 shadow-lg shadow-blue-500/50 border-blue-500";
      case "Privada":
        return "bg-purple-600 shadow-lg shadow-purple-500/50 border-purple-500";
      default:
        return "bg-gray-600 border-gray-500";
    }
  };

  const getPosicaoIcon = (posicao: number) => {
    if (posicao === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (posicao === 2) return <Medal className="w-8 h-8 text-gray-300" />;
    if (posicao === 3) return <Award className="w-8 h-8 text-amber-600" />;
    return <TrendingUp className="w-6 h-6 text-primary" />;
  };

  const top3 = faculdadesFiltradas?.slice(0, 3);
  const resto = faculdadesFiltradas?.slice(3);

  return (
    <div className="px-3 py-4 max-w-7xl mx-auto pb-20">
      {/* Header Animado */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <Crown className="w-8 h-8 text-yellow-400" />
          Ranking Faculdades de Direito
        </h1>
        <p className="text-sm text-muted-foreground">
          As melhores instituições de ensino jurídico do Brasil
        </p>
      </motion.div>

      {/* Busca */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar universidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <>
          {/* Categorias de Liderança */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Destaques por Categoria
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {lideres && (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorNotaGeral.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Nota Geral</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorNotaGeral.universidade}</p>
                        <Badge className="mt-2 bg-yellow-600">{lideres.melhorNotaGeral.nota_geral?.toFixed(2)}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-2 border-blue-500/50 hover:border-blue-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorAvaliacaoMEC.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Aval. MEC</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorAvaliacaoMEC.universidade}</p>
                        <Badge className="mt-2 bg-blue-600">{lideres.melhorAvaliacaoMEC.avaliacao_mec?.toFixed(2)}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-green-900/30 to-green-800/30 border-2 border-green-500/50 hover:border-green-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorQualidadeEnsino.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Qualidade</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorQualidadeEnsino.universidade}</p>
                        <Badge className="mt-2 bg-green-600">{lideres.melhorQualidadeEnsino.qualidade}º lugar</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-2 border-purple-500/50 hover:border-purple-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorNotaDoutores.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <GraduationCap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Nota Doutores</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorNotaDoutores.universidade}</p>
                        <Badge className="mt-2 bg-purple-600">{lideres.melhorNotaDoutores.nota_doutores?.toFixed(2)}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-pink-900/30 to-pink-800/30 border-2 border-pink-500/50 hover:border-pink-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorNotaConcluintes.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Award className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Nota Concluintes</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorNotaConcluintes.universidade}</p>
                        <Badge className="mt-2 bg-pink-600">{lideres.melhorNotaConcluintes.nota_concluintes?.toFixed(2)}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-orange-900/30 to-orange-800/30 border-2 border-orange-500/50 hover:border-orange-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.maisDoutores.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Mais Doutores</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.maisDoutores.universidade}</p>
                        <Badge className="mt-2 bg-orange-600">{lideres.maisDoutores.quantidade_doutores}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorQualidadeDoutores.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Qual. Doutores</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorQualidadeDoutores.universidade}</p>
                        <Badge className="mt-2 bg-cyan-600">{lideres.melhorQualidadeDoutores.qualidade_doutores}º lugar</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card 
                      className="cursor-pointer bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border-2 border-indigo-500/50 hover:border-indigo-400 transition-all"
                      onClick={() => navigate(`/ranking-faculdades/${lideres.melhorAvaliacaoCN.id}`)}
                    >
                      <CardContent className="p-4 text-center">
                        <Medal className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Melhor Aval. CN</p>
                        <p className="font-bold text-sm line-clamp-2 min-h-[40px]">{lideres.melhorAvaliacaoCN.universidade}</p>
                        <Badge className="mt-2 bg-indigo-600">{lideres.melhorAvaliacaoCN.avaliacao_cn}º lugar</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Tabs Horizontais */}
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="todos" className="font-bold">
                Todos ({faculdades?.length})
              </TabsTrigger>
              <TabsTrigger value="Federal" className="font-bold text-green-600">
                Federal ({faculdades?.filter(f => f.tipo === "Federal").length})
              </TabsTrigger>
              <TabsTrigger value="Estadual" className="font-bold text-blue-600">
                Estadual ({faculdades?.filter(f => f.tipo === "Estadual").length})
              </TabsTrigger>
              <TabsTrigger value="Privada" className="font-bold text-purple-600">
                Privada ({faculdades?.filter(f => f.tipo === "Privada").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={abaAtiva}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={abaAtiva}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pódio - Top 3 */}
                  {top3 && top3.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Top 3
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 2º Lugar */}
                        {top3[1] && (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ scale: 1.05, rotateY: 5 }}
                            className="md:mt-8"
                          >
                            <Card
                              className="cursor-pointer border-2 border-gray-300 bg-gradient-to-br from-gray-900/95 to-gray-800/95 shadow-xl shadow-gray-500/30"
                              onClick={() => navigate(`/ranking-faculdades/${top3[1].id}`)}
                            >
                              <CardContent className="p-6 text-center">
                                <motion.div 
                                  className="flex justify-center mb-3"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ repeat: Infinity, duration: 3 }}
                                >
                                  <Medal className="w-12 h-12 text-gray-300" />
                                </motion.div>
                                <div className="text-4xl font-bold text-gray-300 mb-2">2º</div>
                                <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[48px]">
                                  {top3[1].universidade}
                                </h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 border-2 ${getTipoColor(top3[1].tipo)}`}>
                                  {top3[1].tipo} - {top3[1].estado}
                                </div>
                                <div className="text-2xl font-bold text-primary mt-3">
                                  {top3[1].nota_geral?.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Nota Geral</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                        {/* 1º Lugar */}
                        {top3[0] && (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.08, rotateY: 5 }}
                          >
                            <Card
                              className="cursor-pointer border-2 border-yellow-400 bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 shadow-2xl shadow-yellow-500/50 relative overflow-hidden"
                              onClick={() => navigate(`/ranking-faculdades/${top3[0].id}`)}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                              />
                              <CardContent className="p-6 text-center relative z-10">
                                <motion.div 
                                  className="flex justify-center mb-3"
                                  animate={{ 
                                    rotate: [0, 15, -15, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                >
                                  <Trophy className="w-14 h-14 text-yellow-400" />
                                </motion.div>
                                <div className="text-5xl font-bold text-yellow-400 mb-2">1º</div>
                                <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[56px]">
                                  {top3[0].universidade}
                                </h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 border-2 ${getTipoColor(top3[0].tipo)}`}>
                                  {top3[0].tipo} - {top3[0].estado}
                                </div>
                                <div className="text-3xl font-bold text-yellow-400 mt-3">
                                  {top3[0].nota_geral?.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Nota Geral</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}

                        {/* 3º Lugar */}
                        {top3[2] && (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05, rotateY: 5 }}
                            className="md:mt-8"
                          >
                            <Card
                              className="cursor-pointer border-2 border-amber-600 bg-gradient-to-br from-amber-900/35 to-amber-800/35 shadow-xl shadow-amber-500/30"
                              onClick={() => navigate(`/ranking-faculdades/${top3[2].id}`)}
                            >
                              <CardContent className="p-6 text-center">
                                <motion.div 
                                  className="flex justify-center mb-3"
                                  animate={{ rotate: [0, -10, 10, 0] }}
                                  transition={{ repeat: Infinity, duration: 3 }}
                                >
                                  <Award className="w-12 h-12 text-amber-600" />
                                </motion.div>
                                <div className="text-4xl font-bold text-amber-600 mb-2">3º</div>
                                <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[48px]">
                                  {top3[2].universidade}
                                </h3>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 border-2 ${getTipoColor(top3[2].tipo)}`}>
                                  {top3[2].tipo} - {top3[2].estado}
                                </div>
                                <div className="text-2xl font-bold text-amber-600 mt-3">
                                  {top3[2].nota_geral?.toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Nota Geral</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lista Completa */}
                  {resto && resto.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Ranking Completo</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resto.map((faculdade, index) => (
                          <motion.div
                            key={faculdade.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Card
                              className="cursor-pointer border-2 border-transparent hover:border-primary/50 bg-gradient-to-br from-card/95 to-card/80 hover:shadow-xl transition-all"
                              onClick={() => navigate(`/ranking-faculdades/${faculdade.id}`)}
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                  <motion.div 
                                    className="flex-shrink-0"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                                      <span className="text-lg font-bold text-primary">{faculdade.posicao}º</span>
                                    </div>
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                                      {faculdade.universidade}
                                    </h3>
                                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white border ${getTipoColor(faculdade.tipo)}`}>
                                      {faculdade.tipo} - {faculdade.estado}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nota Geral:</span>
                                    <span className="font-bold text-primary">{faculdade.nota_geral?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nota Doutores:</span>
                                    <span className="font-semibold">{faculdade.nota_doutores?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nota Concluintes:</span>
                                    <span className="font-semibold">{faculdade.nota_concluintes?.toFixed(2)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {faculdadesFiltradas?.length === 0 && (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-muted-foreground">Nenhuma faculdade encontrada.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default RankingFaculdades;

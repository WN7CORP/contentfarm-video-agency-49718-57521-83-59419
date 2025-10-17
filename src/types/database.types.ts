export interface AudioAula {
  id: number;
  sequencia: number | null;
  area: string | null;
  tema: string | null;
  titulo: string | null;
  descricao: string | null;
  url_audio: string | null;
  imagem_miniatura: string | null;
  tag: string | null;
}

export interface JuriFlixTitulo {
  id: number;
  ano: number | null;
  tipo: string | null;
  nome: string | null;
  "link Video": string | null;
  sinopse: string | null;
  nota: string | null;
  plataforma: string | null;
  capa: string | null;
  beneficios: string | null;
  link: string | null;
  trailer: string | null;
}

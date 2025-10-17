export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "AUDIO-AULA": {
        Row: {
          area: string | null
          descricao: string | null
          id: number
          imagem_miniatura: string | null
          sequencia: number | null
          tag: string | null
          tema: string | null
          titulo: string | null
          url_audio: string | null
        }
        Insert: {
          area?: string | null
          descricao?: string | null
          id: number
          imagem_miniatura?: string | null
          sequencia?: number | null
          tag?: string | null
          tema?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Update: {
          area?: string | null
          descricao?: string | null
          id?: number
          imagem_miniatura?: string | null
          sequencia?: number | null
          tag?: string | null
          tema?: string | null
          titulo?: string | null
          url_audio?: string | null
        }
        Relationships: []
      }
      "BIBILIOTECA-OAB": {
        Row: {
          Área: string | null
          "Capa-area": string | null
          "Capa-livro": string | null
          Download: string | null
          id: number | null
          Link: string | null
          Ordem: number | null
          Sobre: string | null
          Tema: string | null
        }
        Insert: {
          Área?: string | null
          "Capa-area"?: string | null
          "Capa-livro"?: string | null
          Download?: string | null
          id?: number | null
          Link?: string | null
          Ordem?: number | null
          Sobre?: string | null
          Tema?: string | null
        }
        Update: {
          Área?: string | null
          "Capa-area"?: string | null
          "Capa-livro"?: string | null
          Download?: string | null
          id?: number | null
          Link?: string | null
          Ordem?: number | null
          Sobre?: string | null
          Tema?: string | null
        }
        Relationships: []
      }
      "BIBLIOTECA-CLASSICOS": {
        Row: {
          area: string | null
          autor: string | null
          beneficios: string | null
          "Capa-area": string | null
          download: string | null
          id: number
          imagem: string | null
          link: string | null
          livro: string | null
          sobre: string | null
        }
        Insert: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Update: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id?: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Relationships: []
      }
      "BIBLIOTECA-ESTUDOS": {
        Row: {
          Área: string | null
          "Capa-area": string | null
          "Capa-livro": string | null
          Download: string | null
          id: number | null
          Link: string | null
          Ordem: number | null
          Sobre: string | null
          Tema: string | null
        }
        Insert: {
          Área?: string | null
          "Capa-area"?: string | null
          "Capa-livro"?: string | null
          Download?: string | null
          id?: number | null
          Link?: string | null
          Ordem?: number | null
          Sobre?: string | null
          Tema?: string | null
        }
        Update: {
          Área?: string | null
          "Capa-area"?: string | null
          "Capa-livro"?: string | null
          Download?: string | null
          id?: number | null
          Link?: string | null
          Ordem?: number | null
          Sobre?: string | null
          Tema?: string | null
        }
        Relationships: []
      }
      "BIBLIOTECA-FORA-DA-TOGA": {
        Row: {
          area: string | null
          autor: string | null
          "capa-area": string | null
          "capa-livro": string | null
          download: string | null
          id: number | null
          link: string | null
          livro: string | null
          sobre: string | null
        }
        Insert: {
          area?: string | null
          autor?: string | null
          "capa-area"?: string | null
          "capa-livro"?: string | null
          download?: string | null
          id?: number | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Update: {
          area?: string | null
          autor?: string | null
          "capa-area"?: string | null
          "capa-livro"?: string | null
          download?: string | null
          id?: number | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Relationships: []
      }
      "BIBLIOTECA-LIDERANÇA": {
        Row: {
          area: string | null
          autor: string | null
          beneficios: string | null
          "Capa-area": string | null
          download: string | null
          id: number
          imagem: string | null
          link: string | null
          livro: string | null
          sobre: string | null
        }
        Insert: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Update: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id?: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Relationships: []
      }
      "BIBLIOTECA-ORATORIA": {
        Row: {
          area: string | null
          autor: string | null
          beneficios: string | null
          "Capa-area": string | null
          download: string | null
          id: number
          imagem: string | null
          link: string | null
          livro: string | null
          sobre: string | null
        }
        Insert: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Update: {
          area?: string | null
          autor?: string | null
          beneficios?: string | null
          "Capa-area"?: string | null
          download?: string | null
          id?: number
          imagem?: string | null
          link?: string | null
          livro?: string | null
          sobre?: string | null
        }
        Relationships: []
      }
      "CA - Código de Águas": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CAPA-BIBILIOTECA": {
        Row: {
          Biblioteca: string | null
          capa: string | null
          id: number
        }
        Insert: {
          Biblioteca?: string | null
          capa?: string | null
          id: number
        }
        Update: {
          Biblioteca?: string | null
          capa?: string | null
          id?: number
        }
        Relationships: []
      }
      "CBA Código Brasileiro de Aeronáutica": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CBT Código Brasileiro de Telecomunicações": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CC - Código Civil": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CCOM – Código Comercial": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CDC – Código de Defesa do Consumidor": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CDM – Código de Minas": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CE – Código Eleitoral": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CF - Constituição Federal": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CLT – Consolidação das Leis do Trabalho": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CP - Código Penal": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CPC – Código de Processo Civil": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CPP – Código de Processo Penal": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CTB Código de Trânsito Brasileiro": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "CTN – Código Tributário Nacional": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      CURSOS: {
        Row: {
          Area: string | null
          Assunto: string | null
          Aula: number | null
          capa: string | null
          "capa-area": string | null
          "capa-modulo": string | null
          conteudo: string | null
          id: number
          material: string | null
          Modulo: number | null
          Tema: string | null
          video: string | null
        }
        Insert: {
          Area?: string | null
          Assunto?: string | null
          Aula?: number | null
          capa?: string | null
          "capa-area"?: string | null
          "capa-modulo"?: string | null
          conteudo?: string | null
          id: number
          material?: string | null
          Modulo?: number | null
          Tema?: string | null
          video?: string | null
        }
        Update: {
          Area?: string | null
          Assunto?: string | null
          Aula?: number | null
          capa?: string | null
          "capa-area"?: string | null
          "capa-modulo"?: string | null
          conteudo?: string | null
          id?: number
          material?: string | null
          Modulo?: number | null
          Tema?: string | null
          video?: string | null
        }
        Relationships: []
      }
      DICIONARIO: {
        Row: {
          "Exemplo de Uso 1": string | null
          "Exemplo de Uso 2": string | null
          Letra: string | null
          Palavra: string | null
          Significado: string | null
        }
        Insert: {
          "Exemplo de Uso 1"?: string | null
          "Exemplo de Uso 2"?: string | null
          Letra?: string | null
          Palavra?: string | null
          Significado?: string | null
        }
        Update: {
          "Exemplo de Uso 1"?: string | null
          "Exemplo de Uso 2"?: string | null
          Letra?: string | null
          Palavra?: string | null
          Significado?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - CIDADE": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - DESARMAMENTO": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - ECA": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - IDOSO": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - IGUALDADE RACIAL": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - OAB": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - PESSOA COM DEFICIÊNCIA": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      "ESTATUTO - TORCEDOR": {
        Row: {
          Artigo: string | null
          Aula: string | null
          Comentario: string | null
          id: number
          Narração: string | null
          "Número do Artigo": string | null
        }
        Insert: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Update: {
          Artigo?: string | null
          Aula?: string | null
          Comentario?: string | null
          id?: number
          Narração?: string | null
          "Número do Artigo"?: string | null
        }
        Relationships: []
      }
      FLASHCARDS: {
        Row: {
          area: string | null
          exemplo: string | null
          id: number
          pergunta: string | null
          resposta: string | null
          tema: string | null
        }
        Insert: {
          area?: string | null
          exemplo?: string | null
          id: number
          pergunta?: string | null
          resposta?: string | null
          tema?: string | null
        }
        Update: {
          area?: string | null
          exemplo?: string | null
          id?: number
          pergunta?: string | null
          resposta?: string | null
          tema?: string | null
        }
        Relationships: []
      }
      "IMAGEM - DESKTOP": {
        Row: {
          Imagem: number
          link: string | null
        }
        Insert: {
          Imagem: number
          link?: string | null
        }
        Update: {
          Imagem?: number
          link?: string | null
        }
        Relationships: []
      }
      JURIFLIX: {
        Row: {
          ano: number | null
          beneficios: string | null
          capa: string | null
          id: number
          link: string | null
          "link Video": string | null
          nome: string | null
          nota: string | null
          plataforma: string | null
          sinopse: string | null
          tipo: string | null
          trailer: string | null
        }
        Insert: {
          ano?: number | null
          beneficios?: string | null
          capa?: string | null
          id: number
          link?: string | null
          "link Video"?: string | null
          nome?: string | null
          nota?: string | null
          plataforma?: string | null
          sinopse?: string | null
          tipo?: string | null
          trailer?: string | null
        }
        Update: {
          ano?: number | null
          beneficios?: string | null
          capa?: string | null
          id?: number
          link?: string | null
          "link Video"?: string | null
          nome?: string | null
          nota?: string | null
          plataforma?: string | null
          sinopse?: string | null
          tipo?: string | null
          trailer?: string | null
        }
        Relationships: []
      }
      NOVIDADES: {
        Row: {
          Área: string | null
          Atualização: string | null
          created_at: string | null
          Dia: string | null
          id: number
        }
        Insert: {
          Área?: string | null
          Atualização?: string | null
          created_at?: string | null
          Dia?: string | null
          id: number
        }
        Update: {
          Área?: string | null
          Atualização?: string | null
          created_at?: string | null
          Dia?: string | null
          id?: number
        }
        Relationships: []
      }
      PETIÇÃO: {
        Row: {
          id: number
          Link: string | null
          Petições: string | null
        }
        Insert: {
          id: number
          Link?: string | null
          Petições?: string | null
        }
        Update: {
          id?: number
          Link?: string | null
          Petições?: string | null
        }
        Relationships: []
      }
      "RANKING FALCULDADE": {
        Row: {
          Estado: string | null
          "Nota da OAB": number | null
          "Nota dos concluintes": number | null
          "Nota em avaliação do Mercado": number | null
          "Nota em avaliação dos docentes": number | null
          "Nota em Professores com doutorado e mestrado": number | null
          "Nota em qualidade de ensino": number | null
          "Nota em Tempo de Dedicação dos Professores": number | null
          Posição: number | null
          "Posição em avaliação do Mercado": string | null
          "Posição em avaliação dos docentes": number | null
          "Posição em Professores com doutorado e mestrado": string | null
          "Posição em qualidade de ensino": string | null
          "Posição em Tempo de Dedicação dos Professores": string | null
          "Posição Nota da OAB": number | null
          "Posição Nota dos concluintes": string | null
          "Pública ou Privada": string | null
          Universidade: string
        }
        Insert: {
          Estado?: string | null
          "Nota da OAB"?: number | null
          "Nota dos concluintes"?: number | null
          "Nota em avaliação do Mercado"?: number | null
          "Nota em avaliação dos docentes"?: number | null
          "Nota em Professores com doutorado e mestrado"?: number | null
          "Nota em qualidade de ensino"?: number | null
          "Nota em Tempo de Dedicação dos Professores"?: number | null
          Posição?: number | null
          "Posição em avaliação do Mercado"?: string | null
          "Posição em avaliação dos docentes"?: number | null
          "Posição em Professores com doutorado e mestrado"?: string | null
          "Posição em qualidade de ensino"?: string | null
          "Posição em Tempo de Dedicação dos Professores"?: string | null
          "Posição Nota da OAB"?: number | null
          "Posição Nota dos concluintes"?: string | null
          "Pública ou Privada"?: string | null
          Universidade: string
        }
        Update: {
          Estado?: string | null
          "Nota da OAB"?: number | null
          "Nota dos concluintes"?: number | null
          "Nota em avaliação do Mercado"?: number | null
          "Nota em avaliação dos docentes"?: number | null
          "Nota em Professores com doutorado e mestrado"?: number | null
          "Nota em qualidade de ensino"?: number | null
          "Nota em Tempo de Dedicação dos Professores"?: number | null
          Posição?: number | null
          "Posição em avaliação do Mercado"?: string | null
          "Posição em avaliação dos docentes"?: number | null
          "Posição em Professores com doutorado e mestrado"?: string | null
          "Posição em qualidade de ensino"?: string | null
          "Posição em Tempo de Dedicação dos Professores"?: string | null
          "Posição Nota da OAB"?: number | null
          "Posição Nota dos concluintes"?: string | null
          "Pública ou Privada"?: string | null
          Universidade?: string
        }
        Relationships: []
      }
      "RANKING-FACULDADES": {
        Row: {
          avaliacao_cn: number | null
          avaliacao_mec: number | null
          estado: string | null
          id: number
          nota_concluintes: number | null
          nota_doutores: number | null
          nota_geral: number | null
          posicao: number | null
          qualidade: number | null
          qualidade_doutores: number | null
          quantidade_doutores: number | null
          tipo: string | null
          universidade: string
        }
        Insert: {
          avaliacao_cn?: number | null
          avaliacao_mec?: number | null
          estado?: string | null
          id: number
          nota_concluintes?: number | null
          nota_doutores?: number | null
          nota_geral?: number | null
          posicao?: number | null
          qualidade?: number | null
          qualidade_doutores?: number | null
          quantidade_doutores?: number | null
          tipo?: string | null
          universidade: string
        }
        Update: {
          avaliacao_cn?: number | null
          avaliacao_mec?: number | null
          estado?: string | null
          id?: number
          nota_concluintes?: number | null
          nota_doutores?: number | null
          nota_geral?: number | null
          posicao?: number | null
          qualidade?: number | null
          qualidade_doutores?: number | null
          quantidade_doutores?: number | null
          tipo?: string | null
          universidade?: string
        }
        Relationships: []
      }
      "SIMULADO-OAB": {
        Row: {
          "Alternativa A": string | null
          "Alternativa B": string | null
          "Alternativa C": string | null
          "Alternativa D": string | null
          Ano: number | null
          area: string | null
          Banca: string | null
          comentario: string | null
          Enunciado: string | null
          Exame: string | null
          "Numero da questao": number | null
          resposta: string | null
        }
        Insert: {
          "Alternativa A"?: string | null
          "Alternativa B"?: string | null
          "Alternativa C"?: string | null
          "Alternativa D"?: string | null
          Ano?: number | null
          area?: string | null
          Banca?: string | null
          comentario?: string | null
          Enunciado?: string | null
          Exame?: string | null
          "Numero da questao"?: number | null
          resposta?: string | null
        }
        Update: {
          "Alternativa A"?: string | null
          "Alternativa B"?: string | null
          "Alternativa C"?: string | null
          "Alternativa D"?: string | null
          Ano?: number | null
          area?: string | null
          Banca?: string | null
          comentario?: string | null
          Enunciado?: string | null
          Exame?: string | null
          "Numero da questao"?: number | null
          resposta?: string | null
        }
        Relationships: []
      }
      SUMULAS: {
        Row: {
          "Data de Aprovação": string | null
          id: number | null
          Narração: string | null
          "Texto da Súmula": string | null
          "Título da Súmula": string | null
        }
        Insert: {
          "Data de Aprovação"?: string | null
          id?: number | null
          Narração?: string | null
          "Texto da Súmula"?: string | null
          "Título da Súmula"?: string | null
        }
        Update: {
          "Data de Aprovação"?: string | null
          id?: number | null
          Narração?: string | null
          "Texto da Súmula"?: string | null
          "Título da Súmula"?: string | null
        }
        Relationships: []
      }
      "SUMULAS VINCULANTES": {
        Row: {
          "Data de Aprovação": string | null
          id: number | null
          Narração: string | null
          "Texto da Súmula": string | null
          "Título da Súmula": string | null
        }
        Insert: {
          "Data de Aprovação"?: string | null
          id?: number | null
          Narração?: string | null
          "Texto da Súmula"?: string | null
          "Título da Súmula"?: string | null
        }
        Update: {
          "Data de Aprovação"?: string | null
          id?: number | null
          Narração?: string | null
          "Texto da Súmula"?: string | null
          "Título da Súmula"?: string | null
        }
        Relationships: []
      }
      "VIDEO AULAS": {
        Row: {
          area: string | null
          categoria: string | null
          id: number
          link: string | null
        }
        Insert: {
          area?: string | null
          categoria?: string | null
          id: number
          link?: string | null
        }
        Update: {
          area?: string | null
          categoria?: string | null
          id?: number
          link?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_flashcard_areas: {
        Args: Record<PropertyKey, never>
        Returns: {
          area: string
          count: number
        }[]
      }
      get_flashcard_temas: {
        Args: { p_area: string }
        Returns: {
          count: number
          tema: string
        }[]
      }
    }
    Enums: {
      vade_role: "admin" | "moderador" | "contribuidor" | "leitor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      vade_role: ["admin", "moderador", "contribuidor", "leitor"],
    },
  },
} as const

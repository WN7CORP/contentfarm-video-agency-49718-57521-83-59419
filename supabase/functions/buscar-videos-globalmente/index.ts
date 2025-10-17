import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DIREITO_PREMIUM_API_KEY = Deno.env.get("DIREITO_PREMIUM_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm } = await req.json();
    
    if (!searchTerm || searchTerm.length < 3) {
      return new Response(
        JSON.stringify({ videos: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Buscando vídeos globalmente com termo:", searchTerm);

    // Buscar todas as playlists do banco
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: playlists, error: dbError } = await supabaseClient
      .from("VIDEO AULAS")
      .select("*");

    if (dbError) throw dbError;

    console.log(`Encontradas ${playlists?.length || 0} playlists no banco`);

    const allVideos: any[] = [];
    const searchLower = searchTerm.toLowerCase();

    // Buscar vídeos de cada playlist
    for (const playlist of playlists || []) {
      try {
        const playlistId = new URL(playlist.link).searchParams.get("list");
        if (!playlistId) continue;

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${DIREITO_PREMIUM_API_KEY}`
        );

        if (!response.ok) continue;

        const data = await response.json();
        
        // Filtrar vídeos que correspondem ao termo de busca
        const matchingVideos = data.items
          ?.filter((item: any) => {
            const title = item.snippet.title.toLowerCase();
            const description = item.snippet.description.toLowerCase();
            return title.includes(searchLower) || description.includes(searchLower);
          })
          .map((item: any) => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            playlistLink: playlist.link,
            area: playlist.area,
            categoria: playlist.categoria,
          })) || [];

        allVideos.push(...matchingVideos);
      } catch (err) {
        console.error("Erro ao buscar vídeos da playlist:", err);
      }
    }

    console.log(`Total de vídeos encontrados: ${allVideos.length}`);

    return new Response(
      JSON.stringify({ videos: allVideos }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Erro na função buscar-videos-globalmente:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

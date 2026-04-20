import { useEffect, useMemo, useState } from "react";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";
import { supabase } from "@/lib/supabase";
import { Lock, PlayCircle, Loader2 } from "lucide-react";

type MaxLabVideo = {
  id: string;
  title: string | null;
  embed_url: string | null;
  category: string | null;
  is_published: boolean | null;
  created_at: string | null;
};

type SubscriptionRow = {
  created_at: string | null;
};

function extractVturbVideoId(scriptUrl: string) {
  const match = scriptUrl.match(/players\/([^/]+)\/v4\/player\.js/i);
  return match?.[1] ?? "";
}

export default function MaxLab() {
  const [liberado, setLiberado] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [videos, setVideos] = useState<MaxLabVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    async function loadAccess() {
      setLoadingAccess(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erro ao buscar usuário autenticado:", authError);
        setLiberado(false);
        setLoadingAccess(false);
        return;
      }

      if (!user?.email) {
        setLiberado(false);
        setLoadingAccess(false);
        return;
      }

      const { data, error } = await supabase
        .from("swipemax_subscriptions")
        .select("created_at")
        .eq("email", user.email.toLowerCase())
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar assinatura:", error);
        setLiberado(false);
        setLoadingAccess(false);
        return;
      }

      const purchaseDate = data?.created_at ? new Date(data.created_at) : null;
      const now = new Date();

      if (!purchaseDate || Number.isNaN(purchaseDate.getTime())) {
        setLiberado(false);
        setLoadingAccess(false);
        return;
      }

      const diffMs = now.getTime() - purchaseDate.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      setLiberado(diffDias >= 7);
      setLoadingAccess(false);
    }

    loadAccess();
  }, []);

  useEffect(() => {
    async function loadVideos() {
      setLoadingVideos(true);

      const { data, error } = await supabase
        .from("maxlab_videos")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar vídeos do MaxLab:", error);
        setVideos([]);
        setLoadingVideos(false);
        return;
      }

      setVideos((data || []) as MaxLabVideo[]);
      setLoadingVideos(false);
    }

    loadVideos();
  }, []);

  const loading = loadingAccess || loadingVideos;

  const visibleVideos = useMemo(() => {
    return videos.filter((video) => video.embed_url && video.title);
  }, [videos]);

  return (
    <>
      <style>{`
        html {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 transparent;
        }

        html::-webkit-scrollbar {
          width: 8px;
        }

        html::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
        }

        html::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444 0%, #991b1b 100%);
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        html::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f87171 0%, #b91c1c 100%);
        }

        body {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 transparent;
        }

        body::-webkit-scrollbar {
          width: 8px;
        }

        body::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
        }

        body::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444 0%, #991b1b 100%);
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f87171 0%, #b91c1c 100%);
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-[#0c0c10] text-white">
        {loading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0c0c10]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="text-sm font-medium text-white">Carregando...</p>
            </div>
          </div>
        )}

        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_22%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[380px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="fixed inset-x-0 top-0 z-50">
          <SwipeHeader />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-8 pt-24 md:px-6 md:pt-28">
          {!liberado ? (
            <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.92)_0%,rgba(14,14,18,0.94)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <Lock className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-[32px] font-semibold tracking-[-0.06em] text-white md:text-[40px]">
                    MaxLab
                  </h1>

                  <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-zinc-400 md:text-[16px]">
                    Conteúdos, aulas e gravações disponíveis para membros.
                  </p>

                  <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-lg font-semibold text-white">
                      Conteúdo liberado em breve
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      O acesso ao MaxLab é liberado 7 dias após a compra.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-col gap-6">
              <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.92)_0%,rgba(14,14,18,0.94)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                  <PlayCircle className="h-4 w-4 text-red-300" />
                  MaxLab
                </div>

                <h1 className="mt-5 text-[32px] font-semibold leading-[0.98] tracking-[-0.06em] text-white md:text-[40px]">
                  Aulas, gravações e conteúdos práticos
                </h1>

                <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-zinc-400 md:text-[16px]">
                  Aqui você pode assistir aulas gravadas, conteúdos ao vivo e
                  materiais práticos para ajudar no dia a dia.
                </p>
              </section>

              {visibleVideos.length === 0 ? (
                <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <p className="text-lg font-medium text-white">
                    Nenhum vídeo publicado ainda
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Cadastre vídeos na tabela maxlab_videos.
                  </p>
                </section>
              ) : (
                <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {visibleVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      title={video.title || ""}
                      category={video.category || "Sem categoria"}
                      embedUrl={video.embed_url || ""}
                    />
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <SwipeFooter />
    </>
  );
}

function VideoCard({
  title,
  category,
  embedUrl,
}: {
  title: string;
  category: string;
  embedUrl: string;
}) {
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const match = embedUrl.match(/players\/([^/]+)\/v4\/player\.js/i);
    if (match?.[1]) {
      setPlayerId(match[1]);
    }
  }, [embedUrl]);

  useEffect(() => {
    if (!embedUrl || !playerId) return;

    const scriptId = `vturb-script-${playerId}`;

    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = embedUrl;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [embedUrl, playerId]);

  if (!playerId) {
    return null;
  }

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.96)_0%,rgba(13,13,18,0.98)_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:shadow-[0_24px_54px_rgba(0,0,0,0.24)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.06),transparent_22%)] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-70 transition-opacity duration-300 group-hover:via-red-400/35" />

      <div className="relative z-10 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white">
            {category}
          </span>
        </div>

        <h3 className="mb-4 text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
          {title}
        </h3>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black p-3">
          <div className="w-full">
            <vturb-smartplayer
              id={`vid-${playerId}`}
              style={{ display: "block", margin: "0 auto", width: "100%" }}
            ></vturb-smartplayer>
          </div>
        </div>
      </div>
    </article>
  );
}

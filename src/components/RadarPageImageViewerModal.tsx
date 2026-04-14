import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Image as ImageIcon, Loader2, ZoomIn, ZoomOut } from "lucide-react";

type ActiveTab = "white" | "black";

export type RadarImageViewerItem = {
  id: number;
  title: string;
  niche: string;
  pageStyle: "black" | "white" | "black-white";
  imageWhiteUrl: string;
  imageBlackUrl: string;
};

type RadarPageImageViewerModalProps = {
  open: boolean;
  onClose: () => void;
  item: RadarImageViewerItem | null;
};

function getInitialTab(item: RadarImageViewerItem | null): ActiveTab {
  if (item?.imageWhiteUrl) return "white";
  if (item?.imageBlackUrl) return "black";
  return "white";
}

export default function RadarPageImageViewerModal({
  open,
  onClose,
  item,
}: RadarPageImageViewerModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("white");
  const [signedImageUrl, setSignedImageUrl] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState("");
  const [zoom, setZoom] = useState(0.8);

  const hasWhite = !!item?.imageWhiteUrl;
  const hasBlack = !!item?.imageBlackUrl;

  const currentImagePath = useMemo(() => {
    if (!item) return "";
    return activeTab === "white" ? item.imageWhiteUrl : item.imageBlackUrl;
  }, [activeTab, item]);

  useEffect(() => {
    if (!open || !item) return;

    const initialTab = getInitialTab(item);
    setActiveTab(initialTab);
    setSignedImageUrl("");
    setFileError("");
    setZoom(0.8);
  }, [open, item]);

  useEffect(() => {
    async function loadViewerImage() {
      if (!open || !item) return;

      try {
        setLoadingFile(true);
        setFileError("");
        setSignedImageUrl("");

        if (!currentImagePath) {
          throw new Error("Nenhuma imagem disponível para esta visualização.");
        }

        const { data, error } = await supabase.storage
          .from("radarpage-images")
          .createSignedUrl(currentImagePath, 60 * 60);

        if (error || !data?.signedUrl) {
          throw error || new Error("Não foi possível gerar a URL temporária.");
        }

        setSignedImageUrl(data.signedUrl);
      } catch (error: any) {
        console.error("Erro ao gerar source do viewer:", error);
        setFileError(error?.message || "Erro ao abrir a imagem.");
      } finally {
        setLoadingFile(false);
      }
    }

    loadViewerImage();
  }, [open, item, activeTab, currentImagePath]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="
          relative flex h-[94vh] w-full max-w-[1400px] flex-col overflow-hidden
          rounded-[28px] border border-white/10
          bg-[linear-gradient(180deg,rgba(14,14,18,0.98)_0%,rgba(8,8,12,0.98)_100%)]
          shadow-[0_30px_90px_rgba(0,0,0,0.55)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_24%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_28%)]" />

        <div className="relative z-10 border-b border-white/10 px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-[24px] font-semibold tracking-[-0.04em] text-white md:text-[28px]">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Nicho: {item.niche || "-"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!hasWhite}
              onClick={() => setActiveTab("white")}
              className={`inline-flex h-[44px] items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-300 ${
                activeTab === "white"
                  ? "border border-emerald-400/20 bg-emerald-400/[0.12] text-emerald-200"
                  : hasWhite
                  ? "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.02] text-zinc-600"
              }`}
            >
              White
            </button>

            <button
              type="button"
              disabled={!hasBlack}
              onClick={() => setActiveTab("black")}
              className={`inline-flex h-[44px] items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-300 ${
                activeTab === "black"
                  ? "border border-red-500/20 bg-red-500/[0.12] text-red-200"
                  : hasBlack
                  ? "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.02] text-zinc-600"
              }`}
            >
              Black
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                title="Diminuir zoom"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <div className="inline-flex h-[38px] min-w-[72px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-300">
                {Math.round(zoom * 100)}%
              </div>

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                title="Aumentar zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-400 md:inline-flex">
                {activeTab === "white" ? "Visualizando White" : "Visualizando Black"}
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-10 min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_22%)] px-3 py-4 md:px-6 md:py-6"
          onContextMenu={(e) => e.preventDefault()}
        >
          {!hasWhite && !hasBlack ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-zinc-500" />
                <p className="mt-3 text-sm text-zinc-300">
                  Nenhuma imagem disponível para esta página.
                </p>
              </div>
            </div>
          ) : loadingFile ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-300" />
                <p className="mt-3 text-sm text-zinc-300">
                  Abrindo visualização...
                </p>
              </div>
            </div>
          ) : fileError ? (
            <div className="flex h-full min-h-[420px] items-center justify-center">
              <div className="rounded-[24px] border border-red-500/20 bg-red-500/[0.06] px-6 py-8 text-center">
                <p className="text-sm font-semibold text-red-200">
                  Não foi possível abrir a imagem
                </p>
                <p className="mt-2 text-sm text-red-100/80">{fileError}</p>
              </div>
            </div>
          ) : signedImageUrl ? (
            <div className="flex justify-center pt-2">
              <div
                className="transition-all duration-300"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
              >
                <img
                  src={signedImageUrl}
                  alt={item.title}
                  className="max-w-full rounded-[20px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
                  style={{ maxHeight: "none", objectFit: "contain" }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
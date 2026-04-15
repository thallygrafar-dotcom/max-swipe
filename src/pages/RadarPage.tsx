import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";
import RadarPageImageViewerModal from "@/components/RadarPageImageViewerModal";
import {
  Search,
  ChevronDown,
  Image as ImageIcon,
  Tag as TagIcon,
  Loader2,
} from "lucide-react";

type RadarPageStyle = "black" | "white" | "black-white";

type DbRadarItem = {
  id: number;
  title: string | null;
  niche: string | null;
  page_style: string | null;
  tags: string | null;
  image_url: string | null;
  image_white_url: string | null;
  image_black_url: string | null;
  published: boolean | null;
  created_at: string | null;
};

type RadarItem = {
  id: number;
  title: string;
  niche: string;
  pageStyle: RadarPageStyle;
  tags: string;
  imageUrl: string;
  imageWhiteUrl: string;
  imageBlackUrl: string;
  published: boolean;
  createdAt: string;
};

type RadarImageViewerItem = {
  id: number;
  title: string;
  niche: string;
  pageStyle: RadarPageStyle;
  imageWhiteUrl: string;
  imageBlackUrl: string;
};

function formatDateToDisplay(dateString: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR");
}

function getPageStyleLabel(style: RadarPageStyle) {
  if (style === "black") return "Black";
  if (style === "white") return "White";
  return "Black + White";
}

function mapDbItemToRadarItem(item: DbRadarItem): RadarItem {
  return {
    id: item.id,
    title: item.title ?? "",
    niche: item.niche ?? "",
    pageStyle: (item.page_style as RadarPageStyle) ?? "black",
    tags: item.tags ?? "",
    imageUrl: item.image_url ?? "",
    imageWhiteUrl: item.image_white_url ?? "",
    imageBlackUrl: item.image_black_url ?? "",
    published: item.published ?? false,
    createdAt: formatDateToDisplay(item.created_at),
  };
}

function mapRadarItemToViewerItem(item: RadarItem): RadarImageViewerItem {
  return {
    id: item.id,
    title: item.title,
    niche: item.niche,
    pageStyle: item.pageStyle,
    imageWhiteUrl: item.imageWhiteUrl,
    imageBlackUrl: item.imageBlackUrl,
  };
}

function getTopBadgeClasses(style: RadarPageStyle) {
  if (style === "white") {
    return "border-black/10 bg-white/80 text-black";
  }

  if (style === "black") {
    return "border-white/10 bg-black/60 text-white";
  }

  return "border-amber-300/20 bg-amber-300/80 text-black";
}

export default function RadarPage() {
  const [items, setItems] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const [selectedNiche, setSelectedNiche] = useState("Todos");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RadarImageViewerItem | null>(
    null
  );

  useEffect(() => {
    async function loadItems() {
      setLoading(true);

      const { data, error } = await supabase
        .from("radar_page_items")
        .select(
          "id, title, niche, page_style, tags, image_url, image_white_url, image_black_url, published, created_at"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar RadarPage:", error);
        alert(`Erro ao carregar RadarPage: ${error.message}`);
        setItems([]);
        setLoading(false);
        return;
      }

      const mapped = ((data as DbRadarItem[]) || []).map(mapDbItemToRadarItem);
      setItems(mapped);
      setLoading(false);
    }

    loadItems();
  }, []);

  const nicheOptions = useMemo(() => {
    const niches = items.map((item) => item.niche.trim()).filter(Boolean);
    return ["Todos", ...Array.from(new Set(niches))];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.niche.toLowerCase().includes(term) ||
          item.tags.toLowerCase().includes(term)
      );
    }

    if (selectedStyle !== "Todos") {
      result = result.filter((item) => item.pageStyle === selectedStyle);
    }

    if (selectedNiche !== "Todos") {
      result = result.filter((item) => item.niche === selectedNiche);
    }

    return result;
  }, [items, search, selectedStyle, selectedNiche]);

  function openViewer(item: RadarItem) {
    setSelectedItem(mapRadarItemToViewerItem(item));
    setViewerOpen(true);
  }

  function clearFilters() {
    setSearch("");
    setSelectedStyle("Todos");
    setSelectedNiche("Todos");
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[#0c0c10] text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_22%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[380px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="fixed inset-x-0 top-0 z-50">
          <SwipeHeader />
        </div>

<div className="relative z-10 mx-auto w-full max-w-[1432px] px-4 pb-10 pt-24 md:px-6 md:pb-12 md:pt-28">
    <div className="flex flex-col gap-6">
            <section
              className="
                relative overflow-hidden rounded-[30px]
                border border-white/[0.07]
                bg-[linear-gradient(180deg,rgba(18,18,22,1)_0%,rgba(10,10,12,1)_100%)]
                px-6 py-6 md:px-8 md:py-8
                shadow-[0_18px_55px_rgba(0,0,0,0.28)]
              "
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_18%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.08),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.04),transparent_22%)]" />

              <div className="relative z-10">
                <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
                  RadarPage
                </div>

                <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-white md:text-[48px]">
  Páginas do Radar<span className="text-red-500">Page</span>
</h1>

                <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-zinc-400 md:text-[15px]">
Veja exemplos de páginas bem estruturadas, com copy e construção organizadas para análise e inspiração.                </p>
              </div>
            </section>

            <section
              className="
                relative overflow-hidden rounded-[24px]
                border border-white/[0.07]
                bg-[linear-gradient(180deg,rgba(17,17,20,1)_0%,rgba(10,10,12,1)_100%)]
                p-4
                shadow-[0_14px_34px_rgba(0,0,0,0.22)]
              "
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por título, nicho ou tag..."
                      className="
                        h-[54px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                        pl-11 pr-4 text-sm text-white outline-none
                        placeholder:text-zinc-500
                        transition-all duration-300
                        focus:border-red-500/25 focus:bg-white/[0.05]
                      "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      inline-flex h-[54px] items-center justify-center rounded-2xl
                      border border-white/10 bg-white/[0.03] px-6
                      text-sm font-semibold text-white
                      transition-all duration-300
                      hover:bg-white/[0.06]
                    "
                  >
                    Limpar filtros
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <SelectField
                    label="Estilo"
                    value={selectedStyle}
                    onChange={setSelectedStyle}
                    options={["Todos", "black", "white", "black-white"]}
                    labels={{
                      Todos: "Todos",
                      black: "Black",
                      white: "White",
                      "black-white": "Black + White",
                    }}
                  />

                  <SelectField
                    label="Nicho"
                    value={selectedNiche}
                    onChange={setSelectedNiche}
                    options={nicheOptions}
                  />
                </div>
              </div>
            </section>

            <section className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-white md:text-[30px]">
                  Todas as páginas
                </h2>

                <div className="inline-flex h-12 min-w-[52px] items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white">
                  {loading ? "..." : filteredItems.length}
                </div>
              </div>
            </section>

            <section>
              {loading ? (
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-300" />
                  <p className="mt-3 text-lg font-medium text-white">
                    Carregando páginas...
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <p className="text-lg font-medium text-white">
                    Nenhuma página encontrada
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Ajuste os filtros ou publique novas páginas no admin.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openViewer(item)}
                      className="
                        group relative overflow-hidden rounded-[30px]
                        border border-white/10
                        bg-[linear-gradient(180deg,rgba(22,22,28,0.96)_0%,rgba(13,13,18,0.98)_100%)]
                        text-left shadow-[0_16px_34px_rgba(0,0,0,0.18)]
                        transition-all duration-300
                        hover:-translate-y-1.5 hover:border-red-500/20
                        hover:shadow-[0_24px_54px_rgba(0,0,0,0.24)]
                      "
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.06),transparent_22%)] opacity-80" />

                      <div className="relative z-10">
                        <div className="relative h-[250px] overflow-hidden">
                          {item.imageUrl ? (
  <img
    src={item.imageUrl}
    alt={item.title}
    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
  />
) : item.imageWhiteUrl || item.imageBlackUrl ? (
  <img
    src={item.imageWhiteUrl || item.imageBlackUrl}
    alt={item.title}
    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
  />
) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-zinc-500">
                              <ImageIcon className="h-8 w-8" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.14)_45%,rgba(0,0,0,0.78)_100%)]" />

                          <div className="absolute left-4 top-4 flex items-center gap-2">
                            <div
                              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[12px] font-semibold backdrop-blur-md ${getTopBadgeClasses(
                                item.pageStyle
                              )}`}
                            >
                              {getPageStyleLabel(item.pageStyle)}
                            </div>
                          </div>

                          <div className="absolute right-4 top-4">
                            <div className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[12px] font-medium text-zinc-100 backdrop-blur-md">
                              {item.createdAt || "Sem data"}
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="line-clamp-2 min-h-[58px] text-[20px] font-semibold leading-[1.08] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-red-50">
                            {item.title || "Sem título"}
                          </h3>

                          <p className="mt-2 line-clamp-1 text-[13px] text-zinc-400">
                            Nicho:{" "}
                            <span className="text-zinc-200">
                              {item.niche || "-"}
                            </span>
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <MiniTag>
                              <ImageIcon className="h-3.5 w-3.5" />
                              {item.imageWhiteUrl ? "Página White" : "Sem White"}
                            </MiniTag>

                            <MiniTag>
                              <ImageIcon className="h-3.5 w-3.5" />
                              {item.imageBlackUrl ? "Página Black" : "Sem Black"}
                            </MiniTag>
                          </div>

                          {item.tags.trim().length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {item.tags
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean)
                                .map((tag) => (
                                  <MiniTag key={tag}>
                                    <TagIcon className="h-3.5 w-3.5" />
                                    {tag}
                                  </MiniTag>
                                ))}
                            </div>
                          )}

                          <div className="mt-5 inline-flex h-[46px] w-full items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-red-500/[0.12]">
                            Abrir página
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <SwipeFooter />
      </div>

      <RadarPageImageViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        item={selectedItem}
      />
    </>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-[48px] w-full appearance-none rounded-2xl border border-white/10
            bg-white/[0.03] px-4 pr-10 text-sm text-white outline-none
            transition-all duration-300
            focus:border-red-500/25 focus:bg-white/[0.05]
          "
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#0d0d10] text-white"
            >
              {labels?.[option] ?? option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  );
}

function MiniTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        inline-flex h-[30px] items-center gap-1.5 rounded-full
        border border-white/10 bg-white/[0.03]
        px-2.5 text-[11px] font-medium text-zinc-300
        whitespace-nowrap
      "
    >
      {children}
    </div>
  );
}

function StorageImage({
  bucket,
  path,
  alt,
}: {
  bucket: string;
  path: string;
  alt: string;
}) {
  const [signedUrl, setSignedUrl] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImage() {
      if (!path) {
        setSignedUrl("");
        return;
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60);

      if (!active) return;
      if (error || !data?.signedUrl) {
        setSignedUrl("");
        return;
      }

      setSignedUrl(data.signedUrl);
    }

    loadImage();

    return () => {
      active = false;
    };
  }, [bucket, path]);

  if (!signedUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-zinc-500">
        <ImageIcon className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={signedUrl}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}
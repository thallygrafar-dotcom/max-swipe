import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import SwipeHeader from "@/components/SwipeHeader";
import {
  Search,
  BarChart3,
  ChevronDown,
  Link as LinkIcon,
  Sparkles,
  X,
} from "lucide-react";

type OfferStatus = "Escalando" | "Teste" | "Validada";
type OfferStyle = "Black" | "White";
type OfferFormat = "Advertorial" | "VSL" | "Quiz" | "Bridge Page";

type DbOfferItem = {
  id: number;
  title: string | null;
  product: string | null;
  niche: string | null;
  format: string | null;
  style: string | null;
  status: string | null;
  image_url: string | null;
  vsl_url: string | null;
  transcription_url: string | null;
  ads_count: number | null;
  tags: string | null;
  published: boolean | null;
  created_at: string | null;
};

type OfferItem = {
  id: number;
  title: string;
  product: string;
  niche: string;
  format: OfferFormat;
  style: OfferStyle;
  status: OfferStatus;
  imageUrl: string;
  vslUrl: string;
  transcriptionUrl: string;
  adsCount: number;
  tags: string;
  published: boolean;
  createdAt: string;
};

const niches = [
  "Todos",
  "Visão",
  "Diabetes",
  "Neuropatia",
  "Próstata",
  "Emagrecimento",
  "Pulmão",
  "Disfunção Erétil",
  "Memória",
];

const formats = ["Todos"];
const styles = ["Todos", "Black", "White"];
const statuses = ["Todos", "Escalando", "Validada"];

const sortOptions = [
  { label: "Mais recentes", value: "recent" },
  { label: "Mais anúncios", value: "ads_desc" },
  { label: "Menos anúncios", value: "ads_asc" },
  { label: "A-Z", value: "az" },
];

function getStatusStyles(status: OfferStatus) {
  if (status === "Escalando") {
    return "border-emerald-400/20 bg-emerald-400/[0.10] text-emerald-300";
  }

  if (status === "Teste") {
    return "border-amber-400/20 bg-amber-400/[0.10] text-amber-300";
  }

  return "border-sky-400/20 bg-sky-400/[0.10] text-sky-300";
}

function getStyleTagStyles(style: OfferStyle) {
  if (style === "Black") {
    return "border-white/10 bg-white/[0.05] text-white";
  }

  return "border-white/10 bg-white text-black";
}

function formatDisplayDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("pt-BR");
}

function getSafeTimestamp(dateString: string) {
  const timestamp = new Date(dateString).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function SwipeMax() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Todos");
  const [selectedFormat, setSelectedFormat] = useState("Todos");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);

      const { data, error } = await supabase
        .from("swipe_max_items")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert("Erro ao carregar ofertas do Swipe MAX");
        setOffers([]);
        setLoading(false);
        return;
      }

      const rows = (data || []) as DbOfferItem[];

      const mappedOffers: OfferItem[] = rows.map((item) => ({
        id: item.id,
        title: item.title ?? "",
        product: item.product ?? "",
        niche: item.niche ?? "",
        format: (item.format as OfferFormat) ?? "VSL",
        style: (item.style as OfferStyle) ?? "Black",
        status: (item.status as OfferStatus) ?? "Escalando",
        imageUrl:
          item.image_url ||
          "https://via.placeholder.com/1200x800?text=Swipe+MAX",
        vslUrl: item.vsl_url ?? "",
        transcriptionUrl: item.transcription_url ?? "",
        adsCount: item.ads_count ?? 0,
        tags: item.tags ?? "",
        published: item.published ?? false,
        createdAt: item.created_at ?? "",
      }));

      setOffers(mappedOffers);
      setLoading(false);
    }

    loadOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    let result = [...offers];

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter(
        (offer) =>
          offer.title.toLowerCase().includes(term) ||
          offer.product.toLowerCase().includes(term) ||
          offer.niche.toLowerCase().includes(term) ||
          offer.format.toLowerCase().includes(term) ||
          offer.tags.toLowerCase().includes(term)
      );
    }

    if (selectedNiche !== "Todos") {
      result = result.filter((offer) => offer.niche === selectedNiche);
    }

    if (selectedFormat !== "Todos") {
      result = result.filter((offer) => offer.format === selectedFormat);
    }

    if (selectedStyle !== "Todos") {
      result = result.filter((offer) => offer.style === selectedStyle);
    }

    if (selectedStatus !== "Todos") {
      result = result.filter((offer) => offer.status === selectedStatus);
    }

    if (sortBy === "ads_desc") {
      result.sort((a, b) => b.adsCount - a.adsCount);
    } else if (sortBy === "ads_asc") {
      result.sort((a, b) => a.adsCount - b.adsCount);
    } else if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort(
        (a, b) => getSafeTimestamp(b.createdAt) - getSafeTimestamp(a.createdAt)
      );
    }

    return result;
  }, [
    offers,
    search,
    selectedNiche,
    selectedFormat,
    selectedStyle,
    selectedStatus,
    sortBy,
  ]);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  function clearFilters() {
    setSearch("");
    setSelectedNiche("Todos");
    setSelectedFormat("Todos");
    setSelectedStyle("Todos");
    setSelectedStatus("Todos");
    setSortBy("recent");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c10] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_22%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[380px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="fixed inset-x-0 top-0 z-50">
        <SwipeHeader />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1460px] px-4 pb-5 pt-24 md:px-6 md:pb-6 md:pt-28">
        <div className="flex flex-col gap-6">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.92)_0%,rgba(14,14,18,0.94)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.08),transparent_20%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                  <Sparkles className="h-3.5 w-3.5 text-red-300" />
                  SwipeMAX
                </div>

                <h1 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[0.98] tracking-[-0.06em] text-white md:text-[44px]">
                  Biblioteca de VSLs e Transcrições
                </h1>

                <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-zinc-400 md:text-[16px]">
                  VSLs reais que estão fazendo dinheiro todos os dias, prontas pra você estudar e replicar.
                </p>
              </div>

              <div className="flex items-center gap-3">
                
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[rgba(18,18,24,0.72)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar oferta, produto, nicho ou tag..."
                    className="h-[54px] w-full rounded-2xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/35 focus:bg-white/[0.07]"
                  />
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-[54px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-red-500/25 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                  Limpar filtros
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <FilterSelect
                  label="Nicho"
                  value={selectedNiche}
                  onChange={setSelectedNiche}
                  options={niches}
                />
                <FilterSelect
                  label="Formato"
                  value={selectedFormat}
                  onChange={setSelectedFormat}
                  options={formats}
                />
                <FilterSelect
                  label="Estilo"
                  value={selectedStyle}
                  onChange={setSelectedStyle}
                  options={styles}
                />
                <FilterSelect
                  label="Status"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={statuses}
                />
                <FilterSelect
                  label="Ordenar"
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions.map((option) => option.value)}
                  labels={Object.fromEntries(
                    sortOptions.map((option) => [option.value, option.label])
                  )}
                />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-white md:text-[30px]">
                Todas as VSLs
              </h2>

              <div className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white">
                {loading ? "..." : filteredOffers.length}
              </div>
            </div>
          </section>

          <section>
            {loading ? (
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <p className="text-lg font-medium text-white">Carregando...</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <p className="text-lg font-medium text-white">
                  Nenhuma oferta publicada
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Cadastre e publique ofertas no Swipe MAX Admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {filteredOffers.map((offer) => (
                  <article
                    key={offer.id}
                    className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.96)_0%,rgba(13,13,18,0.98)_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/25 hover:shadow-[0_24px_54px_rgba(0,0,0,0.24)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.06),transparent_22%)] opacity-80" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-70 transition-opacity duration-300 group-hover:via-red-400/35" />

                    <div className="relative z-10">
                      <div className="relative h-[238px] overflow-hidden">
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.14)_48%,rgba(0,0,0,0.74)_100%)]" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <div
                            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${getStatusStyles(
                              offer.status
                            )}`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                            {offer.status}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[13px] text-zinc-300">
                              {offer.createdAt
                                ? formatDisplayDate(offer.createdAt)
                                : ""}
                            </p>

                            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-[13px] font-medium text-zinc-100 backdrop-blur-md">
                              <BarChart3 className="h-4 w-4 text-red-300" />
                              {offer.adsCount} ads
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="min-h-[90px]">
                          <h3 className="line-clamp-3 text-[20px] font-semibold leading-[1.08] tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-red-50">
                            {offer.title}
                          </h3>

                          {offer.product ? (
                            <p className="mt-2 line-clamp-1 text-[13px] text-zinc-400">
                              Produto: <span className="text-zinc-200">{offer.product}</span>
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Tag className={getStyleTagStyles(offer.style)}>
                            {offer.style}
                          </Tag>
                          <Tag>{offer.niche}</Tag>
                          <Tag>{offer.format}</Tag>

                          {offer.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <a
                            href={offer.vslUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => {
                              if (!offer.vslUrl) e.preventDefault();
                            }}
                            className={`inline-flex h-[46px] items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 text-[13px] font-semibold text-white transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/16 hover:shadow-[0_10px_24px_rgba(127,29,29,0.18)] ${
                              !offer.vslUrl ? "cursor-not-allowed opacity-40" : ""
                            }`}
                          >
                            <LinkIcon className="h-4 w-4" />
                            Abrir VSL
                          </a>

                          <a
                            href={offer.transcriptionUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => {
                              if (!offer.transcriptionUrl) e.preventDefault();
                            }}
                            className={`inline-flex h-[46px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[13px] font-semibold text-white transition-all duration-300 hover:border-red-500/25 hover:bg-white/[0.08] ${
                              !offer.transcriptionUrl
                                ? "cursor-not-allowed opacity-40"
                                : ""
                            }`}
                          >
                            <LinkIcon className="h-4 w-4" />
                            Transcrição
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[48px] w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 pr-10 text-sm text-white outline-none transition-all duration-300 hover:border-red-500/20 focus:border-red-500/35 focus:bg-white/[0.07]"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#111115] text-white"
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

function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white transition-all duration-300 hover:border-red-500/25 hover:bg-red-500/10 ${className}`}
    >
      {children}
    </span>
  );
}
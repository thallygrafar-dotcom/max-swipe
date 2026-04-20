import { useEffect, useMemo, useRef, useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  vslId: number;
  onClose: () => void;
};

type AnalysisData = Record<string, any>;

type TabItem = {
  key: string;
  label: string;
};

const tabs: TabItem[] = [
  { key: "promessa_real", label: "1. PROMESSA REAL DA NARRATIVA" },
  { key: "mecanismo_central", label: "2. MECANISMO CENTRAL" },
  { key: "dor_central", label: "3. DOR CENTRAL E CAMADAS DE DOR" },
  { key: "persona", label: "4. PERSONA" },
  { key: "angulos", label: "5. ÂNGULOS QUE A NARRATIVA SUPORTA" },
  { key: "clusters", label: "6. CLUSTERS COMPATÍVEIS" },
  { key: "palavras_chave", label: "7. PALAVRAS-CHAVE POR CLUSTER" },
  { key: "estrutura_invisivel", label: "8. ESTRUTURA INVISÍVEL DA NARRATIVA" },
  { key: "gatilhos_copy", label: "9. GATILHOS DE COPY USADOS" },
  { key: "diagnostico_estrategico", label: "10. DIAGNÓSTICO ESTRATÉGICO FINAL" },
  { key: "resumo_executivo", label: "11. RESUMO EXECUTIVO" },
];

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function prettifyKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isPrimitive(value: unknown) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function PrimitiveValue({ value }: { value: string | number | boolean }) {
  return <p className="text-sm leading-7 text-zinc-300">{String(value)}</p>;
}

function ArrayValue({ items }: { items: any[] }) {
  const allPrimitive = items.every((item) => isPrimitive(item));

  if (allPrimitive) {
    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${String(item)}-${index}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-zinc-300"
          >
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <RenderValue value={item} />
        </div>
      ))}
    </div>
  );
}

function ObjectValue({ value }: { value: Record<string, any> }) {
  const entries = Object.entries(value);

  return (
    <div className="space-y-4">
      {entries.map(([key, nestedValue]) => (
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {prettifyKey(key)}
          </p>
          <RenderValue value={nestedValue} />
        </div>
      ))}
    </div>
  );
}

function RenderValue({ value }: { value: any }) {
  if (value === null || value === undefined || value === "") {
    return <p className="text-sm text-zinc-500">Sem informação.</p>;
  }

  if (isPrimitive(value)) {
    return <PrimitiveValue value={value} />;
  }

  if (Array.isArray(value)) {
    return <ArrayValue items={value} />;
  }

  if (typeof value === "object") {
    return <ObjectValue value={value} />;
  }

  return <p className="text-sm text-zinc-300">{String(value)}</p>;
}

function SectionCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </p>
      <RenderValue value={value} />
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-200">
        <Sparkles className="h-3.5 w-3.5" />
        Em breve
      </div>

      <p className="mt-3 text-[15px] leading-7 text-zinc-400">
        Ainda não temos a estrutura dessa VSL disponível.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex h-[50px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[14px] font-semibold text-white transition-all hover:bg-white/[0.08]"
      >
        Entendi
      </button>
    </>
  );
}

export default function SwipeMaxInvisibleModal({ vslId, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollTop = 0;
  }
}, [activeTab]);

  useEffect(() => {
    async function loadAnalysis() {
      setLoading(true);

      

      const { data, error } = await supabase
        .from("vsl_analysis")
        .select("analysis_data")
        .eq("vsl_id", vslId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar análise:", error);
        setAnalysis(null);
        setLoading(false);
        return;
      }

      const rawAnalysis = (data?.analysis_data ?? null) as AnalysisData | null;
      setAnalysis(rawAnalysis);
      setLoading(false);
    }

    loadAnalysis();
  }, [vslId]);

  const normalizedAnalysis = useMemo(() => {
    if (!analysis || typeof analysis !== "object") return null;

    const mapped: Record<string, any> = {};

    Object.entries(analysis).forEach(([key, value]) => {
      mapped[normalizeKey(key)] = value;
    });

    return mapped;
  }, [analysis]);

  const currentTabData = normalizedAnalysis?.[activeTab] ?? null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >

   <style>{`
  section {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px;
    padding: 22px 22px;
    margin-bottom: 16px;
  }

  section h2 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #a1a1aa;
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .analysis-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .analysis-block p {
    font-size: 15px;
    line-height: 1.75;
    color: #d4d4d8;
    margin: 0;
  }

  .analysis-block strong {
  color: #fca5a5;
  font-weight: 700;
}

  .analysis-block em {
    color: #a1a1aa;
    font-style: italic;
  }

  .analysis-block ul {
  list-style: disc;
  list-style-position: outside;
  padding-left: 22px;
  margin: 8px 0 10px;
}

.analysis-block li {
  display: list-item;
  font-size: 14px;
  line-height: 1.7;
  color: #d4d4d8;
  margin-bottom: 6px;
}

.analysis-block li::marker {
  color: #fca5a5;
}


  .item-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
    radial-gradient(circle at top left, rgba(248,113,113,0.08), transparent 35%);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 20px;
  padding: 18px 20px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04),
    0 10px 30px rgba(0,0,0,0.18);
  margin-bottom: 14px;
}



  .item-card:last-child {
    margin-bottom: 0;
  }

  .item-title {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6px;
    line-height: 1.5;
  }

  .item-meta {
    font-size: 13px;
    line-height: 1.7;
    color: #c4c4c7;
  }

  .item-meta strong {
    color: #ffffff;
    font-weight: 700;
  }

  .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 8px;
  vertical-align: middle;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
}

.badge-green {
  background: linear-gradient(180deg, rgba(52,211,153,0.18), rgba(52,211,153,0.10));
  color: #bbf7d0;
  border: 1px solid rgba(52,211,153,0.22);
}

.badge-amber {
  background: linear-gradient(180deg, rgba(251,191,36,0.18), rgba(251,191,36,0.10));
  color: #fde68a;
  border: 1px solid rgba(251,191,36,0.22);
}

.badge-red {
  background: linear-gradient(180deg, rgba(248,113,113,0.20), rgba(248,113,113,0.10));
  color: #fecaca;
  border: 1px solid rgba(248,113,113,0.24);
}

  .divider {
    border: 0;
    border-top: 1px solid rgba(255,255,255,0.08);
    margin: 14px 0;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .card-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  .metric-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 16px;
    text-align: center;
  }

  .metric-card .label {
    display: block;
    font-size: 11px;
    color: #a1a1aa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .metric-card .value {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
  }

  .timeline {
    display: grid;
    gap: 12px;
  }

  .tl-item {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
    align-items: start;
  }

  .tl-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a1a1aa;
    text-align: right;
    padding-top: 4px;
  }

  .tl-body {
    border-left: 2px solid rgba(255,255,255,0.08);
    padding-left: 16px;
  }

  .tl-title {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
    line-height: 1.5;
  }

  .tl-desc {
    font-size: 13px;
    line-height: 1.7;
    color: #c4c4c7;
  }

  .kw-group {
    margin-bottom: 18px;
  }

  .kw-group:last-child {
    margin-bottom: 0;
  }

  .kw-group-title {
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .kw-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .kw-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    padding: 6px 10px;
    font-size: 12px;
    color: #d4d4d8;
  }

  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }

    .tl-item {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .tl-label {
      text-align: left;
      padding-top: 0;
    }
  }
`}</style>
      <div
        className="relative flex h-[88vh] w-full max-w-[1180px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.98)_0%,rgba(13,13,18,1)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_25%),radial-gradient(circle_at_right,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.05),transparent_30%)]" />

       <button
  onClick={onClose}
  className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-zinc-300 transition-all hover:bg-black/60"
>
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 flex w-full flex-col lg:flex-row">
          <aside className="flex min-h-0 w-full flex-col border-b border-white/10 bg-white/[0.02] lg:w-[350px] lg:border-b-0 lg:border-r">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
                <Sparkles className="h-3.5 w-3.5" />
                Estrutura da VSL
              </div>

              <h3 className="mt-3 pr-10 text-[28px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                Estrutura Invisível
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Engenharia invisível da narrativa organizada em 11 abas.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const hasContent = !!normalizedAnalysis?.[tab.key];
                  const isActive = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                        isActive
                          ? "border-red-500/35 bg-red-500/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[12px] font-semibold leading-5">
                          {tab.label}
                        </span>

                        <span
                          className={`mt-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            hasContent
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-yellow-400/10 text-yellow-200"
                          }`}
                        >
                          {hasContent ? "OK" : "Vazio"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-h-0 flex-1 overflow-hidden">
  <div
    ref={contentRef}
    className="h-full overflow-y-auto px-5 py-5 md:px-6 md:py-6"
  >
              {loading && (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando análise...
                </div>
              )}

              {!loading && !normalizedAnalysis && <EmptyState onClose={onClose} />}

              {!loading && normalizedAnalysis && (
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Aba ativa
                    </p>
                    <h4 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.04em] text-white">
                      {tabs.find((tab) => tab.key === activeTab)?.label}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      VSL #{vslId}
                    </p>
                  </div>

                  {currentTabData ? (
                    typeof currentTabData === "object" &&
                    !Array.isArray(currentTabData) ? (
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {Object.entries(currentTabData).map(([key, value]) => (
                          <SectionCard
                            key={key}
                            title={prettifyKey(key)}
                            value={value}
                          />
                        ))}
                      </div>
                    ) : (
  <div
    className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
    dangerouslySetInnerHTML={{ __html: String(currentTabData) }}
  />
)
                  ) : (
                    <div className="rounded-[22px] border border-yellow-400/20 bg-yellow-400/10 p-5">
                      <p className="text-sm font-semibold text-yellow-200">
                        Essa aba ainda não tem conteúdo cadastrado.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
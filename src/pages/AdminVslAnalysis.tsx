import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, LogOut } from "lucide-react";

type VslItem = {
  id: number;
  title: string | null;
  product: string | null;
};

type AnalysisData = {
  promessa_real: string;
  mecanismo_central: string;
  dor_central: string;
  persona: string;
  angulos: string;
  clusters: string;
  palavras_chave: string;
  estrutura_invisivel: string;
  gatilhos_copy: string;
  diagnostico_estrategico: string;
  resumo_executivo: string;
};

const emptyForm: AnalysisData = {
  promessa_real: "",
  mecanismo_central: "",
  dor_central: "",
  persona: "",
  angulos: "",
  clusters: "",
  palavras_chave: "",
  estrutura_invisivel: "",
  gatilhos_copy: "",
  diagnostico_estrategico: "",
  resumo_executivo: "",
};

const tabs: Array<{ key: keyof AnalysisData; label: string }> = [
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

function normalizeLoadedData(data: Record<string, any> | null | undefined): AnalysisData {
  return {
    promessa_real: typeof data?.promessa_real === "string" ? data.promessa_real : "",
    mecanismo_central: typeof data?.mecanismo_central === "string" ? data.mecanismo_central : "",
    dor_central: typeof data?.dor_central === "string" ? data.dor_central : "",
    persona: typeof data?.persona === "string" ? data.persona : "",
    angulos: typeof data?.angulos === "string" ? data.angulos : "",
    clusters: typeof data?.clusters === "string" ? data.clusters : "",
    palavras_chave: typeof data?.palavras_chave === "string" ? data.palavras_chave : "",
    estrutura_invisivel: typeof data?.estrutura_invisivel === "string" ? data.estrutura_invisivel : "",
    gatilhos_copy: typeof data?.gatilhos_copy === "string" ? data.gatilhos_copy : "",
    diagnostico_estrategico:
      typeof data?.diagnostico_estrategico === "string" ? data.diagnostico_estrategico : "",
    resumo_executivo: typeof data?.resumo_executivo === "string" ? data.resumo_executivo : "",
  };
}

export default function AdminVslAnalysis() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loadingVsls, setLoadingVsls] = useState(true);
  const [vsls, setVsls] = useState<VslItem[]>([]);
  const [selectedVslId, setSelectedVslId] = useState<number | "">("");

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof AnalysisData>("promessa_real");
  const [form, setForm] = useState<AnalysisData>(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getUser();
      setIsLogged(!!data.user);
      setCheckingAuth(false);
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (!isLogged) return;

    async function loadVsls() {
      setLoadingVsls(true);

      const { data, error } = await supabase
        .from("swipe_max_items")
        .select("id, title, product")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar VSLs:", error);
        setVsls([]);
        setLoadingVsls(false);
        return;
      }

      setVsls((data ?? []) as VslItem[]);
      setLoadingVsls(false);
    }

    loadVsls();
  }, [isLogged]);

  useEffect(() => {
    if (!selectedVslId) {
      setForm(emptyForm);
      setMessage("");
      return;
    }

    async function loadAnalysis() {
      setLoadingAnalysis(true);
      setMessage("");

      const { data, error } = await supabase
        .from("vsl_analysis")
        .select("analysis_data")
        .eq("vsl_id", selectedVslId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar análise:", error);
        setForm(emptyForm);
        setLoadingAnalysis(false);
        return;
      }

      setForm(normalizeLoadedData(data?.analysis_data));
      setLoadingAnalysis(false);
    }

    loadAnalysis();
  }, [selectedVslId]);

  const selectedVsl = useMemo(
    () => vsls.find((item) => item.id === selectedVslId) ?? null,
    [vsls, selectedVslId]
  );

  async function handleLogin() {
    setLoginLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoginLoading(false);

    if (error) {
      alert("Email ou senha inválidos.");
      return;
    }

    setIsLogged(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsLogged(false);
    setLoginEmail("");
    setLoginPassword("");
    setSelectedVslId("");
    setForm(emptyForm);
    setMessage("");
  }

  async function handleSave() {
    if (!selectedVslId) {
      alert("Selecione uma VSL.");
      return;
    }

    setSaving(true);
    setMessage("");

    const analysisData = {
      promessa_real: form.promessa_real,
      mecanismo_central: form.mecanismo_central,
      dor_central: form.dor_central,
      persona: form.persona,
      angulos: form.angulos,
      clusters: form.clusters,
      palavras_chave: form.palavras_chave,
      estrutura_invisivel: form.estrutura_invisivel,
      gatilhos_copy: form.gatilhos_copy,
      diagnostico_estrategico: form.diagnostico_estrategico,
      resumo_executivo: form.resumo_executivo,
    };

    const { data: updatedRows, error: updateError } = await supabase
      .from("vsl_analysis")
      .update({
        analysis_data: analysisData,
        updated_at: new Date().toISOString(),
      })
      .eq("vsl_id", selectedVslId)
      .select("id");

    if (updateError) {
      console.error("Erro ao atualizar análise:", updateError);
      alert(`Erro ao atualizar análise: ${updateError.message}`);
      setSaving(false);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      const { error: insertError } = await supabase
        .from("vsl_analysis")
        .insert({
          vsl_id: selectedVslId,
          analysis_data: analysisData,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Erro ao criar análise:", insertError);
        alert(`Erro ao criar análise: ${insertError.message}`);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setMessage("Análise salva com sucesso.");
  }

  function updateField(key: keyof AnalysisData, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c10] text-white">
        <div className="flex items-center gap-2 text-zinc-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </div>
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c10] px-4 text-white">
        <div className="w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.96)_0%,rgba(13,13,18,1)_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-white">
            Admin VSL Analysis
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Faça login para acessar o painel.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <input
              type="password"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loginLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-white transition-all hover:bg-red-500/20 disabled:opacity-60"
            >
              {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loginLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.05em] text-white">
              Admin VSL Analysis
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Preencha as 11 abas da análise e salve para aparecer no modal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition-all hover:bg-white/[0.08]"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Selecionar VSL
          </label>

          {loadingVsls ? (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando VSLs...
            </div>
          ) : (
            <select
              value={selectedVslId}
              onChange={(e) => setSelectedVslId(e.target.value ? Number(e.target.value) : "")}
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#111115] px-4 text-sm text-white outline-none"
            >
              <option value="">Selecione uma VSL</option>
              {vsls.map((item) => (
                <option key={item.id} value={item.id}>
                  #{item.id} - {item.title || "Sem título"} {item.product ? `| ${item.product}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.03] p-3">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const filled = form[tab.key]?.trim().length > 0;
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-red-500/35 bg-red-500/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[12px] font-semibold leading-5">
                        {tab.label}
                      </span>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          filled
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-zinc-700/40 text-zinc-400"
                        }`}
                      >
                        {filled ? "OK" : "Vazio"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
            {!selectedVslId ? (
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400">
                Selecione uma VSL para começar.
              </div>
            ) : loadingAnalysis ? (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando análise...
              </div>
            ) : (
              <>
                <div className="mb-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    VSL selecionada
                  </p>
                  <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-white">
                    {selectedVsl?.title || "Sem título"}
                  </h2>
                  {selectedVsl?.product ? (
                    <p className="mt-1 text-sm text-zinc-400">{selectedVsl.product}</p>
                  ) : null}
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {tabs.find((tab) => tab.key === activeTab)?.label}
                  </p>

                  <textarea
                    value={form[activeTab]}
                    onChange={(e) => updateField(activeTab, e.target.value)}
                    placeholder="Preencha aqui..."
                    className="min-h-[420px] w-full resize-y rounded-2xl border border-white/10 bg-[#111115] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500"
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-zinc-400">
                    {message ? message : "Edite a aba atual e clique em salvar."}
                  </p>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 text-sm font-semibold text-white transition-all hover:bg-red-500/20 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Salvando..." : "Salvar análise"}
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
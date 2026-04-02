import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Search,
  Sparkles,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronDown,
  Image as ImageIcon,
  Lock,
  Link as LinkIcon,
} from "lucide-react";

const ADMIN_PASSWORD = "12645555";

type SwipeStatus = "Escalando" | "Teste" | "Validada";
type SwipeStyle = "Black" | "White";
type SwipeFormat = "Advertorial" | "VSL" | "Quiz" | "Bridge Page";

type DbSwipeItem = {
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

type SwipeItem = {
  id: number;
  title: string;
  product: string;
  niche: string;
  format: SwipeFormat;
  style: SwipeStyle;
  status: SwipeStatus;
  imageUrl: string;
  vslUrl: string;
  transcriptionUrl: string;
  adsCount: number;
  tags: string;
  published: boolean;
  createdAt: string;
};

type SwipeFormData = {
  title: string;
  product: string;
  niche: string;
  format: SwipeFormat;
  style: SwipeStyle;
  status: SwipeStatus;
  imageUrl: string;
  vslUrl: string;
  transcriptionUrl: string;
  adsCount: string;
  tags: string;
  published: boolean;
  createdAt: string;
};

const defaultForm: SwipeFormData = {
  title: "",
  product: "",
  niche: "",
  format: "VSL",
  style: "Black",
  status: "Escalando",
  imageUrl: "",
  vslUrl: "",
  transcriptionUrl: "",
  adsCount: "",
  tags: "",
  published: true,
  createdAt: "",
};

function getStatusStyles(status: SwipeStatus) {
  if (status === "Escalando") {
    return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";
  }

  if (status === "Teste") {
    return "border-yellow-400/20 bg-yellow-400/[0.08] text-yellow-300";
  }

  return "border-primary/25 bg-primary/[0.10] text-white";
}

function formatDateToDisplay(dateString: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR");
}

function formatDateToInput(dateString: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function mapDbItemToSwipeItem(item: DbSwipeItem): SwipeItem {
  return {
    id: item.id,
    title: item.title ?? "",
    product: item.product ?? "",
    niche: item.niche ?? "",
    format: (item.format as SwipeFormat) ?? "VSL",
    style: (item.style as SwipeStyle) ?? "Black",
    status: (item.status as SwipeStatus) ?? "Escalando",
    imageUrl: item.image_url ?? "",
    vslUrl: item.vsl_url ?? "",
    transcriptionUrl: item.transcription_url ?? "",
    adsCount: item.ads_count ?? 0,
    tags: item.tags ?? "",
    published: item.published ?? false,
    createdAt: formatDateToDisplay(item.created_at),
  };
}

export default function SwipeMaxAdmin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [items, setItems] = useState<SwipeItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SwipeFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  async function loadItems() {
    const { data, error } = await supabase
      .from("swipe_max_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar swipes:", error);
      alert(`Erro ao carregar os swipes: ${error.message}`);
      return;
    }

    const mappedItems = ((data as DbSwipeItem[]) || []).map(mapDbItemToSwipeItem);
    setItems(mappedItems);
  }

  useEffect(() => {
    if (isAuth) {
      loadItems();
    }
  }, [isAuth]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.product.toLowerCase().includes(term) ||
          item.niche.toLowerCase().includes(term)
      );
    }

    if (filterPublished === "Publicados") {
      result = result.filter((item) => item.published);
    }

    if (filterPublished === "Rascunhos") {
      result = result.filter((item) => !item.published);
    }

    return result.sort((a, b) => b.id - a.id);
  }, [items, search, filterPublished]);

  function openCreateModal() {
    setEditingId(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  }

  function openEditModal(item: SwipeItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      product: item.product,
      niche: item.niche,
      format: item.format,
      style: item.style,
      status: item.status,
      imageUrl: item.imageUrl,
      vslUrl: item.vslUrl,
      transcriptionUrl: item.transcriptionUrl,
      adsCount: String(item.adsCount),
      tags: item.tags,
      published: item.published,
      createdAt: item.createdAt
        ? item.createdAt.split("/").reverse().join("-")
        : "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(defaultForm);
    setIsSaving(false);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert("Preencha o título");
      return;
    }

    if (!form.product.trim()) {
      alert("Preencha o produto");
      return;
    }

    if (!form.niche.trim()) {
      alert("Preencha o nicho");
      return;
    }

    const payload = {
      title: form.title.trim(),
      product: form.product.trim(),
      niche: form.niche.trim(),
      format: form.format,
      style: form.style,
      status: form.status,
      image_url:
        form.imageUrl.trim() ||
        "https://via.placeholder.com/1200x800?text=SwipeMAX",
      vsl_url: form.vslUrl.trim(),
      transcription_url: form.transcriptionUrl.trim(),
      ads_count: Number(form.adsCount) || 0,
      tags: form.tags.trim(),
      published: form.published,
      created_at: form.createdAt
        ? new Date(`${form.createdAt}T12:00:00`).toISOString()
        : null,
    };

    try {
      setIsSaving(true);

      if (editingId !== null) {
        const { error } = await supabase
          .from("swipe_max_items")
          .update(payload)
          .eq("id", editingId);

        if (error) {
          console.error("Erro ao atualizar swipe:", error);
          alert(`Erro ao atualizar swipe: ${error.message}`);
          return;
        }
      } else {
        const insertPayload = {
          ...payload,
          created_at: payload.created_at ?? new Date().toISOString(),
        };

        const { error } = await supabase
          .from("swipe_max_items")
          .insert([insertPayload]);

        if (error) {
          console.error("Erro ao cadastrar swipe:", error);
          alert(`Erro ao cadastrar swipe: ${error.message}`);
          return;
        }
      }

      await loadItems();
      closeModal();
    } catch (error) {
      console.error("Erro inesperado ao salvar swipe:", error);
      alert("Erro inesperado ao salvar swipe");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Deseja excluir este swipe?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("swipe_max_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir swipe:", error);
      alert(`Erro ao excluir: ${error.message}`);
      return;
    }

    await loadItems();
  }

  async function togglePublished(id: number, currentValue: boolean) {
    const { error } = await supabase
      .from("swipe_max_items")
      .update({ published: !currentValue })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar publicação:", error);
      alert(`Erro ao atualizar publicação: ${error.message}`);
      return;
    }

    await loadItems();
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      return;
    }

    alert("Senha errada");
  }

  return (
    <>
      <div
        className={`mx-auto w-full max-w-[1360px] px-5 py-7 lg:px-8 lg:py-8 transition-all duration-300 ${
          !isAuth ? "pointer-events-none select-none blur-[2px]" : ""
        }`}
      >
        <div className="flex flex-col gap-6">
          <section
            className="
              relative overflow-hidden rounded-[28px]
              border border-white/[0.07]
              bg-[linear-gradient(180deg,rgba(18,18,22,1)_0%,rgba(10,10,12,1)_100%)]
              px-6 py-6 lg:px-7 lg:py-7
              shadow-[0_18px_55px_rgba(0,0,0,0.28)]
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_20%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.07),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.04),transparent_22%)]" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[760px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-300">
                  <Sparkles size={11} />
                  Painel administrativo
                </div>

                <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-white lg:text-[48px]">
                  SwipeMAX Admin
                </h1>

                <p className="mt-3 max-w-[650px] text-[14px] leading-7 text-muted-foreground">
                  Cadastre, edite e publique as ofertas exibidas dentro da biblioteca do SwipeMAX.
                </p>
              </div>

              <button
                onClick={openCreateModal}
                className="
                  inline-flex h-[44px] items-center justify-center gap-2 rounded-2xl
                  border border-primary/30 bg-primary/[0.14] px-4
                  text-sm font-semibold text-white
                  shadow-[0_10px_24px_rgba(239,68,68,0.16)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-primary/[0.18]
                "
              >
                <Plus className="h-4 w-4" />
                Novo Swipe
              </button>
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
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título, produto ou nicho..."
                  className="
                    h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                    pl-11 pr-4 text-sm text-white outline-none
                    placeholder:text-muted-foreground
                    transition-all duration-300
                    focus:border-primary/30 focus:bg-white/[0.05]
                  "
                />
              </div>

              <div className="w-full lg:w-[220px]">
                <div className="relative">
                  <select
                    value={filterPublished}
                    onChange={(e) => setFilterPublished(e.target.value)}
                    className="
                      h-[44px] w-full appearance-none rounded-2xl border border-white/10
                      bg-white/[0.03] px-4 pr-10 text-sm text-white outline-none
                      transition-all duration-300
                      focus:border-primary/30 focus:bg-white/[0.05]
                    "
                  >
                    <option value="Todos" className="bg-[#0d0d10] text-white">
                      Todos
                    </option>
                    <option value="Publicados" className="bg-[#0d0d10] text-white">
                      Publicados
                    </option>
                    <option value="Rascunhos" className="bg-[#0d0d10] text-white">
                      Rascunhos
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {filteredItems.length === 0 && (
              <div
                className="
                  rounded-[26px] border border-white/[0.07]
                  bg-[linear-gradient(180deg,rgba(17,17,20,1)_0%,rgba(10,10,12,1)_100%)]
                  px-6 py-8 text-center shadow-[0_14px_34px_rgba(0,0,0,0.22)]
                "
              >
                <p className="text-lg font-medium text-white">
                  Nenhum swipe cadastrado
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clique em “Novo Swipe” para começar.
                </p>
              </div>
            )}

            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="
                  group relative overflow-hidden rounded-[26px]
                  border border-white/[0.07]
                  bg-[linear-gradient(180deg,rgba(17,17,20,1)_0%,rgba(10,10,12,1)_100%)]
                  px-5 py-5
                  shadow-[0_14px_34px_rgba(0,0,0,0.22)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-white/[0.12]
                  hover:shadow-[0_18px_42px_rgba(0,0,0,0.3)]
                  lg:px-6
                "
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.05),transparent_20%)] opacity-90" />

                <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                          {item.title}
                        </h3>

                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </div>

                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            item.published
                              ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                              : "border-white/10 bg-white/[0.03] text-muted-foreground"
                          }`}
                        >
                          {item.published ? "Publicado" : "Rascunho"}
                        </div>
                      </div>

                      <p className="mt-1.5 text-[13px] text-muted-foreground">
                        Produto: {item.product}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <MiniTag>{item.niche}</MiniTag>
                        <MiniTag>{item.format}</MiniTag>
                        <MiniTag>{item.style}</MiniTag>
                        <MiniTag>{item.adsCount} ads</MiniTag>
                        <MiniTag>{item.createdAt}</MiniTag>
                      </div>

                      {item.vslUrl && (
                        <div className="mt-2">
                          <a
                            href={item.vslUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-400 transition hover:text-blue-300"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Abrir VSL
                          </a>
                        </div>
                      )}

                      {item.tags.trim().length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => (
                              <MiniTag key={tag}>{tag}</MiniTag>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() => togglePublished(item.id, item.published)}
                    >
                      {item.published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {item.published ? "Despublicar" : "Publicar"}
                    </ActionButton>

                    <ActionButton onClick={() => openEditModal(item)}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </ActionButton>

                    <ActionButton danger onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="
                relative w-full max-w-3xl overflow-hidden rounded-[28px]
                border border-white/[0.08]
                bg-[linear-gradient(180deg,rgba(18,18,22,1)_0%,rgba(10,10,12,1)_100%)]
                shadow-[0_24px_70px_rgba(0,0,0,0.45)]
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.06),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.08),transparent_25%)]" />

              <div className="relative z-10 border-b border-white/10 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-white">
                      {editingId !== null ? "Editar Swipe" : "Novo Swipe"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Preencha os dados da oferta que vai aparecer no SwipeMAX.
                    </p>
                  </div>

                  <button
                    onClick={closeModal}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-muted-foreground transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative z-10 grid gap-4 px-6 py-6 md:grid-cols-2">
                <Field label="Título">
                  <Input
                    value={form.title}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, title: value }))
                    }
                    placeholder="Ex: Forbidden Remedy - Breath Clear"
                  />
                </Field>

                <Field label="Produto">
                  <Input
                    value={form.product}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, product: value }))
                    }
                    placeholder="Ex: Breath Clear"
                  />
                </Field>

                <Field label="Nicho">
                  <Input
                    value={form.niche}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, niche: value }))
                    }
                    placeholder="Ex: Pulmão"
                  />
                </Field>

                <Field label="Quantidade de ads">
                  <Input
                    value={form.adsCount}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, adsCount: value }))
                    }
                    placeholder="Ex: 32"
                  />
                </Field>

                <Field label="Data do Swipe">
                  <input
                    type="date"
                    value={form.createdAt}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        createdAt: e.target.value,
                      }))
                    }
                    className="
                      h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                      px-4 text-sm text-white outline-none
                      transition-all duration-300
                      focus:border-primary/30 focus:bg-white/[0.05]
                    "
                  />
                </Field>

                <Field label="Formato">
                  <SelectField
                    value={form.format}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, format: value as SwipeFormat }))
                    }
                    options={["Advertorial", "VSL", "Quiz", "Bridge Page"]}
                  />
                </Field>

                <Field label="Estilo">
                  <SelectField
                    value={form.style}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, style: value as SwipeStyle }))
                    }
                    options={["Black", "White"]}
                  />
                </Field>

                <Field label="Status">
                  <SelectField
                    value={form.status}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, status: value as SwipeStatus }))
                    }
                    options={["Escalando", "Teste", "Validada"]}
                  />
                </Field>

                <Field label="Publicado">
                  <SelectField
                    value={form.published ? "Sim" : "Não"}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, published: value === "Sim" }))
                    }
                    options={["Sim", "Não"]}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="URL da VSL">
                    <div className="relative">
                      <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={form.vslUrl}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, vslUrl: e.target.value }))
                        }
                        placeholder="https://..."
                        className="
                          h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                          pl-11 pr-4 text-sm text-white outline-none
                          placeholder:text-muted-foreground
                          transition-all duration-300
                          focus:border-primary/30 focus:bg-white/[0.05]
                        "
                      />
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="URL da Transcrição">
                    <div className="relative">
                      <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={form.transcriptionUrl}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            transcriptionUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="
                          h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                          pl-11 pr-4 text-sm text-white outline-none
                          placeholder:text-muted-foreground
                          transition-all duration-300
                          focus:border-primary/30 focus:bg-white/[0.05]
                        "
                      />
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Imagem / upload da thumbnail">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <label
                          className="
                            inline-flex h-[44px] cursor-pointer items-center justify-center gap-2 rounded-2xl
                            border border-white/10 bg-white/[0.03] px-4
                            text-sm text-white transition hover:bg-white/[0.05]
                          "
                        >
                          <ImageIcon className="h-4 w-4" />
                          Upload imagem

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const safeName = file.name.replace(/\s+/g, "-");
                              const fileName = `${Date.now()}-${safeName}`;

                              const { error: uploadError } = await supabase.storage
                                .from("swipe-thumbnails")
                                .upload(fileName, file, {
                                  upsert: false,
                                });

                              if (uploadError) {
                                console.error("Erro upload imagem:", uploadError);
                                alert(`Erro ao subir imagem: ${uploadError.message}`);
                                return;
                              }

                              const { data } = supabase.storage
                                .from("swipe-thumbnails")
                                .getPublicUrl(fileName);

                              setForm((prev) => ({
                                ...prev,
                                imageUrl: data.publicUrl,
                              }));
                            }}
                          />
                        </label>

                        {form.imageUrl && (
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                          />
                        )}
                      </div>

                      <input
                        value={form.imageUrl}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                        }
                        placeholder="Ou cole uma URL da imagem"
                        className="
                          h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                          px-4 text-sm text-white outline-none
                          placeholder:text-muted-foreground
                          transition-all duration-300
                          focus:border-primary/30 focus:bg-white/[0.05]
                        "
                      />
                    </div>
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Tags (separadas por vírgula)">
                    <Input
                      value={form.tags}
                      onChange={(value) =>
                        setForm((prev) => ({ ...prev, tags: value }))
                      }
                      placeholder="Ex: Escalando, Alta Conversão, Topo de Funil"
                    />
                  </Field>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
                <button
                  onClick={closeModal}
                  className="
                    inline-flex h-[42px] items-center justify-center rounded-2xl
                    border border-white/10 bg-white/[0.03] px-4
                    text-sm font-semibold text-white
                    transition-all duration-300
                    hover:bg-white/[0.05]
                  "
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="
                    inline-flex h-[42px] items-center justify-center gap-2 rounded-2xl
                    border border-primary/30 bg-primary/[0.14] px-4
                    text-sm font-semibold text-white
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-primary/[0.18]
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  <Plus className="h-4 w-4" />
                  {isSaving
                    ? "Salvando..."
                    : editingId !== null
                    ? "Salvar alterações"
                    : "Cadastrar swipe"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isAuth && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className="
              relative w-full max-w-md overflow-hidden rounded-[28px]
              border border-white/[0.08]
              bg-[linear-gradient(180deg,rgba(18,18,22,1)_0%,rgba(10,10,12,1)_100%)]
              shadow-[0_24px_70px_rgba(0,0,0,0.45)]
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.06),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.08),transparent_25%)]" />

            <div className="relative z-10 px-6 py-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-300">
                <Lock className="h-3.5 w-3.5" />
                Acesso protegido
              </div>

              <h2 className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-white">
                SwipeMAX Admin
              </h2>

              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Digite a senha para acessar o painel administrativo.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="
                    h-[46px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                    px-4 text-sm text-white outline-none
                    placeholder:text-muted-foreground
                    transition-all duration-300
                    focus:border-primary/30 focus:bg-white/[0.05]
                  "
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />

                <button
                  onClick={handleLogin}
                  className="
                    inline-flex h-[46px] w-full items-center justify-center rounded-2xl
                    border border-primary/30 bg-primary/[0.14]
                    text-sm font-semibold text-white
                    shadow-[0_10px_24px_rgba(239,68,68,0.16)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-primary/40
                    hover:bg-primary/[0.18]
                  "
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
        px-4 text-sm text-white outline-none
        placeholder:text-muted-foreground
        transition-all duration-300
        focus:border-primary/30 focus:bg-white/[0.05]
      "
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-[44px] w-full appearance-none rounded-2xl border border-white/10
          bg-white/[0.03] px-4 pr-10 text-sm text-white outline-none
          transition-all duration-300
          focus:border-primary/30 focus:bg-white/[0.05]
        "
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0d0d10] text-white">
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function MiniTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex h-[40px] items-center justify-center gap-2 rounded-2xl border px-4
        text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5
        ${
          danger
            ? "border-red-500/20 bg-red-500/[0.08] text-red-300 hover:bg-red-500/[0.12]"
            : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        }
      `}
    >
      {children}
    </button>
  );
}
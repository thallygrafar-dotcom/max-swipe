import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import RadarPageFormModal, {
  type RadarFormData,
  type RadarPageStyle,
} from "@/components/RadarPageFormModal";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Lock,
  Image as ImageIcon,
  Tag as TagIcon,
} from "lucide-react";

const ADMIN_PASSWORD = "12645555";

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
  createdAtRaw: string;
};

const defaultForm: RadarFormData = {
  title: "",
  niche: "",
  pageStyle: "black",
  tags: "",
  imageUrl: "",
  imageWhiteUrl: "",
  imageBlackUrl: "",
  published: true,
  createdAt: "",
};

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

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    createdAtRaw: item.created_at ?? "",
  };
}

function getPageStyleBadgeClasses(style: RadarPageStyle) {
  if (style === "black") {
    return "border-red-500/20 bg-red-500/[0.10] text-red-200";
  }

  if (style === "white") {
    return "border-zinc-300/20 bg-zinc-100 text-zinc-900";
  }

  return "border-amber-400/20 bg-amber-400/[0.10] text-amber-200";
}

function getPageStyleLabel(style: RadarPageStyle) {
  if (style === "black") return "Black";
  if (style === "white") return "White";
  return "Black + White";
}

export default function RadarPageAdmin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [items, setItems] = useState<RadarItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState("Todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RadarFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  async function loadItems() {
    const { data, error } = await supabase
      .from("radar_page_items")
      .select(
        "id, title, niche, page_style, tags, image_url, image_white_url, image_black_url, published, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar páginas do Radar:", error);
      alert(`Erro ao carregar páginas: ${error.message}`);
      return;
    }

    const mappedItems = ((data as DbRadarItem[]) || []).map(mapDbItemToRadarItem);
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
          item.niche.toLowerCase().includes(term) ||
          item.tags.toLowerCase().includes(term)
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

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      return;
    }

    alert("Senha errada");
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  }

  function openEditModal(item: RadarItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      niche: item.niche,
      pageStyle: item.pageStyle,
      tags: item.tags,
      imageUrl: item.imageUrl,
      imageWhiteUrl: item.imageWhiteUrl,
      imageBlackUrl: item.imageBlackUrl,
      published: item.published,
      createdAt: formatDateToInput(item.createdAtRaw),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(defaultForm);
    setIsSaving(false);
  }

  async function handleDelete(id: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("SUPABASE USER DELETE:", user);

    const confirmed = window.confirm("Deseja excluir esta página do Radar?");
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("radar_page_items").delete().eq("id", id);

      if (error) {
        console.error("Erro ao excluir página:", error);
        alert(`Erro ao excluir página: ${error.message}`);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro inesperado ao excluir página:", error);
      alert("Erro inesperado ao excluir página");
    }
  }

  async function togglePublished(id: number, currentValue: boolean) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("SUPABASE USER UPDATE:", user);

      const { error } = await supabase
        .from("radar_page_items")
        .update({ published: !currentValue })
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar publicação:", error);
        alert(`Erro ao atualizar publicação: ${error.message}`);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: !currentValue } : item
        )
      );
    } catch (error) {
      console.error("Erro inesperado ao atualizar publicação:", error);
      alert("Erro inesperado ao atualizar publicação");
    }
  }

  async function handleSave() {
    let imageUrl = form.imageUrl.trim();

    if (!imageUrl.startsWith("http")) {
      imageUrl = `https://ppbcrkvuxbfqapseocvp.supabase.co/storage/v1/object/public/radarpage-previews/${imageUrl}`;
    }

    const payload = {
      title: form.title.trim(),
      niche: form.niche.trim(),
      page_style: form.pageStyle,
      tags: form.tags.trim(),
      image_url: imageUrl,
      image_white_url: form.imageWhiteUrl.trim(),
      image_black_url: form.imageBlackUrl.trim(),
      published: form.published,
      created_at: form.createdAt
        ? new Date(`${form.createdAt}T12:00:00`).toISOString()
        : new Date().toISOString(),
    };

    try {
      setIsSaving(true);

      if (!payload.title) {
        alert("Preencha o título");
        return;
      }

      if (!payload.niche) {
        alert("Preencha o nicho");
        return;
      }

      if (!payload.image_url) {
        alert("Envie a imagem de preview");
        return;
      }

      if (!payload.image_white_url && !payload.image_black_url) {
        alert("Envie ao menos a imagem White ou a imagem Black");
        return;
      }

      if (editingId !== null) {
        const { error } = await supabase
          .from("radar_page_items")
          .update(payload)
          .eq("id", editingId);

        if (error) {
          console.error("Erro ao atualizar página:", error);
          alert(`Erro ao atualizar página: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase.from("radar_page_items").insert([payload]);

        if (error) {
          console.error("Erro ao cadastrar página:", error);
          alert(`Erro ao cadastrar página: ${error.message}`);
          return;
        }
      }

      await loadItems();
      closeModal();
    } catch (error) {
      console.error("Erro inesperado ao salvar página:", error);
      alert("Erro inesperado ao salvar página");
    } finally {
      setIsSaving(false);
    }
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
                  RadarPage Admin
                </h1>

                <p className="mt-3 max-w-[700px] text-[14px] leading-7 text-zinc-400">
                  Cadastre, edite e publique páginas do Radar com preview leve e
                  imagens separadas para White e Black.
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
                Nova Página
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
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título, nicho ou tag..."
                  className="
                    h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                    pl-11 pr-4 text-sm text-white outline-none
                    placeholder:text-zinc-500
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

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
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
                  Nenhuma página cadastrada
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Clique em “Nova Página” para começar.
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
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                          {item.title || "Sem título"}
                        </h3>

                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${getPageStyleBadgeClasses(
                            item.pageStyle
                          )}`}
                        >
                          {getPageStyleLabel(item.pageStyle)}
                        </div>

                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            item.published
                              ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                              : "border-white/10 bg-white/[0.03] text-zinc-400"
                          }`}
                        >
                          {item.published ? "Publicado" : "Rascunho"}
                        </div>
                      </div>

                      <p className="mt-1.5 text-[13px] text-zinc-400">
                        Nicho: {item.niche || "-"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <MiniTag>
                          <ImageIcon className="h-3.5 w-3.5" />
                          {item.imageUrl ? "Preview" : "Sem Preview"}
                        </MiniTag>

                        <MiniTag>
                          <ImageIcon className="h-3.5 w-3.5" />
                          {item.imageWhiteUrl ? "Página White" : "Sem White"}
                        </MiniTag>

                        <MiniTag>
                          <ImageIcon className="h-3.5 w-3.5" />
                          {item.imageBlackUrl ? "Página Black" : "Sem Black"}
                        </MiniTag>

                        <MiniTag>{item.createdAt || "Sem data"}</MiniTag>
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

        <RadarPageFormModal
          open={isModalOpen}
          onClose={closeModal}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          isSaving={isSaving}
          editingId={editingId}
        />
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
                RadarPage Admin
              </h2>

              <p className="mt-2 text-sm leading-7 text-zinc-400">
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
                    placeholder:text-zinc-500
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
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex h-[40px] items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-all duration-300 ${
        danger
          ? "border-red-500/20 bg-red-500/[0.08] text-red-200 hover:bg-red-500/[0.12]"
          : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
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
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  }

  return <img src={signedUrl} alt={alt} className="h-full w-full object-cover" />;
}
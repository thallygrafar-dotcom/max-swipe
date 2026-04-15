import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { supabase } from "@/lib/supabase";
import {
  X,
  Plus,
  ChevronDown,
  Image as ImageIcon,
  Upload,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export type RadarPageStyle = "black" | "white" | "black-white";

export type RadarFormData = {
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

type RadarPageFormModalProps = {
  open: boolean;
  onClose: () => void;
  form: RadarFormData;
  setForm: Dispatch<SetStateAction<RadarFormData>>;
  onSave: () => void;
  isSaving: boolean;
  editingId: number | null;
};

type UploadState = {
  preview: boolean;
  imageWhite: boolean;
  imageBlack: boolean;
};

function getPageStyleLabel(style: RadarPageStyle) {
  if (style === "black") return "Black";
  if (style === "white") return "White";
  return "Black + White";
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

function buildFilePath(folder: string, fileName: string) {
  const safeName = sanitizeFileName(fileName);
  return `${folder}/${Date.now()}-${safeName}`;
}

function getFileNameFromPath(path: string) {
  if (!path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1] || "";
}

async function uploadToBucket(bucket: string, path: string, file: File) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

export default function RadarPageFormModal({
  open,
  onClose,
  form,
  setForm,
  onSave,
  isSaving,
  editingId,
}: RadarPageFormModalProps) {
  const [uploading, setUploading] = useState<UploadState>({
    preview: false,
    imageWhite: false,
    imageBlack: false,
  });

  const hasPreview = useMemo(() => {
    return !!(form.imageUrl || form.imageWhiteUrl || form.imageBlackUrl);
  }, [form.imageUrl, form.imageWhiteUrl, form.imageBlackUrl]);

  if (!open) return null;

  async function handlePreviewUpload(file: File) {
    try {
      setUploading((prev) => ({ ...prev, preview: true }));

      const filePath = `${Date.now()}-${sanitizeFileName(file.name)}`;
await uploadToBucket("radarpage-previews", filePath, file);

      setForm((prev) => ({
        ...prev,
        imageUrl: filePath,
      }));
    } catch (error: any) {
      console.error("Erro ao subir preview:", error);
      alert(`Erro ao subir preview: ${error?.message || "Erro desconhecido"}`);
    } finally {
      setUploading((prev) => ({ ...prev, preview: false }));
    }
  }

  async function handleImageWhiteUpload(file: File) {
    try {
      setUploading((prev) => ({ ...prev, imageWhite: true }));

      const filePath = buildFilePath("white-images", file.name);
      await uploadToBucket("radarpage-images", filePath, file);

      setForm((prev) => ({
        ...prev,
        imageWhiteUrl: filePath,
      }));
    } catch (error: any) {
      console.error("Erro ao subir imagem White:", error);
      alert(
        `Erro ao subir imagem White: ${error?.message || "Erro desconhecido"}`
      );
    } finally {
      setUploading((prev) => ({ ...prev, imageWhite: false }));
    }
  }

  async function handleImageBlackUpload(file: File) {
    try {
      setUploading((prev) => ({ ...prev, imageBlack: true }));

      const filePath = buildFilePath("black-images", file.name);
      await uploadToBucket("radarpage-images", filePath, file);

      setForm((prev) => ({
        ...prev,
        imageBlackUrl: filePath,
      }));
    } catch (error: any) {
      console.error("Erro ao subir imagem Black:", error);
      alert(
        `Erro ao subir imagem Black: ${error?.message || "Erro desconhecido"}`
      );
    } finally {
      setUploading((prev) => ({ ...prev, imageBlack: false }));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
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
                {editingId !== null ? "Editar Página" : "Nova Página"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Suba um preview leve para o card e as imagens completas para White
                e Black.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
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
              placeholder="Ex: Native Blood Sugar Fix"
            />
          </Field>

          <Field label="Nicho">
            <Input
              value={form.niche}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, niche: value }))
              }
              placeholder="Ex: Diabetes"
            />
          </Field>

          <Field label="Data da página">
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

          <Field label="Estilo">
            <SelectField
              value={form.pageStyle}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  pageStyle: value as RadarPageStyle,
                }))
              }
              options={["black", "white", "black-white"]}
              labels={{
                black: "Black",
                white: "White",
                "black-white": "Black + White",
              }}
            />
          </Field>

          <Field label="Publicado">
            <SelectField
              value={form.published ? "Sim" : "Não"}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  published: value === "Sim",
                }))
              }
              options={["Sim", "Não"]}
            />
          </Field>

          <Field label="Tags">
            <Input
              value={form.tags}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, tags: value }))
              }
              placeholder="Ex: Cloaker, Quiz, UGC, Longform"
            />
          </Field>

          <div className="md:col-span-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Preview do card
              </p>

              <div className="mt-4">
                <Field label="Imagem Preview">
                  <div className="flex flex-col gap-3">
                    <label
                      className="
                        inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl
                        border border-white/10 bg-white/[0.03] px-4
                        text-sm font-semibold text-white transition-all duration-300
                        hover:bg-white/[0.05]
                      "
                    >
                      {uploading.preview ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : form.imageUrl ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploading.preview
                        ? "Enviando preview..."
                        : form.imageUrl
                        ? "Preview enviado"
                        : "Enviar preview"}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await handlePreviewUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>

                    <input
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      placeholder="Path interno do preview"
                      className="
                        h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                        px-4 text-sm text-white outline-none
                        placeholder:text-zinc-500
                        transition-all duration-300
                        focus:border-primary/30 focus:bg-white/[0.05]
                      "
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                White
              </p>

              <div className="mt-4">
                <Field label="Imagem White">
                  <div className="flex flex-col gap-3">
                    <label
                      className="
                        inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl
                        border border-white/10 bg-white/[0.03] px-4
                        text-sm font-semibold text-white transition-all duration-300
                        hover:bg-white/[0.05]
                      "
                    >
                      {uploading.imageWhite ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : form.imageWhiteUrl ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploading.imageWhite
                        ? "Enviando imagem White..."
                        : form.imageWhiteUrl
                        ? "Imagem White enviada"
                        : "Enviar imagem White"}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await handleImageWhiteUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>

                    <input
                      value={form.imageWhiteUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          imageWhiteUrl: e.target.value,
                        }))
                      }
                      placeholder="Path interno da imagem White"
                      className="
                        h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                        px-4 text-sm text-white outline-none
                        placeholder:text-zinc-500
                        transition-all duration-300
                        focus:border-primary/30 focus:bg-white/[0.05]
                      "
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Black
              </p>

              <div className="mt-4">
                <Field label="Imagem Black">
                  <div className="flex flex-col gap-3">
                    <label
                      className="
                        inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl
                        border border-white/10 bg-white/[0.03] px-4
                        text-sm font-semibold text-white transition-all duration-300
                        hover:bg-white/[0.05]
                      "
                    >
                      {uploading.imageBlack ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : form.imageBlackUrl ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploading.imageBlack
                        ? "Enviando imagem Black..."
                        : form.imageBlackUrl
                        ? "Imagem Black enviada"
                        : "Enviar imagem Black"}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await handleImageBlackUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>

                    <input
                      value={form.imageBlackUrl}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          imageBlackUrl: e.target.value,
                        }))
                      }
                      placeholder="Path interno da imagem Black"
                      className="
                        h-[44px] w-full rounded-2xl border border-white/10 bg-white/[0.03]
                        px-4 text-sm text-white outline-none
                        placeholder:text-zinc-500
                        transition-all duration-300
                        focus:border-primary/30 focus:bg-white/[0.05]
                      "
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {hasPreview && (
            <div className="md:col-span-2">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Prévia rápida
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Preview
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <MiniTag>
                        <ImageIcon className="h-3.5 w-3.5" />
                        {form.imageUrl
                          ? getFileNameFromPath(form.imageUrl)
                          : "Sem preview"}
                      </MiniTag>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      White
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <MiniTag>
                        <ImageIcon className="h-3.5 w-3.5" />
                        {form.imageWhiteUrl
                          ? getFileNameFromPath(form.imageWhiteUrl)
                          : "Sem imagem"}
                      </MiniTag>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Black
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <MiniTag>
                        <ImageIcon className="h-3.5 w-3.5" />
                        {form.imageBlackUrl
                          ? getFileNameFromPath(form.imageBlackUrl)
                          : "Sem imagem"}
                      </MiniTag>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <MiniTag>{getPageStyleLabel(form.pageStyle)}</MiniTag>
                  <MiniTag>{form.title || "Sem título"}</MiniTag>
                  <MiniTag>{form.niche || "Sem nicho"}</MiniTag>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
          <button
            onClick={onClose}
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
            onClick={onSave}
            disabled={
              isSaving ||
              uploading.preview ||
              uploading.imageWhite ||
              uploading.imageBlack
            }
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
              : "Cadastrar página"}
          </button>
        </div>
      </div>
    </div>
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
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
        placeholder:text-zinc-500
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
  labels,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
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
        inline-flex items-center gap-1.5 rounded-full
        border border-white/10 bg-white/[0.03]
        px-2.5 py-1 text-[11px] font-medium text-zinc-300
      "
    >
      {children}
    </div>
  );
}
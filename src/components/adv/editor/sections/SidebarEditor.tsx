import { ChangeEvent } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import {
  useAdvertorial,
  type AdvertorialImage,
} from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const labelClass = "mb-1 block text-xs text-muted-foreground";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-md border border-[#3a1a1a] bg-[#2b0f0f] px-3 py-2 text-xs text-white transition hover:bg-[#3a1414]";

const sidebarColorPresets = [
  "#15215f",
  "#0f172a",
  "#1e293b",
  "#1d4ed8",
  "#2563eb",
  "#0f766e",
  "#7c2d12",
  "#111827",
];

const ctaColorPresets = [
  "#ef2b2d",
  "#dc2626",
  "#991b1b",
  "#f97316",
  "#d97706",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
];

const getImageSrc = (image: AdvertorialImage) => {
  if (image.mode === "upload" && image.preview) return image.preview;
  if (image.mode === "url" && image.url) return image.url;
  return "";
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const SidebarEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  const sidebarSrc = getImageSrc(config.sidebarImage);

  const updateFeaturedArticle = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    const updated = [...config.featuredArticles];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig({ featuredArticles: updated });
  };

  const addFeaturedArticle = () => {
    updateConfig({
      featuredArticles: [...config.featuredArticles, { label: "", url: "#" }],
    });
  };

  const removeFeaturedArticle = (index: number) => {
    const updated = config.featuredArticles.filter((_, i) => i !== index);
    updateConfig({
      featuredArticles: updated.length ? updated : [{ label: "", url: "#" }],
    });
  };

  const updateRelatedArticle = (
    index: number,
    field: "title" | "meta" | "url",
    value: string
  ) => {
    const updated = [...config.relatedArticles];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig({ relatedArticles: updated });
  };

  const addRelatedArticle = () => {
    updateConfig({
      relatedArticles: [
        ...config.relatedArticles,
        { title: "", meta: "", url: "#" },
      ],
    });
  };

  const removeRelatedArticle = (index: number) => {
    const updated = config.relatedArticles.filter((_, i) => i !== index);
    updateConfig({
      relatedArticles: updated.length
        ? updated
        : [{ title: "", meta: "", url: "#" }],
    });
  };

  const handleSidebarImageUrlChange = (value: string) => {
    updateConfig({
      sidebarImage: {
        ...config.sidebarImage,
        mode: "url",
        url: value,
      },
    });
  };

  const handleSidebarImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileData = await fileToBase64(file);

    updateConfig({
      sidebarImage: {
        mode: "upload",
        url: "",
        preview: fileData,
        fileName: file.name,
        fileData,
      },
    });

    event.target.value = "";
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Featured Articles</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lista principal exibida no topo da sidebar
          </p>
        </div>

        <div>
          <label className={labelClass}>Título da seção</label>
          <input
            className={inputClass}
            value={config.featuredTitle}
            onChange={(e) => updateConfig({ featuredTitle: e.target.value })}
            placeholder="Featured Articles"
          />
        </div>

        {config.featuredArticles.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-3 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-white">
                Artigo {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeFeaturedArticle(index)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3a1a1a] bg-[#2b0f0f] text-white transition hover:bg-[#3a1414]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className={labelClass}>Texto</label>
              <input
                className={inputClass}
                value={item.label}
                onChange={(e) =>
                  updateFeaturedArticle(index, "label", e.target.value)
                }
                placeholder="Título do artigo"
              />
            </div>

            <div>
              <label className={labelClass}>Link</label>
              <input
                className={inputClass}
                value={item.url}
                onChange={(e) =>
                  updateFeaturedArticle(index, "url", e.target.value)
                }
                placeholder="https://..."
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeaturedArticle}
          className={`${actionButtonClass} w-full gap-2`}
        >
          <Plus className="h-4 w-4" />
          Adicionar featured article
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Related Articles</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lista secundária exibida abaixo da featured
          </p>
        </div>

        <div>
          <label className={labelClass}>Título da seção</label>
          <input
            className={inputClass}
            value={config.relatedTitle}
            onChange={(e) => updateConfig({ relatedTitle: e.target.value })}
            placeholder="Related Articles"
          />
        </div>

        {config.relatedArticles.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-3 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-white">
                Artigo {index + 1}
              </p>

              <button
                type="button"
                onClick={() => removeRelatedArticle(index)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#3a1a1a] bg-[#2b0f0f] text-white transition hover:bg-[#3a1414]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className={labelClass}>Título</label>
              <input
                className={inputClass}
                value={item.title}
                onChange={(e) =>
                  updateRelatedArticle(index, "title", e.target.value)
                }
                placeholder="Título do artigo"
              />
            </div>

            <div>
              <label className={labelClass}>Meta</label>
              <input
                className={inputClass}
                value={item.meta}
                onChange={(e) =>
                  updateRelatedArticle(index, "meta", e.target.value)
                }
                placeholder="Dr. Nome - January 24, 2026"
              />
            </div>

            <div>
              <label className={labelClass}>Link</label>
              <input
                className={inputClass}
                value={item.url}
                onChange={(e) =>
                  updateRelatedArticle(index, "url", e.target.value)
                }
                placeholder="https://..."
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRelatedArticle}
          className={`${actionButtonClass} w-full gap-2`}
        >
          <Plus className="h-4 w-4" />
          Adicionar related article
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Imagem CTA lateral</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Imagem exibida no topo do card lateral
          </p>
        </div>

        <div>
          <label className={labelClass}>URL da imagem</label>
          <input
            className={inputClass}
            value={config.sidebarImage.url}
            onChange={(e) => handleSidebarImageUrlChange(e.target.value)}
            placeholder="Cole a URL da imagem"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-4 py-2 text-sm text-white transition hover:bg-muted">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleSidebarImageUpload}
              className="hidden"
            />
          </label>

          <p className="text-sm text-muted-foreground">
            {config.sidebarImage.fileName || "Nenhuma imagem selecionada"}
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          {sidebarSrc ? (
            <img
              src={sidebarSrc}
              alt="Sidebar"
              className="block h-[180px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[180px] items-center justify-center text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagem CTA lateral
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">CTA lateral</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Título, texto, botão e cores do card lateral
          </p>
        </div>

        <div>
          <label className={labelClass}>Título</label>
          <input
            className={inputClass}
            value={config.sidebarCtaTitle}
            onChange={(e) => updateConfig({ sidebarCtaTitle: e.target.value })}
            placeholder="Título do CTA lateral"
          />
        </div>

        <div>
          <label className={labelClass}>Texto</label>
          <textarea
            className={inputClass}
            value={config.sidebarCtaText}
            onChange={(e) => updateConfig({ sidebarCtaText: e.target.value })}
            placeholder="Texto do CTA lateral"
            rows={4}
          />
        </div>

        <div>
          <label className={labelClass}>Texto do botão</label>
          <input
            className={inputClass}
            value={config.sidebarCtaButton}
            onChange={(e) =>
              updateConfig({ sidebarCtaButton: e.target.value })
            }
            placeholder="Texto do botão"
          />
        </div>

        <div>
          <label className={labelClass}>Link do botão</label>
          <input
            className={inputClass}
            value={config.sidebarCtaButtonUrl}
            onChange={(e) =>
              updateConfig({ sidebarCtaButtonUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Fundo do card
            </label>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.sidebarBgColor }}
              />
              <input
                className={inputClass}
                value={config.sidebarBgColor}
                onChange={(e) =>
                  updateConfig({ sidebarBgColor: e.target.value })
                }
                placeholder="#15215f"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor do texto
            </label>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.sidebarTextColor }}
              />
              <input
                className={inputClass}
                value={config.sidebarTextColor}
                onChange={(e) =>
                  updateConfig({ sidebarTextColor: e.target.value })
                }
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-muted-foreground">
            Cores rápidas do card
          </label>
          <div className="flex flex-wrap gap-2">
            {sidebarColorPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="h-8 w-8 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => updateConfig({ sidebarBgColor: color })}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor do botão
            </label>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.sidebarButtonColor }}
              />
              <input
                className={inputClass}
                value={config.sidebarButtonColor}
                onChange={(e) =>
                  updateConfig({ sidebarButtonColor: e.target.value })
                }
                placeholder="#ef2b2d"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Texto do botão
            </label>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.sidebarButtonTextColor }}
              />
              <input
                className={inputClass}
                value={config.sidebarButtonTextColor}
                onChange={(e) =>
                  updateConfig({ sidebarButtonTextColor: e.target.value })
                }
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-muted-foreground">
            Cores rápidas do botão
          </label>
          <div className="flex flex-wrap gap-2">
            {ctaColorPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="h-8 w-8 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => updateConfig({ sidebarButtonColor: color })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarEditor;
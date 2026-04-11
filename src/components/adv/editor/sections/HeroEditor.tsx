import { useEffect, useRef } from "react";
import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";
const labelClass = "mb-1 block text-xs text-muted-foreground";

const editorClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";
const formatButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-white transition hover:bg-muted";

const colorPresets = [
  "#ef2b2d",
  "#b91c1c",
  "#7f1d1d",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#111827",
  "#ffffff",
];

type RichEditorProps = {
  label: string;
  description?: string;
  value: string;
  minHeight: string;
  onChange: (html: string) => void;
};

const RichEditor = ({
  label,
  description,
  value,
  minHeight,
  onChange,
}: RichEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const applyFormat = (command: "bold" | "underline") => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand(command);
    onChange(editor.innerHTML);
  };

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
      <div>
        <label className="block text-sm font-semibold text-white">{label}</label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={formatButtonClass}
          onClick={() => applyFormat("bold")}
        >
          B
        </button>

        <button
          type="button"
          className={formatButtonClass}
          onClick={() => applyFormat("underline")}
        >
          U
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={`${editorClass} ${minHeight}`}
        onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
      />
    </div>
  );
};

const HeroEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  return (
    <div className="space-y-4 pb-6">
      <RichEditor
        label="Título principal (Headline)"
        description="Texto principal exibido no topo do advertorial."
        value={config.headline}
        minHeight="min-h-[80px]"
        onChange={(html) => updateConfig({ headline: html })}
      />

      <RichEditor
        label="Subtítulo"
        description="Texto complementar logo abaixo da headline."
        value={config.subheadline}
        minHeight="min-h-[120px]"
        onChange={(html) => updateConfig({ subheadline: html })}
      />

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Autor / Credibilidade
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Linha de autoridade exibida abaixo do subtítulo.
          </p>
        </div>

        <div>
          <label className={labelClass}>Texto do autor</label>
          <input
            className={inputClass}
            value={config.author}
            onChange={(e) => updateConfig({ author: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Imagem principal</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Imagem exibida na hero do advertorial.
          </p>
        </div>

        <div>
          <label className={labelClass}>URL da imagem</label>
          <input
            className={inputClass}
            placeholder="Cole a URL da imagem"
            value={config.heroImage.url}
            onChange={(e) =>
              updateConfig({
                heroImage: {
                  ...config.heroImage,
                  mode: "url",
                  url: e.target.value,
                },
              })
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-xs text-gray-300 transition hover:bg-white/5 hover:border-gray-400">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();

                reader.onloadend = () => {
                  updateConfig({
                    heroImage: {
                      mode: "upload",
                      url: "",
                      preview: reader.result as string,
                      fileName: file.name,
                      fileData: reader.result as string,
                    },
                  });
                };

                reader.readAsDataURL(file);
              }}
            />
          </label>

          <span className="text-xs text-muted-foreground">
            {config.heroImage.fileName || "Nenhuma imagem selecionada"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Botão principal</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Texto e estilo do CTA principal da hero.
          </p>
        </div>

        <div>
          <label className={labelClass}>Texto do botão (CTA)</label>
          <input
            className={inputClass}
            value={config.ctaText}
            onChange={(e) => updateConfig({ ctaText: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
        <div>
          <label className="block text-sm font-semibold text-white">
            Estilo do botão
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajuste as cores e escolha rapidamente um visual pronto.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor do botão
            </label>

            <div className="flex items-center gap-3">
              <label
                className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.ctaButtonColor }}
              >
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={config.ctaButtonColor}
                  onChange={(e) =>
                    updateConfig({ ctaButtonColor: e.target.value })
                  }
                />
              </label>

              <input
                className={inputClass}
                value={config.ctaButtonColor}
                onChange={(e) =>
                  updateConfig({ ctaButtonColor: e.target.value })
                }
                placeholder="#ef2b2d"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor do texto
            </label>

            <div className="flex items-center gap-3">
              <label
                className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.ctaButtonTextColor }}
              >
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={config.ctaButtonTextColor}
                  onChange={(e) =>
                    updateConfig({ ctaButtonTextColor: e.target.value })
                  }
                />
              </label>

              <input
                className={inputClass}
                value={config.ctaButtonTextColor}
                onChange={(e) =>
                  updateConfig({ ctaButtonTextColor: e.target.value })
                }
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-muted-foreground">
            Cores rápidas
          </label>

          <div className="flex flex-wrap gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="h-8 w-8 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => updateConfig({ ctaButtonColor: color })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
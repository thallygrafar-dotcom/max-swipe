import { useEffect, useRef } from "react";
import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const editorClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const formatButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-white transition hover:bg-muted";

const footerColorPresets = [
  "#18256b",
  "#0f172a",
  "#101828",
  "#1e293b",
  "#991b1b",
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#d97706",
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

const FooterEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Cores do rodapé</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Escolha a cor de fundo e do texto do rodapé.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor de fundo
            </label>

            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.footerBgColor }}
              />

              <input
                className={inputClass}
                value={config.footerBgColor}
                onChange={(e) =>
                  updateConfig({ footerBgColor: e.target.value })
                }
                placeholder="#18256b"
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
                style={{ backgroundColor: config.footerTextColor }}
              />

              <input
                className={inputClass}
                value={config.footerTextColor}
                onChange={(e) =>
                  updateConfig({ footerTextColor: e.target.value })
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
            {footerColorPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="h-8 w-8 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => updateConfig({ footerBgColor: color })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Marca do footer</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Parte principal da identidade exibida no rodapé
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Marca principal
          </label>
          <input
            className={inputClass}
            value={config.footerBrandMain}
            onChange={(e) =>
              updateConfig({ footerBrandMain: e.target.value })
            }
            placeholder="Ex: Vision Eye Health"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Subtítulo da marca
          </label>
          <input
            className={inputClass}
            value={config.footerBrandSub}
            onChange={(e) =>
              updateConfig({ footerBrandSub: e.target.value })
            }
            placeholder="Ex: Eye Health"
          />
        </div>
      </div>

      <RichEditor
        label="Texto principal do footer"
        description="Texto institucional exibido no centro do rodapé"
        value={config.footerText}
        minHeight="min-h-[100px]"
        onChange={(html) => updateConfig({ footerText: html })}
      />

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
        <div>
          <label className="block text-sm font-semibold text-white">
            Links automáticos do rodapé
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Terms of Use, Disclaimer e Privacy Policy serão gerados automaticamente no export.
          </p>
        </div>

        <div className="rounded-md border border-border bg-card px-3 py-3 text-sm text-muted-foreground">
          Terms of Use | Disclaimer | Privacy Policy
        </div>
      </div>

      <RichEditor
        label="Copyright"
        description="Texto final exibido na última linha do rodapé"
        value={config.footerCopyright}
        minHeight="min-h-[80px]"
        onChange={(html) => updateConfig({ footerCopyright: html })}
      />
    </div>
  );
};

export default FooterEditor;
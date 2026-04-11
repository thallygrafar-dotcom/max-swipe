import { useEffect, useRef } from "react";
import { useAdvertorial, LinkItem } from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";
const labelClass = "mb-1 block text-xs text-muted-foreground";

const editableClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white min-h-[40px] flex items-center";

const colorPresets = [
  "#111d5c",
  "#0f172a",
  "#111827",
  "#1f2937",
  "#7f1d1d",
  "#b91c1c",
  "#2563eb",
  "#16a34a",
  "#ca8a04",
  "#ffffff",
];

type RichInlineEditorProps = {
  label: string;
  value: string;
  onChange: (html: string) => void;
};

const RichInlineEditor = ({
  label,
  value,
  onChange,
}: RichInlineEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={editableClass}
        onInput={(e) => onChange((e.target as HTMLElement).innerHTML)}
      />
    </div>
  );
};

const HeaderEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  const updateMenuItem = (
    index: number,
    field: keyof LinkItem,
    value: string
  ) => {
    const updated = [...config.menuItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateConfig({ menuItems: updated });
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Informações básicas</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dados gerais usados no cabeçalho do advertorial.
          </p>
        </div>

        <div>
          <label className={labelClass}>Nome do site</label>
          <input
            className={inputClass}
            value={config.siteName}
            onChange={(e) => updateConfig({ siteName: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Domínio</label>
          <input
            className={inputClass}
            value={config.domain}
            onChange={(e) => updateConfig({ domain: e.target.value })}
            placeholder="https://seudominio.com"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Marca</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nome principal e subtexto exibidos no header.
          </p>
        </div>

        <RichInlineEditor
          label="Nome da marca"
          value={config.brandName}
          onChange={(html) => updateConfig({ brandName: html })}
        />

        <RichInlineEditor
          label="Subtexto da marca"
          value={config.brandSubtext}
          onChange={(html) => updateConfig({ brandSubtext: html })}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
        <div>
          <label className="block text-sm font-semibold text-white">
            Cores do header
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Escolha a cor do fundo e do texto do topo da página.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <label className="mb-2 block text-xs text-muted-foreground">
              Cor de fundo
            </label>

            <div className="flex items-center gap-3">
              <label
                className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border shadow-sm"
                style={{ backgroundColor: config.headerBgColor }}
              >
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={config.headerBgColor}
                  onChange={(e) =>
                    updateConfig({ headerBgColor: e.target.value })
                  }
                />
              </label>

              <input
                className={inputClass}
                value={config.headerBgColor}
                onChange={(e) =>
                  updateConfig({ headerBgColor: e.target.value })
                }
                placeholder="#111d5c"
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
                style={{ backgroundColor: config.headerTextColor }}
              >
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={config.headerTextColor}
                  onChange={(e) =>
                    updateConfig({ headerTextColor: e.target.value })
                  }
                />
              </label>

              <input
                className={inputClass}
                value={config.headerTextColor}
                onChange={(e) =>
                  updateConfig({ headerTextColor: e.target.value })
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
                onClick={() => updateConfig({ headerBgColor: color })}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Menu</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Deixe o texto vazio para ocultar o item do menu.
          </p>
        </div>

        {config.menuItems.map((item, index) => (
          <div key={index} className="rounded-md border border-border p-3">
            <RichInlineEditor
              label={`Texto do menu ${index + 1}`}
              value={item.label}
              onChange={(html) => updateMenuItem(index, "label", html)}
            />

            <label className={`${labelClass} mt-3`}>
              URL do menu {index + 1}
            </label>

            <input
              className={inputClass}
              value={item.url}
              onChange={(e) => updateMenuItem(index, "url", e.target.value)}
              placeholder="#"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderEditor;
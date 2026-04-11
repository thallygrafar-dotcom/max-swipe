import { ChangeEvent, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import {
  useAdvertorial,
  type AdvertorialImage,
} from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const labelClass = "mb-1 block text-xs text-muted-foreground";

const editorClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const formatButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-white transition hover:bg-muted";

const colorPresets = [
  "#f5e9bc",
  "#fde68a",
  "#fecaca",
  "#dbeafe",
  "#dcfce7",
  "#f3e8ff",
  "#ffe4e6",
  "#e5e7eb",
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

const BodyContinuationEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  const secondarySrc = getImageSrc(config.secondaryImage);
  const storyImageSrc = getImageSrc(config.storyImage);

  const handleSecondaryImageUrlChange = (value: string) => {
    updateConfig({
      secondaryImage: {
        ...config.secondaryImage,
        mode: "url",
        url: value,
      },
    });
  };

  const handleSecondaryImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileData = await fileToBase64(file);

    updateConfig({
      secondaryImage: {
        mode: "upload",
        url: "",
        preview: fileData,
        fileName: file.name,
        fileData,
      },
    });

    event.target.value = "";
  };

  const handleStoryImageUrlChange = (value: string) => {
    updateConfig({
      storyImage: {
        ...config.storyImage,
        mode: "url",
        url: value,
      },
    });
  };

  const handleStoryImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileData = await fileToBase64(file);

    updateConfig({
      storyImage: {
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
      <RichEditor
        label="Título do depoimento"
        value={config.storyTitle}
        minHeight="min-h-[80px]"
        onChange={(html) => updateConfig({ storyTitle: html })}
      />

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Card do depoimento</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Conteúdo exibido no bloco da história
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-white">
              Imagem do depoimento
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              Foto exibida no círculo do card da Margaret
            </p>
          </div>

          <div>
            <label className={labelClass}>Cole a URL da imagem</label>
            <input
              className={inputClass}
              value={config.storyImage.url}
              onChange={(e) => handleStoryImageUrlChange(e.target.value)}
              placeholder="Cole a URL da imagem"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-4 py-2 text-sm text-white transition hover:bg-muted">
              Escolher imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleStoryImageUpload}
                className="hidden"
              />
            </label>

            <p className="text-sm text-muted-foreground">
              {config.storyImage.fileName || "Nenhuma imagem selecionada"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-sm font-bold text-white">
              {storyImageSrc ? (
                <img
                  src={storyImageSrc}
                  alt={config.storyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                config.storyName.charAt(0)
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Prévia da foto do depoimento
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Nome</label>
          <input
            className={inputClass}
            value={config.storyName}
            onChange={(e) => updateConfig({ storyName: e.target.value })}
            placeholder="Digite o nome"
          />
        </div>

        <div>
          <label className={labelClass}>Cargo / descrição</label>
          <input
            className={inputClass}
            value={config.storyRole}
            onChange={(e) => updateConfig({ storyRole: e.target.value })}
            placeholder="Digite a descrição"
          />
        </div>

        <RichEditor
          label="Frase em destaque"
          value={config.storyQuote}
          minHeight="min-h-[100px]"
          onChange={(html) => updateConfig({ storyQuote: html })}
        />

        <RichEditor
          label="Texto 1"
          value={config.storyText1}
          minHeight="min-h-[120px]"
          onChange={(html) => updateConfig({ storyText1: html })}
        />

        <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
          <RichEditor
            label="Texto destacado"
            description="Texto do box de destaque do depoimento"
            value={config.storyHighlight}
            minHeight="min-h-[140px]"
            onChange={(html) => updateConfig({ storyHighlight: html })}
          />

          <div>
            <label className={labelClass}>Cor do box destacado</label>
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="h-8 w-8 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => updateConfig({ storyHighlightColor: color })}
                />
              ))}
            </div>
          </div>
        </div>

        <RichEditor
          label="Texto 2"
          value={config.storyText2}
          minHeight="min-h-[120px]"
          onChange={(html) => updateConfig({ storyText2: html })}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
        <div>
          <label className="block text-sm font-semibold text-white">
            Botão CTA
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Botão exibido logo abaixo do depoimento
          </p>
        </div>

        <div>
          <label className={labelClass}>Texto do botão</label>
          <input
            className={inputClass}
            value={config.ctaText}
            onChange={(e) => updateConfig({ ctaText: e.target.value })}
            placeholder="Ex: Watch Video Now"
          />
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
            {ctaColorPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="h-7 w-7 rounded-full border border-white/10 shadow-sm transition hover:scale-105"
                style={{ backgroundColor: color }}
                onClick={() => updateConfig({ ctaButtonColor: color })}
              />
            ))}
          </div>
        </div>
      </div>

      <RichEditor
        label="Pequeno texto abaixo do CTA"
        value={config.storyNote}
        minHeight="min-h-[90px]"
        onChange={(html) => updateConfig({ storyNote: html })}
      />

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
        <div>
          <label className="block text-sm font-semibold text-white">
            Imagem secundária
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Imagem exibida abaixo do texto após o CTA
          </p>
        </div>

        <div>
          <label className={labelClass}>Cole a URL da imagem</label>
          <input
            className={inputClass}
            value={config.secondaryImage.url}
            onChange={(e) => handleSecondaryImageUrlChange(e.target.value)}
            placeholder="Cole a URL da imagem"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-4 py-2 text-sm text-white transition hover:bg-muted">
            Escolher imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleSecondaryImageUpload}
              className="hidden"
            />
          </label>

          <p className="text-sm text-muted-foreground">
            {config.secondaryImage.fileName || "Nenhuma imagem selecionada"}
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          {secondarySrc ? (
            <img
              src={secondarySrc}
              alt="Imagem secundária"
              className="block h-[220px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[220px] items-center justify-center text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagem secundária do advertorial
              </div>
            </div>
          )}
        </div>
      </div>

      <RichEditor
        label="Título da próxima seção"
        value={config.secondSectionTitle}
        minHeight="min-h-[80px]"
        onChange={(html) => updateConfig({ secondSectionTitle: html })}
      />

      <RichEditor
        label="Texto da próxima seção"
        value={config.secondSectionText}
        minHeight="min-h-[120px]"
        onChange={(html) => updateConfig({ secondSectionText: html })}
      />

      <RichEditor
        label="Texto final em destaque"
        description="Texto forte exibido abaixo do texto da próxima seção"
        value={config.secondSectionBold}
        minHeight="min-h-[90px]"
        onChange={(html) => updateConfig({ secondSectionBold: html })}
      />
    </div>
  );
};

export default BodyContinuationEditor;
import { ChangeEvent, useEffect, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import {
  useAdvertorial,
  emptyImage,
  uid,
  type AdvertorialImage,
} from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const labelClass = "mb-1 block text-xs text-muted-foreground";

const editorClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const formatButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-white transition hover:bg-muted";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-md border border-[#3a1a1a] bg-[#2b0f0f] px-3 py-2 text-xs text-white transition hover:bg-[#3a1414]";

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

const CommentsEditor = () => {
  const { config, updateConfig } = useAdvertorial();

  const updateComment = (
    id: string,
    field: "name" | "text" | "likes" | "comments",
    value: string
  ) => {
    updateConfig({
      comments: config.comments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const updateCommentImage = (id: string, image: AdvertorialImage) => {
    updateConfig({
      comments: config.comments.map((item) =>
        item.id === id ? { ...item, image } : item
      ),
    });
  };

  const handleCommentImageUrlChange = (id: string, value: string) => {
    const current = config.comments.find((item) => item.id === id);
    if (!current) return;

    updateCommentImage(id, {
      ...current.image,
      mode: "url",
      url: value,
    });
  };

  const handleCommentImageUpload =
    (id: string) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileData = await fileToBase64(file);

      updateCommentImage(id, {
        mode: "upload",
        url: "",
        preview: fileData,
        fileName: file.name,
        fileData,
      });

      event.target.value = "";
    };

  const addComment = () => {
    updateConfig({
      comments: [
        ...config.comments,
        {
          id: uid(),
          name: "New Comment",
          text: "Write the testimonial here.",
          likes: "0",
          comments: "0 comments",
          image: emptyImage(),
        },
      ],
    });
  };

  const removeComment = (id: string) => {
    const updated = config.comments.filter((item) => item.id !== id);

    updateConfig({
      comments: updated.length
        ? updated
        : [
            {
              id: uid(),
              name: "New Comment",
              text: "Write the testimonial here.",
              likes: "0",
              comments: "0 comments",
              image: emptyImage(),
            },
          ],
    });
  };

  return (
    <div className="space-y-4 pb-6">
      <RichEditor
        label="Título da seção de comentários"
        value={config.commentsTitle}
        minHeight="min-h-[80px]"
        onChange={(html) => updateConfig({ commentsTitle: html })}
      />

      {config.comments.map((comment, index) => {
        const commentImageSrc = getImageSrc(comment.image);

        return (
          <div
            key={comment.id}
            className="rounded-xl border border-border bg-card/40 p-4 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  Comentário {index + 1}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bloco individual do depoimento
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeComment(comment.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#3a1a1a] bg-[#2b0f0f] text-white transition hover:bg-[#3a1414]"
                title="Remover comentário"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-white">
                  Imagem do comentário
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Avatar exibido no círculo do comentário
                </p>
              </div>

              <div>
                <label className={labelClass}>Cole a URL da imagem</label>
                <input
                  className={inputClass}
                  value={comment.image.url}
                  onChange={(e) =>
                    handleCommentImageUrlChange(comment.id, e.target.value)
                  }
                  placeholder="Cole a URL da imagem"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-md border border-border bg-card px-4 py-2 text-sm text-white transition hover:bg-muted">
                  Escolher imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCommentImageUpload(comment.id)}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-muted-foreground">
                  {comment.image.fileName || "Nenhuma imagem selecionada"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-sm font-bold text-white">
                  {commentImageSrc ? (
                    <img
                      src={commentImageSrc}
                      alt={comment.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    comment.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Prévia do avatar do comentário
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Nome</label>
              <input
                className={inputClass}
                value={comment.name}
                onChange={(e) =>
                  updateComment(comment.id, "name", e.target.value)
                }
                placeholder="Digite o nome"
              />
            </div>

            <RichEditor
              label="Texto do comentário"
              value={comment.text}
              minHeight="min-h-[110px]"
              onChange={(html) => updateComment(comment.id, "text", html)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Likes</label>
                <input
                  className={inputClass}
                  value={comment.likes}
                  onChange={(e) =>
                    updateComment(comment.id, "likes", e.target.value)
                  }
                  placeholder="Ex: 234"
                />
              </div>

              <div>
                <label className={labelClass}>Comentários</label>
                <input
                  className={inputClass}
                  value={comment.comments}
                  onChange={(e) =>
                    updateComment(comment.id, "comments", e.target.value)
                  }
                  placeholder="Ex: 45 comments"
                />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addComment}
        className={`${actionButtonClass} w-full gap-2`}
      >
        <Plus className="h-4 w-4" />
        Adicionar comentário
      </button>
    </div>
  );
};

export default CommentsEditor;
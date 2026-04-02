import type { CanvasBlock } from "../../../types/builder";

interface HeadingBlockProps {
  block: CanvasBlock;
}

export default function HeadingBlock({ block }: HeadingBlockProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("application/max-existing-block", block.id);
        e.dataTransfer.effectAllowed = "move";

        // 👇 remove o preview do texto arrastando
        const ghost = document.createElement("div");
        ghost.style.width = "1px";
        ghost.style.height = "1px";
        ghost.style.opacity = "0";
        ghost.style.position = "absolute";
        ghost.style.top = "-9999px";
        document.body.appendChild(ghost);

        e.dataTransfer.setDragImage(ghost, 0, 0);

        requestAnimationFrame(() => {
          document.body.removeChild(ghost);
        });
      }}
      className="inline-block cursor-move"
    >
      <h1 className="text-4xl font-bold text-black">
        Título exemplo
      </h1>
    </div>
  );
}
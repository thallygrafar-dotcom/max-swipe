import type { CanvasBlock } from "../../../types/builder";

interface TextBlockProps {
  block: CanvasBlock;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function TextBlock({
  block,
  isSelected,
  isHovered,
  onSelectBlock,
  onHoverBlock,
}: TextBlockProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("application/max-existing-block", block.id);
        e.dataTransfer.effectAllowed = "move";

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
      onMouseEnter={(e) => {
        e.stopPropagation();
        onHoverBlock?.(block.id);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        onHoverBlock?.(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelectBlock?.(block.id);
      }}
      className="w-full cursor-move"
    >
      <div
        className={`w-full rounded border px-4 py-3 transition-all ${
          isSelected || isHovered
            ? "border-dashed border-[#4da3ff] bg-[#4da3ff]/5"
            : "border-transparent bg-white"
        }`}
      >
        <p className="text-sm leading-6 text-[#444]">
          Este é um texto de exemplo.
        </p>
      </div>
    </div>
  );
}
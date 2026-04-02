import type { CanvasBlock } from "../../../types/builder";

interface ImageBlockProps {
  block: CanvasBlock;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function ImageBlock({
  block,
  isSelected,
  isHovered,
  onSelectBlock,
  onHoverBlock,
}: ImageBlockProps) {
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
      className="inline-block cursor-move"
    >
      <div
        className={`flex h-[180px] w-[260px] items-center justify-center rounded border transition-all ${
          isSelected || isHovered
            ? "border-dashed border-[#4da3ff] bg-[#4da3ff]/5"
            : "border-dashed border-[#cfcfcf] bg-[#f8f8f8]"
        }`}
      >
        <span className="text-sm text-[#666]">Imagem</span>
      </div>
    </div>
  );
}
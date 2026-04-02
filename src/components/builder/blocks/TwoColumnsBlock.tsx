import type { ReactNode } from "react";
import type { CanvasBlock } from "../../../types/builder";

interface TwoColumnsBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function TwoColumnsBlock({
  block,
  isSelected,
  isHovered,
  children,
  onSelectBlock,
  onHoverBlock,
}: TwoColumnsBlockProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        if (e.target !== e.currentTarget) {
          e.preventDefault();
          return;
        }

        e.stopPropagation();
        e.dataTransfer.setData("application/max-existing-block", block.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
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
      className="relative mx-4 my-4 border border-dashed border-[#d0d0d0]"
    >
      {isHovered && (
        <div className="absolute left-0 top-0 z-20 bg-[#4da3ff] px-2 py-1 text-[11px] font-medium text-white">
          2 Col
        </div>
      )}

      <div className="flex w-full items-start gap-4 p-2">
        {children}
      </div>
    </div>
  );
}
import type { ReactNode } from "react";
import type { CanvasBlock } from "../../../types/builder";

interface ContainerBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function ContainerBlock({
  block,
  isSelected,
  isHovered,
  children,
  onSelectBlock,
  onHoverBlock,
}: ContainerBlockProps) {
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
      className={`relative w-full min-h-[260px] bg-white border ${
        isSelected ? "border-[#4da3ff]" : "border-zinc-300"
      }`}
    >
      {isHovered && (
        <div className="absolute left-0 bottom-0 z-20 bg-blue-500 px-2 py-1 text-[11px] font-medium text-white">
          {block.label}
        </div>
      )}

      <div className="w-full min-h-[260px] p-4">
        {children}
      </div>

      {isSelected && (
        <>
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-2 border-[#4da3ff] bg-white" />
          <div className="absolute left-1/2 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 border-2 border-[#4da3ff] bg-white" />
          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-2 border-[#4da3ff] bg-white" />
          <div className="absolute right-0 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 border-2 border-[#4da3ff] bg-white" />
        </>
      )}
    </div>
  );
}
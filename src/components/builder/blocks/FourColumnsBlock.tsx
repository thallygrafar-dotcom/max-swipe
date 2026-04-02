import type { ReactNode } from "react";
import type { CanvasBlock } from "../../../types/builder";

interface FourColumnsBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function FourColumnsBlock({
  block,
  isSelected,
  isHovered,
  children,
  onSelectBlock,
  onHoverBlock,
}: FourColumnsBlockProps) {
  return (
    <div
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
          4 Col
        </div>
      )}

      <div className="flex w-full items-start gap-4 p-2">
        {children}
      </div>
    </div>
  );
}
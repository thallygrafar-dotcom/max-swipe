import type { ReactNode } from "react";
import type { CanvasBlock, BlockType } from "../../../types/builder";

interface OneColumnBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onDropBlock?: (type: BlockType, parentId: string) => void;
  onMoveBlock?: (blockId: string, parentId: string, insertIndex: number) => void;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function OneColumnBlock({
  block,
  isSelected,
  isHovered,
  children,
  onDropBlock,
  onMoveBlock,
  onSelectBlock,
  onHoverBlock,
}: OneColumnBlockProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();

  const newBlockType = e.dataTransfer.getData(
    "application/max-new-block"
  ) as BlockType;

  const existingBlockId = e.dataTransfer.getData(
    "application/max-existing-block"
  );

  // 👉 se for bloco já existente → MOVE
  if (existingBlockId) {
    onMoveBlock?.(existingBlockId, block.id, 0);
    return;
  }

  // 👉 se for bloco novo → CRIA
  if (newBlockType) {
    onDropBlock?.(newBlockType, block.id);
  }
};

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
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
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
      className={`relative mx-4 my-4 min-h-[228px] bg-white ${
        isSelected || isHovered
          ? "border border-dashed border-[#4da3ff]"
          : "border border-dashed border-[#d7d7d7]"
      }`}
    >
      {isHovered && (
        <div className="absolute left-0 top-0 z-20 bg-[#4da3ff] px-2 py-1 text-[11px] font-medium text-white">
          Col
        </div>
      )}

      <div className="w-full min-h-[228px]">
        {children}
      </div>
    </div>
  );
}
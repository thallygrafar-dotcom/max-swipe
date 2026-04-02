import { useState, type ReactNode } from "react";
import type { CanvasBlock, BlockType } from "../../../types/builder";

interface ColumnSlotBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onDropBlock?: (type: BlockType, parentId: string) => void;
  onMoveBlock?: (blockId: string, parentId: string, insertIndex: number) => void;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
}

export default function ColumnSlotBlock({
  block,
  isSelected,
  isHovered,
  children,
  onDropBlock,
  onMoveBlock,
  onSelectBlock,
  onHoverBlock,
}: ColumnSlotBlockProps) {
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newBlockType = e.dataTransfer.getData(
      "application/max-new-block"
    ) as BlockType;

    const existingBlockId = e.dataTransfer.getData(
      "application/max-existing-block"
    );

    if (existingBlockId) {
      onMoveBlock?.(existingBlockId, block.id, dropIndex ?? 0);
      setDropIndex(null);
      return;
    }

    if (newBlockType) {
      onDropBlock?.(newBlockType, block.id);
      setDropIndex(null);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const container = e.currentTarget;
        const childrenElements = Array.from(
  container.querySelectorAll(":scope > div > [data-builder-child='true']")
) as HTMLElement[];

        if (childrenElements.length === 0) {
          setDropIndex(0);
          return;
        }

        const mouseY = e.clientY;
        let nextIndex = childrenElements.length;

        for (let i = 0; i < childrenElements.length; i++) {
          const rect = childrenElements[i].getBoundingClientRect();
          const middleY = rect.top + rect.height / 2;

          if (mouseY < middleY) {
            nextIndex = i;
            break;
          }
        }

        setDropIndex(nextIndex);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDropIndex(null);
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
      className={`relative min-h-[200px] flex-1 border border-dashed transition-all ${
        isHovered
          ? "border-[#4da3ff] bg-[#4da3ff]/5"
          : "border-[#d0d0d0]"
      }`}
    >
      {isHovered && (
        <div className="absolute left-0 top-0 z-20 bg-[#4da3ff] px-2 py-1 text-[11px] font-medium text-white">
          {block.label}
        </div>
      )}

      <div className="relative w-full h-full">
        {dropIndex !== null && (
          <div
            className="pointer-events-none absolute left-2 right-2 z-20 h-[2px] bg-green-500"
            style={{
              top: dropIndex === 0 ? "4px" : "auto",
              bottom: dropIndex !== 0 ? "4px" : "auto",
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
}
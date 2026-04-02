import { useState, type ReactNode } from "react";
import type { CanvasBlock, BlockType } from "../../../types/builder";

interface SectionBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  onDropBlock?: (type: BlockType, parentId: string) => void;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
  onMoveBlock?: (blockId: string, parentId: string, insertIndex: number) => void;
}

export default function SectionBlock({
  block,
  isSelected,
  isHovered,
  children,
  onDropBlock,
  onMoveBlock,
  onSelectBlock,
  onHoverBlock,
}: SectionBlockProps) {
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndex(null);

    const newBlockType = e.dataTransfer.getData(
      "application/max-new-block"
    ) as BlockType;

    const existingBlockId = e.dataTransfer.getData(
      "application/max-existing-block"
    );

    if (existingBlockId) {
      onMoveBlock?.(existingBlockId, block.id, dropIndex ?? 0);
      return;
    }

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
        setDropIndex(null);
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
      className="relative w-full"
    >
      {isHovered && (
        <div className="absolute left-0 bottom-0 z-20 bg-violet-500 px-2 py-1 text-[11px] font-medium text-white">
          {block.label}
        </div>
      )}

      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectBlock?.(block.id);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          onHoverBlock?.(block.id);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropIndex(0);
        }}
        onDragOver={(e) => {
  e.preventDefault();
  e.stopPropagation();

  const container = e.currentTarget;
  const childrenElements = Array.from(
    container.children
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
        className={`relative w-full min-h-[260px] bg-transparent ${
          isSelected
            ? "border border-dashed border-[#4da3ff]"
            : "border border-dashed border-[#d0d0d0]"
        }`}
      >
        {dropIndex !== null && (
  <div
    className="pointer-events-none absolute left-4 right-4 z-20 h-[2px] bg-green-500"
    style={{
      top: dropIndex === 0 ? "4px" : "auto",
      bottom: dropIndex !== 0 ? "4px" : "auto",
    }}
  />
)}

        {children ? children : null}
      </div>
    </div>
  );
}
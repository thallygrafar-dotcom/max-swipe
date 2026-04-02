import ContainerBlock from "./blocks/ContainerBlock";
import SectionBlock from "./blocks/SectionBlock";
import OneColumnBlock from "./blocks/OneColumnBlock";
import TwoColumnsBlock from "./blocks/TwoColumnsBlock";
import ColumnSlotBlock from "./blocks/ColumnSlotBlock";
import ThreeColumnsBlock from "./blocks/ThreeColumnsBlock";
import FourColumnsBlock from "./blocks/FourColumnsBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import ImageBlock from "./blocks/ImageBlock";
import VideoBlock from "./blocks/VideoBlock";
import TextBlock from "./blocks/TextBlock";
import type { CanvasBlock, BlockType } from "../../types/builder";

interface BlockRendererProps {
  onMoveBlock?: (blockId: string, parentId: string, insertIndex: number) => void;
  block: CanvasBlock;
  selectedBlockId?: string | null;
  hoveredBlockId?: string | null;
  onDropBlock?: (type: BlockType, parentId: string) => void;
  onSelectBlock?: (id: string) => void;
  onHoverBlock?: (id: string | null) => void;
  draggingBlockId?: string | null;
}

export default function BlockRenderer({
  block,
  selectedBlockId,
  hoveredBlockId,
  onDropBlock,
  onMoveBlock,
  onSelectBlock,
  onHoverBlock,
  draggingBlockId,
}: BlockRendererProps) {
  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id;
  const isDragging = draggingBlockId === block.id;

  // CONTAINER
  if (block.type === "container") {
    return (
      <ContainerBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onDropBlock={onDropBlock}
            onMoveBlock={onMoveBlock}
            onSelectBlock={onSelectBlock}
            onHoverBlock={onHoverBlock}
          />
        ))}
      </ContainerBlock>
    );
  }

  // SECTION
  if (block.type === "section") {
    return (
      <SectionBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onDropBlock={onDropBlock}
        onMoveBlock={onMoveBlock}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {(block.children || []).map((child) => (
  <div key={child.id} data-builder-child="true">
    <BlockRenderer
      block={child}
      selectedBlockId={selectedBlockId}
      hoveredBlockId={hoveredBlockId}
      onDropBlock={onDropBlock}
      onMoveBlock={onMoveBlock}
      onSelectBlock={onSelectBlock}
      onHoverBlock={onHoverBlock}
    />
  </div>
))}
      </SectionBlock>
    );
  }

  // 1 COLUMN
  if (block.type === "1-column") {
    return (
      <OneColumnBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onDropBlock={onDropBlock}
        onMoveBlock={onMoveBlock}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
  <div key={child.id} data-builder-child="true">
    <BlockRenderer
      block={child}
      selectedBlockId={selectedBlockId}
      hoveredBlockId={hoveredBlockId}
      onDropBlock={onDropBlock}
      onMoveBlock={onMoveBlock}
      onSelectBlock={onSelectBlock}
      onHoverBlock={onHoverBlock}
    />
  </div>
))}
      </OneColumnBlock>
    );
  }

  // 2 COLUMNS
  if (block.type === "2-columns") {
    return (
      <TwoColumnsBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onDropBlock={onDropBlock}
            onMoveBlock={onMoveBlock}
            onSelectBlock={onSelectBlock}
            onHoverBlock={onHoverBlock}
          />
        ))}
      </TwoColumnsBlock>
    );
  }

  // 3 COLUMNS
  if (block.type === "3-columns") {
    return (
      <ThreeColumnsBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onDropBlock={onDropBlock}
            onMoveBlock={onMoveBlock}
            onSelectBlock={onSelectBlock}
            onHoverBlock={onHoverBlock}
          />
        ))}
      </ThreeColumnsBlock>
    );
  }

  // 4 COLUMNS
  if (block.type === "4-columns") {
    return (
      <FourColumnsBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onDropBlock={onDropBlock}
            onMoveBlock={onMoveBlock}
            onSelectBlock={onSelectBlock}
            onHoverBlock={onHoverBlock}
          />
        ))}
      </FourColumnsBlock>
    );
  }

  // COLUMN SLOT (CRÍTICO)
  if (block.type === "column-slot") {
    return (
      <ColumnSlotBlock
        block={block}
        isSelected={isSelected}
        isHovered={isHovered}
        onDropBlock={onDropBlock}
        onMoveBlock={onMoveBlock}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      >
        {block.children?.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            selectedBlockId={selectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onDropBlock={onDropBlock}
            onMoveBlock={onMoveBlock}
            onSelectBlock={onSelectBlock}
            onHoverBlock={onHoverBlock}
          />
        ))}
      </ColumnSlotBlock>
    );
  }

  // HEADING
  if (block.type === "heading") {
    return <HeadingBlock block={block} />;
  }

 if (block.type === "image") {
  return (
    <div data-builder-child="true">
      <ImageBlock
        block={block}
        isSelected={selectedBlockId === block.id}
        isHovered={hoveredBlockId === block.id}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      />
    </div>
  );
}

if (block.type === "video") {
  return (
    <div data-builder-child="true">
      <VideoBlock
        block={block}
        isSelected={selectedBlockId === block.id}
        isHovered={hoveredBlockId === block.id}
        onSelectBlock={onSelectBlock}
        onHoverBlock={onHoverBlock}
      />
    </div>
  );
}

if (block.type === "text") {
  return (
    <TextBlock
      block={block}
      isSelected={isSelected}
    />
  );
}

  return null;
}
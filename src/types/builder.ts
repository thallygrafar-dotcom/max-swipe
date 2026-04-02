export type TabKey =
  | "Blocos"
  | "Propriedades"
  | "Camadas"
  | "Mídia"
  | "Seções"
  | "Componentes";

export type BlockType =
  | "container"
  | "section"
  | "1-column"
  | "2-columns"
  | "3-columns"
  | "4-columns"
  | "column-slot"
  | "heading"
  | "image"
  | "video"
  | "text";



export type CanvasBlock = {
  id: string;
  type: BlockType;
  label: string;

  // 🔥 estrutura
  children?: CanvasBlock[];

  // 🔥 layout (ESSENCIAL pro builder)
  width?: string | number;
  height?: number;

  // 🔥 posição futura (drag)
  x?: number;
  y?: number;

  // 🔥 estilos básicos (já deixa pronto)
  styles?: {
    padding?: string;
    margin?: string;
    background?: string;
    borderRadius?: string;
    border?: string;
  };
};

export type BlockLibraryItem = {
  label: string;
  icon: any;
  type?: BlockType;
  enabled?: boolean;
};
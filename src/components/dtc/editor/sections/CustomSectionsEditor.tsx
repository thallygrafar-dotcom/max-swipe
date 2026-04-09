import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Trash2, GripVertical, Image, Type, MapPin, ChevronDown } from "lucide-react";
import { CustomSectionItem, SectionPosition } from "@/types/dtc-builder";

const positionLabels: Record<SectionPosition, string> = {
  'after-header': 'Após o Cabeçalho (topo)',
  'after-plans': 'Após os Planos',
  'after-guarantee': 'Após a Garantia',
  'after-testimonials': 'Após os Depoimentos',
  'after-faq': 'Após o FAQ',
  'after-bonuses': 'Após os Bônus',
  'before-footer': 'Antes do Rodapé (fundo)',
};

export function CustomSectionsEditor() {
  const { state, dispatch } = useBuilder();
  const { customSections } = state;

  const updateCustomSections = (items: CustomSectionItem[]) => {
    dispatch({ type: 'UPDATE_CUSTOM_SECTIONS', payload: { items } });
  };

  const addSection = (position: SectionPosition = 'after-bonuses') => {
    const newSection: CustomSectionItem = {
      id: `section-${Date.now()}`,
      title: "Novo Título da Seção",
      text: "Adicione seu conteúdo aqui. Você pode descrever seu produto, adicionar informações importantes ou destacar recursos.",
      imageUrl: "",
      imagePosition: 'left',
      backgroundColor: "#ffffff",
      textColor: "#374151",
      titleColor: "#1f2937",
      enabled: true,
      position: position,
      titleFontSize: 20,
      textFontSize: 16,
      imageWidth: 40,
      sectionPadding: 32,
    };
    updateCustomSections([...customSections.items, newSection]);
  };

  const updateSection = (id: string, updates: Partial<CustomSectionItem>) => {
    updateCustomSections(
      customSections.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeSection = (id: string) => {
    updateCustomSections(customSections.items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Seções Personalizadas</h3>
          <p className="text-xs text-muted-foreground">Adicione seções flexíveis com imagem e texto</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Adicionar Seção
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {(Object.keys(positionLabels) as SectionPosition[]).map((pos) => (
              <DropdownMenuItem key={pos} onClick={() => addSection(pos)} className="cursor-pointer">
                <MapPin className="w-4 h-4 mr-2" />
                {positionLabels[pos]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {customSections.items.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Nenhuma seção personalizada</p>
                <p className="text-sm text-muted-foreground">Clique em "Adicionar Seção" para criar sua primeira seção personalizada com imagem e texto</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.items.map((section, index) => (
            <div 
              key={section.id} 
              className="border rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <span className="font-medium text-sm">Seção {index + 1}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {positionLabels[section.position || 'after-bonuses']}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`enabled-${section.id}`} className="text-xs">Ativo</Label>
                    <Switch
                      id={`enabled-${section.id}`}
                      checked={section.enabled}
                      onCheckedChange={(checked) => updateSection(section.id, { enabled: checked })}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-4 space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Título da seção..."
                  />
                </div>

                <div>
                  <Label>Conteúdo de Texto</Label>
                  <Textarea
                    value={section.text}
                    onChange={(e) => updateSection(section.id, { text: e.target.value })}
                    placeholder="Conteúdo da seção..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>URL da Imagem</Label>
                  <Input
                    value={section.imageUrl}
                    onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.png"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Posição da Imagem</Label>
                    <Select
                      value={section.imagePosition}
                      onValueChange={(value) => updateSection(section.id, { imagePosition: value as CustomSectionItem['imagePosition'] })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                        <SelectItem value="top">Topo</SelectItem>
                        <SelectItem value="bottom">Fundo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Posição na Página
                    </Label>
                    <Select
                      value={section.position || 'after-bonuses'}
                      onValueChange={(value) => updateSection(section.id, { position: value as SectionPosition })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(positionLabels) as SectionPosition[]).map((pos) => (
                          <SelectItem key={pos} value={pos}>{positionLabels[pos]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Fundo</Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="color"
                        value={section.backgroundColor}
                        onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                        className="w-10 h-9 p-1 cursor-pointer"
                      />
                      <Input
                        value={section.backgroundColor}
                        onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cor do Título</Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="color"
                        value={section.titleColor}
                        onChange={(e) => updateSection(section.id, { titleColor: e.target.value })}
                        className="w-10 h-9 p-1 cursor-pointer"
                      />
                      <Input
                        value={section.titleColor}
                        onChange={(e) => updateSection(section.id, { titleColor: e.target.value })}
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="color"
                        value={section.textColor}
                        onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                        className="w-10 h-9 p-1 cursor-pointer"
                      />
                      <Input
                        value={section.textColor}
                        onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Controles de Tamanho e Espaçamento */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tamanho da Fonte do Título ({section.titleFontSize || 20}px)</Label>
                    <input
                      type="range"
                      min="14"
                      max="36"
                      value={section.titleFontSize || 20}
                      onChange={(e) => updateSection(section.id, { titleFontSize: parseInt(e.target.value) })}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tamanho da Fonte do Texto ({section.textFontSize || 16}px)</Label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={section.textFontSize || 16}
                      onChange={(e) => updateSection(section.id, { textFontSize: parseInt(e.target.value) })}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Largura da Imagem ({section.imageWidth || 40}%)</Label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={section.imageWidth || 40}
                      onChange={(e) => updateSection(section.id, { imageWidth: parseInt(e.target.value) })}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <Label>Padding da Seção ({section.sectionPadding || 32}px)</Label>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      step="4"
                      value={section.sectionPadding || 32}
                      onChange={(e) => updateSection(section.id, { sectionPadding: parseInt(e.target.value) })}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                {/* Preview Skeleton */}
                <div className="border rounded-lg p-3 bg-muted/30">
                  <Label className="text-xs text-muted-foreground mb-2 block">Pré-visualização do Layout</Label>
                  <div 
                    className={`flex gap-3 ${
                      section.imagePosition === 'top' || section.imagePosition === 'bottom' 
                        ? 'flex-col' 
                        : section.imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                    style={{ 
                      flexDirection: section.imagePosition === 'top' ? 'column' : 
                                     section.imagePosition === 'bottom' ? 'column-reverse' :
                                     section.imagePosition === 'right' ? 'row-reverse' : 'row'
                    }}
                  >
                    <div className="flex-shrink-0 w-16 h-12 bg-muted rounded flex items-center justify-center">
                      <Image className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-muted rounded w-3/4 flex items-center">
                        <Type className="w-2 h-2 text-muted-foreground ml-1" />
                      </div>
                      <div className="h-2 bg-muted/60 rounded w-full" />
                      <div className="h-2 bg-muted/60 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
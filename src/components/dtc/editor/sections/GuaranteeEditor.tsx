import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Image } from "lucide-react";

export function GuaranteeEditor() {
  const { state, dispatch } = useBuilder();
  const { guarantee, sectionVisibility } = state;

  const updateGuarantee = (updates: Partial<typeof guarantee>) => {
    dispatch({ type: 'UPDATE_GUARANTEE', payload: updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Garantia</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={sectionVisibility.guaranteeEnabled}
            onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { guaranteeEnabled: checked } })}
          />
          <Label className="text-sm">Ativar seção</Label>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="guaranteeTitle">Título</Label>
          <Input
            id="guaranteeTitle"
            value={guarantee.title}
            onChange={(e) => updateGuarantee({ title: e.target.value })}
            placeholder="Garantia 100% de Reembolso"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Cor do Título</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={guarantee.titleColor}
                onChange={(e) => updateGuarantee({ titleColor: e.target.value })}
                className="w-12 h-9 p-1"
              />
              <Input
                value={guarantee.titleColor}
                onChange={(e) => updateGuarantee({ titleColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Tamanho do Título: {guarantee.titleFontSize}px</Label>
            <Slider
              value={[guarantee.titleFontSize]}
              onValueChange={(value) => updateGuarantee({ titleFontSize: value[0] })}
              min={14}
              max={36}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guaranteeText">Descrição</Label>
          <Textarea
            id="guaranteeText"
            value={guarantee.text}
            onChange={(e) => updateGuarantee({ text: e.target.value })}
            placeholder="Sua satisfação é garantida..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Cor do Texto</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={guarantee.textColor}
                onChange={(e) => updateGuarantee({ textColor: e.target.value })}
                className="w-12 h-9 p-1"
              />
              <Input
                value={guarantee.textColor}
                onChange={(e) => updateGuarantee({ textColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Tamanho do Texto: {guarantee.textFontSize}px</Label>
            <Slider
              value={[guarantee.textFontSize]}
              onValueChange={(value) => updateGuarantee({ textFontSize: value[0] })}
              min={12}
              max={24}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg space-y-3">
          <Label className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            URL do Selo de Garantia (lateral)
          </Label>
          <Input
            id="guaranteeIcon"
            value={guarantee.iconUrl}
            onChange={(e) => updateGuarantee({ iconUrl: e.target.value })}
            placeholder="https://exemplo.com/selo.png"
          />
          {guarantee.iconUrl && (
            <>
              <div>
                <Label>Escala do Ícone: {guarantee.iconScale}%</Label>
                <Slider
                  value={[guarantee.iconScale]}
                  onValueChange={(value) => updateGuarantee({ iconScale: value[0] })}
                  min={50}
                  max={200}
                  step={10}
                  className="mt-2"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded overflow-hidden">
                <img 
                  src={guarantee.iconUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${guarantee.iconScale / 100})` }}
                />
              </div>
            </>
          )}
        </div>

        <div className="p-3 bg-muted rounded-lg space-y-3">
          <Label className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Imagem Abaixo da Descrição
          </Label>
          <Input
            value={guarantee.bottomImageUrl}
            onChange={(e) => updateGuarantee({ bottomImageUrl: e.target.value })}
            placeholder="https://exemplo.com/garantia.png"
          />
          {guarantee.bottomImageUrl && (
            <>
              <div>
                <Label>Escala da Imagem: {guarantee.bottomImageScale}%</Label>
                <Slider
                  value={[guarantee.bottomImageScale]}
                  onValueChange={(value) => updateGuarantee({ bottomImageScale: value[0] })}
                  min={50}
                  max={200}
                  step={10}
                  className="mt-2"
                />
              </div>
              <div className="h-24 bg-white rounded overflow-hidden">
                <img 
                  src={guarantee.bottomImageUrl} 
                  alt="Preview" 
                  className="h-full object-contain"
                  style={{ transform: `scale(${guarantee.bottomImageScale / 100})` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

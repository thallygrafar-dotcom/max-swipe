import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function BrandingEditor() {
  const { state, dispatch } = useBuilder();
  const { branding } = state;

  const updateBranding = (updates: Partial<typeof branding>) => {
    dispatch({ type: 'UPDATE_BRANDING', payload: updates });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Marca</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="productName">Nome do Produto</Label>
          <Input
            id="productName"
            value={branding.productName}
            onChange={(e) => updateBranding({ productName: e.target.value })}
            placeholder="MindBoost Pro"
          />
        </div>

        <div>
          <Label htmlFor="headline">Título Principal</Label>
          <Textarea
            id="headline"
            value={branding.headline}
            onChange={(e) => updateBranding({ headline: e.target.value })}
            placeholder="Garanta Seu Produto Com Desconto Agora"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="subheadline">Subtítulo</Label>
          <Input
            id="subheadline"
            value={branding.subheadline}
            onChange={(e) => updateBranding({ subheadline: e.target.value })}
            placeholder="Enquanto Durar o Estoque"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="primaryColor">Cor Principal</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primaryColor"
                value={branding.primaryColor}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={branding.primaryColor}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondaryColor">Cor Secundária</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="secondaryColor"
                value={branding.secondaryColor}
                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={branding.secondaryColor}
                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="buttonColor">Cor do Botão</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="buttonColor"
                value={branding.buttonColor}
                onChange={(e) => updateBranding({ buttonColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={branding.buttonColor}
                onChange={(e) => updateBranding({ buttonColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="buttonTextColor">Cor do Texto do Botão</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="buttonTextColor"
                value={branding.buttonTextColor}
                onChange={(e) => updateBranding({ buttonTextColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={branding.buttonTextColor}
                onChange={(e) => updateBranding({ buttonTextColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="backgroundColor"
                value={branding.backgroundColor}
                onChange={(e) => updateBranding({ backgroundColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={branding.backgroundColor}
                onChange={(e) => updateBranding({ backgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="fontFamily">Família de Fonte</Label>
          <Select
            value={branding.fontFamily}
            onValueChange={(value) => updateBranding({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Poppins">Poppins</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 border-t">
          <h4 className="font-medium text-sm mb-3">Estilo do Container</h4>
          <p className="text-xs text-muted-foreground mb-3">Configure o wrapper externo com fundo branco e padding</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showContainerBorder"
                checked={branding.showContainerBorder}
                onChange={(e) => updateBranding({ showContainerBorder: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="showContainerBorder">Ativar container branco com padding</Label>
            </div>

            {branding.showContainerBorder && (
              <>
                <div>
                  <Label>Padding do Container: {branding.containerPadding}px</Label>
                  <Slider
                    value={[branding.containerPadding]}
                    onValueChange={(value) => updateBranding({ containerPadding: value[0] })}
                    min={0}
                    max={40}
                    step={2}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Borda Arredondada do Container: {branding.containerBorderRadius}px</Label>
                  <Slider
                    value={[branding.containerBorderRadius]}
                    onValueChange={(value) => updateBranding({ containerBorderRadius: value[0] })}
                    min={0}
                    max={32}
                    step={2}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <h4 className="font-medium text-sm mb-3">Efeitos Visuais</h4>
          
          <div className="space-y-4">
            <div>
              <Label>Borda Arredondada (cards): {branding.borderRadius}px</Label>
              <Slider
                value={[branding.borderRadius]}
                onValueChange={(value) => updateBranding({ borderRadius: value[0] })}
                min={0}
                max={24}
                step={2}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Intensidade da Sombra</Label>
              <Select
                value={branding.shadowIntensity}
                onValueChange={(value) => updateBranding({ shadowIntensity: value as typeof branding.shadowIntensity })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="light">Leve</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="strong">Forte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Animação do Botão</Label>
              <Select
                value={branding.buttonAnimation}
                onValueChange={(value) => updateBranding({ buttonAnimation: value as typeof branding.buttonAnimation })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  <SelectItem value="pulse">Pulsar</SelectItem>
                  <SelectItem value="bounce">Quicar</SelectItem>
                  <SelectItem value="glow">Brilho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Espaçamento dos Cards</Label>
              <Select
                value={branding.cardSpacing}
                onValueChange={(value) => updateBranding({ cardSpacing: value as typeof branding.cardSpacing })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacto</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="spacious">Espaçoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Espaçamento entre Seções: {branding.sectionSpacing}px</Label>
              <Slider
                value={[branding.sectionSpacing]}
                onValueChange={(value) => updateBranding({ sectionSpacing: value[0] })}
                min={8}
                max={64}
                step={4}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Espaçamento entre as seções</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

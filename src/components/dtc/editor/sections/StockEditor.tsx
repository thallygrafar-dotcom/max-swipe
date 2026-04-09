import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function StockEditor() {
  const { state, dispatch } = useBuilder();
  const { stock, sectionVisibility } = state;

  const updateStock = (updates: Partial<typeof stock>) => {
    dispatch({ type: 'UPDATE_STOCK', payload: updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Estoque / Urgência</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={sectionVisibility.stockEnabled}
            onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { stockEnabled: checked } })}
          />
          <Label className="text-sm">Ativar seção</Label>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={stock.quantity}
              onChange={(e) => updateStock({ quantity: parseInt(e.target.value) || 0 })}
              placeholder="165"
            />
          </div>
          <div>
            <Label htmlFor="stockText">Texto do Estoque</Label>
            <Input
              id="stockText"
              value={stock.text}
              onChange={(e) => updateStock({ text: e.target.value })}
              placeholder="Unidades em Estoque"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="urgencyText">Texto de Urgência</Label>
          <Input
            id="urgencyText"
            value={stock.urgencyText}
            onChange={(e) => updateStock({ urgencyText: e.target.value })}
            placeholder="Enquanto durar o estoque"
          />
        </div>

        {/* Contagem Regressiva */}
        <div className="p-3 bg-muted rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={stock.countdown}
              onCheckedChange={(checked) => updateStock({ countdown: checked })}
            />
            <Label>Ativar contagem regressiva (estoque diminui)</Label>
          </div>
          
          {stock.countdown && (
            <div>
              <Label>Intervalo da contagem: {stock.countdownInterval}s</Label>
              <Slider
                value={[stock.countdownInterval]}
                onValueChange={(value) => updateStock({ countdownInterval: value[0] })}
                min={1}
                max={30}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Estoque diminui 1 a cada {stock.countdownInterval} segundo(s)
              </p>
            </div>
          )}
        </div>

        {/* Estilização */}
        <div className="p-3 bg-muted rounded-lg space-y-3">
          <Label className="font-semibold">Estilização</Label>
          
          <div>
            <Label>Tamanho da Fonte: {stock.fontSize}px</Label>
            <Slider
              value={[stock.fontSize]}
              onValueChange={(value) => updateStock({ fontSize: value[0] })}
              min={14}
              max={48}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cor do Número</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={stock.numberColor}
                  onChange={(e) => updateStock({ numberColor: e.target.value })}
                  className="w-12 h-9 p-1"
                />
                <Input
                  value={stock.numberColor}
                  onChange={(e) => updateStock({ numberColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Cor do Texto</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={stock.textColor}
                  onChange={(e) => updateStock({ textColor: e.target.value })}
                  className="w-12 h-9 p-1"
                />
                <Input
                  value={stock.textColor}
                  onChange={(e) => updateStock({ textColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label>Animação</Label>
          <Select
            value={stock.animation}
            onValueChange={(value) => updateStock({ animation: value as typeof stock.animation })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="pulse">Pulsar</SelectItem>
              <SelectItem value="blink">Piscar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

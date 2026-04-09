import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Image, Settings2 } from "lucide-react";
import { Plan, PlanBullet } from "@/types/dtc-builder";

export function PlansEditor() {
  const { state, dispatch } = useBuilder();
  const { plans, plansStyle, sectionVisibility } = state;

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    dispatch({ type: 'UPDATE_PLAN', payload: { id, updates } });
  };

  const updatePlansStyle = (updates: Partial<typeof plansStyle>) => {
    dispatch({ type: 'UPDATE_PLANS_STYLE', payload: updates });
  };

  const addBullet = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const newBullet: PlanBullet = {
        id: `bullet-${Date.now()}`,
        text: "Novo benefício",
        color: "#374151",
        isBold: false,
      };
      updatePlan(planId, { bullets: [...plan.bullets, newBullet] });
    }
  };

  const updateBullet = (planId: string, bulletId: string, updates: Partial<PlanBullet>) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      updatePlan(planId, {
        bullets: plan.bullets.map(b => b.id === bulletId ? { ...b, ...updates } : b)
      });
    }
  };

  const removeBullet = (planId: string, bulletId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      updatePlan(planId, {
        bullets: plan.bullets.filter(b => b.id !== bulletId)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Planos de Preço</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={sectionVisibility.plansEnabled}
            onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { plansEnabled: checked } })}
          />
          <Label className="text-sm">Ativar seção</Label>
        </div>
      </div>

      {/* Configurações Globais de Estilo */}
      <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <Label className="font-semibold">Estilo Global dos Planos</Label>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Estas configurações se aplicam a todos os planos</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tamanho da Fonte do Título: {plansStyle.titleFontSize}px</Label>
            <Slider
              value={[plansStyle.titleFontSize]}
              onValueChange={(value) => updatePlansStyle({ titleFontSize: value[0] })}
              min={16}
              max={48}
              step={2}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Tamanho da Fonte do Preço: {plansStyle.priceFontSize}px</Label>
            <Slider
              value={[plansStyle.priceFontSize]}
              onValueChange={(value) => updatePlansStyle({ priceFontSize: value[0] })}
              min={24}
              max={64}
              step={2}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label>Escala da Imagem: {plansStyle.imageScale}%</Label>
          <Slider
            value={[plansStyle.imageScale]}
            onValueChange={(value) => updatePlansStyle({ imageScale: value[0] })}
            min={50}
            max={200}
            step={5}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Espaçamento Superior da Imagem: {plansStyle.imageSpacingTop}px</Label>
            <Slider
              value={[plansStyle.imageSpacingTop]}
              onValueChange={(value) => updatePlansStyle({ imageSpacingTop: value[0] })}
              min={-20}
              max={40}
              step={2}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Espaçamento Inferior da Imagem: {plansStyle.imageSpacingBottom}px</Label>
            <Slider
              value={[plansStyle.imageSpacingBottom]}
              onValueChange={(value) => updatePlansStyle({ imageSpacingBottom: value[0] })}
              min={-20}
              max={40}
              step={2}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label>Espaçamento Superior "Day Supply": {plansStyle.daySupplySpacingTop}px</Label>
          <Slider
            value={[plansStyle.daySupplySpacingTop]}
            onValueChange={(value) => updatePlansStyle({ daySupplySpacingTop: value[0] })}
            min={-10}
            max={24}
            step={2}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cor do Botão</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={plansStyle.buttonColor}
                onChange={(e) => updatePlansStyle({ buttonColor: e.target.value })}
                className="w-12 h-9 p-1 cursor-pointer"
              />
              <Input
                value={plansStyle.buttonColor}
                onChange={(e) => updatePlansStyle({ buttonColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Cor do Texto do Botão</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={plansStyle.buttonTextColor}
                onChange={(e) => updatePlansStyle({ buttonTextColor: e.target.value })}
                className="w-12 h-9 p-1 cursor-pointer"
              />
              <Input
                value={plansStyle.buttonTextColor}
                onChange={(e) => updatePlansStyle({ buttonTextColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {plans.map((plan, index) => (
          <AccordionItem key={plan.id} value={plan.id}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-2">
                Plano {index + 1}: {plan.title}
                {plan.isFeatured && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Destaque</span>}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Título do Plano</Label>
                  <Input
                    value={plan.title}
                    onChange={(e) => updatePlan(plan.id, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Dias de Suprimento</Label>
                  <Input
                    type="number"
                    value={plan.daysSupply}
                    onChange={(e) => updatePlan(plan.id, { daysSupply: parseInt(e.target.value) || 30 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Texto do Selo</Label>
                  <Input
                    value={plan.badge}
                    onChange={(e) => updatePlan(plan.id, { badge: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tipo do Selo</Label>
                  <Select
                    value={plan.badgeType}
                    onValueChange={(value) => updatePlan(plan.id, { badgeType: value as Plan['badgeType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="best">Melhor Valor</SelectItem>
                      <SelectItem value="popular">Mais Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={plan.isFeatured}
                  onCheckedChange={(checked) => updatePlan(plan.id, { isFeatured: checked })}
                />
                <Label>Card Destacado</Label>
              </div>

              {/* Upload de Imagem */}
              <div className="p-3 bg-muted rounded-lg space-y-3">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  URL da Imagem do Produto
                </Label>
                <Input
                  value={plan.imageUrl}
                  onChange={(e) => updatePlan(plan.id, { imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/garrafa.png"
                />

                {plan.imageUrl && (
                  <div 
                    className="mt-2 w-20 h-24 rounded overflow-hidden flex items-center justify-center bg-gray-100"
                  >
                    <img 
                      src={plan.imageUrl} 
                      alt="Preview" 
                      className="object-contain" 
                      style={{ transform: `scale(${plansStyle.imageScale / 100})` }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Frascos</Label>
                  <Input
                    type="number"
                    value={plan.bottles}
                    onChange={(e) => updatePlan(plan.id, { bottles: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label>Economia %</Label>
                  <Input
                    type="number"
                    value={plan.savings}
                    onChange={(e) => updatePlan(plan.id, { savings: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">(não aparece no preview)</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Preço/Frasco</Label>
                  <Input
                    type="number"
                    value={plan.pricePerBottle}
                    onChange={(e) => updatePlan(plan.id, { pricePerBottle: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Preço Total</Label>
                  <Input
                    type="number"
                    value={plan.totalPrice}
                    onChange={(e) => updatePlan(plan.id, { totalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Preço Original</Label>
                  <Input
                    type="number"
                    value={plan.originalPrice}
                    onChange={(e) => updatePlan(plan.id, { originalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Texto de Frete</Label>
                  <Input
                    value={plan.shipping}
                    onChange={(e) => updatePlan(plan.id, { shipping: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Texto do Botão</Label>
                  <Input
                    value={plan.buttonText}
                    onChange={(e) => updatePlan(plan.id, { buttonText: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Link de Checkout (URL)</Label>
                <Input
                  value={plan.buttonLink}
                  onChange={(e) => updatePlan(plan.id, { buttonLink: e.target.value })}
                  placeholder="https://checkout.example.com/..."
                />
              </div>

              {/* Cor Individual do Botão */}
              <div className="p-3 bg-muted rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.useCustomButtonColor}
                    onCheckedChange={(checked) => updatePlan(plan.id, { useCustomButtonColor: checked })}
                  />
                  <Label>Usar Cor Personalizada do Botão</Label>
                </div>
                {plan.useCustomButtonColor && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Cor do Botão</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={plan.buttonColor}
                          onChange={(e) => updatePlan(plan.id, { buttonColor: e.target.value })}
                          className="w-10 h-8 p-0.5 cursor-pointer"
                        />
                        <Input
                          value={plan.buttonColor}
                          onChange={(e) => updatePlan(plan.id, { buttonColor: e.target.value })}
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Texto do Botão</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={plan.buttonTextColor}
                          onChange={(e) => updatePlan(plan.id, { buttonTextColor: e.target.value })}
                          className="w-10 h-8 p-0.5 cursor-pointer"
                        />
                        <Input
                          value={plan.buttonTextColor}
                          onChange={(e) => updatePlan(plan.id, { buttonTextColor: e.target.value })}
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Imagem abaixo do Botão */}
              <div className="p-3 bg-muted rounded-lg">
                <Label className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4" />
                  Imagem Abaixo do Botão (Cards/Pagamento)
                </Label>
                <Input
                  value={plan.checkoutImageUrl}
                  onChange={(e) => updatePlan(plan.id, { checkoutImageUrl: e.target.value })}
                  placeholder="https://exemplo.com/cartoes-pagamento.png"
                />
                {plan.checkoutImageUrl && (
                  <div className="mt-2 h-8 bg-white rounded overflow-hidden">
                    <img src={plan.checkoutImageUrl} alt="Preview" className="h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Benefícios</Label>
                  <Button variant="outline" size="sm" onClick={() => addBullet(plan.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-3">
                  {plan.bullets.map((bullet) => (
                    <div key={bullet.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={bullet.text}
                          onChange={(e) => updateBullet(plan.id, bullet.id, { text: e.target.value })}
                          className="flex-1"
                          placeholder="Texto do benefício"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBullet(plan.id, bullet.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Cor:</Label>
                          <Input
                            type="color"
                            value={bullet.color}
                            onChange={(e) => updateBullet(plan.id, bullet.id, { color: e.target.value })}
                            className="w-8 h-6 p-0.5"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={bullet.isBold}
                            onCheckedChange={(checked) => updateBullet(plan.id, bullet.id, { isBold: checked })}
                          />
                          <Label className="text-xs">Negrito</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
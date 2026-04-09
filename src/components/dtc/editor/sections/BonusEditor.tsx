import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Image } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { BonusItem } from "@/types/dtc-builder";

export function BonusEditor() {
  const { state, dispatch } = useBuilder();
  const { bonuses, sectionVisibility } = state;

  const updateBonuses = (newBonuses: BonusItem[]) => {
    dispatch({ type: 'UPDATE_BONUSES', payload: newBonuses });
  };

  const addItem = () => {
    const newItem: BonusItem = {
      id: `bonus-${Date.now()}`,
      title: "Novo Bônus",
      description: "Descrição do bônus...",
      value: "R$47 GRÁTIS",
      imageUrl: "",
      showImage: true
    };
    updateBonuses([...bonuses, newItem]);
  };

  const updateItem = (id: string, updates: Partial<BonusItem>) => {
    updateBonuses(bonuses.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    updateBonuses(bonuses.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bônus</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={sectionVisibility.bonusesEnabled}
              onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { bonusesEnabled: checked } })}
            />
            <Label className="text-sm">Ativar seção</Label>
          </div>
          <Button onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Adicionar Bônus
          </Button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {bonuses.map((item, index) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left">
                Bônus {index + 1}: {item.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <Label>Título</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(item.id, { title: e.target.value })}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Valor (ex: "R$97 GRÁTIS")</Label>
                <Input
                  value={item.value}
                  onChange={(e) => updateItem(item.id, { value: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.showImage !== false}
                  onCheckedChange={(checked) => updateItem(item.id, { showImage: checked })}
                />
                <Label>Mostrar imagem do bônus</Label>
              </div>

              {item.showImage !== false && (
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4" />
                    URL da Imagem do Bônus
                  </Label>
                  <Input
                    value={item.imageUrl}
                    onChange={(e) => updateItem(item.id, { imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/bonus.png"
                  />
                  {item.imageUrl && (
                    <div className="mt-2 w-16 h-20 bg-white rounded overflow-hidden">
                      <img src={item.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remover
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

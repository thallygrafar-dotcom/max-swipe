import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FAQItem } from "@/types/dtc-builder";

export function FAQEditor() {
  const { state, dispatch } = useBuilder();
  const { faq, sectionVisibility } = state;

  const updateFAQ = (newFAQ: FAQItem[]) => {
    dispatch({ type: 'UPDATE_FAQ', payload: newFAQ });
  };

  const addItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "Nova Pergunta",
      answer: "Resposta aqui...",
      enabled: true
    };
    updateFAQ([...faq, newItem]);
  };

  const updateItem = (id: string, updates: Partial<FAQItem>) => {
    updateFAQ(faq.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    updateFAQ(faq.filter(item => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faq.length) return;
    
    const newFAQ = [...faq];
    [newFAQ[index], newFAQ[newIndex]] = [newFAQ[newIndex], newFAQ[index]];
    updateFAQ(newFAQ);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Perguntas Frequentes</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={sectionVisibility.faqEnabled}
              onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { faqEnabled: checked } })}
            />
            <Label className="text-sm">Ativar seção</Label>
          </div>
          <Button onClick={addItem} size="sm" disabled={!sectionVisibility.faqEnabled}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, index) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-2 text-left">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                P{index + 1}: {item.question.substring(0, 30)}...
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <Label>Pergunta</Label>
                <Input
                  value={item.question}
                  onChange={(e) => updateItem(item.id, { question: e.target.value })}
                />
              </div>
               <div>
                 <Label>Resposta</Label>
                 <Textarea
                   value={item.answer}
                   onChange={(e) => updateItem(item.id, { answer: e.target.value })}
                   rows={3}
                 />
               </div>
               <div className="flex items-center gap-2">
                 <Switch
                   checked={item.enabled !== false}
                   onCheckedChange={(checked) => updateItem(item.id, { enabled: checked })}
                 />
                 <Label>Habilitar pergunta</Label>
               </div>
               <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                >
                  Mover Acima
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === faq.length - 1}
                >
                  Mover Abaixo
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

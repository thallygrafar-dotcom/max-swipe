import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image, Plus, Trash2 } from "lucide-react";
import { TestimonialItem } from "@/types/dtc-builder";

export function TestimonialEditor() {
  const { state, dispatch } = useBuilder();
  const { testimonials, sectionVisibility } = state;

  const updateTestimonials = (updates: Partial<typeof testimonials>) => {
    dispatch({ type: 'UPDATE_TESTIMONIALS', payload: updates });
  };

  const addTestimonial = () => {
    const newItem: TestimonialItem = {
      id: `testimonial-${Date.now()}`,
      text: "Este produto é incrível!",
      name: "Novo Cliente",
      location: "São Paulo",
      stars: 5,
      photoUrl: "",
    };
    updateTestimonials({ items: [...testimonials.items, newItem] });
  };

  const updateTestimonialItem = (id: string, updates: Partial<TestimonialItem>) => {
    updateTestimonials({
      items: testimonials.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  const removeTestimonial = (id: string) => {
    if (testimonials.items.length > 1) {
      updateTestimonials({
        items: testimonials.items.filter(item => item.id !== id)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Depoimentos</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={sectionVisibility.testimonialsEnabled}
              onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { testimonialsEnabled: checked } })}
            />
            <Label className="text-sm">Ativar seção</Label>
          </div>
          <Button variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">Os depoimentos são exibidos em grade. Adicione quantos quiser.</p>
      
      <Accordion type="single" collapsible className="w-full">
        {testimonials.items.map((item, index) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-2">
                Depoimento {index + 1}: {item.name}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <Label>Texto do Depoimento</Label>
                <Textarea
                  value={item.text}
                  onChange={(e) => updateTestimonialItem(item.id, { text: e.target.value })}
                  placeholder="Este produto mudou minha vida..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateTestimonialItem(item.id, { name: e.target.value })}
                    placeholder="João S."
                  />
                </div>
                <div>
                  <Label>Localização</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateTestimonialItem(item.id, { location: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
              </div>

              <div>
                <Label>Avaliação: {item.stars} estrelas</Label>
                <Slider
                  value={[item.stars]}
                  onValueChange={(value) => updateTestimonialItem(item.id, { stars: value[0] })}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <Label className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4" />
                  URL da Foto do Cliente
                </Label>
                <Input
                  value={item.photoUrl}
                  onChange={(e) => updateTestimonialItem(item.id, { photoUrl: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
                />
                {item.photoUrl && (
                  <div className="mt-2 w-12 h-12 bg-white rounded-full overflow-hidden">
                    <img src={item.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {testimonials.items.length > 1 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeTestimonial(item.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Remover Depoimento
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

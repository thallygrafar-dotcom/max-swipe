import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function CTAEditor() {
  const { state, dispatch } = useBuilder();
  const { cta, sectionVisibility } = state;

  const updateCTA = (updates: Partial<typeof cta>) => {
    dispatch({ type: 'UPDATE_CTA', payload: updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Chamada para Ação Final</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={sectionVisibility.ctaEnabled}
            onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { ctaEnabled: checked } })}
          />
          <Label className="text-sm">Ativar seção</Label>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="ctaHeadline">Título</Label>
          <Textarea
            id="ctaHeadline"
            value={cta.headline}
            onChange={(e) => updateCTA({ headline: e.target.value })}
            placeholder="NÃO PERCA ESTA OPORTUNIDADE LIMITADA!"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="ctaSubheadline">Subtítulo</Label>
          <Input
            id="ctaSubheadline"
            value={cta.subheadline}
            onChange={(e) => updateCTA({ subheadline: e.target.value })}
            placeholder="ESTOQUE ACABANDO - PEÇA AGORA!"
          />
        </div>

        <div>
          <Label htmlFor="ctaButton">Texto do Botão</Label>
          <Input
            id="ctaButton"
            value={cta.buttonText}
            onChange={(e) => updateCTA({ buttonText: e.target.value })}
            placeholder="COMPRAR AGORA"
          />
        </div>

        <div>
          <Label htmlFor="ctaNote">Observação</Label>
          <Input
            id="ctaNote"
            value={cta.note}
            onChange={(e) => updateCTA({ note: e.target.value })}
            placeholder="Peça 6 Frascos e Receba 2 Bônus GRÁTIS"
          />
        </div>
      </div>
    </div>
  );
}

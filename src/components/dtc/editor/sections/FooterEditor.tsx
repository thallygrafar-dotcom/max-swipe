import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function FooterEditor() {
  const { state, dispatch } = useBuilder();
  const { footer, sectionVisibility } = state;

  const updateFooter = (updates: Partial<typeof footer>) => {
    dispatch({ type: 'UPDATE_FOOTER', payload: updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Rodapé</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={sectionVisibility.footerEnabled}
            onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SECTION_VISIBILITY', payload: { footerEnabled: checked } })}
          />
          <Label className="text-sm">Ativar seção</Label>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="footerLinks">Links do Rodapé (separados por |)</Label>
          <Input
            id="footerLinks"
            value={footer.links}
            onChange={(e) => updateFooter({ links: e.target.value })}
            placeholder="Contato | Privacidade | Termos | Reembolso"
          />
        </div>

        <div>
          <Label htmlFor="footerDisclaimer">Disclaimer</Label>
          <Textarea
            id="footerDisclaimer"
            value={footer.disclaimer}
            onChange={(e) => updateFooter({ disclaimer: e.target.value })}
            placeholder="© 2024 Produto. Todos os direitos reservados..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export function PaymentBadgesEditor() {
  const { state, dispatch } = useBuilder();
  const { paymentBadges } = state;

  const updatePaymentBadges = (updates: Partial<typeof paymentBadges>) => {
    dispatch({ type: 'UPDATE_PAYMENT_BADGES', payload: updates });
  };

  const toggleBadge = (badgeId: string, enabled: boolean) => {
    const updatedBadges = paymentBadges.badges.map(badge =>
      badge.id === badgeId ? { ...badge, enabled } : badge
    );
    updatePaymentBadges({ badges: updatedBadges });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Selos de Pagamento</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Exibir Selos de Pagamento</Label>
          <Switch
            checked={paymentBadges.enabled}
            onCheckedChange={(checked) => updatePaymentBadges({ enabled: checked })}
          />
        </div>

        {paymentBadges.enabled && (
          <div className="space-y-3 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Selecione quais selos exibir:</p>
            
            <div className="grid grid-cols-2 gap-3">
              {paymentBadges.badges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={badge.id}
                    checked={badge.enabled}
                    onCheckedChange={(checked) => toggleBadge(badge.id, checked as boolean)}
                  />
                  <label
                    htmlFor={badge.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {badge.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

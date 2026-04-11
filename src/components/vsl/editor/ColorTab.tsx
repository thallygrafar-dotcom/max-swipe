import { useVSL } from '@/contexts/vsl/VSLContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { defaultColors } from '@/contexts/vsl/VSLContext';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
      />
      <div className="flex-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-sm"
        />
      </div>
    </div>
  );
}

export function ColorTab() {
  const { config, updateColors, resetColors } = useVSL();

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">Personalizar Cores</h4>
        <Button variant="outline" size="sm" onClick={resetColors}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar
        </Button>
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Gradiente de Fundo</h5>
        <ColorInput label="Cor Inicial" value={config.colors.gradientStart} onChange={(v) => updateColors({ gradientStart: v })} />
        <ColorInput label="Cor Final" value={config.colors.gradientEnd} onChange={(v) => updateColors({ gradientEnd: v })} />
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Banner de Urgência</h5>
        <ColorInput label="Fundo" value={config.colors.urgencyBg} onChange={(v) => updateColors({ urgencyBg: v })} />
        <ColorInput label="Texto" value={config.colors.urgencyText} onChange={(v) => updateColors({ urgencyText: v })} />
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Títulos</h5>
        <ColorInput label="Título Principal" value={config.colors.headlineColor} onChange={(v) => updateColors({ headlineColor: v })} />
        <ColorInput label="Subtítulo" value={config.colors.subheadlineColor} onChange={(v) => updateColors({ subheadlineColor: v })} />
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Badge Ao Vivo</h5>
        <ColorInput label="Fundo" value={config.colors.liveBadgeBg} onChange={(v) => updateColors({ liveBadgeBg: v })} />
        <ColorInput label="Texto" value={config.colors.liveBadgeText} onChange={(v) => updateColors({ liveBadgeText: v })} />
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Comentários</h5>
        <ColorInput label="Fundo" value={config.colors.commentBg} onChange={(v) => updateColors({ commentBg: v })} />
        <ColorInput label="Texto" value={config.colors.commentText} onChange={(v) => updateColors({ commentText: v })} />
        <ColorInput label="Nome" value={config.colors.commentNameColor} onChange={(v) => updateColors({ commentNameColor: v })} />
        <ColorInput label="Azul Facebook (likes)" value={config.colors.facebookBlue} onChange={(v) => updateColors({ facebookBlue: v })} />
      </div>

      <div className="space-y-3 p-4 bg-secondary rounded-lg">
        <h5 className="font-medium text-sm">Footer</h5>
        <ColorInput label="Fundo" value={config.colors.footerBg} onChange={(v) => updateColors({ footerBg: v })} />
        <ColorInput label="Texto" value={config.colors.footerText} onChange={(v) => updateColors({ footerText: v })} />
      </div>
    </div>
  );
}

import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Copy, RotateCcw } from "lucide-react";
import { generateHTML } from "@/utils/dtcHtmlExporter";
import { toast } from "@/hooks/use-toast";

export function ExportEditor() {
  const { state, dispatch } = useBuilder();
  const { export: exportConfig } = state;

  const updateExport = (updates: Partial<typeof exportConfig>) => {
    dispatch({ type: 'UPDATE_EXPORT', payload: updates });
  };

  const handleExportHTML = () => {
    const html = generateHTML(state);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.branding.productName.toLowerCase().replace(/\s+/g, '-')}-offer.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "HTML Exportado!",
      description: "Sua página de oferta foi baixada.",
    });
  };

  const handleCopyHTML = async () => {
    const html = generateHTML(state);
    await navigator.clipboard.writeText(html);
    toast({
      title: "Copiado!",
      description: "HTML copiado para a área de transferência.",
    });
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja resetar todas as configurações para os valores padrão?")) {
      dispatch({ type: 'RESET' });
      toast({
        title: "Reset Completo",
        description: "Todas as configurações foram restauradas para os valores padrão.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Configurações de Exportação</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <h4 className="font-medium">Wrapper de Conteúdo Oculto</h4>
          <p className="text-sm text-muted-foreground">
            Configure o wrapper para VTurb ou outros players de vídeo para revelar a seção de oferta.
          </p>

          <div>
            <Label>Tipo do Wrapper</Label>
            <RadioGroup
              value={exportConfig.wrapperType}
              onValueChange={(value) => updateExport({ wrapperType: value as 'class' | 'id' })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="id" id="id" />
                <Label htmlFor="id">ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class">Classe</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="wrapperName">Nome do Wrapper</Label>
            <Input
              id="wrapperName"
              value={exportConfig.wrapperName}
              onChange={(e) => updateExport({ wrapperName: e.target.value })}
              placeholder="dtc-offer-section"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Será exportado como: {exportConfig.wrapperType === 'id' ? `id="${exportConfig.wrapperName}"` : `class="${exportConfig.wrapperName}"`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={exportConfig.startHidden}
              onCheckedChange={(checked) => updateExport({ startHidden: checked })}
            />
            <Label>Iniciar Oculto (display: none)</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleExportHTML} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Exportar HTML
          </Button>
          <Button onClick={handleCopyHTML} variant="outline" className="w-full" size="lg">
            <Copy className="w-4 h-4 mr-2" />
            Copiar HTML
          </Button>
        </div>

        <Button onClick={handleReset} variant="destructive" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useVSL } from "@/contexts/vsl/VSLContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, Video, Eye as EyeIcon, MessageSquare, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorTab } from "./ColorTab";
import { CommentsTab } from "./CommentsTab";

const sections = [
  { id: "general", label: "Geral", icon: Type },
  { id: "video", label: "Vídeo", icon: Video },
  { id: "viewers", label: "Viewers", icon: EyeIcon },
  { id: "comments", label: "Comentários", icon: MessageSquare },
  { id: "colors", label: "Cores", icon: Palette },
];

export function VSLEditorSidebar() {
  const { config, updateConfig } = useVSL();
  const [activeSection, setActiveSection] = useState("general");

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto de Urgência (badge)</Label>
              <Input value={config.urgencyText} onChange={e => updateConfig({ urgencyText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mensagem de Urgência (antes da data)</Label>
              <Input value={config.urgencyDatePrefix} onChange={e => updateConfig({ urgencyDatePrefix: e.target.value })} className="mt-1" />
              <p className="text-[10px] text-muted-foreground mt-1">A data de hoje é adicionada automaticamente.</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Título Principal</Label>
              <Input value={config.headline} onChange={e => updateConfig({ headline: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subtítulo</Label>
              <Input value={config.subheadline} onChange={e => updateConfig({ subheadline: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Texto do Footer</Label>
              <Input value={config.footerText} onChange={e => updateConfig({ footerText: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">País</Label>
              <Input value={config.footerCountry} onChange={e => updateConfig({ footerCountry: e.target.value })} className="mt-1" />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Código Embed do Vturb</Label>
              <Textarea
                value={config.vturbEmbedCode}
                onChange={e => updateConfig({ vturbEmbedCode: e.target.value })}
                className="mt-1 min-h-[200px] font-mono text-sm"
                placeholder="Cole o código embed do Vturb aqui..."
              />
              <p className="text-[10px] text-muted-foreground mt-1">Cole o código HTML/iframe completo do seu vídeo Vturb</p>
            </div>
          </div>
        );

      case "viewers":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantidade Base de Espectadores</Label>
              <Input
                type="number"
                value={config.viewerCount}
                onChange={e => updateConfig({ viewerCount: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
              <p className="text-[10px] text-muted-foreground mt-1">O número vai variar ±20% automaticamente</p>
            </div>
            <div className="rounded-lg border p-3 space-y-3">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Textos do Badge "Ao Vivo"</Label>
              <div>
                <Label className="text-[10px] text-muted-foreground">Linha 1 (após o número)</Label>
                <Input value={config.liveBadgeText1} onChange={e => updateConfig({ liveBadgeText1: e.target.value })} placeholder="people are" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Linha 2</Label>
                <Input value={config.liveBadgeText2} onChange={e => updateConfig({ liveBadgeText2: e.target.value })} placeholder="watching this video" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Linha 3</Label>
                <Input value={config.liveBadgeText3} onChange={e => updateConfig({ liveBadgeText3: e.target.value })} placeholder="Live now" />
              </div>
            </div>
          </div>
        );

      case "comments":
        return <CommentsTab />;

      case "colors":
        return <ColorTab />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b bg-muted/30 px-2 py-2 gap-1 overflow-x-auto shrink-0">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
              activeSection === section.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            )}
          >
            <section.icon className="w-3.5 h-3.5" />
            {section.label}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderSection()}
        </div>
      </ScrollArea>
    </div>
  );
}

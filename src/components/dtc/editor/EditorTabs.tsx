import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrandingEditor } from "./sections/BrandingEditor";
import { StockEditor } from "./sections/StockEditor";
import { PlansEditor } from "./sections/PlansEditor";
import { GuaranteeEditor } from "./sections/GuaranteeEditor";
import { TestimonialEditor } from "./sections/TestimonialEditor";
import { FAQEditor } from "./sections/FAQEditor";
import { BonusEditor } from "./sections/BonusEditor";
import { CTAEditor } from "./sections/CTAEditor";
import { FooterEditor } from "./sections/FooterEditor";
import { ExportEditor } from "./sections/ExportEditor";
import { CustomSectionsEditor } from "./sections/CustomSectionsEditor";
import { 
  Palette, 
  Package, 
  CreditCard, 
  Shield, 
  MessageSquare, 
  HelpCircle, 
  Gift, 
  MousePointer, 
  FileText,
  Download,
  LayoutTemplate
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'branding', label: 'Marca', icon: Palette, description: 'Cores, fontes, espaçamento' },
  { id: 'stock', label: 'Estoque', icon: Package, description: 'Urgência e contagem' },
  { id: 'plans', label: 'Planos', icon: CreditCard, description: 'Cards de preço' },
  { id: 'guarantee', label: 'Garantia', icon: Shield, description: 'Garantia de reembolso' },
  { id: 'testimonial', label: 'Depoimentos', icon: MessageSquare, description: 'Avaliações de clientes' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Perguntas e respostas' },
  { id: 'bonus', label: 'Bônus', icon: Gift, description: 'Bônus gratuitos' },
  { id: 'custom', label: 'Personalizar', icon: LayoutTemplate, description: 'Seções personalizadas' },
  { id: 'cta', label: 'CTA', icon: MousePointer, description: 'Chamada para ação' },
  { id: 'footer', label: 'Rodapé', icon: FileText, description: 'Links e disclaimer' },
  { id: 'export', label: 'Exportar', icon: Download, description: 'Baixar HTML' },
];

const tabComponents: Record<string, React.ComponentType> = {
  branding: BrandingEditor,
  stock: StockEditor,
  plans: PlansEditor,
  guarantee: GuaranteeEditor,
  testimonial: TestimonialEditor,
  faq: FAQEditor,
  bonus: BonusEditor,
  custom: CustomSectionsEditor,
  cta: CTAEditor,
  footer: FooterEditor,
  export: ExportEditor,
};

export function EditorTabs() {
  const [activeTab, setActiveTab] = useState('branding');
  
  const ActiveComponent = tabComponents[activeTab];
  const activeTabInfo = tabs.find(t => t.id === activeTab);

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation - Vertical */}
      <div className="w-14 border-r bg-muted/20 flex flex-col py-2 flex-shrink-0">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 px-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  className={cn(
                    "w-11 h-11 rounded-lg flex items-center justify-center transition-all relative group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md shadow-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {tab.label}
                    <span className="block text-[10px] text-muted-foreground font-normal">{tab.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Active Tab Header */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-muted/50 to-transparent flex-shrink-0">
          <div className="flex items-center gap-2">
            {activeTabInfo && (
              <>
                <activeTabInfo.icon className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{activeTabInfo.label}</span>
                <span className="text-muted-foreground text-xs">— {activeTabInfo.description}</span>
              </>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <ActiveComponent />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import HeaderEditor from "./sections/HeaderEditor";
import HeroEditor from "./sections/HeroEditor";
import BodyEditor from "./sections/BodyEditor";
import BodyContinuationEditor from "./sections/BodyContinuationEditor";
import CommentsEditor from "./sections/CommentsEditor";
import SidebarEditor from "./sections/SidebarEditor";
import FooterEditor from "./sections/FooterEditor";
import ExportEditor from "./sections/ExportEditor";
import {
  LayoutTemplate,
  Image,
  FileText,
  MessageSquare,
  PanelBottom,
  Download,
} from "lucide-react";

const EditorTabs = () => {
  const [activeTab, setActiveTab] = useState<
    | "header"
    | "hero"
    | "body"
    | "bodyContinuation"
    | "comments"
    | "sidebar"
    | "footer"
    | "export"
  >("header");

  return (
    <div className="flex h-full min-h-0">
      <div className="w-[52px] border-r bg-muted/20 flex flex-col py-2 flex-shrink-0">
        <div className="flex flex-col gap-1 px-1.5">
          <button
            onClick={() => setActiveTab("header")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "header"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "hero"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Image className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("body")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "body"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("bodyContinuation")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "bodyContinuation"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "comments"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("sidebar")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "sidebar"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("footer")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "footer"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <PanelBottom className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              activeTab === "export"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 flex-col min-w-0">
        <div className="px-3 py-3 border-b bg-gradient-to-r from-muted/50 to-transparent flex-shrink-0">
          {activeTab === "header" && (
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Header</span>
              <span className="text-muted-foreground text-xs">
                — Configurações do cabeçalho
              </span>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Hero</span>
              <span className="text-muted-foreground text-xs">
                — Conteúdo principal do advertorial
              </span>
            </div>
          )}

          {activeTab === "body" && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Body</span>
              <span className="text-muted-foreground text-xs">
                — Conteúdo central do advertorial
              </span>
            </div>
          )}

          {activeTab === "bodyContinuation" && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Body 2</span>
              <span className="text-muted-foreground text-xs">
                — Continuação do conteúdo central do advertorial
              </span>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Comentários</span>
              <span className="text-muted-foreground text-xs">
                — Depoimentos e prova social do advertorial
              </span>
            </div>
          )}

          {activeTab === "sidebar" && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Sidebar</span>
              <span className="text-muted-foreground text-xs">
                — Conteúdo lateral do advertorial
              </span>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="flex items-center gap-2">
              <PanelBottom className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Footer</span>
              <span className="text-muted-foreground text-xs">
                — Rodapé institucional do advertorial
              </span>
            </div>
          )}

          {activeTab === "export" && (
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Export</span>
              <span className="text-muted-foreground text-xs">
                — Baixar ZIP do advertorial
              </span>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {activeTab === "header" && <HeaderEditor />}
            {activeTab === "hero" && <HeroEditor />}
            {activeTab === "body" && <BodyEditor />}
            {activeTab === "bodyContinuation" && <BodyContinuationEditor />}
            {activeTab === "comments" && <CommentsEditor />}
            {activeTab === "sidebar" && <SidebarEditor />}
            {activeTab === "footer" && <FooterEditor />}
            {activeTab === "export" && <ExportEditor />}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EditorTabs;
import { BuilderProvider } from "@/contexts/dtc/BuilderContext";
import { EditorTabs } from "@/components/dtc/editor/EditorTabs";
import { OfferPreview } from "@/components/dtc/preview/OfferPreview";
import { ProjectManager } from "@/components/dtc/ProjectManager";
import { Layers, Eye, Smartphone, Monitor, Settings2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";

const DTCBuilder = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <BuilderProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <SwipeHeader />

        <div className="flex-1 w-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-6">
            <div className="flex h-[calc(100vh-3.5rem-48px)] overflow-hidden rounded-xl border border-border bg-card">
              {/* Editor Sidebar */}
              <aside
                className={`
                  w-[400px] bg-card border-r border-border flex flex-col shrink-0
                  transition-transform duration-300
                  ${showPreview ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
                `}
              >
                <header className="h-14 border-b bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h1 className="font-bold text-sm leading-tight">DTC Offer Builder</h1>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Construtor de ofertas
                      </p>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-hidden">
                  <EditorTabs />
                </div>
              </aside>

              {/* Preview */}
              <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-12 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-muted-foreground hidden md:block">
                      Preview
                    </span>

                    <ToggleGroup
                      type="single"
                      value={previewMode}
                      onValueChange={(value) =>
                        value && setPreviewMode(value as "desktop" | "mobile")
                      }
                      className="bg-muted/50 p-0.5 rounded-lg border"
                    >
                      <ToggleGroupItem
                        value="desktop"
                        className="px-2.5 py-1 text-xs gap-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Desktop</span>
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        value="mobile"
                        className="px-2.5 py-1 text-xs gap-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mobile</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="flex items-center gap-2">
                    <ProjectManager />

                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden gap-2"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? (
                        <>
                          <Settings2 className="w-4 h-4" /> Editor
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" /> Preview
                        </>
                      )}
                    </Button>
                  </div>
                </header>

                <div className="flex-1 overflow-auto bg-background">
                  <div
                    className={`min-h-full transition-all duration-300 ${
                      previewMode === "mobile"
                        ? "mx-auto my-6 border border-border rounded-xl shadow-2xl overflow-hidden"
                        : "w-full"
                    }`}
                    style={
                      previewMode === "mobile"
                        ? { width: "375px", maxWidth: "375px" }
                        : {}
                    }
                  >
                    <OfferPreview isMobile={previewMode === "mobile"} />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        <SwipeFooter />
      </div>
    </BuilderProvider>
  );
};

export default DTCBuilder;
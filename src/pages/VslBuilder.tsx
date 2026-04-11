import { useState, useEffect } from "react";
import { VSLProvider, useVSL, defaultConfig } from "@/contexts/vsl/VSLContext";
import { VSLEditorSidebar } from "@/components/vsl/editor/VSLEditorSidebar";
import { VSLPreview } from "@/components/vsl/preview/VSLPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  RotateCcw,
  Check,
  PanelLeftClose,
  PanelLeft,
  Eye,
  Download,
  Save,
  FolderOpen,
  Trash2,
  Video,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateVSLHTML } from "@/utils/vslHtmlExporter";
import { exportAsZip } from "@/utils/zipExporter";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";

interface SaveSlot {
  name: string;
  config: any;
  date: string;
}

const SLOTS_KEY = "vsl-save-slots";

function VSLBuilderInner() {
  const { config, updateConfig } = useVSL();
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [savedVersions, setSavedVersions] = useState<SaveSlot[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SLOTS_KEY);
    if (saved) {
      try {
        setSavedVersions(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const persistVersions = (versions: SaveSlot[]) => {
    setSavedVersions(versions);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(versions));
  };

  const handleCopyCode = async () => {
    const htmlContent = generateVSLHTML(config);
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    toast.success("HTML + CSS copiado para a área de transferência");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    updateConfig(defaultConfig);
    toast.success("Configuração resetada para o padrão");
  };

  const handleSave = (name: string) => {
    const slot: SaveSlot = {
      name,
      config: { ...config },
      date: new Date().toLocaleString("pt-BR"),
    };
    const updated = [...savedVersions, slot];
    persistVersions(updated);
    toast.success(`"${name}" salvo com sucesso`);
  };

  const handleLoad = (index: number) => {
    const version = savedVersions[index];
    updateConfig(version.config);
    toast.success(`"${version.name}" carregado com sucesso`);
  };

  const handleDeleteVersion = (index: number) => {
    const name = savedVersions[index].name;
    const updated = savedVersions.filter((_, i) => i !== index);
    persistVersions(updated);
    toast.success(`"${name}" foi removido`);
  };

  const handleDownloadZip = async () => {
    setExporting(true);
    try {
      const html = generateVSLHTML(config);
      const imageUrls: { url: string; name: string }[] = [];

      config.comments.forEach((comment, i) => {
        if (comment.avatar) {
          imageUrls.push({ url: comment.avatar, name: `avatar-${i + 1}` });
        }
        comment.replies?.forEach((reply, j) => {
          if (reply.avatar) {
            imageUrls.push({
              url: reply.avatar,
              name: `avatar-${i + 1}-reply-${j + 1}`,
            });
          }
        });
      });

      await exportAsZip(html, imageUrls, "vsl-page");
      toast.success("ZIP com HTML + imagens baixado com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Falha ao exportar ZIP");
    }
    setExporting(false);
  };

  const handleDownloadHTML = () => {
    const html = generateVSLHTML(config);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vsl-page.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo HTML baixado com sucesso");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SwipeHeader />

      <div className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-6">
          <div className="flex h-[calc(100vh-3.5rem-48px)] overflow-hidden rounded-xl border border-border bg-card">
            {/* Editor Sidebar */}
            <aside
              className={cn(
                "border-r bg-card flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
                sidebarOpen ? "w-[420px]" : "w-0"
              )}
            >
              <header className="h-14 border-b bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-bold text-sm leading-tight">
                      VSL Page Builder
                    </h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Páginas de VSL otimizadas
                    </p>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-hidden">
                <VSLEditorSidebar />
              </div>
            </aside>

            {/* Preview */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <header className="h-12 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="w-4 h-4" />
                    ) : (
                      <PanelLeft className="w-4 h-4" />
                    )}
                  </Button>

                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> Preview ao Vivo
                  </span>

                  <div className="flex items-center gap-1 ml-2">
                    <span className="text-[10px] text-muted-foreground">
                      Zoom:
                    </span>
                    {[0.4, 0.5, 0.6, 0.75, 1].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setPreviewScale(scale)}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded",
                          previewScale === scale
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {Math.round(scale * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
                  </Button>

                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {copied ? "Copiado!" : "Copiar HTML"}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowSaveDialog(true)}
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" /> Salvar
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowLoadDialog(true)}
                  >
                    <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> Abrir (
                    {savedVersions.length})
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={exporting}
                    onClick={handleDownloadZip}
                  >
                    {exporting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {exporting ? "Exportando..." : "Baixar ZIP"}
                  </Button>
                </div>
              </header>

              <div className="flex-1 overflow-auto bg-background p-4">
                <div
                  className="mx-auto origin-top rounded-lg shadow-lg border overflow-hidden"
                  style={{
                    transform: `scale(${previewScale})`,
                    width: `${100 / previewScale}%`,
                    maxWidth: `${1440 / previewScale}px`,
                    transformOrigin: "top center",
                  }}
                >
                  <VSLPreview />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {showSaveDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSaveDialog(false)}
        >
          <div
            className="bg-card rounded-lg shadow-xl p-6 w-96 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-foreground">Salvar Versão</h2>
            <p className="text-sm text-muted-foreground">
              Dê um nome para identificar esta versão da página.
            </p>

            <Input
              placeholder="Ex: Versão 1, Teste cores..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && saveName.trim()) {
                  handleSave(saveName.trim());
                  setSaveName("");
                  setShowSaveDialog(false);
                }
              }}
              autoFocus
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                disabled={!saveName.trim()}
                onClick={() => {
                  handleSave(saveName.trim());
                  setSaveName("");
                  setShowSaveDialog(false);
                }}
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLoadDialog(false)}
        >
          <div
            className="bg-card rounded-lg shadow-xl p-6 w-[480px] max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-foreground mb-1">
              Versões Salvas
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em uma versão para carregá-la.
            </p>

            {savedVersions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma versão salva ainda.
              </p>
            ) : (
              <div className="flex-1 overflow-auto space-y-2">
                {savedVersions.map((version, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => {
                        handleLoad(index);
                        setShowLoadDialog(false);
                      }}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {version.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {version.date}
                      </p>
                    </button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => handleDeleteVersion(index)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoadDialog(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      <SwipeFooter />
    </div>
  );
}

const PresselVsl = () => (
  <VSLProvider>
    <VSLBuilderInner />
  </VSLProvider>
);

export default PresselVsl;
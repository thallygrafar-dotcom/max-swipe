import { useEffect, useMemo, useState } from "react";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";
import {
  AdvertorialProvider,
  useAdvertorial,
} from "@/contexts/adv/AdvertorialContext";
import AdvertorialPreview from "@/components/adv/preview/AdvertorialPreview";
import EditorTabs from "@/components/adv/editor/EditorTabs";
import {
  saveProject,
  updateProject,
  getProjects,
} from "@/components/adv/utils/advLocalStorage";
import { exportAdvertorialZip } from "@/components/adv/utils/advertorialZipExporter";
import {
  Save,
  CopyPlus,
  FolderPlus,
  Monitor,
  Smartphone,
  Download,
} from "lucide-react";

const PaginaAdvertorialInner = () => {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const { config, currentProjectId, setCurrentProjectId } = useAdvertorial();

  const [projects, setProjects] = useState<any[]>([]);
  const [isProjectActionLoading, setIsProjectActionLoading] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<"new" | "saveAsNew">(
    "new"
  );
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  const currentProject = useMemo(() => {
    return projects.find((project) => project.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  const refreshProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const openProjectModal = (mode: "new" | "saveAsNew") => {
    setProjectModalMode(mode);
    setProjectName("");
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    if (isProjectActionLoading) return;
    setIsProjectModalOpen(false);
    setProjectName("");
  };

  const handleConfirmProjectModal = async () => {
    const trimmedName = projectName.trim();
    if (!trimmedName) return;

    setIsProjectActionLoading(true);

    try {
      const savedProject = await saveProject(trimmedName, config);

      if (savedProject) {
        setCurrentProjectId(savedProject.id);
      }

      await refreshProjects();
      setIsProjectModalOpen(false);
      setProjectName("");
    } finally {
      setIsProjectActionLoading(false);
    }
  };

  const handleNewProject = async () => {
    openProjectModal("new");
  };

  const handleSaveAsNew = async () => {
    openProjectModal("saveAsNew");
  };

  const handleUpdateProject = async () => {
    if (!currentProject) return;

    setIsProjectActionLoading(true);

    try {
      await updateProject(currentProject.id, currentProject.name, config);
      await refreshProjects();
    } finally {
      setIsProjectActionLoading(false);
    }
  };

  const handleDownloadZip = () => {
    exportAdvertorialZip(config);
  };

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <SwipeHeader />

        <div className="flex-1 w-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-6">
            <div className="flex h-[calc(100vh-3.5rem-48px)] overflow-hidden rounded-[22px] border border-border bg-card">
              <aside className="w-[400px] border-r border-border bg-card shrink-0 flex min-h-0 flex-col">
                <div className="border-b border-border px-3 py-3 bg-gradient-to-r from-[#2a0f0f] via-[#1a1212] to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b0f0f] border border-[#3a1a1a]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-[#ff3b1a]"
                      >
                        <rect x="3" y="4" width="18" height="6" rx="1" />
                        <rect x="3" y="14" width="8" height="6" rx="1" />
                        <rect x="13" y="14" width="8" height="6" rx="1" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Advertorial Builder
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Construtor de advertorial
                      </p>
                    </div>
                  </div>
                </div>

                <EditorTabs />
              </aside>

              <main className="flex-1 flex flex-col overflow-hidden">
                <header className="border-b border-border px-4 py-3 bg-card">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        Projeto aberto
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white truncate">
                        {currentProject
                          ? currentProject.name
                          : "Nenhum projeto selecionado"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => setPreviewMode("desktop")}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                          previewMode === "desktop"
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white"
                        }`}
                        title="Preview Desktop"
                      >
                        <Monitor className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setPreviewMode("mobile")}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                          previewMode === "mobile"
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-white"
                        }`}
                        title="Preview Mobile"
                      >
                        <Smartphone className="h-4 w-4" />
                      </button>

                      <button
                        onClick={handleDownloadZip}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-all hover:bg-white/[0.08] hover:text-white"
                        title="Baixar ZIP"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        onClick={handleNewProject}
                        disabled={isProjectActionLoading}
                        className="h-10 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        {isProjectActionLoading ? "Salvando..." : "Novo Projeto"}
                      </button>

                      <button
                        onClick={handleSaveAsNew}
                        disabled={isProjectActionLoading}
                        className="h-10 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-medium text-white transition-all hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <CopyPlus className="w-3.5 h-3.5" />
                        Salvar como novo
                      </button>

                      <button
                        onClick={handleUpdateProject}
                        disabled={isProjectActionLoading || !currentProject}
                        className="h-10 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isProjectActionLoading ? "Salvando..." : "Atualizar"}
                      </button>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-auto bg-[#efefef] p-6">
                  <AdvertorialPreview previewMode={previewMode} />
                </div>
              </main>
            </div>
          </div>
        </div>

        <SwipeFooter />
      </div>

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="text-lg font-semibold text-white">
                {projectModalMode === "new"
                  ? "Criar novo projeto"
                  : "Salvar como novo"}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {projectModalMode === "new"
                  ? "Dê um nome para criar um novo projeto a partir do advertorial atual."
                  : "Dê um nome para salvar uma nova versão deste advertorial."}
              </p>
            </div>

            <div className="space-y-3 px-6 py-5">
              <label className="text-sm text-white/80">Nome do projeto</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    projectName.trim() &&
                    !isProjectActionLoading
                  ) {
                    handleConfirmProjectModal();
                  }
                }}
                placeholder="Ex: Advertorial Vision Teste 01"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-red-500/70"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={closeProjectModal}
                disabled={isProjectActionLoading}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmProjectModal}
                disabled={!projectName.trim() || isProjectActionLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProjectActionLoading
                  ? "Salvando..."
                  : projectModalMode === "new"
                  ? "Criar projeto"
                  : "Salvar nova versão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PaginaAdvertorial = () => {
  return (
    <AdvertorialProvider>
      <PaginaAdvertorialInner />
    </AdvertorialProvider>
  );
};

export default PaginaAdvertorial;
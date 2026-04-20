import { useEffect, useMemo, useState } from "react";
import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";
import {
  getProjects,
  loadProject,
  deleteProject,
} from "@/components/adv/utils/advLocalStorage";

type ProjectItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: any;
};

let projectsCache: ProjectItem[] = [];
let hasLoadedProjectsCache = false;

const ExportEditor = () => {
  const { setFullConfig, currentProjectId, setCurrentProjectId } =
    useAdvertorial();

  const [projects, setProjects] = useState<ProjectItem[]>(projectsCache);
  const [isFetchingProjects, setIsFetchingProjects] = useState(
    !hasLoadedProjectsCache
  );
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(
    null
  );

  const currentProject = useMemo(() => {
    return projects.find((project) => project.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  const fetchProjects = async (forceRefresh = false) => {
    if (hasLoadedProjectsCache && !forceRefresh) {
      setProjects(projectsCache);
      setIsFetchingProjects(false);
      return;
    }

    setIsFetchingProjects(true);

    try {
      const data = await getProjects();
      projectsCache = data;
      hasLoadedProjectsCache = true;
      setProjects(data);
    } finally {
      setIsFetchingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLoad = async (id: string) => {
    setLoadingProjectId(id);

    try {
      const project = await loadProject(id);
      if (!project) return;

      setFullConfig(project.config);
      setCurrentProjectId(project.id);
    } finally {
      setLoadingProjectId(null);
    }
  };

  const openDeleteModal = (project: ProjectItem) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deletingProjectId) return;
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setDeletingProjectId(projectToDelete.id);

    try {
      await deleteProject(projectToDelete.id);

      if (projectToDelete.id === currentProjectId) {
        setCurrentProjectId(null);
      }

      const updatedProjects = projectsCache.filter(
        (project) => project.id !== projectToDelete.id
      );

      projectsCache = updatedProjects;
      setProjects(updatedProjects);

      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } finally {
      setDeletingProjectId(null);
    }
  };

  const isAnyActionRunning =
    isFetchingProjects ||
    loadingProjectId !== null ||
    deletingProjectId !== null;

  return (
    <>
      <div className="space-y-4 pb-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-4 space-y-3">
          {isFetchingProjects && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 px-6 text-center">
                <div className="h-10 w-10 rounded-full border-4 border-white/15 border-t-red-500 animate-spin" />
                <p className="text-sm font-medium text-white">
                  Carregando projetos...
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Projetos Salvos</p>
            <p className="text-xs text-white/60">
              Abra ou remova seus projetos salvos.
            </p>

            {currentProject && (
              <p className="text-xs text-white/70">
                Projeto aberto no momento:{" "}
                <span className="font-medium text-white">
                  {currentProject.name}
                </span>
              </p>
            )}
          </div>

          {!isFetchingProjects && projects.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Nenhum projeto salvo ainda
            </p>
          )}

          <div className="space-y-3">
            {projects.map((p) => {
              const isOpeningThisProject = loadingProjectId === p.id;
              const isDeletingThisProject = deletingProjectId === p.id;
              const isCurrentProject = currentProjectId === p.id;

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-xl border px-3 py-3 ${
                    isCurrentProject
                      ? "border-red-500/35 bg-red-500/[0.08]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-sm font-medium text-white">
                      {p.name}
                    </p>

                    {isCurrentProject && (
                      <p className="mt-1 text-[11px] text-red-300">
                        Projeto atualmente aberto
                      </p>
                    )}
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => handleLoad(p.id)}
                      disabled={isAnyActionRunning}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isOpeningThisProject ? "Abrindo..." : "Abrir"}
                    </button>

                    <button
                      onClick={() => openDeleteModal(p)}
                      disabled={isAnyActionRunning}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingThisProject ? "Deletando..." : "Deletar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isDeleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0B1220] shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="text-lg font-semibold text-white">
                Deletar projeto
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Revise antes de confirmar.
              </p>
            </div>

            <div className="space-y-3 px-6 py-5">
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-white">
                  Você está prestes a deletar o projeto{" "}
                  <span className="font-semibold text-red-400">
                    {projectToDelete.name}
                  </span>
                  .
                </p>
                <p className="mt-2 text-sm text-red-300">
                  Essa ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={closeDeleteModal}
                disabled={deletingProjectId !== null}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 hover:bg-white/[0.06] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingProjectId !== null}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingProjectId ? "Deletando..." : "Deletar permanentemente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportEditor;
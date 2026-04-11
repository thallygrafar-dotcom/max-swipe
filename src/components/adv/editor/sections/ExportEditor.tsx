import { useState } from "react";
import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";
import {
  saveProject,
  getProjects,
  loadProject,
  deleteProject,
} from "@/components/adv/utils/advLocalStorage";
import { exportAdvertorialZip } from "@/components/adv/utils/advertorialZipExporter";

const ExportEditor = () => {
  const { config, setFullConfig } = useAdvertorial();
  const [projects, setProjects] = useState(getProjects());

  const handleSave = () => {
    const name = prompt("Nome do projeto:");
    if (!name) return;

    saveProject(name, config);
    setProjects(getProjects());
  };

  const handleLoad = (id: string) => {
    const project = loadProject(id);
    if (!project) return;

    setFullConfig(project.config);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <p className="text-sm font-semibold text-white">Gerenciar Projeto</p>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Salvar
          </button>

          <button
            onClick={() => exportAdvertorialZip(config)}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Baixar ZIP
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
        <p className="text-sm font-semibold text-white">Projetos Salvos</p>

        {projects.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum projeto salvo ainda
          </p>
        )}

        {projects.map((p: any) => (
          <div
            key={p.id}
            className="flex items-center justify-between border border-border rounded-md px-3 py-2"
          >
            <span className="text-sm text-white">{p.name}</span>

            <div className="flex gap-2">
              <button
                onClick={() => handleLoad(p.id)}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
              >
                Abrir
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportEditor;
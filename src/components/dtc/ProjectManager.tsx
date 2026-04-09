import { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/dtc/BuilderContext";
import { migrateState } from "@/contexts/dtc/BuilderContext";
import { BuilderState } from "@/types/dtc-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, Save, Plus, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface SavedProject {
  id: string;
  name: string;
  state: BuilderState;
  createdAt: string;
  updatedAt: string;
}

const PROJECTS_STORAGE_KEY = 'dtc-saved-projects';

function getProjects(): SavedProject[] {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: SavedProject[]) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

export function ProjectManager() {
  const { state, dispatch } = useBuilder();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleSaveNew = () => {
    if (!newProjectName.trim()) {
      toast.error("Digite um nome para o projeto");
      return;
    }

    const newProject: SavedProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      state: state,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    setNewProjectName("");
    setIsDialogOpen(false);
    toast.success(`Projeto "${newProject.name}" salvo com sucesso!`);
  };

  const handleSaveCurrent = () => {
    if (!currentProjectId) {
      setIsDialogOpen(true);
      return;
    }

    const updatedProjects = projects.map(p => 
      p.id === currentProjectId 
        ? { ...p, state: state, updatedAt: new Date().toISOString() }
        : p
    );
    saveProjects(updatedProjects);
    setProjects(updatedProjects);
    
    const projectName = projects.find(p => p.id === currentProjectId)?.name;
    toast.success(`Projeto "${projectName}" atualizado!`);
  };

  const handleLoadProject = (project: SavedProject) => {
    try {
      const migratedState = migrateState(project.state);
      dispatch({ type: 'SET_STATE', payload: migratedState });
      setCurrentProjectId(project.id);
      toast.success(`Projeto "${project.name}" carregado!`);
    } catch (e) {
      console.error('Failed to load project:', e);
      toast.error(`Erro ao carregar o projeto "${project.name}". O arquivo pode estar corrompido.`);
    }
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    setProjects(updatedProjects);
    
    if (currentProjectId === projectId) {
      setCurrentProjectId(null);
    }
    
    toast.success(`Projeto "${project?.name}" excluído!`);
  };

  const handleNewProject = () => {
    dispatch({ type: 'RESET' });
    setCurrentProjectId(null);
    toast.success("Novo projeto criado!");
  };

  const currentProjectName = projects.find(p => p.id === currentProjectId)?.name;

  return (
    <div className="flex items-center gap-2">
      {/* Save Button */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleSaveCurrent}
      >
        <Save className="w-4 h-4" />
        <span className="hidden sm:inline">Salvar</span>
      </Button>

      {/* Projects Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline max-w-[100px] truncate">
              {currentProjectName || "Projetos"}
            </span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleNewProject}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </DropdownMenuItem>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Como...
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Projeto</DialogTitle>
                <DialogDescription>
                  Digite um nome para salvar seu projeto.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Nome do projeto..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNew()}
                />
                <Button onClick={handleSaveNew}>Salvar</Button>
              </div>
            </DialogContent>
          </Dialog>

          {projects.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                Projetos Salvos
              </div>
              {projects.map((project) => (
                <DropdownMenuItem 
                  key={project.id}
                  className="flex items-center justify-between group"
                  onClick={() => handleLoadProject(project)}
                >
                  <span className={`truncate ${project.id === currentProjectId ? 'font-semibold' : ''}`}>
                    {project.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

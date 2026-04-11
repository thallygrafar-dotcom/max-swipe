const STORAGE_KEY = "adv_projects";

export const getProjects = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const saveProject = (name: string, config: any) => {
  const projects = getProjects();

  const newProject = {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config,
  };

  projects.push(newProject);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const loadProject = (id: string) => {
  const projects = getProjects();
  return projects.find((p: any) => p.id === id);
};

export const deleteProject = (id: string) => {
  const projects = getProjects().filter((p: any) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};
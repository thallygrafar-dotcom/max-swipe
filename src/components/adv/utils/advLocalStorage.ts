import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { AdvertorialConfig } from "@/contexts/adv/AdvertorialContext";

type AdvertorialProject = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: AdvertorialConfig;
};

export const getProjects = async (): Promise<AdvertorialProject[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado:", userError);
    return [];
  }

  const { data, error } = await supabase
    .from("advertorial_projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar projetos:", error);
    return [];
  }

  return (data ?? []).map((project) => ({
    id: project.id,
    name: project.name,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    config: project.data as unknown as AdvertorialConfig,
  }));
};

export const saveProject = async (
  name: string,
  config: AdvertorialConfig
): Promise<AdvertorialProject | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado:", userError);
    return null;
  }

  const payload = {
    name,
    data: config as unknown as Json,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("advertorial_projects")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar projeto:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    config: data.data as unknown as AdvertorialConfig,
  };
};

export const updateProject = async (
  id: string,
  name: string,
  config: AdvertorialConfig
): Promise<AdvertorialProject | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado:", userError);
    return null;
  }

  const payload = {
    name,
    data: config as unknown as Json,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("advertorial_projects")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar projeto:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    config: data.data as unknown as AdvertorialConfig,
  };
};

export const loadProject = async (
  id: string
): Promise<AdvertorialProject | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado:", userError);
    return null;
  }

  const { data, error } = await supabase
    .from("advertorial_projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erro ao carregar projeto:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    config: data.data as unknown as AdvertorialConfig,
  };
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Usuário não autenticado:", userError);
    return false;
  }

  const { error } = await supabase
    .from("advertorial_projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao deletar projeto:", error);
    return false;
  }

  return true;
};
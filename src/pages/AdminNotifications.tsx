import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, EyeOff, Eye, LogOut } from "lucide-react";

const ADMIN_EMAIL = "thally.grafar@gmail.com";
const ADMIN_PASSWORD = "12645555";

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  type?: "info" | "hot";
  read: boolean;
  created_at?: string;
  is_active?: boolean;
};

const AdminNotifications = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("info");

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const fetchNotifications = async () => {
    setLoadingList(true);
    const sb = supabase as any;

    const { data, error } = await sb
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar notificações:", error);
      setLoadingList(false);
      return;
    }

    setNotifications(data || []);
    setLoadingList(false);
  };

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin_notifications_auth", "true");
    } else {
      alert("Acesso negado");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_notifications_auth");
    setAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin_notifications_auth");
    if (saved === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchNotifications();
    }
  }, [authenticated]);

  const handleSave = async () => {
    if (!title || !description) {
      alert("Preencha tudo");
      return;
    }

    setSaving(true);
    const sb = supabase as any;

    const { error } = await sb.from("notifications").insert([
      {
        title,
        description,
        type,
        is_active: true,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar");
      setSaving(false);
      return;
    }

    setTitle("");
    setDescription("");
    setType("info");
    setSaving(false);

    fetchNotifications();
  };

  const handleToggleActive = async (notification: AdminNotification) => {
    const sb = supabase as any;

    const { error } = await sb
      .from("notifications")
      .update({ is_active: notification.is_active ? false : true })
      .eq("id", notification.id);

    if (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
      return;
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? { ...item, is_active: !notification.is_active }
          : item
      )
    );
  };

  const handleDeleteForever = async (notification: AdminNotification) => {
    const confirmed = window.confirm(
      `Deseja apagar permanentemente a notificação "${notification.title}"?`
    );

    if (!confirmed) return;

    const sb = supabase as any;

    const { error } = await sb
      .from("notifications")
      .delete()
      .eq("id", notification.id);

    if (error) {
      console.error("Erro ao apagar definitivamente:", error);
      alert("Erro ao apagar definitivamente");
      return;
    }

    setNotifications((prev) =>
      prev.filter((item) => item.id !== notification.id)
    );
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return value;
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
        <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[rgba(11,16,32,0.96)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <h2 className="mb-1 text-2xl font-bold text-white">Admin Login</h2>
          <p className="mb-5 text-sm text-zinc-400">
            Acesso restrito ao painel de notificações.
          </p>

          <input
            type="email"
            placeholder="Email"
            className="mb-3 w-full rounded-[16px] border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-red-500/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="mb-4 w-full rounded-[16px] border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-red-500/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-[16px] border border-red-500/30 bg-red-500/10 p-3 font-semibold text-white transition hover:border-red-500/50 hover:bg-red-500/20"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[rgba(11,16,32,0.96)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Painel de Notificações</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Crie, oculte para usuários e mantenha o histórico no painel.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 transition hover:border-white/15 hover:bg-white/[0.06]"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(11,16,32,0.96)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
            <h2 className="mb-1 text-xl font-bold">Criar Notificação</h2>
            <p className="mb-5 text-sm text-zinc-400">
              Tudo que for criado entra ativo para os usuários.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título"
                className="w-full rounded-[16px] border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-red-500/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Descrição"
                className="min-h-[140px] w-full rounded-[16px] border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-red-500/30"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                className="w-full rounded-[16px] border border-white/10 bg-black/30 p-3 text-white outline-none transition focus:border-red-500/30"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="info">Info</option>
                <option value="hot">Hot</option>
              </select>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-[16px] border border-emerald-500/30 bg-emerald-500/10 p-3 font-semibold text-white transition hover:border-emerald-500/50 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar Notificação"}
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(11,16,32,0.96)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Histórico</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Aqui fica tudo que já foi notificado.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                {notifications.length} itens
              </div>
            </div>

            <div className="space-y-3">
              {loadingList ? (
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                  Carregando notificações...
                </div>
              ) : notifications.length === 0 ? (
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                  Nenhuma notificação cadastrada ainda.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                            {item.type || "info"}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${
                              item.is_active
                                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                            }`}
                          >
                            {item.is_active ? "Ativa no sino" : "Oculta no sino"}
                          </span>
                        </div>

                        <p className="text-[17px] font-semibold text-white">
                          {item.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          {item.description}
                        </p>

                        <p className="mt-3 text-xs text-zinc-500">
                          Criada em: {formatDate(item.created_at)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex h-10 items-center justify-center gap-2 rounded-[14px] px-4 text-sm font-semibold transition ${
                            item.is_active
                              ? "border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/16"
                              : "border border-sky-500/20 bg-sky-500/10 text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/16"
                          }`}
                        >
                          {item.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                          {item.is_active ? "Ocultar usuários" : "Reativar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteForever(item)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/16"
                        >
                          <Trash2 size={16} />
                          Apagar geral
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
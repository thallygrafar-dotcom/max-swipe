import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import PlanModal from "@/components/PlanModal";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
  setMessage("E-mail ou senha incorretos.");
  return;
}

      const { data: userData } = await supabase.auth.getUser();
const userEmail = userData.user?.email;

if (!userEmail) {
  setMessage("Não foi possível identificar seu e-mail.");
  return;
}

const { data: subscription, error: subscriptionError } = await supabase
  .from("swipemax_subscriptions")
  .select("status, access_expires_at")
  .eq("email", userEmail)
  .maybeSingle();

if (subscriptionError) {
  setMessage("Erro ao validar seu acesso.");
  return;
}

const hasAccess =
  subscription &&
  subscription.status === "active" &&
  new Date(subscription.access_expires_at) > new Date();

if (!hasAccess) {
  setMessage("Seu acesso não está ativo. Assine para entrar.");
  return;
}

navigate("/swipe-max");

    } catch (err) {
      console.error(err);
      setMessage("Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Preencha e-mail e senha para criar a conta.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Conta criada com sucesso. Verifique seu e-mail.");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setMessage("");

    if (!email) {
      setMessage("Digite seu e-mail para redefinir a senha.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Enviamos um link de redefinição para seu e-mail.");
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.18),transparent_38%),linear-gradient(180deg,#050505_0%,#000000_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-sm font-bold shadow-[0_10px_30px_rgba(220,38,38,0.28)]">
              S
            </div>

            <span className="text-[24px] font-semibold tracking-tight">
              Swipe<span className="text-red-500">MAX</span>
            </span>
          </div>

          <h1 className="mt-12 text-[52px] font-semibold leading-[1.05] tracking-[-0.05em]">
            Biblioteca de VSLs <span className="text-red-500">Nutra</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-[20px] leading-9 text-zinc-400">
            Tenha acesso a VSLs com transcrição completa que estão gerando
            vendas todos os dias!
          </p>

          <div className="mt-10 space-y-5 text-[18px] text-zinc-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>VSLs reais rodando em escala</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Transcrição completa palavra por palavra</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Atualizado diariamente com novas VSLs</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Ideal para afiliados de alta performance</span>
            </div>
          </div>

<div className="mt-10">
  <button
    type="button"
    onClick={() => setOpenModal(true)}
    className="inline-flex h-[56px] items-center justify-center rounded-full bg-red-600 px-8 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-red-500 shadow-[0_12px_30px_rgba(220,38,38,0.28)]"
  >
    Assinar Agora
  </button>
</div>

        </div>




      {/* MODAL */}
<PlanModal open={openModal} onClose={() => setOpenModal(false)} />

      </div>

      <div className="flex w-full items-center justify-center bg-[#f5f5f5] px-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.14)]">
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold text-black">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Entre para acessar a biblioteca SwipeMAX
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mt-5">
              <label className="text-sm font-medium text-zinc-600">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-[52px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-600">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-[52px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
              />
            </div>

            {message && (
              <p className="mt-4 text-sm text-red-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-[56px] w-full rounded-[999px] bg-red-600 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-red-500 shadow-[0_12px_30px_rgba(220,38,38,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-[15px] font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              Esqueceu sua senha?
            </button>

            <p className="mt-5 text-[15px] text-zinc-500">
              Ainda não tem acesso?{" "}
              <button
  type="button"
  onClick={() => setOpenModal(true)}
  className="font-semibold text-red-600 transition hover:text-red-500"
>
  Assinar Agora
</button>
            </p>

            <p className="mt-8 text-[13px] text-zinc-400">
              © 2026 SwipeMAX. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
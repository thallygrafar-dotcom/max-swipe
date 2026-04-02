import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initRecovery = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setMessage("Link inválido ou expirado.");
            setInitializing(false);
            return;
          }
        }

        setInitializing(false);
      } catch (error) {
        console.error(error);
        setMessage("Erro ao validar o link de redefinição.");
        setInitializing(false);
      }
    };

    initRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Preencha os dois campos.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage("Erro ao redefinir senha.");
        return;
      }

      setMessage("Senha alterada com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
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
            Redefinir sua <span className="text-red-500">senha</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-[20px] leading-9 text-zinc-400">
            Crie uma nova senha segura para continuar acessando a biblioteca
            SwipeMAX.
          </p>

          <div className="mt-10 space-y-5 text-[18px] text-zinc-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Acesse novamente sua conta com segurança</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Defina uma nova senha em poucos segundos</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-red-500" />
              <span>Continue de onde parou no SwipeMAX</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#f5f5f5] px-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.14)]">
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold text-black">
              Redefinir senha
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Digite sua nova senha para voltar a acessar o SwipeMAX
            </p>
          </div>

          {initializing ? (
            <p className="text-sm text-zinc-500">Validando link...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <label className="text-sm font-medium text-zinc-600">
                  Nova senha
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[52px] w-full rounded-xl border border-zinc-300 bg-white px-4 pr-12 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-zinc-600">
                  Confirmar nova senha
                </label>

                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-[52px] w-full rounded-xl border border-zinc-300 bg-white px-4 pr-12 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <p
                  className={`mt-4 text-sm ${
                    message.includes("sucesso")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 h-[56px] w-full rounded-[999px] bg-red-600 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-red-500 shadow-[0_12px_30px_rgba(220,38,38,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
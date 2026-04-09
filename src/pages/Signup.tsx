import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Preencha os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Conta criada com sucesso. Agora faça login.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar conta.");
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
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#f5f5f5] px-6 lg:w-1/2">
        <div className="w-full max-w-xl scale-[0.82] rounded-[30px] bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.14)]">
          <div className="mb-4">
            <h2 className="text-[38px] font-semibold text-black">
              Criar sua conta
            </h2>
            <p className="mt-3 text-[18px] text-zinc-500">
              Preencha os dados abaixo para criar sua conta e acessar a plataforma.
            </p>
            <p className="mt-2 text-[15px] text-red-600 font-medium">
  Use o mesmo e-mail utilizado na compra para liberar seu acesso.
</p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="mt-8">
              <label className="text-[15px] font-medium text-black">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 h-[58px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-[15px] font-medium text-black">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-[58px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="text-[15px] font-medium text-black">
                  Telefone
                </label>
                <input
                  type="text"
                  placeholder="+55"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 h-[58px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-[15px] font-medium text-black">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-[58px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="text-[15px] font-medium text-black">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 h-[58px] w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-black outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-red-500/50"
                />
              </div>
            </div>

            {message && (
              <p className="mt-4 text-sm text-red-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 h-[58px] w-full rounded-[999px] bg-red-600 text-[20px] font-semibold text-white transition-all duration-200 hover:bg-red-500 shadow-[0_12px_30px_rgba(220,38,38,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-[16px] text-zinc-500">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-red-600 transition hover:text-red-500"
            >
              Faça login
            </Link>
          </p>

          <p className="mt-8 text-center text-[14px] text-zinc-400">
            © 2026 SwipeMAX. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
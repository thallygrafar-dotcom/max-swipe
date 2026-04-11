import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import SwipeHeader from "@/components/SwipeHeader";
import SwipeFooter from "@/components/SwipeFooter";
import {
  Crown,
  Lock,
  LayoutTemplate,
  FileText,
  Wand2,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

type UserPlan = "monthly" | "annual";

export default function Ferramentas() {
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan>("monthly");
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isAnnual = userPlan === "annual";

  useEffect(() => {
    async function loadUserPlan() {
      setLoadingPlan(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Erro ao buscar usuário autenticado:", authError);
        setUserPlan("monthly");
        setLoadingPlan(false);
        return;
      }

      if (!user) {
        setUserPlan("monthly");
        setLoadingPlan(false);
        return;
      }

      const { data, error } = await supabase
        .from("swipemax_subscriptions")
        .select("status, plan_type, access_expires_at")
        .eq("email", user.email?.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar plano do usuário:", error);
        setUserPlan("monthly");
        setLoadingPlan(false);
        return;
      }

      const hasAccess =
        !!data?.access_expires_at &&
        new Date(data.access_expires_at).getTime() > Date.now();

      if (hasAccess) {
        setUserPlan(data?.plan_type === "annual" ? "annual" : "monthly");
      } else {
        setUserPlan("monthly");
      }

      setLoadingPlan(false);
    }

    loadUserPlan();
  }, []);

  function openPricingModal() {
    setShowPricingModal(true);
  }

  function closePricingModal() {
    setShowPricingModal(false);
  }

  function handlePremiumRoute(route: string) {
    if (!isAnnual) {
      openPricingModal();
      return;
    }

    navigate(route);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[#0b0b10] text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_24%),radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.04),transparent_22%)]" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[320px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="fixed inset-x-0 top-0 z-50">
          <SwipeHeader />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-8 pt-24 md:px-6 md:pt-28">
          <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.92)_0%,rgba(13,13,18,0.96)_100%)] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.26)] md:px-8 md:py-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.08),transparent_18%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[820px]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-200">
                    <Crown className="h-3.5 w-3.5 text-red-300" />
                    Ferramentas Premium
                  </div>

                  <h1 className="mt-4 text-[34px] font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-[48px]">
                    Builders prontos para editar
                  </h1>

                  <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-zinc-400 md:text-[16px]">
                    Abra a estrutura, altere as informações e trabalhe dentro de
                    um layout mais limpo e organizado.
                  </p>
                </div>

                
              </div>
            </section>

            {loadingPlan ? (
              <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,26,0.94)_0%,rgba(12,12,16,0.94)_100%)] px-6 py-14 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <p className="text-lg font-medium text-white">Carregando...</p>
              </section>
            ) : (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <ToolCard
                  title="Página Advertorial"
                  description="Edite títulos, blocos e seções da página com uma estrutura já organizada."
                  icon={<FileText className="h-5 w-5" />}
                  isAnnual={isAnnual}
                  onClick={() => handlePremiumRoute("/pagina-advertorial")}
                />

                <ToolCard
                  title="VSL Builder"
                  description="Monte e ajuste a estrutura da VSL em um builder visual e mais limpo."
                  icon={<Wand2 className="h-5 w-5" />}
                  isAnnual={isAnnual}
                  onClick={() => handlePremiumRoute("/vsl-builder")}
                />

                <ToolCard
                  title="DTC Builder"
                  description="Abra uma base pronta para editar sua página direta com mais rapidez."
                  icon={<LayoutTemplate className="h-5 w-5" />}
                  isAnnual={isAnnual}
                  onClick={() => handlePremiumRoute("/dtc")}
                />
              </section>
            )}
          </div>
        </div>
      </div>

      <SwipeFooter />

      {showPricingModal ? <PricingModal onClose={closePricingModal} /> : null}
    </>
  );
}

function ToolCard({
  title,
  description,
  icon,
  isAnnual,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  isAnnual: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(21,21,27,0.96)_0%,rgba(13,13,18,0.98)_100%)] p-5 text-left shadow-[0_16px_34px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-[0_24px_54px_rgba(0,0,0,0.22)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.05),transparent_22%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent transition-all duration-300 group-hover:via-red-400/30" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/[0.08] text-red-300">
            {icon}
          </div>

          <div
            className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[11px] font-semibold ${
              isAnnual
                ? "border-emerald-400/20 bg-emerald-400/[0.10] text-emerald-200"
                : "border-amber-400/20 bg-amber-400/[0.10] text-amber-200"
            }`}
          >
            {isAnnual ? (
              <>
                <Crown className="h-3.5 w-3.5" />
                Liberado
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Premium
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-[28px] font-semibold leading-[1] tracking-[-0.05em] text-white">
            {title}
          </h2>

          <p className="mt-4 text-[14px] leading-7 text-zinc-400">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <div
            className={`inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border px-4 text-[14px] font-semibold transition-all duration-300 ${
              isAnnual
                ? "border-red-500/30 bg-red-500/10 text-white hover:border-red-500/50 hover:bg-red-500/16"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/15 hover:bg-white/[0.06]"
            }`}
          >
            {isAnnual ? (
              <>
                Acessar ferramenta
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver planos
                <Lock className="h-4 w-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function PricingModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.98)_0%,rgba(13,13,18,1)_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_28%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">
            <Crown className="h-3.5 w-3.5" />
            Recurso Premium
          </div>

          <h3 className="mt-4 text-[30px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
            Libere o plano anual
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-zinc-400">
            Tenha acesso à página de Ferramentas Premium, Advertorial, DTC
            Builder, VSL Builder e aos recursos exclusivos da plataforma.
          </p>

          <div className="mt-6 rounded-[24px] border border-red-500/20 bg-red-500/[0.07] p-5">
            <div className="flex items-end gap-2">
              <span className="text-[14px] text-zinc-400">12x de</span>
              <span className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-white">
                R$154,82
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Acesso anual ao SwipeMAX + Ferramentas Premium.
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              Página Advertorial
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              VSL Builder
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              DTC Builder
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              window.open(
                "https://pay.kiwify.com.br/re3AP8o",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 text-[14px] font-semibold text-white transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/16"
          >
            <Crown className="h-4 w-4" />
            Quero o plano anual
          </button>
        </div>
      </div>
    </div>
  );
}
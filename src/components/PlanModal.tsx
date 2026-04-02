import { CheckCircle2, Sparkles, X } from "lucide-react";

type PlanModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function PlanModal({ open, onClose }: PlanModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-3 backdrop-blur-md">
<div className="relative w-full max-w-[980px] scale-[0.75] origin-center overflow-hidden rounded-[28px] border border-white/10 bg-[#070709] shadow-[0_24px_80px_rgba(0,0,0,0.72)]">        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.10),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.06),transparent_24%),linear-gradient(180deg,#070709_0%,#0b0b10_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 px-5 pb-5 pt-6 md:px-7 md:pb-6 md:pt-7">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-emerald-400/15 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-medium text-emerald-300 md:text-xs">
              Acesso imediato após confirmação de pagamento
            </div>

            <h2 className="mt-4 text-[42px] font-semibold leading-[0.95] tracking-[-0.05em] text-white md:text-[56px]">
              Escolha o plano ideal
              <br className="hidden sm:block" /> para acessar o SwipeMAX
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-[15px]">
              Tenha acesso à biblioteca de VSLs escaladas, traduções completas
              para estudo e tudo organizado em um só lugar.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {/* CARD MENSAL */}
            <div className="flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
              <div className="text-center">
               

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[42px]">
                  Mensal
                </h3>

                <div className="mt-4">
                  <div className="text-5xl font-semibold tracking-[-0.05em] text-white md:text-[60px]">
                    R$ 147,00
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-400 md:text-base">
                    por mês
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <ul className="space-y-2.5 text-[14px] leading-6 text-zinc-200 md:text-[15px]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
                  <span>Biblioteca de VSLs escaladas</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
                  <span>Atualizações frequentes de novas VSLs</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
                  <span>Traduções completas para estudos</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
                  <span>Tudo organizado em um só acesso</span>
                </li>
              </ul>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "https://pay.kiwify.com.br/JYKhhPI";
                  }}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/10 md:text-base"
                >
                  Assinar Agora
                </button>
              </div>
            </div>

            {/* CARD ANUAL */}
            <div className="relative flex h-full flex-col rounded-[22px] border border-red-500/20 bg-[linear-gradient(180deg,rgba(127,29,29,0.24)_0%,rgba(255,255,255,0.03)_24%,rgba(255,255,255,0.03)_100%)] p-5 shadow-[0_0_0_1px_rgba(239,68,68,0.05),0_24px_70px_rgba(0,0,0,0.42)] md:p-6">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 px-4 py-1.5 text-[11px] font-semibold text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] md:text-xs">
                Melhor custo-benefício
              </div>

              <div className="text-center">
                

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[42px]">
                  Anual
                </h3>

                <div className="mt-4 flex items-end justify-center gap-2 leading-none">
                  
                  <span className="text-5xl font-semibold tracking-[-0.06em] text-emerald-400 md:text-[64px]">
                    1.497,00
                  </span>
                </div>

                <p className="mt-2.5 text-lg text-zinc-300 md:text-[22px]">
                  ou em até 12x
                </p>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <ul className="space-y-2.5 text-[14px] leading-6 text-zinc-100 md:text-[15px]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400" />
                  <span>Biblioteca de VSLs escaladas</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400" />
                  <span>Atualizações frequentes de novas VSLs</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400" />
                  <span>Traduções completas para estudos</span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-400" />
                  <span>Tudo organizado em um só acesso</span>
                </li>
              </ul>

              <div className="mt-4 rounded-[16px] border border-amber-300/12 bg-amber-300/8 p-3.5">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-[14px] font-semibold leading-6 text-white md:text-[15px]">
                      Acesso exclusivo a ofertas com CPA de mais de $180 por
                      venda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "https://pay.kiwify.com.br/re3AP8o";
                  }}
                  className="w-full rounded-full bg-red-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_35px_rgba(220,38,38,0.28)] transition hover:bg-red-500 md:text-base"
                >
                  Escolher Plano
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
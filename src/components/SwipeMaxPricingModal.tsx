import { X, Crown, Check } from "lucide-react";

type SwipeMaxPricingModalProps = {
  onClose: () => void;
};

export default function SwipeMaxPricingModal({
  onClose,
}: SwipeMaxPricingModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.98)_0%,rgba(13,13,18,1)_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_28%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200">
            <Crown className="h-3.5 w-3.5" />
            Recurso Premium
          </div>

          <h3 className="mt-4 pr-12 text-[30px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
            Libere o Plano Anual
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-zinc-400">
            Desbloqueie o RadarPage, os Builders Premium e a Estrutura Invisível que revela como cada VSL foi construída.
          </p>

          <div className="mt-6 rounded-[24px] border border-red-500/20 bg-red-500/[0.07] p-5">
            <div className="flex items-end gap-2">
              <span className="text-[14px] text-zinc-400">12x de</span>
              <span className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-white">
                R$154,82
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">
              Acesso anual ao SwipeMAX + RadarPage + Ferramentas Premium.
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              Estrutura Invisível da VSL
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              Ferramentas Premium
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              RadarPage
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-300" />
              Ofertas CPA de Elite ($180+)
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
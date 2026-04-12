import { X, Sparkles, Crown } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function SwipeMaxInvisibleModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,28,0.98)_0%,rgba(13,13,18,1)_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fundo premium */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_25%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.05),transparent_30%)]" />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition-all hover:bg-white/[0.08]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-200">
            <Sparkles className="h-3.5 w-3.5" />
            Em breve
          </div>

          {/* Título */}
          <h3 className="mt-4 pr-10 text-[28px] font-semibold leading-[1.05] tracking-[-0.05em] text-white">
            Estrutura Invisível
          </h3>

          {/* Texto */}
          <p className="mt-3 text-[15px] leading-7 text-zinc-400">
            Estamos finalizando essa funcionalidade para você acessar a estrutura completa das VSLs.
          </p>

          <p className="mt-3 text-[14px] text-zinc-500">
            👉 Esse recurso será exclusivo para usuários do plano anual.
          </p>

          {/* Botão */}
          <button
            onClick={() =>
              window.open(
                "https://pay.kiwify.com.br/re3AP8o",
                "_blank"
              )
            }
            className="mt-6 inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 text-[14px] font-semibold text-yellow-100 transition-all hover:bg-yellow-400/20"
          >
            <Crown className="h-4 w-4" />
            Quero acesso antecipado
          </button>
        </div>
      </div>
    </div>
  );
}
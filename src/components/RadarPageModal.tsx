import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function RadarPageModal() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      setOpen(false);
    }, 220);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-[3px] transition-all duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-[430px] rounded-[28px] border border-white/10 bg-[#071019] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.55)] transition-all duration-200 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.98] opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-transparent via-[#ff2b2b] to-transparent" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="pr-10">
          
          <span className="inline-flex rounded-full border border-[#ff2b2b]/25 bg-[#ff2b2b]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6b6b]">
  Plano anual
</span>

<h2 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-[30px]">
  RadarPage
</h2>

<p className="mt-3 text-sm leading-6 text-white/72 sm:text-[15px]">
  Em breve no plano anual: acesso ao RadarPage com páginas reais que
  estão rodando no Google Ads para inspiração de estrutura, copy e
  construção.
</p>

<p className="mt-3 text-sm leading-6 text-white/50">
  Não são páginas criadas por nós. É uma curadoria visual para analisar
  com mais visão o que está no ar no mercado.
</p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#ff2b2b] px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
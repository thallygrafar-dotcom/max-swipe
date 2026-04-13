import { useEffect, useState } from "react";

const GROUP_LINK =
  "https://chat.whatsapp.com/LvLMCEq0pueCccsecnkUPH?mode=gi_t";

export default function RadarMaxWidget() {
  const [open, setOpen] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const scrollPercent = scrollTop / docHeight;

      if (scrollPercent >= 0.1 && open) {
        setOpen(false);

        window.setTimeout(() => {
          setHidden(true);
        }, 280);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end sm:bottom-5 sm:right-5">
      {!hidden && (
        <div
          className={[
            "mb-2 w-[250px] rounded-[20px] border border-red-500/25 bg-[#090909]/95 p-3",
            "shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_14px_38px_rgba(0,0,0,0.48)] backdrop-blur-xl",
            "transition-all duration-300 ease-out sm:mb-3 sm:w-[280px] sm:rounded-[22px] sm:p-3.5",
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0",
          ].join(" ")}
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22c55e] shadow-[0_0_22px_rgba(34,197,94,0.30)] sm:h-11 sm:w-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-white sm:h-5.5 sm:w-5.5"
              >
                <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.41 0 .05 5.36.05 12c0 2.11.55 4.17 1.6 5.99L0 24l6.17-1.61a11.94 11.94 0 0 0 5.88 1.5h.01c6.63 0 11.99-5.36 11.99-11.99 0-3.2-1.25-6.2-3.53-8.42ZM12.06 21.7c-1.8 0-3.56-.48-5.1-1.39l-.36-.21-3.66.96.98-3.57-.24-.37a9.84 9.84 0 0 1-1.5-5.24c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.91 9.9Zm5.45-7.41c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.77-1.68-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.08 3.18 5.03 4.46.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-none text-white sm:text-[15px]">
                Radar <span className="text-red-500">MAX</span>
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#19d38a]" />
                <span className="text-[12px] text-[#19d38a] sm:text-[13px]">
                  Online agora
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-[1.45] text-white/70 sm:mt-3.5 sm:text-[14px]">
                🚨 Entre no grupo do RadarMAX e receba alertas das VSLs que
                estão escalando.
              </p>

              <div className="mt-3 h-px w-full bg-white/10 sm:mt-3.5" />

              <a
                href={GROUP_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1ee3a1] transition hover:opacity-80 sm:mt-3.5 sm:text-[14px]"
              >
                Entrar no Radar
                <span className="text-[16px]">›</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <a
        href={GROUP_LINK}
        target="_blank"
        rel="noreferrer"
        className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#22c55e] shadow-[0_0_0_8px_rgba(34,197,94,0.12),0_0_26px_rgba(34,197,94,0.32)] transition hover:scale-[1.03] sm:h-[64px] sm:w-[64px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 text-white sm:h-8 sm:w-8"
        >
          <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.41 0 .05 5.36.05 12c0 2.11.55 4.17 1.6 5.99L0 24l6.17-1.61a11.94 11.94 0 0 0 5.88 1.5h.01c6.63 0 11.99-5.36 11.99-11.99 0-3.2-1.25-6.2-3.53-8.42ZM12.06 21.7c-1.8 0-3.56-.48-5.1-1.39l-.36-.21-3.66.96.98-3.57-.24-.37a9.84 9.84 0 0 1-1.5-5.24c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.91 9.9Zm5.45-7.41c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.77-1.68-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.08 3.18 5.03 4.46.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.07-.12-.27-.2-.57-.35Z" />
        </svg>

        <span className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4b4b] text-[12px] font-semibold text-white sm:h-6.5 sm:w-6.5 sm:text-[13px]">
          1
        </span>
      </a>
    </div>
  );
}
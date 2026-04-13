import { Info, Flame, ChevronRight } from "lucide-react";

export type HeaderNotification = {
  id: string | number;
  title: string;
  description: string;
  read: boolean;
  type?: "info" | "hot";
};

interface Props {
  notifications: HeaderNotification[];
  onMarkAsRead: (notification: HeaderNotification) => void;
}

const NotificationsPanel = ({ notifications, onMarkAsRead }: Props) => {
  return (
    <>
      <style>{`
        .notifications-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.16) transparent;
        }

        .notifications-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .notifications-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .notifications-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.14);
          border-radius: 999px;
        }

        .notifications-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.24);
        }
      `}</style>

      <div className="absolute right-0 top-[calc(100%+14px)] z-[80] w-[400px] overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,10,22,0.96)] shadow-[0_30px_100px_rgba(0,0,0,0.62)] backdrop-blur-[28px] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,70,70,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_34%)]" />

        <div className="relative border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                Notificações
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Atualizações e avisos importantes
              </p>
            </div>

            <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-2 text-[11px] font-semibold text-zinc-300">
              {notifications.length}
            </div>
          </div>
        </div>

        <div className="notifications-scroll relative max-h-[430px] overflow-y-auto overflow-x-hidden p-3">
          {notifications.length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center">
              <p className="text-sm font-medium text-zinc-300">
                Nenhuma notificação
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Quando houver novidades, elas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((item, i) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={`group animate-in fade-in slide-in-from-right-4 duration-300 rounded-[22px] border px-4 py-4 transition-all ${
                    !item.read
                      ? "border-white/10 bg-white/[0.045] hover:bg-white/[0.06]"
                      : "border-white/6 bg-white/[0.025] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                        item.type === "hot"
                          ? "border-orange-400/20 bg-orange-400/10 text-orange-300"
                          : "border-sky-400/20 bg-sky-400/10 text-sky-300"
                      }`}
                    >
                      {item.type === "hot" ? (
                        <Flame className="h-4.5 w-4.5" />
                      ) : (
                        <Info className="h-4.5 w-4.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate pr-2 text-[15px] font-semibold tracking-[-0.02em] text-white">
                          {item.title}
                        </p>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            !item.read
                              ? "border-red-500/20 bg-red-500/10 text-red-300"
                              : "border-white/10 bg-white/[0.04] text-zinc-400"
                          }`}
                        >
                          {!item.read ? "Nova" : "Lida"}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-zinc-400">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-zinc-500">
                          {!item.read ? "Ainda não visualizada" : "Já visualizada"}
                        </span>

                        <button
                          type="button"
                          onClick={() => onMarkAsRead(item)}
                          className="group/btn inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-zinc-200 transition-all hover:border-red-500/25 hover:bg-red-500/10 hover:text-white"
                        >
                          Ver mais
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
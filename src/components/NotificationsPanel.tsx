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
          scrollbar-color: rgba(255,255,255,0.18) transparent;
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
          background: rgba(255,255,255,0.28);
        }
      `}</style>

      <div className="absolute right-0 top-[calc(100%+12px)] z-[80] w-[380px] overflow-hidden rounded-[26px] border border-white/10 bg-[#070A16] shadow-[0_30px_90px_rgba(0,0,0,0.62)] animate-in fade-in slide-in-from-top-2 duration-200">

        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-[18px] font-semibold text-white">
            Notificações
          </p>
        </div>

        <div className="notifications-scroll max-h-[420px] overflow-y-auto overflow-x-hidden">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-zinc-400">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map((item, i) => (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-in fade-in slide-in-from-right-4 duration-300 border-b border-white/5 px-5 py-4 transition-all hover:bg-white/[0.03] ${
                  !item.read ? "bg-white/[0.02]" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/[0.05]">
                    {item.type === "hot" ? (
                      <Flame className="text-orange-400" />
                    ) : (
                      <Info className="text-sky-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {item.title}
                    </p>

                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-zinc-500">
                        {!item.read ? "Não lida" : "Lida"}
                      </span>

                      <button
                        onClick={() => onMarkAsRead(item)}
                        className="group flex items-center gap-1 text-xs text-red-400"
                      >
                        Ver mais
                        <ChevronRight className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import NotificationsPanel, {
  type HeaderNotification,
} from "@/components/NotificationsPanel";

const HeaderNotifications = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] =
    useState<HeaderNotification | null>(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  const fetchNotifications = useCallback(async () => {
    const sb = supabase as any;

    const { data } = await sb
      .from("notifications")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setNotifications((data as HeaderNotification[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const sb = supabase as any;

    const channel = sb
      .channel("notifications-realtime-header")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (notification: HeaderNotification) => {
    const sb = supabase as any;

    await sb.from("notifications").update({ read: true }).eq("id", notification.id);

    const updated = { ...notification, read: true };

    setNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? updated : item))
    );

    setSelectedNotification(updated);
    setOpen(false);
  };

  const handleCloseSelectedNotification = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <div className="relative hidden md:block" ref={wrapperRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="group relative flex h-11 w-11 items-center justify-center rounded-[20px] border border-white/10 bg-[#0B1020] text-zinc-300 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.05] hover:border-white/15 hover:bg-[#11182C] hover:text-white"
        >
          <Bell
            size={18}
            className="transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
          />

          {!loading && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-[0_0_18px_rgba(239,68,68,0.65)]">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <NotificationsPanel
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        )}
      </div>

      {selectedNotification && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[6px] animate-in fade-in duration-200">
          <button
            type="button"
            aria-label="Fechar modal"
            onClick={handleCloseSelectedNotification}
            className="absolute inset-0"
          />

          <div className="relative w-full max-w-[540px] overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(7,10,22,0.96)] shadow-[0_40px_120px_rgba(0,0,0,0.7)] backdrop-blur-[30px] animate-in zoom-in-95 duration-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,70,70,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_35%)]" />

            <div className="relative border-b border-white/10 px-6 py-5">
              <button
                onClick={handleCloseSelectedNotification}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="pr-12">
                <div className="mb-3 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                  Notificação
                </div>

                <p className="text-[20px] font-semibold leading-tight tracking-[-0.03em] text-white">
                  {selectedNotification.title}
                </p>

                <div className="mt-3 h-[2px] w-12 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
              </div>
            </div>

            <div className="relative px-6 py-6">
              <p className="whitespace-pre-line text-[14px] leading-7 text-zinc-300">
                {selectedNotification.description}
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseSelectedNotification}
                  className="inline-flex h-11 items-center justify-center rounded-[16px] border border-red-500/30 bg-red-500/10 px-5 text-sm font-semibold text-white transition hover:border-red-500/50 hover:bg-red-500/20"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNotifications;
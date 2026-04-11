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

  const handleMarkAsRead = async (notification: HeaderNotification) => {
    const sb = supabase as any;

    await sb
      .from("notifications")
      .update({ read: true })
      .eq("id", notification.id);

    const updated = { ...notification, read: true };

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? updated : item
      )
    );

    setSelectedNotification(updated);
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="animate-in zoom-in-95 duration-200 w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[#070A16] shadow-[0_30px_90px_rgba(0,0,0,0.62)]">
            <div className="relative border-b border-white/10 px-6 py-5">
              <button
                onClick={() => setSelectedNotification(null)}
                className="absolute right-4 top-4"
              >
                <X />
              </button>

              <p className="text-xl font-semibold text-white">
                {selectedNotification.title}
              </p>
            </div>

            <div className="px-6 py-5 text-zinc-300">
              {selectedNotification.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNotifications;
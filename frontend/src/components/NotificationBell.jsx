import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { notifications as notifApi } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await notifApi.list();
      setItems(data.results || data);
      setError("");
    } catch {
      setError("Notifications are temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const markAll = async () => {
    try {
      await notifApi.markAllRead();
      await load();
    } catch {
      setError("We couldn't mark notifications as read. Please try again.");
    }
  };

  const openNotification = async (notification) => {
    try {
      if (!notification.is_read) await notifApi.markRead(notification.id);
    } catch {
      setError("We couldn't update that notification.");
    }
    setOpen(false);
    const message = notification.message.toLowerCase();
    const section = message.includes("blood") || message.includes("donat") ? "blood"
      : message.includes("food") || message.includes("rescued") ? "food"
        : message.includes("emergency") ? "emergency" : "resources";
    navigate(`/app/${section}`);
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        className={`interactive-control relative rounded-full p-2 text-ink-soft hover:bg-primary-50 hover:text-primary-700 ${unreadCount ? "notification-pulse" : ""}`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-urgent-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-line bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-display text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button type="button" onClick={markAll} className="interactive-control text-xs font-medium text-primary-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {error && <p className="border-b border-line px-4 py-2 text-xs text-urgent-600">{error}</p>}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-ink-soft">Loading notifications…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-soft">You're all caught up.</p>
            ) : (
              items.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNotification(n)}
                  type="button"
                  className={`interactive-control block w-full border-b border-line px-4 py-3 text-left text-sm last:border-0 hover:bg-primary-50 ${!n.is_read ? "bg-primary-50/50" : ""}`}
                >
                  <p className="text-ink">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-soft">{new Date(n.created_at).toLocaleString()}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, IndianRupee, CalendarCheck, Ban } from 'lucide-react';

const ICONS = {
  booked: { Icon: CalendarCheck, cls: 'bg-[#149B8B]/10 text-[#149B8B]' },
  bid: { Icon: IndianRupee, cls: 'bg-amber-50 text-amber-600' },
  accepted: { Icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-600' },
  cancelled: { Icon: Ban, cls: 'bg-rose-50 text-rose-600' }
};

const ago = (iso) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso)) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString();
};

// Bell with unread badge. "Read" = seen after the last time this user opened the list
// (remembered per user in the browser).
export const NotificationBell = ({ notifications = [], storageKey, onOpenItem }) => {
  const [open, setOpen] = useState(false);
  const [seenAt, setSeenAt] = useState(() => {
    try { return localStorage.getItem(storageKey) || ''; } catch { return ''; }
  });
  const boxRef = useRef(null);

  const unread = notifications.filter((n) => !seenAt || n.at > seenAt).length;

  // Pop-up: show the newest unread notification once, as soon as it arrives
  const [toast, setToast] = useState(null);
  const latest = notifications[0];
  useEffect(() => {
    if (!latest || (seenAt && latest.at <= seenAt)) return;
    const key = `${storageKey}_toasted`;
    let shown = '';
    try { shown = sessionStorage.getItem(key) || ''; } catch { /* ignore */ }
    if (shown === latest.id) return;
    try { sessionStorage.setItem(key, latest.id); } catch { /* ignore */ }
    setToast(latest);
    const timer = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(timer);
  }, [latest?.id]);

  // close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && notifications.length) {
      // mark everything as read once the list has been shown
      const latest = notifications[0].at;
      setTimeout(() => {
        setSeenAt(latest);
        try { localStorage.setItem(storageKey, latest); } catch { /* ignore */ }
      }, 1500);
    }
  };

  const toastIcon = toast ? (ICONS[toast.type] || ICONS.bid) : null;

  return (
    <div className="relative" ref={boxRef}>
      {toast && (
        <div className="fixed top-24 right-4 z-[60] w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border-2 border-[#149B8B]/40 shadow-2xl p-4 flex items-start gap-3 animate-in fade-in">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toastIcon.cls}`}>
            <toastIcon.Icon className="w-4 h-4" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-black text-[#149B8B]">New notification</div>
            <p className="text-xs font-bold text-slate-900 leading-snug mt-0.5">{toast.text}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => { const n = toast; setToast(null); if (onOpenItem) onOpenItem(n); }}
                className="px-3 py-1.5 rounded-lg bg-[#0A2540] text-white text-[11px] font-bold"
              >
                View
              </button>
              <button onClick={() => setToast(null)} className="text-[11px] font-bold text-slate-500 hover:text-slate-700">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggle}
        title="Notifications"
        aria-label="Notifications"
        className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
          open ? 'border-[#149B8B] bg-[#149B8B]/10 text-[#149B8B]' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-[#0A2540]'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="font-display font-bold text-slate-900">Notifications</span>
            {unread > 0 && <span className="text-[11px] font-bold text-rose-600">{unread} new</span>}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-xs text-slate-400">No notifications yet.</p>
            ) : (
              notifications.slice(0, 30).map((n) => {
                const { Icon, cls } = ICONS[n.type] || ICONS.bid;
                const isNew = !seenAt || n.at > seenAt;
                return (
                  <button
                    key={n.id}
                    onClick={() => { setOpen(false); if (onOpenItem) onOpenItem(n); }}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors ${isNew ? 'bg-[#149B8B]/5' : ''}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cls}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-xs leading-snug ${isNew ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{n.text}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{ago(n.at)}</span>
                    </span>
                    {isNew && <span className="w-2 h-2 rounded-full bg-[#149B8B] mt-1.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

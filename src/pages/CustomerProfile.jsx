import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, ShieldCheck, LogOut, Briefcase, FileText } from 'lucide-react';

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-9 h-9 rounded-xl bg-[#149B8B]/10 text-[#149B8B] flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-slate-900 break-words">{value || '—'}</div>
    </div>
  </div>
);

// Profile page opened from the navbar's profile icon: shows the user's details and lets them log out.
export const CustomerProfile = ({ user, bookingsCount = 0, onLogout }) => {
  if (!user) return null;

  const isEmail = (v) => typeof v === 'string' && v.includes('@');
  const phone = user.phone && !isEmail(user.phone) ? user.phone : null;
  const email = user.email || (isEmail(user.phone) ? user.phone : null);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const initial = (user.name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm p-6 sm:p-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#0A2540] text-white text-3xl font-bold flex items-center justify-center shrink-0 border-4 border-[#149B8B]/30">
          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initial}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0A2540] truncate">{user.name || 'My profile'}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#149B8B]/10 text-[#149B8B] text-xs font-bold capitalize">
              {user.role || 'customer'}
            </span>
            {user.isVerified && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm px-6 sm:px-8 py-2 divide-y divide-slate-100">
        <Row icon={User} label="Full name" value={user.name} />
        <Row icon={Phone} label="Phone" value={phone} />
        <Row icon={Mail} label="Email" value={email} />
        <Row icon={MapPin} label="Area" value={user.locality} />
        {user.role === 'worker' && <Row icon={Briefcase} label="Trade" value={user.tradeLabel || user.trade} />}
        {(user.documentName || user.govtIdDocument) && (
          <Row icon={FileText} label="ID document" value={user.documentName || user.govtIdDocument} />
        )}
        <Row icon={Calendar} label="Bookings" value={String(bookingsCount)} />
        {memberSince && <Row icon={Calendar} label="Member since" value={memberSince} />}
      </div>

      {/* Log out */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Log out</span>
      </button>
    </div>
  );
};

export default CustomerProfile;

import React, { useMemo, useState } from "react";
import { ArrowLeft, PhoneCall, Clock, MapPin, IndianRupee, Navigation, Hash, CheckCircle2, User, KeyRound, X, AlertTriangle } from "lucide-react";
import { verifyBookingOtp, updateBookingStatus, workerCancelBooking } from "../services/db";
import { NearbyWorkersMap, CUSTOMER_LOCATION, distanceKm } from './NearbyWorkersMap';
import { BookingChat } from '../pages/BookingDetailPage';
import { WORKERS_DATABASE } from '../data/mockData';

const STATUS = {
  en_route: { label: 'On the way', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Scheduled', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: { label: 'Work in progress', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-xl bg-[#149B8B]/10 text-[#149B8B] flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-slate-900 break-words">{value || '—'}</div>
    </div>
  </div>
);

// Worker's view of one accepted order: live map to the customer, details and chat.
export const WorkerOrderDetail = ({ order, onBack, onUpdated }) => {
  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const done = () => { if (onUpdated) onUpdated(); };
  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 4) { setOtpMsg({ ok: false, text: "Enter the 4-digit OTP from the customer." }); return; }
    const res = verifyBookingOtp(order.id, otp);
    setOtpMsg(res.success ? { ok: true, text: "OTP verified. You can start the work." } : { ok: false, text: res.error });
    if (res.success) { setOtp(""); done(); }
  };
  const worker = useMemo(() => {
    const w = order?.worker || {};
    const fromDb = WORKERS_DATABASE.find((x) => String(x.id) === String(w.id)) || {};
    return {
      ...fromDb,
      ...w,
      id: w.id ?? fromDb.id ?? 'worker',
      lat: w.lat ?? fromDb.lat ?? CUSTOMER_LOCATION[0] + 0.012,
      lng: w.lng ?? fromDb.lng ?? CUSTOMER_LOCATION[1] + 0.01,
      photo: w.photo || fromDb.photo
    };
  }, [order?.id, order?.worker?.id]);
  const mapWorkers = useMemo(() => [worker], [worker]);

  if (!order) return null;
  const status = STATUS[order.status] || STATUS.en_route;
  const isClosed = order.status === 'completed' || order.status === 'cancelled';
  const km = distanceKm([worker.lat, worker.lng], CUSTOMER_LOCATION).toFixed(1);
  const customerFirst = (order.customerName || 'Customer').split(' ')[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0A2540]">
          <ArrowLeft className="w-4 h-4" /> Active Orders
        </button>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${status.cls}`}>{status.label}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0A2540]">{order.title}</h1>

      {/* Live map: you and the customer's location */}
      <NearbyWorkersMap
        workers={mapWorkers}
        highlightIds={[worker.id]}
        height={380}
        live={!isClosed}
        label={`You → ${customerFirst} • ${km} km • Live`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center text-2xl font-display font-black">
              {customerFirst.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-lg text-slate-900 truncate">{order.customerName || 'Customer'}</h3>
              <p className="text-xs text-slate-500 truncate">{order.customerPhone || 'Phone hidden'}</p>
            </div>
            {order.customerPhone && (
              <a href={`tel:${order.customerPhone.replace(/[^0-9+]/g, '')}`} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50" title="Call customer">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
              </a>
            )}
          </div>

          {/* Order details */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Detail icon={Navigation} label="Distance" value={`${km} km to customer`} />
            <Detail icon={IndianRupee} label="Agreed price" value={order.quoteAmount != null ? `₹${order.quoteAmount}` : null} />
            <Detail icon={Clock} label="Time" value={[order.timingSlot?.date, order.timingSlot?.timeSlot || order.urgency].filter(Boolean).join(' • ')} />
            <Detail icon={MapPin} label="Address" value={order.address} />
            <Detail icon={User} label="Customer" value={order.customerName} />
            <Detail icon={Hash} label="Order ID" value={order.id} />
            {order.description && (
              <div className="sm:col-span-2">
                <Detail icon={CheckCircle2} label="Job" value={order.description} />
              </div>
            )}
          </div>
          {/* Start OTP: entered at the customer's door */}
          {(order.status === 'en_route' || order.status === 'scheduled') && (
            <form onSubmit={handleVerify} className="bg-amber-50/80 rounded-3xl border-2 border-amber-300 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-700" />
                <h3 className="font-display font-bold text-slate-900">Enter the customer's Start OTP</h3>
              </div>
              <p className="text-xs text-slate-600">Ask {customerFirst} for the 4-digit OTP shown on their booking page when you arrive.</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="----"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 4)); setOtpMsg(null); }}
                  className="w-full sm:w-40 text-center tracking-widest text-2xl font-mono font-black py-2.5 rounded-xl bg-white border-2 border-amber-400 focus:ring-2 focus:ring-[#149B8B]"
                />
                <button type="submit" className="btn-primary text-sm px-6 py-3 shadow-md">Verify OTP & start work</button>
              </div>
              {otpMsg && (
                <p className={`text-xs font-bold ${otpMsg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{otpMsg.text}</p>
              )}
            </form>
          )}

          {order.status === 'in_progress' && (
            <div className="bg-emerald-50 rounded-3xl border-2 border-emerald-300 p-6 space-y-3">
              <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> OTP verified. Work in progress.
              </p>
              <button
                onClick={() => { updateBookingStatus(order.id, 'completed'); done(); }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm"
              >
                Mark job completed
              </button>
            </div>
          )}

          {/* Cancellation */}
          {!isClosed && (
            confirmCancel ? (
              <div className="p-5 rounded-3xl border-2 border-rose-200 bg-rose-50 space-y-3">
                <p className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Cancel this order? {customerFirst} will be notified.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { workerCancelBooking(order.id); setConfirmCancel(false); done(); }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Yes, cancel order
                  </button>
                  <button onClick={() => setConfirmCancel(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs">
                    Keep order
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="w-full py-3.5 rounded-2xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel order
              </button>
            )
          )}
          {order.status === 'cancelled' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">This order was cancelled.</div>
          )}
          {order.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">Job completed.</div>
          )}
        </div>

        {/* Chat with the customer */}
        <div className="lg:col-span-2">
          <BookingChat booking={order} role="worker" disabled={order.status === 'cancelled'} />
        </div>
      </div>
    </div>
  );
};

export default WorkerOrderDetail;

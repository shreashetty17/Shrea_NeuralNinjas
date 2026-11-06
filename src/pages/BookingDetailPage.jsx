import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, PhoneCall, ShieldCheck, Clock, MapPin, KeyRound, IndianRupee,
  Navigation, Send, X, CheckCircle2, AlertTriangle, Hash
} from 'lucide-react';
import { NearbyWorkersMap, CUSTOMER_LOCATION, distanceKm } from '../components/NearbyWorkersMap';
import { WORKERS_DATABASE } from '../data/mockData';
import { getChatMessages, sendChatMessage, updateBookingStatus, proposePrice, customerAgreePrice } from '../services/db';

const STATUS = {
  negotiating: { label: 'Waiting for worker', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  en_route: { label: 'On the way', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Scheduled', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  in_progress: { label: 'Work in progress', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const timeOf = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Chat between customer and the booked worker, saved in Supabase (chat_messages).
export const BookingChat = ({ booking, customer, disabled, role = "customer" }) => {
  const isWorker = role === "worker";
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState([]);
  const [text, setText] = useState('');
  const [workerTyping, setWorkerTyping] = useState(false);
  const endRef = useRef(null);
  const workerFirst = (booking.worker?.name || 'Technician').split(' ')[0];
  const customerFirst = (customer?.name || '').split(' ')[0];

  const refresh = async () => {
    const rows = await getChatMessages(booking.id);
    setMessages(rows);
    return rows;
  };

  // load history and check for new messages every 4 seconds
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [booking.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, pending.length, workerTyping]);

  const post = async (sender, body) => {
    const temp = { id: `tmp_${Date.now()}_${Math.random()}`, sender, text: body, created_at: new Date().toISOString() };
    setPending((p) => [...p, temp]);
    try {
      await sendChatMessage(booking.id, sender, body);
      await refresh();
    } catch (e) {
      console.warn('[KaamSetu] chat send failed:', e.message);
      alert('Message could not be sent. Please check your connection.');
    } finally {
      setPending((p) => p.filter((m) => m.id !== temp.id));
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText('');
    post(role, body);
    if (isWorker) return; // the customer replies themselves

    // demo: the technician replies automatically
    setWorkerTyping(true);
    setTimeout(() => {
      setWorkerTyping(false);
      const replies = [
        `Ji${customerFirst ? ` ${customerFirst} ji` : ''}, almost there! Just turning into your lane now.`,
        'Understood! Bringing the required tools upstairs.',
        `Noted! Please keep the 4-digit OTP ${booking.startOtp || ''} handy to start work.`,
        'Yes, I have reached near the main entrance gate.'
      ];
      post('worker', replies[Math.floor(Math.random() * replies.length)]);
    }, 1600);
  };

  const shown = [...messages, ...pending];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm flex flex-col h-[460px]">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        {isWorker ? (
          <div className="w-10 h-10 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold">{(booking.customerName || "C").charAt(0).toUpperCase()}</div>
        ) : (
          <img src={booking.worker?.photo} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#149B8B]/40" />
        )}
        <div>
          <div className="font-bold text-sm text-slate-900">Chat with {isWorker ? (booking.customerName || "Customer").split(" ")[0] : workerFirst}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">● Online</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-slate-50/60">
        {shown.length === 0 && (
          <p className="text-center text-xs text-slate-400 pt-10">No messages yet. Say hello to {isWorker ? (booking.customerName || "the customer").split(" ")[0] : workerFirst}!</p>
        )}
        {shown.map((m) => {
          const mine = m.sender === role;
          if (m.sender === 'system') {
            return <p key={m.id} className="text-center text-[11px] text-slate-500">{m.text}</p>;
          }
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${mine ? 'bg-[#149B8B] text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'} ${String(m.id).startsWith('tmp_') ? 'opacity-60' : ''}`}>
                <div>{m.text}</div>
                <div className={`text-[10px] mt-0.5 ${mine ? 'text-white/70' : 'text-slate-400'}`}>{timeOf(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        {workerTyping && <p className="text-[11px] text-slate-400 italic">{workerFirst} is typing…</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? 'Chat is closed for this booking' : 'Type a message…'}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#149B8B]/40 disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="p-3 rounded-xl bg-[#149B8B] text-white disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// Price negotiation with the worker, until the worker accepts the order.
const NegotiationPanel = ({ booking, workerName, onUpdated }) => {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const offers = booking.offers || [];
  const workerFirst = (workerName || 'The worker').split(' ')[0];
  const workerTurn = booking.lastOfferBy === 'customer' || booking.customerAgreed;

  const sendPrice = (e) => {
    e.preventDefault();
    const amount = parseInt(price, 10);
    if (!amount || amount <= 0) { setError('Enter a price first.'); return; }
    proposePrice(booking.id, 'customer', amount);
    setPrice('');
    setError('');
    if (onUpdated) onUpdated();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-bolt-sm p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900">Price negotiation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {booking.customerAgreed
              ? `You agreed to ₹${booking.quoteAmount}. Waiting for ${workerFirst} to confirm the order.`
              : workerTurn
              ? `Your offer was sent. Waiting for ${workerFirst} to accept or send a new price.`
              : `${workerFirst} sent a new price. Agree to it or send your own.`}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current price</span>
          <span className="text-2xl font-display font-black text-[#0A2540]">₹{booking.quoteAmount}</span>
        </div>
      </div>

      {offers.length > 0 && (
        <ol className="space-y-2">
          {offers.map((o, i) => (
            <li key={i} className={`flex ${o.by === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <span className={`px-3.5 py-2 rounded-2xl text-xs font-bold ${o.by === 'customer' ? 'bg-[#149B8B] text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                {o.by === 'customer' ? 'You' : workerFirst} offered ₹{o.amount}
                <span className={`ml-2 font-normal ${o.by === 'customer' ? 'text-white/70' : 'text-slate-400'}`}>{timeOf(o.at)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}

      {!workerTurn && (
        <button
          onClick={() => { customerAgreePrice(booking.id); if (onUpdated) onUpdated(); }}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Agree to ₹{booking.quoteAmount}
        </button>
      )}

      <form onSubmit={sendPrice} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-3 border-t border-slate-100">
        <label className="flex-1">
          <span className="text-[11px] font-bold text-slate-600 block mb-1">{workerTurn ? 'Change your offer (₹)' : 'Send your price (₹)'}</span>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setError(''); }}
            placeholder={`e.g. ${Math.max(100, (booking.quoteAmount || 300) - 50)}`}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#149B8B]/40"
          />
        </label>
        <button type="submit" className="px-5 py-3 rounded-xl bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> Send price
        </button>
      </form>
      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    </div>
  );
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

// One booking: live map of its worker, details, chat and cancellation.
export const BookingDetailPage = ({ booking, customer, onBack, onCancelBooking, onBookingUpdated }) => {
  // the worker with a map position (bookings store a snapshot; fall back to the workers table)
  const worker = useMemo(() => {
    const w = booking?.worker || {};
    const fromDb = WORKERS_DATABASE.find((x) => String(x.id) === String(w.id)) || {};
    const lat = w.lat ?? fromDb.lat ?? CUSTOMER_LOCATION[0] + 0.012;
    const lng = w.lng ?? fromDb.lng ?? CUSTOMER_LOCATION[1] + 0.01;
    return { ...fromDb, ...w, id: w.id ?? fromDb.id ?? 'worker', lat, lng, photo: w.photo || fromDb.photo };
  }, [booking?.id, booking?.worker?.id]);
  const mapWorkers = useMemo(() => [worker], [worker]);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <p className="text-slate-600 font-semibold">No booking selected.</p>
        <button onClick={onBack} className="btn-primary text-sm px-5 py-2.5">Go to My Bookings</button>
      </div>
    );
  }

  const status = STATUS[booking.status] || STATUS.en_route;
  const isClosed = booking.status === 'completed' || booking.status === 'cancelled';
  const isNegotiating = booking.status === "negotiating";
  const km = distanceKm([worker.lat, worker.lng], CUSTOMER_LOCATION).toFixed(1);
  const mapLabel = isClosed
    ? `${worker.name?.split(' ')[0] || 'Worker'} • ${status.label}`
    : `${worker.name?.split(' ')[0] || 'Worker'} • ${booking.etaMins ? `${booking.etaMins} mins away` : `${km} km away`} • Live`;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0A2540]">
          <ArrowLeft className="w-4 h-4" /> My Bookings
        </button>
        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${status.cls}`}>{status.label}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0A2540]">{booking.title}</h1>

      {/* Live map: only this worker */}
      <NearbyWorkersMap workers={mapWorkers} highlightIds={[worker.id]} height={380} label={mapLabel} live={!isClosed} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Details */}
        <div className="lg:col-span-3 space-y-6">
          {isNegotiating && <NegotiationPanel booking={booking} workerName={worker.name} onUpdated={onBookingUpdated} />}

          {/* Worker */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm p-5 flex items-center gap-4">
            <img src={worker.photo} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-lg text-slate-900 truncate">{worker.name}</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs font-semibold text-[#149B8B] truncate">{worker.tradeLabel || 'Verified Technician'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">⭐ {worker.rating || '4.9'} • {worker.locality || 'Mumbai'}</p>
            </div>
            {worker.phone && (
              <a href={`tel:${worker.phone.replace(/[^0-9+]/g, '')}`} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50" title="Call worker">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
              </a>
            )}
          </div>

          {/* Booking details */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Detail icon={Navigation} label="Arrival" value={isClosed ? status.label : booking.etaMins ? `${booking.etaMins} mins • ${km} km away` : `${km} km away`} />
            <Detail icon={IndianRupee} label={isNegotiating ? "Current offer" : "Agreed price"} value={booking.quoteAmount != null ? `₹${booking.quoteAmount}` : null} />
            <Detail icon={Clock} label="Time" value={[booking.timingSlot?.date, booking.timingSlot?.timeSlot || booking.urgency].filter(Boolean).join(' • ')} />
            <Detail icon={MapPin} label="Address" value={booking.address} />
            <Detail icon={KeyRound} label="Start OTP (share on arrival)" value={isNegotiating ? "Shown after the worker accepts" : booking.startOtp} />
            <Detail icon={Hash} label="Booking ID" value={booking.id} />
            {booking.description && (
              <div className="sm:col-span-2">
                <Detail icon={CheckCircle2} label="Job" value={booking.description} />
              </div>
            )}
          </div>

          {/* Cancellation */}
          {!isClosed ? (
            <div className={`grid grid-cols-1 ${isNegotiating ? '' : 'sm:grid-cols-2'} gap-3`}>
              {!isNegotiating && (
                <button
                  onClick={() => {
                    updateBookingStatus(booking.id, 'completed');
                    if (onBookingUpdated) onBookingUpdated();
                    alert(`Job marked as completed. Please pay ₹${booking.quoteAmount ?? ''} to ${worker.name || 'the worker'}. Thank you for using KaamSetu!`);
                  }}
                  className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                </button>
              )}
              <button
                onClick={() => onCancelBooking(booking)}
                className="py-3.5 rounded-2xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel booking
              </button>
            </div>
          ) : booking.status === 'completed' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Job completed
            </div>
          ) : booking.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Cancelled • Fee ₹{booking.cancellationFee ?? 0} • Refund ₹{booking.refundAmount ?? 0}
            </div>
          ) : null}
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          <BookingChat booking={booking} customer={customer} disabled={booking.status === 'cancelled'} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;

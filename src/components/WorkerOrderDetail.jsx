import React, { useMemo } from 'react';
import { ArrowLeft, PhoneCall, Clock, MapPin, IndianRupee, Navigation, Hash, CheckCircle2, User } from 'lucide-react';
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
export const WorkerOrderDetail = ({ order, onBack }) => {
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
          <p className="text-xs text-slate-500">
            Ask {customerFirst} for the 4-digit Start OTP when you arrive, and enter it on the order card in Active Orders.
          </p>
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

import React, { useState } from 'react';
import { Send, CheckCircle2, MapPin, Clock, Radio, X, Inbox } from 'lucide-react';
import { proposePrice, customerAcceptOffer, countersLeft, MAX_COUNTERS } from '../services/db';

const timeOf = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// One bid request: the worker's negotiated price, accept or send a new price.
const RequestCard = ({ req, onAccepted, onUpdated, onCancel }) => {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const worker = req.worker || null;
  const workerFirst = (worker?.name || 'Worker').split(' ')[0];
  const left = countersLeft(req, 'customer');
  const workerLeft = countersLeft(req, 'worker');
  const workerPriced = !!worker && req.lastOfferBy === 'worker';
  const offers = req.offers || [];

  const sendPrice = (e) => {
    e.preventDefault();
    const amount = parseInt(price, 10);
    if (!amount || amount < 100) { setError('Enter a price of at least ₹100.'); return; }
    const res = proposePrice(req.id, 'customer', amount);
    if (res?.error) { setError(res.error); return; }
    setPrice('');
    setError('');
    onUpdated();
  };

  const accept = () => {
    const booking = customerAcceptOffer(req.id);
    if (booking) onAccepted(booking);
  };

  return (
    <div className={`bg-white rounded-3xl border shadow-bolt-sm p-6 space-y-5 ${workerPriced ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200/90'}`}>
      {/* Job */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-primary-800 bg-primary-100 px-2.5 py-0.5 rounded-full border border-primary-200">
              {req.categoryName || 'Home Service'}
            </span>
            <span className="text-xs text-slate-400">Request {req.id}</span>
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">{req.title}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.address || '—'}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {req.urgency || 'Today'}</p>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{workerPriced ? `${workerFirst}'s price` : 'Your bid'}</span>
          <span className="text-3xl font-display font-black text-[#0A2540]">₹{req.quoteAmount}</span>
        </div>
      </div>

      {/* Worker */}
      {worker ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <img src={worker.photo} alt={worker.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
          <div className="min-w-0">
            <div className="font-bold text-sm text-slate-900 truncate">{worker.name}</div>
            <div className="text-[11px] text-slate-500">{worker.tradeLabel || 'Verified Technician'} • ⭐ {worker.rating || '4.9'} • {worker.locality || 'Mumbai'}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <Radio className="w-4 h-4 text-[#149B8B] animate-pulse" /> Sent to nearby workers. You will be notified when a worker sends a price.
        </div>
      )}

      {/* Price history */}
      {offers.length > 0 && (
        <ol className="space-y-2">
          {offers.map((o, i) => (
            <li key={i} className={`flex ${o.by === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <span className={`px-3.5 py-2 rounded-2xl text-xs font-bold ${o.by === 'customer' ? 'bg-[#149B8B] text-white' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                {o.by === 'customer' ? (i === 0 ? 'Your bid' : 'You') : workerFirst}: ₹{o.amount}
                <span className={`ml-2 font-normal ${o.by === 'customer' ? 'text-white/70' : 'text-amber-700/70'}`}>{timeOf(o.at)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}

      {worker && (
        <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-600">
          <span className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">Your changes left: {left} of {MAX_COUNTERS}</span>
          <span className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">{workerFirst}'s changes left: {workerLeft} of {MAX_COUNTERS}</span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {workerPriced && (
          <button
            onClick={accept}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Accept offer of ₹{req.quoteAmount}
          </button>
        )}
        {!!worker && !workerPriced && (
          <p className="text-xs font-bold text-slate-500">You sent ₹{req.quoteAmount}. Waiting for {workerFirst} to accept or reply.</p>
        )}

        {left > 0 ? (
          <form onSubmit={sendPrice} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <label className="flex-1">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                {workerPriced ? 'Or negotiate: send your price (₹)' : 'Change your price (₹)'} • {left} of {MAX_COUNTERS} left
              </span>
              <input
                type="number"
                min="100"
                inputMode="numeric"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setError(''); }}
                placeholder={`e.g. ${Math.max(100, (req.quoteAmount || 300) - 50)}`}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#149B8B]/40"
              />
            </label>
            <button type="submit" className="px-5 py-3 rounded-xl bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Send price
            </button>
          </form>
        ) : (
          <p className="text-xs font-bold text-slate-500">You have used all {MAX_COUNTERS} price changes.{workerPriced ? ' Accept the offer or cancel the request.' : ''}</p>
        )}
        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

        <button onClick={() => onCancel(req)} className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> Cancel request
        </button>
      </div>
    </div>
  );
};

// Customer's open bid requests (not yet accepted). Accepted ones move to My Bookings.
export const CustomerMyRequests = ({ requests = [], onAccepted, onUpdated, onCancel, onNewRequest }) => (
  <div className="space-y-6 animate-in fade-in">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#0A2540]">My Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          See the prices workers send for your requests. Accept an offer or negotiate (up to {MAX_COUNTERS} times). Accepted offers move to My Bookings.
        </p>
      </div>
      <button onClick={onNewRequest} className="btn-primary text-xs px-5 py-2.5 self-start sm:self-auto">New request</button>
    </div>

    {requests.length === 0 ? (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-display font-bold text-slate-900">No open requests</h3>
        <p className="text-xs text-slate-500">Choose a service and tap “Request bids”. Workers' prices will show up here.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6">
        {requests.map((r) => (
          <RequestCard key={r.id} req={r} onAccepted={onAccepted} onUpdated={onUpdated} onCancel={onCancel} />
        ))}
      </div>
    )}
  </div>
);

export default CustomerMyRequests;

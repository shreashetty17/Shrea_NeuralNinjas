import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  X, 
  Zap, 
  Filter,
  Radio,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';

export const LiveBiddingAuction = ({
  job,
  onAcceptQuote,
  onCancelJob,
  onViewWorkerOnMap
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(170);
  const [bids, setBids] = useState([]);
  const [selectedBidForCounter, setSelectedBidForCounter] = useState(null);
  const [counterAmount, setCounterAmount] = useState(320);
  const [counterNote, setCounterNote] = useState('Can you do ₹320 and arrive in 15 minutes?');
  const [sortBy, setSortBy] = useState('eta');
  const [escalationRadius, setEscalationRadius] = useState(3.0);
  const [escalated, setEscalated] = useState(false);
  const [workersNotifiedCount, setWorkersNotifiedCount] = useState(8);

  useEffect(() => {
    const initialBids = [
      {
        id: 'bid-1',
        worker: WORKERS_DATABASE[0], // Rameshwar Jadhav
        quoteAmount: 350,
        etaMins: 12,
        distanceKm: 1.4,
        note: 'Ready with plumbing kit and ceramic spindle in Lokhandwala. Can start right away.',
        status: 'pending',
        counterState: null
      },
      {
        id: 'bid-2',
        worker: WORKERS_DATABASE[27], // Santosh Sawant
        quoteAmount: 320,
        etaMins: 8,
        distanceKm: 0.8,
        note: 'Near your building with motorcycle. Emergency tap repair expert.',
        status: 'pending',
        counterState: null
      }
    ];

    setBids(initialBids);
    playAudioCue('bid_received');

    const timer3 = setTimeout(() => {
      setBids((prev) => [
        ...prev,
        {
          id: 'bid-3',
          worker: WORKERS_DATABASE[3], // Ganesh Shinde
          quoteAmount: 280,
          etaMins: 18,
          distanceKm: 2.8,
          note: 'Fair pricing guaranteed. Will test lines before signoff.',
          status: 'pending',
          counterState: null
        }
      ]);
      playAudioCue('bid_received');
    }, 4000);

    const timer4 = setTimeout(() => {
      setBids((prev) => [
        ...prev,
        {
          id: 'bid-4',
          worker: WORKERS_DATABASE[15], // Sikandar Ali
          quoteAmount: 520,
          etaMins: 17,
          distanceKm: 2.3,
          note: 'Will replace complete diverter and supply brass parts with 6-month warranty.',
          status: 'pending',
          counterState: null
        }
      ]);
      playAudioCue('bid_received');
    }, 8500);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        if (prev === 120 && !escalated) {
          handleAutoEscalate();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [escalated]);

  const handleAutoEscalate = () => {
    setEscalationRadius(7.5);
    setEscalated(true);
    setWorkersNotifiedCount(24);
    playAudioCue('bid_received');
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getFairPriceVerdict = (amount, cat) => {
    const min = cat?.minFair || 200;
    const max = cat?.maxFair || 500;
    if (amount < min) {
      return {
        label: 'Low Bid • Check Scope',
        color: 'bg-stone-100 text-stone-700 border-stone-300'
      };
    }
    if (amount > max) {
      return {
        label: 'Higher Counteroffer',
        color: 'bg-amber-50 text-amber-800 border-amber-300'
      };
    }
    if (amount <= (min + max) / 2) {
      return {
        label: 'Fair Benchmark Value',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    return {
      label: 'Standard Market Rate',
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  };

  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'eta') return a.etaMins - b.etaMins;
    if (sortBy === 'price') return a.quoteAmount - b.quoteAmount;
    if (sortBy === 'rating') return b.worker.rating - a.worker.rating;
    return 0;
  });

  const handleSendCounter = () => {
    if (!selectedBidForCounter) return;
    const bidId = selectedBidForCounter.id;

    setBids((prev) =>
      prev.map((b) => {
        if (b.id === bidId) {
          return {
            ...b,
            quoteAmount: Number(counterAmount),
            counterState: `Technician accepted counter of ₹${counterAmount}!`
          };
        }
        return b;
      })
    );

    playAudioCue('match_success');
    setSelectedBidForCounter(null);
  };

  return (
    <div className="space-y-6">
      {/* Live Auction Banner */}
      <div className="bg-charcoal-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-xl border border-charcoal-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase font-black tracking-widest text-emerald-400">
                Live Reverse Bidding
              </span>
              <span className="text-stone-400 text-xs">• Lokhandwala, Andheri West</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {job?.category?.name || 'Plumbing Service'}
            </h3>

            <p className="text-xs text-stone-300">
              Customer Budget: <strong className="text-brand-400 font-black">₹{job?.budget}</strong> • 
              Fair range: <span className="text-stone-200 font-semibold">{job?.category?.typicalRange || '₹250 - ₹450'}</span>
            </p>
          </div>

          {/* Countdown & Radius Box */}
          <div className="flex items-center gap-4 bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-400" />
                <span>30-Min SLA</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatTimer(secondsRemaining)}
              </div>
            </div>

            <div className="h-8 w-px bg-charcoal-700" />

            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-widest text-stone-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>Radius</span>
              </div>
              <div className="text-xs font-bold text-stone-200 mt-0.5">
                {escalationRadius} km • <span className="text-brand-400">{workersNotifiedCount} pinged</span>
              </div>
            </div>

            {!escalated && (
              <button
                onClick={handleAutoEscalate}
                className="text-xs font-bold bg-charcoal-700 hover:bg-charcoal-600 text-stone-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                Expand
              </button>
            )}
          </div>
        </div>

        {/* Protection Line */}
        <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fair-Price Protection: Quotes outside typical bands are flagged to protect both customer and worker.</span>
          </div>
          <button onClick={onCancelJob} className="text-stone-400 hover:text-red-400 font-bold transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8E3DA] shadow-warm-sm">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900">
          Incoming Quotes ({bids.length} Technicians)
        </span>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSortBy('eta')}
            className={`px-3 py-1 rounded-lg transition-colors ${sortBy === 'eta' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'}`}
          >
            Fastest Arrival ⚡
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-1 rounded-lg transition-colors ${sortBy === 'price' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'}`}
          >
            Lowest Quote ₹
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3 py-1 rounded-lg transition-colors ${sortBy === 'rating' ? 'bg-white text-slate-900 shadow-xs' : 'text-stone-600'}`}
          >
            Top Rating ⭐
          </button>
        </div>
      </div>

      {/* Bids List */}
      <div className="grid grid-cols-1 gap-4">
        {sortedBids.map((bid) => {
          const w = bid.worker;
          const verdict = getFairPriceVerdict(bid.quoteAmount, job?.category);
          const isFastest = bid.etaMins <= 10;

          return (
            <div
              key={bid.id}
              className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-warm-sm ${
                bid.counterState ? 'border-emerald-500 bg-emerald-50/20' : 'border-[#E8E3DA]'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                
                {/* Worker Avatar & Identity */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={w.photo}
                      alt={w.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-warm-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-base sm:text-lg">
                        {w.name}
                      </h4>
                      {isFastest && (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          Fastest Arriver
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 font-medium">
                      {w.tradeLabel} • <span className="text-stone-900 font-semibold">{w.locality}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="font-black text-slate-900 bg-stone-100 px-2 py-0.5 rounded-md">
                        ⭐ {w.rating} ({w.reviewsCount})
                      </span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Trust Score {w.trustScore}/100
                      </span>
                      <span className="text-stone-500 font-medium">
                        {w.jobsCompleted}+ jobs completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote Details & Fair Price verdict */}
                <div className="w-full lg:w-auto lg:border-l lg:border-[#E8E3DA] lg:pl-6 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-stone-400 font-medium">Quote:</span>
                    <span className="text-3xl font-black text-slate-900">₹{bid.quoteAmount}</span>
                    <span className="text-xs text-stone-400 font-medium">labor</span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${verdict.color}`}>
                      {verdict.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      Arrives in {bid.etaMins} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {bid.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Actions: Accept in Escrow / Counter */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => onAcceptQuote(bid)}
                    className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-black text-white font-black text-xs shadow-warm-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Accept & Hold in Escrow</span>
                    <ChevronRight className="w-4 h-4 text-brand-400" />
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBidForCounter(bid);
                        setCounterAmount(bid.quoteAmount > 50 ? bid.quoteAmount - 50 : bid.quoteAmount);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-700 font-bold text-xs bg-stone-50 hover:bg-white transition-colors"
                    >
                      Counteroffer
                    </button>

                    <button
                      onClick={() => onViewWorkerOnMap(w)}
                      className="px-3 py-2 rounded-xl border border-stone-200 hover:border-brand-500 text-stone-700 font-bold text-xs bg-white transition-colors"
                    >
                      Map View
                    </button>
                  </div>
                </div>

              </div>

              {/* Worker Proposal Note */}
              {bid.note && (
                <div className="mt-3.5 pt-3 border-t border-stone-100 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl flex items-start gap-2">
                  <span className="font-black text-stone-900 shrink-0">Technician Note:</span>
                  <p className="italic">"{bid.note}"</p>
                </div>
              )}

              {/* Counter status alert */}
              {bid.counterState && (
                <div className="mt-2.5 p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 border border-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{bid.counterState}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Counteroffer Modal */}
      {selectedBidForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-warm-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-black text-slate-900 text-lg">
                Counteroffer to {selectedBidForCounter.worker.name}
              </h4>
              <button onClick={() => setSelectedBidForCounter(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500">Original Quote: </span>
                <span className="font-black text-slate-900 text-sm">₹{selectedBidForCounter.quoteAmount}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Proposed Counter Amount (₹)
                </label>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-slate-900 font-black text-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message / Condition
                </label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-slate-900 resize-none font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedBidForCounter(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCounter}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-warm-sm"
              >
                Send Counteroffer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

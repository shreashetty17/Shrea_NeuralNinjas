import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Radio, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';

export const FigmaHeroSection = ({ onStartJobPost, onAcceptQuote, onViewMap }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(134); // 2:14 countdown
  const [selectedQuoteForCounter, setSelectedQuoteForCounter] = useState(null);
  const [counterValue, setCounterValue] = useState(320);

  // Live incoming bids
  const [bids, setBids] = useState([
    {
      id: 'bid-1',
      worker: WORKERS_DATABASE[0], // Rameshwar Jadhav
      quoteAmount: 350,
      etaMins: 12,
      distanceKm: 1.4,
      tag: '✓ Fair Price Zone',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'bid-2',
      worker: WORKERS_DATABASE[1], // Sunita Devi
      quoteAmount: 320,
      etaMins: 18,
      distanceKm: 2.1,
      tag: 'Best Value',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 'bid-3',
      worker: WORKERS_DATABASE[2], // Farooq Ansari
      quoteAmount: 420,
      etaMins: 24,
      distanceKm: 2.8,
      tag: 'Top Rated Pro',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  ]);

  // Fast countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleApplyCounter = (bidId) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, quoteAmount: counterValue, tag: `Counter accepted: ₹${counterValue}` } : b))
    );
    playAudioCue('match_success');
    setSelectedQuoteForCounter(null);
  };

  return (
    <section className="pt-8 pb-16 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Differentiator copy */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Eyebrow Pill from Figma */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>A mini reverse auction for home services</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
            Home repairs.<br />
            Not fixed<br />
            prices.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
            Tell us what's broken and your target budget. Nearby verified pros send live quotes. You choose on price, ETA, and verified reviews.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onStartJobPost}
              className="px-6 py-4 rounded-xl bg-galli-dark hover:bg-black text-white font-extrabold text-sm shadow-galli-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Post a job for free</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onViewMap}
              className="px-5 py-4 rounded-xl bg-white hover:bg-stone-50 border border-[#E5E4DC] text-stone-800 font-bold text-sm transition-colors text-center"
            >
              See live quotes nearby
            </button>
          </div>

          {/* 30-Minute Guarantee Stat Strip from Figma */}
          <div className="pt-6 border-t border-[#E5E4DC] flex items-center gap-4">
            <div className="text-3xl sm:text-4xl font-black font-display text-slate-900">
              30'
            </div>
            <div className="text-xs text-stone-600 leading-snug">
              <span className="font-extrabold text-slate-900 block">Minutes to your door (or less)</span>
              <span>Neighborhood pros dispatched with real-time GPS tracking</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Live Auction Preview Widget from Figma */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-[#E5E4DC] p-6 sm:p-7 shadow-galli-lg space-y-5">
            
            {/* Live Auction Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Live Reverse Auction
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Leaking tap, budget ₹300–500
                </h3>
                <p className="text-xs text-stone-500">
                  Lokhandwala / Bandra West • 3 pros bidding
                </p>
              </div>

              {/* Timer */}
              <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[9px] font-bold text-stone-400 block uppercase">Matching In</span>
                <span className="text-base font-mono font-black text-slate-900">{formatTimer(secondsRemaining)}</span>
              </div>
            </div>

            {/* Fair-Price Guide Range from Figma */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700">Fair-price range in your area:</span>
                <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ₹250 – ₹450
                </span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-stone-300" />
                <div className="w-1/2 bg-emerald-500" />
                <div className="w-1/4 bg-amber-400" />
              </div>
              <div className="text-[10px] text-stone-500">
                Quotes flagged if suspiciously high or low so neither side gets exploited.
              </div>
            </div>

            {/* Live Quotes List */}
            <div className="space-y-3">
              {bids.map((bid) => {
                const w = bid.worker;
                return (
                  <div
                    key={bid.id}
                    className="p-3.5 rounded-2xl border border-[#E5E4DC] hover:border-emerald-500 transition-all flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={w.photo}
                        alt={w.name}
                        className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{w.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span>⭐ {w.rating}</span>
                          <span>•</span>
                          <span>{bid.etaMins} mins</span>
                          <span>•</span>
                          <span>{bid.distanceKm} km</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border inline-block mt-0.5 ${bid.tagColor}`}>
                          {bid.tag}
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs text-stone-400 font-medium block">Quote</span>
                        <span className="text-base sm:text-lg font-black text-slate-900">₹{bid.quoteAmount}</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => onAcceptQuote(bid)}
                          className="px-3 py-1.5 rounded-lg bg-galli-dark hover:bg-black text-white font-bold text-xs shadow-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuoteForCounter(bid);
                            setCounterValue(bid.quoteAmount > 30 ? bid.quoteAmount - 30 : bid.quoteAmount);
                          }}
                          className="px-3 py-1 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 font-semibold text-[10px]"
                        >
                          Counter
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Auto-escalation line */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>3-min auto radius escalation: 3 km active</span>
              </span>
              <span className="font-bold text-stone-700">8 workers pinged</span>
            </div>

          </div>
        </div>

      </div>

      {/* Counter Modal */}
      {selectedQuoteForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in">
            <h4 className="font-extrabold text-slate-900 text-base">
              Counteroffer to {selectedQuoteForCounter.worker.name}
            </h4>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600">Your proposed price (₹)</label>
              <input
                type="number"
                value={counterValue}
                onChange={(e) => setCounterValue(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 font-black text-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedQuoteForCounter(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyCounter(selectedQuoteForCounter.id)}
                className="flex-1 py-2 rounded-xl bg-galli-dark text-white text-xs font-bold"
              >
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React from 'react';
import { 
  Send, 
  Users, 
  ArrowLeftRight, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Clock
} from 'lucide-react';

export const BoltHowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 border-t border-slate-200 space-y-16">
      
      {/* 4 Steps Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs font-bold uppercase tracking-wider">
          <span>How It Works</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          From request to done in 4 steps
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          No fixed prices. No middleman markup. You set your budget, workers bid, you negotiate, work gets done.
        </p>
      </div>

      {/* The 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 font-display font-bold text-sm flex items-center justify-center">
            01
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Post your request
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tell us what you need and your target budget range. Bids from nearby verified workers start arriving within 30 seconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 font-display font-bold text-sm flex items-center justify-center">
            02
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Workers bid directly
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verified technicians near you submit live quotes. Review their rating, distance, experience, and estimated arrival time.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 font-display font-bold text-sm flex items-center justify-center">
            03
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Negotiate directly
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can counter any bid. Workers can accept, decline, or counter back. Real market pricing with zero middleman commissions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 font-display font-bold text-sm flex items-center justify-center">
            04
          </div>
          <h3 className="text-base font-display font-bold text-slate-900">
            Track & pay safely
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Track worker arrival with live GPS. Share 4-digit OTP to start. Funds held in Escrow-Lite until you inspect and sign off.
          </p>
        </div>

      </div>

      {/* Why Fixed Pricing is Broken (from Bolt) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-bolt-md space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-secondary-600">
            THE KAAMSETU DIFFERENCE
          </span>
          <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">
            Why fixed pricing is broken
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Fixed Apps (Urban Company) */}
          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-display font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Fixed Price Apps (Urban Company)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Platform dictates pricing, taking 25–40% predatory commissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Workers penalized or suspended for declining inconvenient jobs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Inflexible scheduled slots (2 to 4 hour delays)</span>
              </li>
            </ul>
          </div>

          {/* KaamSetu / KaamSetu */}
          <div className="p-6 rounded-2xl bg-primary-50/50 border border-primary-200/80 space-y-3">
            <div className="flex items-center gap-2 text-primary-800 font-display font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary-600" />
              <span>KaamSetu Marketplace</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>100% worker-set pricing — workers keep everything they earn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Real mini reverse auction negotiation so both sides agree fairly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>30-minute hyperlocal matching with live GPS tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
};

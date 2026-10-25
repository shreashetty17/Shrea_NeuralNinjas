import React from 'react';
import { Camera, CheckCircle2, ShieldCheck } from 'lucide-react';

export const FigmaHowItWorks = () => {
  return (
    <section className="py-16 border-t border-[#E5E4DC]">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
          HOW GALLI WORKS
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          One small post. Three simple steps.
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          A high-velocity reverse auction designed for speed, fairness, and mutual trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E4DC] space-y-4 shadow-galli-sm">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 font-display font-black text-slate-900 flex items-center justify-center text-sm">
            01
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Post your problem
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Snap a photo, record a voice note, or enter your budget. Our benchmark shows you typical neighborhood rates (₹250–₹450).
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E4DC] space-y-4 shadow-galli-sm">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 font-display font-black text-slate-900 flex items-center justify-center text-sm">
            02
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Compare & Counter
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Receive 3–5 competitive quotes within minutes. Review ETA, distance, and verified reviews, then accept or make a counteroffer.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E4DC] space-y-4 shadow-galli-sm">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 font-display font-black text-slate-900 flex items-center justify-center text-sm">
            03
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Pay safely in Escrow
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Payment is held securely in escrow before work begins. Funds are released to the technician only after you inspect and sign off.
          </p>
        </div>

      </div>
    </section>
  );
};

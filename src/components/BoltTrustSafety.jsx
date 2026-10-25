import React from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  ShieldAlert, 
  Lock, 
  ArrowRight
} from 'lucide-react';

export const BoltTrustSafety = ({ onOpenSos, onOpenVerifyModal, onOpenEscrowModal }) => {
  return (
    <section id="trust-safety" className="py-16 border-t border-slate-200 space-y-16">
      
      {/* Header from Bolt */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <span>Trust & Safety</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          Safety isn't a feature. It's the foundation.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl">
          Every worker verified. Every job tracked. Every user protected.
        </p>
      </div>

      {/* Safety Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Verification */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            4-Tier Worker Verification
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Government Aadhaar / DigiLocker e-KYC, Mumbai Police Special Branch criminal clearance, and NSDC trade skill testing.
          </p>
          <button
            onClick={onOpenVerifyModal}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 pt-1"
          >
            <span>Inspect Verification Tiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* OTP & Arrival */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            Photo Check & Start OTP
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Worker arriving in 8–14 mins. The pro must input your unique 4-digit OTP to commence service, guaranteeing zero impersonation.
          </p>
          <div className="text-xs font-mono font-bold text-primary-800 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-200 inline-block">
            Start OTP: 4829
          </div>
        </div>

        {/* SOS Alert */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            Instant Emergency SOS
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            One-touch siren alert sounds locally and transmits live GPS coordinates to Mumbai Police 112 and your trusted family contact.
          </p>
          <button
            onClick={onOpenSos}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Test SOS Siren</span>
          </button>
        </div>

      </div>

      {/* Escrow-Lite Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-bolt-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>KaamSetu Escrow-Lite Protection</span>
          </div>
          <h4 className="text-lg font-display font-bold text-white">
            Payment is held securely and released only after your satisfaction.
          </h4>
          <p className="text-xs text-slate-300 max-w-xl">
            Neither side gets cheated. Before/after photo mediation resolves any disputes within 15 minutes.
          </p>
        </div>

        <button
          onClick={onOpenEscrowModal}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors shrink-0 shadow-sm"
        >
          View Escrow Terms
        </button>
      </div>

    </section>
  );
};

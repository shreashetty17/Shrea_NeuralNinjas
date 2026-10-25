import React from 'react';
import { Logo } from './Logo';
import { ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export const FigmaFooter = ({ onPostJobClick, onOpenVerify, onOpenEscrow, onOpenSlide5 }) => {
  return (
    <div className="space-y-12">
      {/* Light Mint Bottom CTA Banner from Figma */}
      <div className="bg-emerald-100/70 border border-emerald-300 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-galli-sm">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            What needs fixing in your galli?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Post a job in 30 seconds. No card required. Verified neighborhood pros bid directly.
          </p>
        </div>

        <button
          onClick={onPostJobClick}
          className="px-6 py-4 rounded-xl bg-galli-dark hover:bg-black text-white font-extrabold text-sm shadow-galli-md transition-all active:scale-[0.98] flex items-center gap-2 shrink-0"
        >
          <span>Post your job now</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Main Footer */}
      <footer className="pt-8 pb-12 border-t border-[#E5E4DC]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 space-y-3">
            <Logo size="md" />
            <p className="text-stone-500 max-w-sm leading-relaxed">
              Galli is an on-demand hyperlocal marketplace for plumbers, electricians, maids, and cooks with live reverse bidding, 30-minute matching, and worker-first protection.
            </p>
            <div className="text-[11px] text-stone-400 pt-2">
              © 2026 Galli Technologies Pvt Ltd. Built for Mumbai.
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs">Popular Trades</h5>
            <ul className="space-y-1.5 text-stone-500">
              <li>Tap Leak & Geyser</li>
              <li>MCB & Fan Repair</li>
              <li>Deep Kitchen Cleaning</li>
              <li>Home Cook Maharaj</li>
              <li>Split AC Servicing</li>
              <li>Door Locks & Joinery</li>
            </ul>
          </div>

          {/* Col 3: For Workers */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs">For Workers</h5>
            <ul className="space-y-1.5 text-stone-500">
              <li>100% Worker-Set Rates</li>
              <li>Voice-First Partner App</li>
              <li>2G SMS Fallback</li>
              <li>Free NSDC Upskilling</li>
              <li>Two-Way Protection</li>
            </ul>
          </div>

          {/* Col 4: Trust & Pitch */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-slate-900 text-xs">Trust & Pitch</h5>
            <ul className="space-y-1.5 text-stone-500">
              <li onClick={onOpenVerify} className="cursor-pointer hover:text-stone-900">4-Tier Verification</li>
              <li onClick={onOpenEscrow} className="cursor-pointer hover:text-stone-900">Escrow-Lite Security</li>
              <li onClick={onOpenSlide5} className="cursor-pointer text-emerald-800 font-bold hover:underline">Slide 5 Matrix</li>
              <li>Lokhandwala & Bandra</li>
              <li>Dadar & Powai</li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
};

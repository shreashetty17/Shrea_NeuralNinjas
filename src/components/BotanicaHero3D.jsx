import React, { useState } from 'react';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  Sparkles
} from 'lucide-react';

export const BotanicaHero3D = ({ onGetStarted, onBookService, onOpenWorkerPortal }) => {
  const [activeSlide, setActiveSlide] = useState(1); // 0: Left (Agency), 1: Center (Botanica/KaamSetu), 2: Right (Live Tracker)

  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      
      {/* Background cinematic atmosphere matching user's uploaded image */}
      <div className="absolute inset-0 bg-[#0B0D11] pointer-events-none">
        {/* Warm amber/burnt orange ambient glows matching uploaded image */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-orange-600/15 via-amber-700/10 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header: GET STARTED Button matching user's uploaded image */}
        <div className="text-center space-y-3">
          <button
            onClick={onGetStarted}
            className="px-9 py-4 bg-white text-slate-950 font-black text-sm tracking-wider uppercase rounded-xl hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            GET STARTED
          </button>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            Start for free. No credit card required.
          </p>
        </div>

        {/* 3D Perspective Card Carousel Deck matching user's uploaded image */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-8 perspective-1000 py-4">
          
          {/* ========================================================= */}
          {/* LEFT CARD (AGENCY Style from uploaded image): WORKER PORTAL */}
          {/* ========================================================= */}
          <div
            onClick={() => {
              if (activeSlide !== 0) setActiveSlide(0);
              else onOpenWorkerPortal();
            }}
            className={`cursor-pointer transition-all duration-500 rounded-3xl p-6 sm:p-8 shrink-0 w-[280px] sm:w-[350px] lg:w-[420px] bg-[#101217] text-white border border-stone-800 shadow-2xl ${
              activeSlide === 0
                ? 'scale-100 opacity-100 z-20 ring-2 ring-brand-500'
                : 'scale-90 opacity-60 hidden md:block -rotate-y-12 hover:opacity-85'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-widest pb-4 border-b border-stone-800">
              <span className="text-white font-black">WORK</span>
              <span>ABOUT</span>
              <span className="text-brand-400">CONTACT ↗</span>
            </div>

            <div className="py-6 space-y-4">
              <div className="text-4xl sm:text-5xl font-clash font-black uppercase tracking-tighter text-white">
                GIGS
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Worker-set pricing. 100% take-home payout. Direct voice quote bids in Hindi & Marathi.
              </p>

              {/* Projects Grid matching uploaded image (luggage / fashion cards) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80"
                    alt="Plumbing gig"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 text-[9px] font-black uppercase bg-black/70 px-2 py-0.5 rounded text-white">
                    01 PLUMBING
                  </div>
                </div>

                <div className="aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80"
                    alt="Electrical gig"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 text-[9px] font-black uppercase bg-black/70 px-2 py-0.5 rounded text-white">
                    02 ELECTRICAL
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-400 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span>VIEW WORKER PORTAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER CARD (EXACT BOTANICA Style from uploaded image):    */}
          {/* Adapted for KAAMSETU / KAAMSETU LUXURY EDITORIAL          */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveSlide(1)}
            className={`transition-all duration-500 rounded-3xl p-6 sm:p-10 md:p-12 shrink-0 w-full max-w-3xl bg-[#E8DFD1] text-[#201C17] border border-[#D5CABB] shadow-card-3d relative overflow-hidden ${
              activeSlide === 1
                ? 'scale-100 opacity-100 z-20 ring-2 ring-stone-400/40'
                : 'scale-95 opacity-70'
            }`}
          >
            {/* Top Bar matching image: "shop" (left) | "BOTANICA" (right) */}
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest pb-6 border-b border-[#D5CABB]/60">
              <span className="font-sans text-[11px] font-bold text-stone-700">
                on-demand
              </span>
              <span className="font-serif tracking-widest text-sm font-black text-slate-950">
                KAAMSETU
              </span>
            </div>

            {/* Huge Serif Headline matching image "BOTANICA" with overlapping imagery */}
            <div className="relative my-6 sm:my-8 py-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight text-slate-950 leading-none">
                KAAMSETU
              </h1>

              {/* Overlapping botanical & craftsman visual elements */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none opacity-90 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"
                  alt="Craft detail"
                  className="w-full h-full object-cover rounded-3xl shadow-xl border-4 border-[#E8DFD1]"
                />
              </div>

              <div className="pt-6 max-w-sm space-y-1">
                <p className="text-xs sm:text-sm font-sans font-semibold text-stone-800 leading-snug">
                  Hyperlocal blue-collar repairs & domestic services. Worker-set pricing, reverse auction negotiation, matched in ~18 to 30 minutes.
                </p>
                <div className="text-[11px] font-bold text-emerald-800 pt-1">
                  ✓ Mumbai • Bandra • Lokhandwala • Dadar • Powai
                </div>
              </div>
            </div>

            {/* Bottom Split Row matching image: "florals →" | "plants" */}
            <div className="grid grid-cols-2 pt-6 border-t border-[#D5CABB] text-xs font-black uppercase tracking-wider">
              <button
                onClick={onBookService}
                className="py-2.5 flex items-center gap-2 hover:text-emerald-800 transition-colors text-left font-black"
              >
                <span>Book a service</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>

              <button
                onClick={onOpenWorkerPortal}
                className="py-2.5 border-l border-[#D5CABB] pl-6 hover:text-emerald-800 transition-colors text-left font-black"
              >
                Join as a worker
              </button>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT CARD: 30-MIN MATCHING & LIVE TRACKER                */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveSlide(2)}
            className={`cursor-pointer transition-all duration-500 rounded-3xl p-6 sm:p-8 shrink-0 w-[280px] sm:w-[350px] lg:w-[420px] bg-[#101217] text-white border border-stone-800 shadow-2xl ${
              activeSlide === 2
                ? 'scale-100 opacity-100 z-20 ring-2 ring-emerald-500'
                : 'scale-90 opacity-60 hidden md:block rotate-y-12 hover:opacity-85'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-widest pb-4 border-b border-stone-800">
              <span className="flex items-center gap-1.5 text-emerald-400 font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>30-MIN PROMISE</span>
              </span>
              <span>LIVE GPS</span>
            </div>

            <div className="py-6 space-y-4">
              <div className="text-4xl sm:text-5xl font-clash font-black uppercase tracking-tighter text-white">
                TRACK
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Worker arrives in ~14 min. Verified by 4-digit start OTP and held in Escrow-Lite.
              </p>

              {/* Status preview */}
              <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Santosh Sawant (Plumber)</span>
                  <span className="text-emerald-400 font-mono font-black">OTP: 4829</span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Bandra West • Bike route</span>
                  <span className="text-emerald-400 font-bold">14 min ETA</span>
                </div>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
                  alt="Verified worker"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span>EXPLORE LIVE MAP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

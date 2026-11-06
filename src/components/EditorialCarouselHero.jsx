import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Radio, 
  ChevronLeft, 
  ChevronRight,
  KeyRound,
  Mic,
  Star
} from 'lucide-react';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';

export const EditorialCarouselHero = ({
  onGetStarted,
  onAcceptQuote,
  onOpenSos,
  activeBooking
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(1); // 0: Left, 1: Center, 2: Right
  const [secondsRemaining, setSecondsRemaining] = useState(134);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 140));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <section className="relative pt-10 pb-20 overflow-hidden">
      
      {/* Top Dramatic CTA matching user's image */}
      <div className="text-center max-w-xl mx-auto space-y-3 mb-10 z-10 relative">
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 bg-white text-slate-950 font-black text-sm tracking-wider uppercase rounded-xl hover:bg-stone-100 transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          GET STARTED
        </button>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Start for free. No credit card required.
        </p>
      </div>

      {/* 3D Perspective Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Navigation arrows for carousel */}
        <button
          onClick={() => setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : 2))}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 border border-stone-200 text-slate-900 flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveCardIndex((prev) => (prev < 2 ? prev + 1 : 0))}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 border border-stone-200 text-slate-900 flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* The 3 Showcase Cards */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 perspective-1000">
          
          {/* ========================================================= */}
          {/* CARD 0 (LEFT): Editorial Aesthetic Preview matching left card */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveCardIndex(0)}
            className={`cursor-pointer transition-all duration-500 rounded-3xl p-6 sm:p-8 shrink-0 w-[280px] sm:w-[340px] md:w-[420px] bg-[#EAE6DF] border border-[#D5D0C6] shadow-xl ${
              activeCardIndex === 0
                ? 'scale-100 opacity-100 z-20'
                : 'scale-90 opacity-60 hidden lg:block -rotate-y-6 hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-stone-500 pb-6 border-b border-stone-300">
              <span>GALLI</span>
              <span>EST. 2026</span>
            </div>

            <div className="py-8 space-y-4">
              <div className="text-4xl font-display font-black text-slate-950 uppercase leading-none tracking-tighter">
                NICA
              </div>
              <p className="text-xs font-serif italic text-stone-600">
                "Dignified blue-collar craftsmanship for modern urban households."
              </p>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-sm mt-4">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                  alt="Plumbing craft"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-[10px] text-stone-500 font-bold tracking-wider uppercase pt-4 border-t border-stone-300">
              8 CLARKSON ST, BANDRA WEST
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARD 1 (CENTER): The Exact BOROUGH BARBER Editorial Layout */}
          {/* Adapted for GALLI REPAIRS & MINI REVERSE AUCTION          */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveCardIndex(1)}
            className={`transition-all duration-500 rounded-3xl p-6 sm:p-10 md:p-12 shrink-0 w-full max-w-4xl bg-[#EFECE6] border border-[#D8D3C8] shadow-2xl relative ${
              activeCardIndex === 1
                ? 'scale-100 opacity-100 z-20'
                : 'scale-95 opacity-70'
            }`}
          >
            {/* Top Bar matching image: TEAM / GALLERY | BOROUGH BARBER | SERVICES / BOOK NOW */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 pb-8">
              <div className="flex items-center gap-2">
                <span>TEAM</span>
                <span>/</span>
                <span>GALLERY</span>
              </div>

              <div className="font-extrabold tracking-widest text-slate-950 text-xs sm:text-sm">
                GALLI REPAIRS
              </div>

              <div className="flex items-center gap-2">
                <span>SERVICES</span>
                <span>/</span>
                <button
                  onClick={onGetStarted}
                  className="underline hover:text-emerald-700 font-black cursor-pointer"
                >
                  BOOK NOW
                </button>
              </div>
            </div>

            {/* Asymmetric Editorial Grid matching image */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
              
              {/* Photo 1 (Top Left): Equipment/Chair style */}
              <div className="md:col-span-4 space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80"
                    alt="Plumbing brass faucet"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Center Typography matching image */}
              <div className="md:col-span-8 text-center md:text-left space-y-3">
                <div className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-slate-950 tracking-tight leading-[1.05]">
                  GALLI REPAIRS<br />
                  <span className="font-serif italic font-normal text-stone-700 text-xl sm:text-3xl block my-1">
                    EST. 2026
                  </span>
                  PRECISION SERVICES FOR —<br />
                  EVERYDAY LIFE.
                </div>

                <div className="pt-2">
                  <button
                    onClick={onGetStarted}
                    className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-950 underline underline-offset-4 hover:text-emerald-700 transition-colors"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row with 2 Photos + Timings & Address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-4">
              
              {/* Photo 2 (Bottom Left): Tools/Shears style */}
              <div className="md:col-span-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=80"
                    alt="Precision tools"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Center/Right Metadata matching image */}
              <div className="md:col-span-4 text-center space-y-1">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900">
                  MON - SUN, 7 AM - 10 PM
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider">
                  BANDRA WEST & LOKHANDWALA, MUMBAI
                </div>
                <div className="pt-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300">
                    30-Minute Matching SLA
                  </span>
                </div>
              </div>

              {/* Photo 3 (Middle/Right): Portrait style */}
              <div className="md:col-span-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                    alt="Master technician"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* CARD 2 (RIGHT): Dark Slate Card matching "Balance" Card   */}
          {/* Adapted for GALLI LIVE AUCTION & 30-MIN TRACKER           */}
          {/* ========================================================= */}
          <div
            onClick={() => setActiveCardIndex(2)}
            className={`cursor-pointer transition-all duration-500 rounded-3xl p-6 sm:p-8 shrink-0 w-[280px] sm:w-[340px] md:w-[420px] bg-[#101F1A] text-white border border-[#1F3D33] shadow-xl ${
              activeCardIndex === 2
                ? 'scale-100 opacity-100 z-20'
                : 'scale-90 opacity-60 hidden lg:block rotate-y-6 hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-emerald-400 pb-4 border-b border-emerald-900/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE AUCTION</span>
              </span>
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <div className="py-6 space-y-4">
              <div className="text-3xl font-display font-black text-white tracking-tight">
                Balance
              </div>
              <p className="text-xs text-stone-300 font-normal leading-relaxed">
                A marketplace designed to balance fair worker rates with instant 30-minute household matching.
              </p>

              {/* Live Bid Snippet */}
              <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Ramesh Jadhav (Plumber)</span>
                  <span className="text-emerald-400 font-black">₹350</span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center justify-between">
                  <span>12 mins • 1.4 km</span>
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">
                    Fair Zone
                  </span>
                </div>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                  alt="Precision electrical"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-[10px] text-emerald-400/80 font-bold tracking-wider uppercase pt-4 border-t border-emerald-900/60">
              ESCROW PROTECTED • 0% WORKER CUT
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

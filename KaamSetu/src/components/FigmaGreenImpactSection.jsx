import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ArrowUpRight, 
  PhoneCall,
  Zap,
  Radio
} from 'lucide-react';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';

export const FigmaGreenImpactSection = ({ onOpenSos, onOpenVerifyModal, onOpenEscrowModal }) => {
  const [workerAvailable, setWorkerAvailable] = useState(true);
  const [voiceSpoken, setVoiceSpoken] = useState(false);
  const [spokenPhrase, setSpokenPhrase] = useState('₹350 रुपया, 15 मिनिटात पोहोचतो');

  const handleTestVoiceQuote = () => {
    setVoiceSpoken(true);
    playAudioCue('bid_received');
    setTimeout(() => {
      setVoiceSpoken(false);
    }, 3000);
  };

  return (
    <section id="trust-safety" className="py-20 bg-galli-dark text-white rounded-3xl p-8 sm:p-12 lg:p-16 my-12 border border-emerald-950 shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="max-w-3xl space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold">
          <span>SOCIAL IMPACT & WORKER DIGNITY</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
          A home you can trust.<br />
          A livelihood you can build.
        </h2>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal pt-1">
          Built for Mumbai's homeowners and the 300,000+ blue-collar technicians who keep the city running. No predatory commissions, no unfair penalties, and 100% worker-set pricing.
        </p>
      </div>

      {/* Two Interactive Cards from Figma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: The Worker Partner App */}
        <div className="bg-galli-cardDark rounded-3xl p-6 sm:p-7 border border-emerald-800/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                GALLI PARTNER APP
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Worker Autonomy & Voice UI
              </h3>
            </div>
            
            {/* Availability Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-300 font-semibold">{workerAvailable ? 'Online' : 'Offline'}</span>
              <button
                onClick={() => setWorkerAvailable(!workerAvailable)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  workerAvailable ? 'bg-emerald-500' : 'bg-stone-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    workerAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Worker Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
              alt="Gajanan Pawar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-white text-base">Gajanan "Gaja" Pawar</h4>
                <span className="text-[10px] font-bold bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                  Ustaad Pro
                </span>
              </div>
              <p className="text-xs text-stone-300">Master Plumber & Pipe Specialist • Lokhandwala</p>
              <div className="text-xs font-bold text-amber-400 mt-1">⭐ 4.94 (382 reviews)</div>
            </div>
          </div>

          {/* 100% Take-home Earnings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/40">
              <span className="text-[11px] text-stone-400 font-medium block">Today's Take-Home</span>
              <span className="text-2xl font-black text-white mt-0.5 block">₹1,850</span>
              <span className="text-[10px] text-emerald-400 font-bold">0% commission taken</span>
            </div>

            <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/40">
              <span className="text-[11px] text-stone-400 font-medium block">Reputation Score</span>
              <span className="text-2xl font-black text-emerald-400 mt-0.5 block">98/100</span>
              <span className="text-[10px] text-stone-400">Direct UPI settlement</span>
            </div>
          </div>

          {/* Voice-First Marathi/Hindi Quoting */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice Quote (No typing needed)</span>
              </span>
              <span className="text-[10px] text-stone-400 font-devanagari">मराठी / हिंदी</span>
            </div>

            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/60 flex items-center justify-between">
              <div className="text-xs font-bold text-white font-devanagari">
                "{spokenPhrase}"
              </div>
              <button
                onClick={handleTestVoiceQuote}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] rounded-lg transition-colors"
              >
                Test Voice
              </button>
            </div>

            {voiceSpoken && (
              <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice Bid converted: ₹350 labor • ETA 15 mins</span>
              </div>
            )}
          </div>

          {/* Upskilling Nudge from Figma */}
          <div className="text-xs text-stone-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/30 flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              <strong className="text-white">Upskill Nudge:</strong> Add Inverter AC Repair to your profile to earn ~30% more in Bandra West this season.
            </span>
          </div>

        </div>

        {/* Right Card: Trust & Safety Stack */}
        <div className="bg-galli-cardDark rounded-3xl p-6 sm:p-7 border border-emerald-800/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                SAFETY & TRUST ENGINE
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Where Most Apps Are Thin
              </h3>
            </div>

            <button
              onClick={onOpenVerifyModal}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              View Verification
            </button>
          </div>

          {/* 4-Tier Badges List */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">Tier 1 & 2: Aadhaar + Mumbai Police Verification</span>
                <span className="text-stone-300">Biometric identity e-KYC plus criminal record clearance from local police branch.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">Tier 3: NSDC Skill Tested & Tool Kit Audit</span>
                <span className="text-stone-300">Evaluated on real domestic diagnostic scenarios before being allowed on the platform.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-extrabold text-white block">Job Escrow-Lite & Photo Dispute</span>
                <span className="text-stone-300">Payment is locked in escrow upfront and released ONLY when customer signs off.</span>
              </div>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onOpenSos}
              className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Test SOS Siren</span>
            </button>

            <button
              onClick={onOpenEscrowModal}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Escrow Rules</span>
            </button>
          </div>

          {/* Two-Way Rating Shield */}
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/30 text-xs text-stone-300">
            <strong className="text-white">Two-Way Ratings:</strong> Technicians rate homeowners too, protecting blue-collar workers against abusive clients or payment withholding.
          </div>

        </div>

      </div>

    </section>
  );
};

import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  KeyRound, 
  ShieldCheck, 
  PhoneCall, 
  Radio, 
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { WORKERS_DATABASE } from '../data/mockData';

export const FigmaThirtyMinuteSection = ({ onViewFullMap }) => {
  const [etaTimer, setEtaTimer] = useState(14);
  const worker = WORKERS_DATABASE[27]; // Santosh Sawant

  return (
    <section id="how-it-works" className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Map Preview Card matching Figma */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-[#E5E4DC] overflow-hidden shadow-galli-lg relative">
            
            {/* Top Bar on Map */}
            <div className="p-4 bg-white/95 backdrop-blur-md border-b border-stone-100 flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-900">Live GPS Tracker • Bandra West</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Arriving in {etaTimer} min
              </span>
            </div>

            {/* Stylized Interactive Map Canvas */}
            <div className="relative h-80 bg-[#E8ECE6] overflow-hidden">
              {/* Map SVG Graphic / Mock Leaflet Canvas */}
              <svg viewBox="0 0 500 320" className="w-full h-full object-cover">
                {/* Street lines */}
                <path d="M 0 100 Q 200 120 500 90" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                <path d="M 120 0 L 140 320" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                <path d="M 280 0 L 260 320" stroke="#FFFFFF" strokeWidth="14" fill="none" />
                <path d="M 0 220 L 500 240" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                <path d="M 400 0 L 380 320" stroke="#FFFFFF" strokeWidth="8" fill="none" />

                {/* Ocean/Coast outline for Bandra */}
                <path d="M 0 0 C 80 80, 50 200, 20 320 L 0 320 Z" fill="#D0E3EA" opacity="0.6" />

                {/* Active Route Green Dash Line */}
                <path
                  d="M 180 180 Q 220 180 260 140 T 320 110"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeDasharray="6 6"
                  fill="none"
                />

                {/* Customer Pin */}
                <g transform="translate(320, 110)">
                  <circle r="14" fill="#0A261D" />
                  <circle r="6" fill="#10B981" />
                  <text x="18" y="5" fontFamily="system-ui" fontSize="11" fontWeight="bold" fill="#0A261D">
                    Your Location (Bandra)
                  </text>
                </g>

                {/* Worker Bike Pin */}
                <g transform="translate(180, 180)">
                  <circle r="16" fill="#059669" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.3))" />
                  <text x="-8" y="4" fontSize="12">🛵</text>
                </g>

                {/* Other nearby available pros dots */}
                <circle cx="140" cy="80" r="6" fill="#0A261D" opacity="0.6" />
                <circle cx="280" cy="240" r="6" fill="#0A261D" opacity="0.6" />
                <circle cx="390" cy="190" r="6" fill="#0A261D" opacity="0.6" />
              </svg>

              {/* Floating ETA Badge */}
              <div className="absolute top-4 left-4 bg-galli-dark text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>1.1 km away • Bike route</span>
              </div>
            </div>

            {/* Bottom Worker Card Overlay from Figma */}
            <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{worker.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Assigned Pro</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {worker.tradeLabel} • Verified
                  </p>
                </div>
              </div>

              {/* OTP Start Box */}
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-center">
                <div className="text-[9px] uppercase font-bold text-stone-400 flex items-center justify-center gap-0.5">
                  <KeyRound className="w-2.5 h-2.5" />
                  <span>Start OTP</span>
                </div>
                <div className="text-sm font-mono font-black text-emerald-700 tracking-wider">
                  4829
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Copy & 3 Bullets from Figma */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            <span>THE 30-MINUTE PROMISE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.12] tracking-tight">
            A 30-minute arrival starts with someone around the corner.
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            No waiting 4 hours for a centralised franchise slot. Galli matches you with verified pros currently available in your neighborhood.
          </p>

          <div className="space-y-4 pt-2">
            
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Live map with real-time ETA
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  See who is on the road right now in Bandra, Lokhandwala, or Dadar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Auto-radius escalation
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  If nobody accepts in 3 minutes, we automatically widen the radius from 3 km to 7.5 km.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Photo & OTP verified arrival
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  The pro who quotes is the pro who arrives. Work only begins after the 4-digit OTP is verified.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

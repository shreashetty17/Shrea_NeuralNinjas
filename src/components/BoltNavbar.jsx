import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Laptop, 
  CheckCircle2, 
  Clock, 
  PhoneCall,
  User,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

export const BoltNavbar = ({
  activeTab,
  setActiveTab,
  onOpenBookModal,
  onOpenSos,
  onScrollTo,
  onOpenDemoTour
}) => {
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D11]/90 backdrop-blur-md border-b border-[#1E232E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => setActiveTab('customer')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center font-clash font-black text-white text-base shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-clash font-extrabold text-xl text-white tracking-tight leading-none">
                  Kaam<span className="text-brand-500">Wala</span>
                </span>
                <span className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase mt-0.5">
                  Mumbai Hyperlocal
                </span>
              </div>
            </div>

            {/* Navigation Links from Bolt */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-300">
              <button 
                onClick={() => { setActiveTab('customer'); onScrollTo('services'); }}
                className="hover:text-white transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollTo('how-it-works'); }}
                className="hover:text-white transition-colors"
              >
                How it works
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollTo('trust-safety'); }}
                className="hover:text-white transition-colors"
              >
                Trust & Safety
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollTo('social-impact'); }}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Social Impact</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Dignity
                </span>
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollTo('top-workers'); }}
                className="hover:text-white transition-colors"
              >
                Top Workers
              </button>
              <button 
                onClick={() => setActiveTab('worker')}
                className={`transition-colors font-bold ${
                  activeTab === 'worker' ? 'text-brand-400' : 'text-stone-300 hover:text-white'
                }`}
              >
                I'm a worker
              </button>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            
            {/* Any Computer Network Pill */}
            <div className="relative">
              <button
                onClick={() => setShowNetworkInfo(!showNetworkInfo)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-300 hover:border-brand-500 transition-colors"
                title="View Wi-Fi link to open on phones or other computers"
              >
                <Laptop className="w-3.5 h-3.5 text-brand-400" />
                <span>Open Anywhere</span>
              </button>

              {showNetworkInfo && (
                <div className="absolute right-0 top-11 z-50 w-72 bg-[#13161C] rounded-2xl border border-stone-800 shadow-2xl p-4 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-brand-500" />
                      Open on Any Computer / Phone
                    </span>
                    <button onClick={() => setShowNetworkInfo(false)} className="text-stone-400 hover:text-white text-xs">✕</button>
                  </div>
                  <div className="text-[11px] text-stone-300 leading-relaxed">
                    Access this live application from any device on your Wi-Fi:
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 font-mono text-xs font-bold text-brand-400 select-all">
                    http://192.168.0.101:5173/
                  </div>
                </div>
              )}
            </div>

            {/* Slide 5 Pitch Matrix button */}
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'comparison'
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              Slide 5 Matrix
            </button>

            {/* Demo Tour Button for Judges */}
            <button
              onClick={onOpenDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2-Min Demo</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/30"
              title="Emergency SOS Alert"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS</span>
            </button>

            {/* Book a Service CTA Button from Bolt */}
            <button
              onClick={onOpenBookModal}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Book a service
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

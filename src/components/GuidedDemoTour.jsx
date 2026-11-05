import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Mic, 
  TrendingUp, 
  X
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';

export const GuidedDemoTour = ({
  isOpen,
  onClose,
  onStepChange
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      timeRange: '0:00 - 0:15',
      title: '1. The Problem in Mumbai',
      subtitle: 'Scattered unverified brokers, extortionate rates & delayed fixes',
      narration: 'In Indian cities like Mumbai, finding a plumber or electrician means haggling with local brokers or paying 40-50% markups on Urban Company with 4-hour delays. Workers receive tiny cuts, and customers worry about safety at home.',
      targetTab: 'customer',
      badge: 'The Problem'
    },
    {
      timeRange: '0:15 - 0:45',
      title: '2. Live Bidding & Fair-Price Guide',
      subtitle: 'Customer posts job with AI photo diagnosis; nearby workers send real quotes',
      narration: 'Watch our headline differentiator: The mini reverse auction! The customer snaps the problem, AI recommends a fair price range (₹280-₹450), and verified workers within 3 km send live bids within seconds.',
      targetTab: 'customer',
      badge: 'Headline Feature'
    },
    {
      timeRange: '0:45 - 1:15',
      title: '3. Negotiation, Escrow-Lite & Live Map',
      subtitle: 'Customer counters quote, accepts, and tracks 18-minute live arrival',
      narration: 'The customer compares rating, distance, and ETA, counters one quote to ₹320, and accepts! Funds are held safely in Escrow-Lite, and the live map shows Rameshwar arriving in 12 minutes.',
      targetTab: 'customer',
      badge: 'The 30-Min Promise'
    },
    {
      timeRange: '1:15 - 1:40',
      title: '4. Worker-First App (Ustaad Mode)',
      subtitle: 'Voice quotes in Hindi/Marathi, 2G fallback & earnings dashboard',
      narration: 'Now see what impresses judges most: The worker app! Built for low digital literacy, Rameshwar simply speaks "₹350, 15 minutes" in Marathi. His earnings dashboard shows 100% take-home and upskilling nudges.',
      targetTab: 'worker',
      badge: 'Social Impact'
    },
    {
      timeRange: '1:40 - 2:00',
      title: '5. Trust, OTP Job Start & SOS Shield',
      subtitle: 'Aadhaar + Police verification, OTP start, two-way ratings & SOS',
      narration: 'Arrival is photo-verified: Rameshwar inputs the customer’s 4-digit OTP to start work. An emergency SOS button sounds a live siren, and two-way ratings protect workers from abusive clients.',
      targetTab: 'customer',
      badge: 'Trust & Safety'
    }
  ];

  const current = steps[currentStepIndex];

  const goToStep = (idx) => {
    setCurrentStepIndex(idx);
    playAudioCue('bid_received');
    onStepChange(steps[idx].targetTab, idx);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-6 shadow-2xl border-2 border-orange-500/80 space-y-4 animate-in slide-in-from-bottom duration-300">
      
      {/* Top row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
            2-Minute Pitch Demo Flow
          </span>
          <span className="text-slate-400 text-xs">({currentStepIndex + 1} of 5)</span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            ⏱️ {current.timeRange}
          </span>
          <span className="text-[11px] font-bold bg-orange-600/30 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/40">
            {current.badge}
          </span>
        </div>

        <h4 className="text-lg font-black text-white">
          {current.title}
        </h4>
        <div className="text-xs font-semibold text-slate-300">
          {current.subtitle}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
          🗣️ <strong className="text-white">Pitch Script: </strong>
          "{current.narration}"
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`w-7 h-2 rounded-full transition-all ${
                i === currentStepIndex ? 'bg-orange-500 w-10' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

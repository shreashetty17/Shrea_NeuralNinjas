import React, { useState } from 'react';
import { 
  Calendar, 
  RotateCcw, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  UserCheck, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';

export const RecurringBookings = () => {
  const [selectedPlan, setSelectedPlan] = useState('cook');
  const [frequency, setFrequency] = useState('daily');
  const [substituteRequested, setSubstituteRequested] = useState(false);
  const [substituteMatched, setSubstituteMatched] = useState(false);
  const [autoSubstituteActive, setAutoSubstituteActive] = useState(true);

  // Default recurring helper
  const primaryCook = WORKERS_DATABASE[4]; // Rekha Kamble
  const substituteCook = WORKERS_DATABASE[10]; // Pooja Vishwakarma

  const handleSimulateAbsentSubstitute = () => {
    setSubstituteRequested(true);
    setSubstituteMatched(false);
    playAudioCue('bid_received');

    setTimeout(() => {
      setSubstituteMatched(true);
      playAudioCue('match_success');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Smart Retention Feature
            </span>
            <span className="text-xs text-slate-500 font-medium">Daily & Weekly Subscriptions</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Recurring Maid & Cook Bookings
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Fair monthly wages, fixed shifts, with <strong className="text-orange-600">Zero-Leave Auto-Substitute Guarantee</strong>.
          </p>
        </div>

        {/* Substitute Guarantee Pill */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-extrabold block">Instant Substitute SLA</span>
            <span className="text-[11px] text-emerald-700">Auto-dispatches verified neighbor if primary is on leave</span>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedPlan('cook')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedPlan === 'cook'
              ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-400/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-slate-900">Dedicated Home Cook (Maharaj)</span>
            <span className="text-xs font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
              ₹4,200 / month
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Lunch & Dinner preparation (2-4 persons). Maharashtrian, North Indian, or Jain cuisine options.
          </p>
        </div>

        <div
          onClick={() => setSelectedPlan('maid')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedPlan === 'maid'
              ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-400/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-slate-900">Daily House Maid & Cleaning</span>
            <span className="text-xs font-extrabold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
              ₹3,200 / month
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Sweeping, mopping, utensil cleaning, and dusting. Mon to Sat 45-minute morning slot.
          </p>
        </div>
      </div>

      {/* Primary Assigned Worker & Substitute Demo */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your Designated Primary Professional
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Auto-Substitute Shield:</span>
            <button
              onClick={() => setAutoSubstituteActive(!autoSubstituteActive)}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                autoSubstituteActive ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoSubstituteActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={primaryCook.photo}
              alt={primaryCook.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 text-sm">{primaryCook.name}</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Primary Assigned
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Specialty: {primaryCook.specialty} • Slot: 8:00 AM Daily
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateAbsentSubstitute}
            className="px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs transition-colors shrink-0"
          >
            Simulate "Primary on Leave Today"
          </button>
        </div>

        {/* Substitute Match Result */}
        {substituteRequested && (
          <div className="p-4 rounded-xl border-2 border-emerald-400 bg-emerald-50/60 space-y-3 animate-in fade-in">
            {!substituteMatched ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Clock className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Primary reported leave. AI auto-matching neighborhood substitute with matched taste preferences...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Substitute Auto-Matched & Dispatched! Zero Disruption Guarantee</span>
                </div>

                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-emerald-200">
                  <img
                    src={substituteCook.photo}
                    alt={substituteCook.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">{substituteCook.name} (Substitute)</h5>
                    <p className="text-[11px] text-slate-500">{substituteCook.locality} • ⭐ {substituteCook.rating}</p>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      ✓ Profile synced with your dietary spice instructions
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

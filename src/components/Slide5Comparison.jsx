import React, { useState } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Download,
  Presentation
} from 'lucide-react';
import { COMPETITOR_COMPARISON } from '../data/mockData';

export const Slide5Comparison = () => {
  const [highlightDimension, setHighlightDimension] = useState(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Slide 5 Title Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/40 uppercase tracking-widest flex items-center gap-1.5">
              <Presentation className="w-3.5 h-3.5 text-orange-400" />
              <span>Pitch Slide 5 • Competitive Moat</span>
            </span>
            <span className="text-slate-400 text-xs font-semibold">Social Impact & Market Differentiator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Why KaamSetu Wins Over Monopoly Fixed-Rate Apps
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Urban Company fixes rates centrally and squeezes worker margins with harsh penalties. Local brokers exploit both sides. KaamSetu’s <strong className="text-secondary-400">worker-set reverse bidding</strong> and <strong className="text-emerald-400">voice-first regional accessibility</strong> create an equitable, high-velocity hyperlocal ecosystem.
          </p>
        </div>

        {/* Quick Win Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-2xl font-black text-secondary-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Worker-Set Pricing</div>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-2xl font-black text-emerald-400">&lt; 18 min</div>
            <div className="text-xs text-slate-400 mt-0.5">Average Mumbai Match</div>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-2xl font-black text-amber-400">Voice-1st</div>
            <div className="text-xs text-slate-400 mt-0.5">Hindi & Marathi AI Bids</div>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-2xl font-black text-sky-400">2-Tier</div>
            <div className="text-xs text-slate-400 mt-0.5">Aadhaar + Police Trust</div>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Detailed Strategic Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating 7 mission-critical operational pillars for blue-collar platforms
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Legend:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ Market Leader
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
              ✕ Critical Flaw
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <th className="py-4 px-6 w-1/5">Capability / Dimension</th>
                <th className="py-4 px-6 w-1/4 bg-orange-50/60 text-orange-950 border-x-2 border-orange-400/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                    <span>KaamSetu (कामसेतु)</span>
                    <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.2 rounded font-black">OUR APP</span>
                  </div>
                </th>
                <th className="py-4 px-5 text-slate-700">Urban Company</th>
                <th className="py-4 px-5 text-slate-700">Quick Apps (Snabbit/Pronto)</th>
                <th className="py-4 px-5 text-slate-700">Justdial / Brokers</th>
                <th className="py-4 px-5 text-slate-700">Apna / WorkIndia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {COMPETITOR_COMPARISON.map((row, idx) => {
                const isSelected = highlightDimension === idx;
                return (
                  <tr
                    key={idx}
                    onMouseEnter={() => setHighlightDimension(idx)}
                    onMouseLeave={() => setHighlightDimension(null)}
                    className={`transition-colors ${
                      isSelected ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Dimension Name */}
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      {row.feature}
                    </td>

                    {/* KaamSetu (Winner) */}
                    <td className="py-4 px-6 font-bold text-slate-900 bg-orange-50/40 border-x-2 border-orange-300/40">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-900 leading-snug">{row.kaamSetu}</span>
                      </div>
                    </td>

                    {/* Urban Company */}
                    <td className="py-4 px-5 text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold shrink-0">✕</span>
                        <span>{row.urbanCompany}</span>
                      </div>
                    </td>

                    {/* Quick Apps */}
                    <td className="py-4 px-5 text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold shrink-0">~</span>
                        <span>{row.quickApps}</span>
                      </div>
                    </td>

                    {/* Justdial */}
                    <td className="py-4 px-5 text-slate-500">
                      <div className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold shrink-0">✕</span>
                        <span>{row.justdial}</span>
                      </div>
                    </td>

                    {/* Apna / WorkIndia */}
                    <td className="py-4 px-5 text-slate-500">
                      <div className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold shrink-0">-</span>
                        <span>{row.apnaWorkIndia}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer takeaway for presentation */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              💡
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-extrabold text-slate-900">Judges Takeaway: </span>
              KaamSetu bridges trust without monopolistic rate extraction. Workers earn 25-35% more while customers receive on-demand quotes in under 3 minutes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

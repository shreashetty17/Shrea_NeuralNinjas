import React from 'react';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Utensils, 
  AirVent, 
  Hammer,
  ArrowRight
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';

export const FigmaTradeStrip = ({ onSelectCategory }) => {
  const tradeIcons = {
    plumbing: Wrench,
    electrical: Zap,
    cleaning: Sparkles,
    cooking: Utensils,
    ac_repair: AirVent,
    carpentry: Hammer
  };

  return (
    <section id="services" className="py-12 border-y border-[#E5E4DC]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Big fixes. Small jobs. A pro on the curb.
        </h2>
        <button
          onClick={() => onSelectCategory(SERVICE_CATEGORIES[0])}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Explore all trades</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = tradeIcons[cat.id] || Wrench;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="p-4 rounded-2xl bg-white border border-[#E5E4DC] hover:border-emerald-600 hover:shadow-galli-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {cat.name}
                </h4>
                <p className="text-[11px] font-devanagari text-stone-500 mt-0.5">
                  {cat.nameHi}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between text-[10px]">
                <span className="text-stone-400 font-medium">From</span>
                <span className="font-extrabold text-slate-900">{cat.typicalRange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

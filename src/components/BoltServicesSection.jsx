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

export const BoltServicesSection = ({ onSelectCategory }) => {
  const tradeIcons = {
    plumbing: Wrench,
    electrical: Zap,
    cleaning: Sparkles,
    cooking: Utensils,
    ac_repair: AirVent,
    carpentry: Hammer
  };

  return (
    <section id="services" className="py-16 border-t border-slate-200">
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 border border-primary-200 text-primary-800 text-xs font-bold uppercase tracking-wider">
          <span>All Services</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          What do you need today?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl">
          Post a request and get bids from verified workers in minutes. No fixed prices, no middleman markups.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((cat) => {
          const Icon = tradeIcons[cat.id] || Wrench;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:border-primary-500 hover:shadow-bolt-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Starting at ₹{cat.minFair}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs font-devanagari text-slate-500 mt-0.5">
                  {cat.nameHi}
                </p>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-500">Typical range: <strong className="text-slate-800">₹{cat.typicalRange}</strong></span>
                <span className="text-xs font-bold text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

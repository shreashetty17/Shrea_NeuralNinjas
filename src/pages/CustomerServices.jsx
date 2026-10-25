import React, { useState } from 'react';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Utensils, 
  AirVent, 
  Hammer,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerServices = ({ onSelectCategory, lang = 'en' }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const tradeIcons = {
    plumbing: Wrench,
    electrical: Zap,
    cleaning: Sparkles,
    cooking: Utensils,
    ac_repair: AirVent,
    carpentry: Hammer
  };

  const getCategoryName = (cat) => {
    if (lang === 'hi') return cat.nameHi || cat.name;
    if (lang === 'mr') return cat.nameMr || cat.name;
    return cat.name;
  };

  const filteredCategories = activeFilter === 'all'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter((c) => c.id === activeFilter);

  return (
    <div className="space-y-12 animate-in fade-in">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
          <span>{t.servicesTag}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {t.servicesTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t.servicesSubtitle}
        </p>
      </div>

      {/* Trade Selector Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-bolt-sm">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.allTrades} ({SERVICE_CATEGORIES.length})
        </button>

        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === cat.id
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {getCategoryName(cat)}
          </button>
        ))}
      </div>

      {/* Services Grid with Detailed Problem Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const Icon = tradeIcons[cat.id] || Wrench;
          const subServices = (t.subServices && t.subServices[cat.id]) || [];

          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    {t.fromPrice} ₹{cat.minFair}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">
                    {getCategoryName(cat)}
                  </h3>
                  <p className="text-xs font-devanagari text-slate-400 mt-0.5">
                    {lang === 'en' ? cat.nameHi : cat.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Sub-services checklist */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {t.commonRepairsCovered}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {subServices.map((sub, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Price band & CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.fairPriceBand}</span>
                  <span className="text-xs font-bold text-slate-900">{cat.typicalRange}</span>
                </div>

                <button
                  onClick={() => onSelectCategory(cat)}
                  className="btn-primary text-xs px-4 py-2.5 shadow-sm"
                >
                  <span>{t.btnRequestBids}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Fair Price Algorithmic Explainer */}
      <div className="p-8 rounded-3xl bg-slate-100/80 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-primary-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{t.fairPriceGuideTag}</span>
          </div>
          <h4 className="text-base font-display font-bold text-slate-900">
            {t.fairPriceGuideTitle}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.fairPriceGuideDesc}
          </p>
        </div>

        <button
          onClick={() => onSelectCategory(SERVICE_CATEGORIES[0])}
          className="btn-primary text-xs px-5 py-3 shadow-sm shrink-0"
        >
          {t.postJobBudgetBtn}
        </button>
      </div>

    </div>
  );
};

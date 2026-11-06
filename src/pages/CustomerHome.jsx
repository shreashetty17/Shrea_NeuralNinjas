import React from 'react';
import { BoltHeroBright } from '../components/BoltHeroBright';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Utensils, 
  AirVent, 
  Hammer,
  ShieldCheck, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerHome = ({
  onFindWorker,
  onSelectCategory,
  onNavigatePage,
  onOpenChat,
  hasActiveBooking = false,
  lang = 'en'
}) => {
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

  return (
    <div className="space-y-12">
      
      {/* Hero Section */}
      <BoltHeroBright
        onFindWorker={onFindWorker}
        onExploreServices={() => onNavigatePage('services')}
        lang={lang}
      />

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0A2540] tracking-tight">
            {t.navHowItWorks || 'How it works'}
          </h2>
          <p className="text-lg sm:text-xl font-display font-bold text-[#149B8B]">
            Bid Fair, Earn Better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: '01', title: t.step1Title, tag: t.step1Tag, tagClass: 'text-primary-600 bg-primary-50 border-primary-100' },
            { n: '02', title: t.step2Title, tag: t.step2Tag, tagClass: 'text-emerald-800 bg-emerald-50 border-emerald-100' },
            { n: '03', title: t.step3Title, tag: t.step3Tag, tagClass: 'text-secondary-800 bg-secondary-50 border-secondary-100' },
            { n: '04', title: t.step4Title, tag: t.step4Tag, tagClass: 'text-slate-700 bg-slate-100 border-slate-200' }
          ].map((step) => (
            <div key={step.n} className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-display font-bold text-base flex items-center justify-center">
                {step.n}
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900">{step.title}</h3>
              <div className={`text-[11px] font-bold p-2.5 rounded-xl border ${step.tagClass}`}>{step.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-bolt-md space-y-6">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0A2540] tracking-tight text-center">
          Why choose us?
        </h2>
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-primary-50/60 border border-primary-200/80 space-y-4">
          <div className="flex items-center gap-2.5 text-primary-800 font-display font-bold text-base sm:text-lg">
            <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
            <span>{t.kaamsetuTitle || t.kaamwalaTitle}</span>
          </div>
          <ul className="space-y-3 text-sm sm:text-base text-slate-700">
            {(t.kaamsetuPoints || t.kaamwalaPoints || []).map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-primary-600 font-black">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
};

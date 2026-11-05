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

      {/* Quick Services Preview Strip */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-bolt-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-secondary-600">
              {t.homePopularTrades}
            </span>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
              {t.homeSelectService}
            </h2>
          </div>
          <button
            onClick={() => onNavigatePage('services')}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5"
          >
            <span>{t.homeViewAllCategories}</span>
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
                className="p-4 rounded-2xl bg-slate-50 hover:bg-primary-50/70 border border-slate-200/80 hover:border-primary-400 cursor-pointer transition-all text-center group flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-primary-600 group-hover:text-white text-primary-700 flex items-center justify-center shadow-xs transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900 group-hover:text-primary-800">
                    {getCategoryName(cat)}
                  </h4>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {t.fromPrice} ₹{cat.minFair}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights: 30-min guarantee, Reverse Auction, Safety */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigatePage('how-it-works')}
          className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
            {t.featureBiddingTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.featureBiddingDesc}
          </p>
          <span className="text-xs font-bold text-primary-600 flex items-center gap-1 pt-1">
            <span>{t.featureBiddingLink}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigatePage('tracker')}
          className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-secondary-600 transition-colors">
            {t.featureArrivalTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.featureArrivalDesc}
          </p>
          <span className="text-xs font-bold text-secondary-600 flex items-center gap-1 pt-1">
            <span>{t.featureArrivalLink}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigatePage('safety')}
          className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-shadow cursor-pointer group space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {t.featureSafetyTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.featureSafetyDesc}
          </p>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
            <span>{t.featureSafetyLink}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </section>

      {/* Active Ongoing Job & Chat Callout */}
      <section className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-bolt-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.activeDirectComm}</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            {t.chatRealTimeTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.chatRealTimeDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (hasActiveBooking && onOpenChat) {
                onOpenChat();
              } else {
                onFindWorker();
              }
            }}
            className="btn-primary text-xs px-5 py-3 shadow-md flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{hasActiveBooking ? t.btnChatAssigned : t.btnBookToChat}</span>
          </button>

          <button
            onClick={() => onNavigatePage('tracker')}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-secondary-400" />
            <span>{t.btnTrackLiveMap}</span>
          </button>
        </div>
      </section>

    </div>
  );
};

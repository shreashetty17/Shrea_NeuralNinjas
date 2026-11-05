import React from 'react';
import { 
  Send, 
  Users, 
  ArrowLeftRight, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Clock,
  Mic,
  Zap,
  ArrowRight
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const CustomerHowItWorks = ({ onStartBooking, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="space-y-16 animate-in fade-in">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
          <span>{t.howItWorksTag}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {t.howItWorksTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t.howItWorksSubtitle}
        </p>
      </div>

      {/* 4 Interactive Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-display font-bold text-base flex items-center justify-center">
            01
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">
            {t.step1Title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.step1Desc}
          </p>
          <div className="text-[11px] font-bold text-primary-600 bg-primary-50 p-2.5 rounded-xl border border-primary-100">
            {t.step1Tag}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-display font-bold text-base flex items-center justify-center">
            02
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">
            {t.step2Title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.step2Desc}
          </p>
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            {t.step2Tag}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-display font-bold text-base flex items-center justify-center">
            03
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">
            {t.step3Title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.step3Desc}
          </p>
          <div className="text-[11px] font-bold text-secondary-800 bg-secondary-50 p-2.5 rounded-xl border border-secondary-100">
            {t.step3Tag}
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 font-display font-bold text-base flex items-center justify-center">
            04
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">
            {t.step4Title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.step4Desc}
          </p>
          <div className="text-[11px] font-bold text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            {t.step4Tag}
          </div>
        </div>

      </div>

      {/* The KaamSetu Difference vs Fixed Monopoly Apps */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-bolt-md space-y-8">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-secondary-600">
            {t.diffTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
            {t.diffTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.diffSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monopoly Fixed Apps */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700 font-display font-bold text-base">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{t.monopolyTitle}</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {t.monopolyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-black">✕</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KaamSetu Marketplace */}
          <div className="p-6 sm:p-8 rounded-3xl bg-primary-50/60 border border-primary-200/80 space-y-4">
            <div className="flex items-center gap-2.5 text-primary-800 font-display font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
              <span>{t.kaamsetuTitle || t.kaamwalaTitle}</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {(t.kaamsetuPoints || t.kaamwalaPoints).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-primary-600 font-black">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
            {t.readyPrompt}
          </p>
          <button
            onClick={onStartBooking}
            className="btn-primary text-xs sm:text-sm px-6 py-3 shadow-sm flex items-center gap-2"
          >
            <span>{t.postRequestNow}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

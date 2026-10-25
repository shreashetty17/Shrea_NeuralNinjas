import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  FileCheck,
  AlertTriangle,
  Camera,
  Star
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerSafety = ({ onOpenSos, onOpenVerifyModal, onOpenEscrowModal, lang = 'en' }) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleTestSiren = () => {
    setSirenPlaying(true);
    playAudioCue('sos');
    setTimeout(() => {
      setSirenPlaying(false);
    }, 2500);
  };

  return (
    <div className="space-y-16 animate-in fade-in">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <span>{t.safetyTag}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {t.safetyTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t.safetySubtitle}
        </p>
      </div>

      {/* 2-Tier Verification Cards */}
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t.bgEngineTag}
          </span>
          <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">
            {t.tierStackTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.tierStackSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              {t.tier1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.tier1Desc}
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
              {t.tier1Badge}
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              {t.tier2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.tier2Desc}
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
              {t.tier2Badge}
            </span>
          </div>

        </div>
      </div>

      {/* Interactive Safety Features: Start OTP, SOS Siren, Escrow-Lite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Feature 1: Start OTP */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            {t.startOtpCardTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.startOtpCardDesc}
          </p>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.currentOtpLabel}</span>
            <span className="text-2xl font-mono font-black text-secondary-600">4829</span>
          </div>
        </div>

        {/* Feature 2: SOS Siren Alert */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            {t.sosCardTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.sosCardDesc}
          </p>
          <div className="pt-2">
            <button
              onClick={handleTestSiren}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                sirenPlaying
                  ? 'bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{sirenPlaying ? t.sirenSounding : t.testSirenBtn}</span>
            </button>
          </div>
        </div>

        {/* Feature 3: Escrow-Lite Terms */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            {t.escrowCardTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.escrowCardDesc}
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenEscrowModal}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
            >
              {t.viewEscrowRulesBtn}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

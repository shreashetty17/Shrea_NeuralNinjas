import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Star, 
  Zap,
  Wrench
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const BoltHeroBright = ({ onFindWorker, onExploreServices, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Headline, Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs sm:text-sm font-bold border border-primary-200">
            <Zap className="w-4 h-4 text-primary-600" />
            <span>{t.badgeFastMatch}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-slate-900 leading-[1.05] tracking-tight">
            {lang === 'hi' ? (
              <>सही काम。<br /><span className="text-primary-600">सही दाम।</span><br />आपके द्वार पर।</>
            ) : lang === 'mr' ? (
              <>योग्य काम.<br /><span className="text-primary-600">योग्य मोबदला.</span><br />आपल्या दारी.</>
            ) : (
              <>Fair work.<br /><span className="text-primary-600">Fair pay.</span><br />On your doorstep.</>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
            {t.subtitle}
          </p>

          {/* Customer CTAs (NO 'Join as a worker'!) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onFindWorker}
              className="btn-primary text-base px-8 py-4 shadow-bolt-md flex items-center justify-center gap-2"
            >
              <span>{t.btnFindWorker}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="btn-secondary text-base px-7 py-4 flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4 text-slate-600" />
                <span>{t.btnExploreServices}</span>
              </button>
            )}
          </div>

          {/* Stats Strip */}
          <div className="pt-8 flex items-center gap-6 sm:gap-10 text-sm">
            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900">
                150+
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {t.statWorkers}
              </p>
            </div>

            <div className="w-px h-10 bg-slate-200" />

            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900">
                12,400+
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {t.statJobs}
              </p>
            </div>

            <div className="w-px h-10 bg-slate-200" />

            <div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 text-amber-500">
                4.9★
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {t.statRating}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Image with Floating Interactive Cards */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            
            {/* Main Worker Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                alt="Worker providing domestic repair service"
                className="w-full object-cover h-[440px] sm:h-[490px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Card 1: Verified Worker Badge */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl p-3.5 sm:p-4 border border-slate-100 w-52 sm:w-56 animate-bounce-subtle">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-900">{t.floatingVerifiedWorker}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {t.floatingVerifiedDesc}
              </p>
            </div>

            {/* Floating Card 2: Live Bidding Card */}
            <div className="absolute top-1/3 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 w-60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{t.floatingLiveBidding}</span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {t.floatingOffersCount}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Rajesh K. ({lang === 'hi' ? 'प्लंबर' : lang === 'mr' ? 'प्लंबर' : 'Plumber'})</span>
                  <span className="font-bold text-slate-900">₹350</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Sunita D. ({lang === 'hi' ? 'सफाई' : lang === 'mr' ? 'घरकाम' : 'Cleaning'})</span>
                  <span className="font-bold text-slate-900">₹320</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Amit P. ({lang === 'hi' ? 'इलेक्ट्रीशियन' : lang === 'mr' ? 'इलेक्ट्रिशियन' : 'Electrician'})</span>
                  <span className="font-bold text-slate-900">₹400</span>
                </div>
              </div>
            </div>

            {/* Floating Card 3: Arrival Tracker */}
            <div className="absolute -bottom-4 left-4 sm:left-6 bg-white rounded-2xl shadow-xl p-3.5 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t.floatingArriving}
                </span>
                <span className="text-[11px] text-slate-500">{t.floatingDistanceBike}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

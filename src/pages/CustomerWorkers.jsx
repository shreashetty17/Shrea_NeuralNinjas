import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  ArrowRight,
  Search,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { WORKERS_DATABASE } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerWorkers = ({ onSelectWorkerToBook, lang = 'en' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('all');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const filtered = WORKERS_DATABASE.filter((w) => {
    const matchTrade = filterTrade === 'all' || w.trade === filterTrade;
    const matchSearch = !searchQuery.trim() || 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.specialty && w.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTrade && matchSearch;
  });

  const getWorkerTradeLabel = (w) => {
    if (lang === 'hi') {
      if (w.trade === 'plumbing') return 'वरिष्ठ प्लंबर (नल/पाइप)';
      if (w.trade === 'electrical') return 'प्रमाणित इलेक्ट्रीशियन (बिजली)';
      if (w.trade === 'cleaning') return 'सफाई एवं घरेलू सहायिका';
      if (w.trade === 'cooking') return 'विशेषज्ञ रसोइया / महाराज';
      if (w.trade === 'ac_repair') return 'एसी एवं उपकरण टेक्नीशियन';
      if (w.trade === 'carpentry') return 'वरिष्ठ बढ़ई (फर्नीचर)';
      return 'सत्यापित कारीगर';
    }
    if (lang === 'mr') {
      if (w.trade === 'plumbing') return 'वरिष्ठ प्लंबर (नळ/पाईप)';
      if (w.trade === 'electrical') return 'प्रमाणित इलेक्ट्रिशियन';
      if (w.trade === 'cleaning') return 'घरकाम व स्वच्छता सहाय्यक';
      if (w.trade === 'cooking') return 'अनुभवी स्वयंपाकी / कुक';
      if (w.trade === 'ac_repair') return 'एसी व उपकरण दुरुस्ती मेकॅनिक';
      if (w.trade === 'carpentry') return 'वरिष्ठ सुतार (फर्निचर)';
      return 'पडताळलेले कारागीर';
    }
    return w.tradeLabel || w.trade;
  };

  const tradeTabs = [
    { id: 'all', label: t.tradeTabAll },
    { id: 'plumbing', label: t.tradeTabPlumbers },
    { id: 'electrical', label: t.tradeTabElectricians },
    { id: 'cleaning', label: t.tradeTabMaids },
    { id: 'cooking', label: t.tradeTabCooks },
    { id: 'ac_repair', label: t.tradeTabAc },
    { id: 'carpentry', label: t.tradeTabCarpenters }
  ];

  return (
    <div className="space-y-12 animate-in fade-in">
      
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs font-bold uppercase tracking-wider">
          <span>{t.workersTag}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {t.workersTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t.workersSubtitle}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-bolt-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Trade Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
            {tradeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTrade(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTrade === tab.id
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>{t.showingWorkersCount.replace('{count}', filtered.length)}</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-primary-600 font-bold hover:underline">
              {t.clearSearch}
            </button>
          )}
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={w.photo}
                  alt={w.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-200 shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-base text-slate-900 truncate">
                      {w.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-primary-700 capitalize">
                    {getWorkerTradeLabel(w)}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{w.locality}</span>
                  </p>
                </div>
              </div>

              {/* Badges / Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.ratingLabel}</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{w.rating}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.jobsLabel}</span>
                  <span className="font-bold text-slate-900">{w.jobsCompleted || w.jobsDone || 120}+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.etaLabel}</span>
                  <span className="font-bold text-emerald-700">{w.etaMins}m</span>
                </div>
              </div>

              {/* Bio & Skills */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {w.specialty || w.bio || 'Experienced verified technician with 5+ years of verified on-field experience in Mumbai.'}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(w.badges || ['Verified Pro', 'Aadhaar Verified']).slice(0, 3).map((badge, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.rateRangeLabel}</span>
                <span className="text-xs font-bold text-slate-900">{w.fairRateRange || `₹${w.hourlyRate || 350}/job`}</span>
              </div>
              <button
                onClick={() => onSelectWorkerToBook(w)}
                className="btn-primary text-xs px-4 py-2"
              >
                <span>{t.btnRequestBid}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

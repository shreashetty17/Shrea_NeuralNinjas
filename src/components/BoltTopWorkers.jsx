import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { WORKERS_DATABASE } from '../data/mockData';

export const BoltTopWorkers = ({ onSelectWorkerToBook }) => {
  const [filterTrade, setFilterTrade] = useState('all');

  const filtered = WORKERS_DATABASE.filter((w) => {
    if (filterTrade === 'all') return true;
    return w.trade === filterTrade;
  });

  return (
    <section id="top-workers" className="py-16 border-t border-slate-200 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 border border-secondary-200 text-secondary-800 text-xs font-bold uppercase tracking-wider">
            <span>Top Workers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Meet the people who get it done
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Real workers. Real ratings. Real earnings. Background + Police + ID verified.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'all', label: 'All' },
            { id: 'plumbing', label: 'Plumbers' },
            { id: 'electrical', label: 'Electricians' },
            { id: 'cleaning', label: 'Maids' },
            { id: 'cooking', label: 'Cooks' },
            { id: 'ac_repair', label: 'AC Tech' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterTrade(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTrade === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
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
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-base text-slate-900 truncate">
                      {w.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-primary-700 capitalize">
                    {w.tradeLabel || w.trade}
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
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{w.rating}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Jobs</span>
                  <span className="font-bold text-slate-900">{w.jobsCompleted || w.jobsDone || 120}+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ETA</span>
                  <span className="font-bold text-emerald-700">{w.etaMins}m</span>
                </div>
              </div>

              {/* Bio & Skills */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {w.specialty || w.bio || 'Experienced verified professional with 5+ years of verified on-field experience in Mumbai.'}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(w.badges || w.specialties || ['Verified Pro', 'Top Rated']).slice(0, 3).map((badge, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate range</span>
                <span className="text-xs font-bold text-slate-900">{w.fairRateRange || `₹${w.hourlyRate || 350}/job`}</span>
              </div>
              <button
                onClick={() => onSelectWorkerToBook(w)}
                className="btn-primary text-xs px-4 py-2"
              >
                <span>Request Bid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

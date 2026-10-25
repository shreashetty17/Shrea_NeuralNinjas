import React from 'react';
import { LiveMapTracker } from '../components/LiveMapTracker';
import { 
  MapPin, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Navigation,
  X
} from 'lucide-react';
import { WORKERS_DATABASE } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CustomerTrackingPage = ({
  activeBooking = {
    quote: {
      worker: WORKERS_DATABASE[0],
      quoteAmount: 350,
      etaMins: 8
    }
  },
  onConfirmCompletion,
  onOpenSos,
  onOpenChatPopup,
  onCancelBooking,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const assignedWorker = activeBooking?.quote?.worker || WORKERS_DATABASE[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header with Live Status & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-bolt-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.workerDispatched}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {t.liveTrackerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.assignedWorkerLabel}: <strong>{assignedWorker.name}</strong> ({assignedWorker.tradeLabel}) • {t.bikeDispatched}
          </p>
        </div>

        {/* Action Buttons: Chat & Cancel */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {onOpenChatPopup && (
            <button
              onClick={() => onOpenChatPopup(activeBooking)}
              className="btn-primary text-xs sm:text-sm px-4 py-2.5 shadow-sm flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.btnChatWorker}</span>
            </button>
          )}

          {onCancelBooking && (
            <button
              onClick={() => onCancelBooking(activeBooking)}
              className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Cancel booking and review cancellation charges"
            >
              <X className="w-4 h-4" />
              <span>{t.cancelBookingBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Full-width Map Tracker */}
      <div className="w-full">
        <LiveMapTracker
          activeBooking={activeBooking}
          onConfirmCompletion={onConfirmCompletion}
          onOpenSos={onOpenSos}
          selectedWorker={assignedWorker}
          onSelectWorker={() => {}}
          onOpenChat={() => onOpenChatPopup && onOpenChatPopup(activeBooking)}
          onCancelBooking={() => onCancelBooking && onCancelBooking(activeBooking)}
          lang={lang}
        />
      </div>

    </div>
  );
};

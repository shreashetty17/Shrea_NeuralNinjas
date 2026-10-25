import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Navigation, 
  PhoneCall, 
  KeyRound, 
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Lock,
  X,
  AlertTriangle
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { updateBookingStatus, cancelBooking } from '../services/db';
import { CancellationModal } from '../components/CancellationModal';

export const CustomerMyBookings = ({
  bookings = [],
  onTrackBooking,
  onChatWithWorker,
  onBookNewService,
  onUpdateBookings,
  lang = 'en'
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'scheduled' | 'completed' | 'cancelled'
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'active') return b.status === 'en_route' || b.status === 'in_progress';
    if (filter === 'scheduled') return b.status === 'scheduled';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleReleaseEscrow = (bookingId, workerName, amount) => {
    updateBookingStatus(bookingId, 'completed');
    if (onUpdateBookings) onUpdateBookings();
    alert(`Success! Escrow payment of ₹${amount} released to ${workerName}. Thank you for using KaamSetu.`);
  };

  const handleConfirmCancel = (bk, fee, reason) => {
    cancelBooking(bk.id, reason, fee);
    if (onUpdateBookings) onUpdateBookings();
    setCancellingBooking(null);
    alert(`Booking "${bk.title}" has been cancelled.\n• Cancellation Fee: ₹${fee} (Technician travel allowance)\n• Refund Credited: ₹${Math.max(0, (bk.quoteAmount || 0) - fee)}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header with Title and 'Book Another Service' CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-bolt-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{lang === 'hi' ? 'ग्राहक डैशबोर्ड' : lang === 'mr' ? 'ग्राहक डॅशबोर्ड' : 'Customer Dashboard'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {t.bookingsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {t.bookingsSubtitle}
          </p>
        </div>

        <button
          onClick={onBookNewService}
          className="btn-primary text-xs sm:text-sm px-5 py-3 shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.bookAnotherService}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs">
        {[
          { id: 'all', label: `${t.filterAll} (${bookings.length})` },
          { id: 'active', label: `${t.filterActive} (${bookings.filter(b => b.status === 'en_route' || b.status === 'in_progress').length})` },
          { id: 'scheduled', label: `${t.filterScheduled} (${bookings.filter(b => b.status === 'scheduled').length})` },
          { id: 'completed', label: `${t.filterCompleted} (${bookings.filter(b => b.status === 'completed').length})` },
          { id: 'cancelled', label: `${t.filterCancelled} (${bookings.filter(b => b.status === 'cancelled').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-primary-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900">
            {t.noBookingsFound}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.noBookingsDesc}
          </p>
          <button
            onClick={onBookNewService}
            className="btn-primary text-xs px-6 py-2.5 shadow-sm"
          >
            {t.bookServiceNow}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((bk) => {
            const worker = bk.worker || {};
            const isEnRoute = bk.status === 'en_route';
            const isScheduled = bk.status === 'scheduled';
            const isCompleted = bk.status === 'completed';
            const isCancelled = bk.status === 'cancelled';

            return (
              <div
                key={bk.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm hover:shadow-bolt-md transition-all p-6 sm:p-8 space-y-6"
              >
                
                {/* Top Row: Service Title, Timing & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase text-primary-800 bg-primary-100 px-2.5 py-0.5 rounded-full border border-primary-200">
                        {bk.categoryName || 'Home Repair'}
                      </span>
                      <span className="text-xs text-slate-400">• Booking ID: {bk.id}</span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-slate-900">
                      {bk.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {bk.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 self-start sm:self-center">
                    {isEnRoute && (
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{t.statusEnRoute} (~{bk.etaMins || 8} min)</span>
                      </span>
                    )}

                    {isScheduled && (
                      <span className="px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-800 text-xs font-bold border border-primary-200 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary-600" />
                        <span>{t.statusScheduled}</span>
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.statusCompleted}</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancelled (₹{bk.cancellationFee || 50} Fee • ₹{bk.refundAmount ?? Math.max(0, (bk.quoteAmount || 0) - (bk.cancellationFee || 50))} Refunded)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Assigned Technician + Timing Slot + Start OTP + Escrow */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Worker Profile Card */}
                  <div className="md:col-span-5 flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <img
                      src={worker.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'}
                      alt={worker.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-display font-bold text-sm text-slate-900 truncate">
                          {worker.name}
                        </h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-primary-700 font-semibold truncate">
                        {worker.tradeLabel || 'Verified Technician'}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>⭐ {worker.rating || 4.9}</span>
                        <span>•</span>
                        <span className="truncate">{worker.locality || 'Mumbai'}</span>
                      </p>
                    </div>

                    <a
                      href={`tel:${worker.phone || '+919820044102'}`}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors shrink-0"
                      title="Call Worker"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-600" />
                    </a>
                  </div>

                  {/* Timing & Address Details */}
                  <div className="md:col-span-4 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Clock className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                      <span>{bk.timingSlot?.date || 'Today'} • {bk.timingSlot?.timeSlot || bk.urgency}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{bk.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-primary-700 font-semibold pt-1">
                      <Lock className="w-3.5 h-3.5 text-primary-600" />
                      <span>₹{bk.quoteAmount} {t.heldInEscrow}</span>
                    </div>
                  </div>

                  {/* Start OTP Card */}
                  <div className="md:col-span-3 bg-primary-50/70 border border-primary-200 p-3.5 rounded-2xl text-center">
                    <div className="text-[10px] uppercase font-black text-primary-800 tracking-wider flex items-center justify-center gap-1">
                      <KeyRound className="w-3 h-3 text-secondary-600" />
                      <span>{t.startOtpLabel}</span>
                    </div>
                    <div className="text-2xl font-mono font-black text-secondary-600 mt-0.5">
                      {bk.startOtp || '4829'}
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                      {t.otpNotice}
                    </span>
                  </div>

                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    
                    {/* Track on Live Map */}
                    {!isCompleted && (
                      <button
                        onClick={() => onTrackBooking(bk)}
                        className="btn-primary text-xs px-4 py-2.5 shadow-xs flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{t.btnTrackMap}</span>
                      </button>
                    )}

                    {/* Direct Chat with Worker (Enabled because worker IS booked!) */}
                    {!isCancelled && (
                      <button
                        onClick={() => onChatWithWorker(bk)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                        <span>{t.btnChatWorker}</span>
                      </button>
                    )}

                    {/* Cancel Booking Button (Can cancel at any time with policy notice) */}
                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => setCancellingBooking(bk)}
                        className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5"
                        title="Cancel this booking and review cancellation charges"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.cancelBookingBtn}</span>
                      </button>
                    )}

                    {isCancelled && (
                      <button
                        onClick={onBookNewService}
                        className="px-4 py-2.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs border border-primary-200 transition-colors flex items-center gap-1.5"
                      >
                        <span>{t.rebookServiceBtn}</span>
                      </button>
                    )}

                  </div>

                  {/* Release Escrow Button if not completed */}
                  {!isCompleted && !isCancelled && (
                    <button
                      onClick={() => handleReleaseEscrow(bk.id, worker.name, bk.quoteAmount)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs ml-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.btnReleaseEscrow} (₹{bk.quoteAmount})</span>
                    </button>
                  )}

                  {isCompleted && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 ml-auto">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t.serviceCompletedReviewed}</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Charges Popup Modal */}
      <CancellationModal
        isOpen={!!cancellingBooking}
        booking={cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancel}
        lang={lang}
      />

    </div>
  );
};

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Info,
  DollarSign
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const CancellationModal = ({
  isOpen = false,
  onClose,
  booking = null,
  onConfirmCancel,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const reasons = t.reasonsList || [
    'Issue resolved myself',
    'Technician taking longer than expected',
    'Booked wrong service category',
    'Want to reschedule to another date',
    'Emergency / had to leave home'
  ];

  const [selectedReason, setSelectedReason] = useState(reasons[0]);

  if (!isOpen || !booking) return null;

  const quoteAmount = booking.quoteAmount || 350;
  
  // Calculate cancellation fee based on timing and status:
  // If cancelled within 2 minutes of booking or while bidding: ₹0 free cancellation
  // If technician is en route: ₹50 fuel/travel allowance for the worker
  const isEnRoute = booking.status === 'en_route';
  const cancellationFee = isEnRoute ? 50 : 0;
  const refundAmount = Math.max(0, quoteAmount - cancellationFee);

  const handleConfirm = () => {
    playAudioCue('bid_received');
    if (onConfirmCancel) {
      onConfirmCancel(booking, cancellationFee, selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Warning Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {t.cancelPolicyTag}
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
              {t.cancelModalTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.cancelModalSubtitle}
            </p>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900 truncate max-w-[240px]">
              {booking.title}
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              ID: {booking.id}
            </span>
          </div>

          {booking.worker && (
            <div className="flex items-center gap-2.5 text-xs text-slate-600 pt-1 border-t border-slate-200/80">
              <img
                src={booking.worker.photo}
                alt={booking.worker.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
              <span className="font-semibold text-slate-800">
                {t.assignedWorkerLabel || 'Assigned'}: {booking.worker.name} ({booking.worker.tradeLabel})
              </span>
            </div>
          )}
        </div>

        {/* Cancellation Charges Breakdown Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.compBreakdown}</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span>{t.totalEscrowPaid}</span>
              <span className="font-mono font-bold text-slate-900">₹{quoteAmount}</span>
            </div>

            <div className="flex items-center justify-between text-rose-700 font-semibold">
              <span className="flex items-center gap-1">
                <span>{t.travelFuelFee}</span>
              </span>
              <span className="font-mono font-bold">
                {cancellationFee > 0 ? `- ₹${cancellationFee}` : t.freeWindow}
              </span>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-sm font-bold text-emerald-800">
              <span>{t.immediateRefund}</span>
              <span className="font-mono text-base font-black text-emerald-700">₹{refundAmount}</span>
            </div>
          </div>

          <p className="text-[11px] text-amber-800/90 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
            {cancellationFee > 0
              ? t.policyExplainerFee.replace('{refund}', refundAmount)
              : t.policyExplainerFree.replace('{refund}', refundAmount)}
          </p>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            {t.cancelReasonPrompt}
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {reasons.map((reason, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedReason === reason
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="cancellationReason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
          >
            {t.btnKeepBooking}
          </button>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {lang === 'hi' ? 'रद्द करने की पुष्टि करें' : lang === 'mr' ? 'रद्द करण्याची खात्री करा' : 'Confirm & Cancel'} {cancellationFee > 0 ? `(₹${cancellationFee})` : ''}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

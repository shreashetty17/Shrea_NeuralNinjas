import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Share2, 
  PhoneCall, 
  Camera, 
  FileText, 
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { playAudioCue } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const TrustSafetyModal = ({
  isOpen,
  onClose,
  mode = 'sos', // 'sos', 'verify_flow', 'escrow_details', 'dispute', 'two_way_rating'
  activeWorker,
  onTriggerSosPolice,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [sosActivated, setSosActivated] = useState(false);
  const [disputeStep, setDisputeStep] = useState(1);
  const [disputeReason, setDisputeReason] = useState('Service not as described - tap still dripping after repair');
  const [disputeResolved, setDisputeResolved] = useState(false);

  // Verification flow tab
  const [aadhaarInput, setAadhaarInput] = useState('XXXX-XXXX-8921');
  const [digiLockerStatus, setDigiLockerStatus] = useState('Verified');
  const [policeClearanceId, setPoliceClearanceId] = useState('MUM-POL-2026-8812');
  const [nsdcCertId, setNsdcCertId] = useState('NSDC-PLUMB-LVL4-992');

  // Two-way rating inputs
  const [customerRatingForWorker, setCustomerRatingForWorker] = useState(5);
  const [workerRatingForCustomer, setWorkerRatingForCustomer] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSos = () => {
    setSosActivated(true);
    playAudioCue('sos');
    if (onTriggerSosPolice) onTriggerSosPolice();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className={`p-6 text-white flex items-center justify-between ${
          mode === 'sos' ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-slate-900 to-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            {mode === 'sos' ? (
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-secondary-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            )}

            <div>
              <h3 className="text-xl font-black">
                {mode === 'sos' && (t.safetyModalSosTitle || 'Emergency Safety SOS System')}
                {mode === 'verify_flow' && (t.safetyModalVerifyTitle || '2-Tier Worker Verification Engine')}
                {mode === 'escrow_details' && (t.safetyModalEscrowTitle || 'KaamSetu Escrow-Lite Protection')}
                {mode === 'dispute' && (t.safetyModalDisputeTitle || 'Dispute Resolution with Photo Proof')}
                {mode === 'two_way_rating' && (t.safetyModalRatingTitle || 'Two-Way Protective Rating System')}
              </h3>
              <p className="text-xs text-white/80">
                {mode === 'sos' && (t.safetyModalSosSubtitle || 'Real-time alert dispatch to Mumbai Police & Emergency Contact')}
                {mode === 'verify_flow' && (t.safetyModalVerifySubtitle || 'Aadhaar e-KYC and Police Criminal Clearance verified')}
                {mode === 'escrow_details' && (t.safetyModalEscrowSubtitle || 'Funds safely held in escrow until customer inspects and signs off')}
                {mode === 'dispute' && (t.safetyModalDisputeSubtitle || 'Mediation before/after evidence guarantee')}
                {mode === 'two_way_rating' && (t.safetyModalRatingSubtitle || 'Both customer and worker rate each other to ensure mutual respect')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Based on Mode */}
        <div className="p-6 space-y-6">
          
          {/* 1. SOS Emergency Modal */}
          {mode === 'sos' && (
            <div className="space-y-5">
              {!sosActivated ? (
                <>
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-xs space-y-2">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      {t.safetySosInstantProtocol || 'Instant SOS Protocol Active for Mumbai'}
                    </p>
                    <p>
                      {t.safetySosDesc || 'Triggering this will immediately sound the audible local siren, send your exact live GPS coordinates to Mumbai Police Emergency Dispatch (112), and SMS your designated trusted family contact.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPS:</span>
                      <span className="font-mono font-bold text-slate-800">19.1363° N, 72.8277° E (Lokhandwala, Andheri)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.workerCustomerLabel || 'Technician'}:</span>
                      <span className="font-bold text-slate-800">{activeWorker?.name || 'Rameshwar Jadhav'} (+91 98201 44521)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SOS Contact:</span>
                      <span className="font-bold text-slate-800">Aakash (Brother) +91 98200 11999</span>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerSos}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm sm:text-base shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-5 h-5 animate-bounce" />
                    <span>{t.safetySosTapBtn || 'TAP TO ACTIVATE EMERGENCY SOS SIREN & DISPATCH'}</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4 text-center animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center animate-ping-slow">
                    <ShieldAlert className="w-8 h-8" />
                  </div>

                  <h4 className="text-xl font-black text-red-600">
                    {t.safetySosAlertBroadcasted || 'EMERGENCY ALERT BROADCASTED!'}
                  </h4>

                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    {t.safetySosAlertDesc || 'Live GPS tracker shared with Mumbai Police Central Control & Emergency Contact. Siren sound activated on device.'}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <a
                      href="tel:112"
                      className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-red-400" />
                      <span>{t.safetySosCallPolice || 'Call 112 Police Now'}</span>
                    </a>

                    <button
                      onClick={() => {
                        setSosActivated(false);
                        onClose();
                      }}
                      className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      {t.safetySosCancelAlert || 'Cancel Alert'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. 2-Tier Verification Flow Modal */}
          {mode === 'verify_flow' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={activeWorker?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'}
                  alt={activeWorker?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{activeWorker?.name || 'Rameshwar Jadhav'}</h4>
                  <p className="text-xs text-slate-500">{activeWorker?.tradeLabel || 'Senior Master Plumber'}</p>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    ✓ {t.workerBadgeTier1Title || 'Tier 1'} & {t.workerBadgeTier2Title || 'Tier 2'}
                  </span>
                </div>
              </div>

              {/* The 2 Tiers */}
              <div className="space-y-3">
                {/* Tier 1 */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.safetyTier1Title || 'Tier 1: Government Aadhaar / DigiLocker Verification'}</div>
                    <div className="text-[11px] text-slate-600">{t.safetyTier1Desc || 'Aadhaar verified via UIDAI OTP e-KYC. Biometric identity confirmed.'}</div>
                    <div className="text-[10px] font-mono text-emerald-800 mt-1">Aadhaar: {aadhaarInput} • DigiLocker UID Verified</div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.safetyTier2Title || 'Tier 2: Mumbai Police Background Clearance'}</div>
                    <div className="text-[11px] text-slate-600">{t.safetyTier2Desc || 'Clear criminal record check from Special Branch / Local Police Station.'}</div>
                    <div className="text-[10px] font-mono text-emerald-800 mt-1">Certificate #{policeClearanceId} • Verified</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                {t.safetyCloseOverview || 'Close Verification Overview'}
              </button>
            </div>
          )}

          {/* 3. Escrow-Lite Details Modal */}
          {mode === 'escrow_details' && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950 space-y-2">
                <div className="font-extrabold text-sm text-orange-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span>{t.safetyModalEscrowTitle || 'How KaamSetu Escrow-Lite Works'}</span>
                </div>
                <p>
                  {t.safetyEscrowHowItWorks}
                </p>
                <p className="font-semibold">
                  {t.safetyEscrowPayoutRule}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block font-bold text-slate-900">Step 1</span>
                  <span className="text-[11px] text-slate-500">{t.safetyEscrowStep1 || 'Agreed Bid Held'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="block font-bold text-slate-900">Step 2</span>
                  <span className="text-[11px] text-slate-500">{t.safetyEscrowStep2 || 'Service Performed'}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold">
                  <span className="block">Step 3</span>
                  <span className="text-[11px]">{t.safetyEscrowStep3 || 'Instant Payout'}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                {t.safetyGotIt || 'Got It'}
              </button>
            </div>
          )}

          {/* 4. Dispute Resolution Flow */}
          {mode === 'dispute' && (
            <div className="space-y-4">
              {!disputeResolved ? (
                <>
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold block mb-1">{t.safetyDisputeOnHold || 'Escrow Funds On Hold'}</span>
                    {t.safetyDisputeUploadHint || 'Upload before/after photos. Our KaamSetu mediator resolves within 15 minutes.'}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.safetyDisputeReasonLabel || 'Reason for Dispute'}
                    </label>
                    <textarea
                      rows={2}
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium resize-none"
                    />
                  </div>

                  {/* Photo Evidence simulation */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-1">
                      <Camera className="w-5 h-5 text-slate-400 mx-auto" />
                      <span className="font-bold text-slate-700 block">{t.safetyBeforePhoto || 'Before Photo'}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{t.safetyPhotoUploaded || 'Uploaded ✓'}</span>
                    </div>

                    <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-1">
                      <Camera className="w-5 h-5 text-slate-400 mx-auto" />
                      <span className="font-bold text-slate-700 block">{t.safetyAfterPhoto || 'After Photo'}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{t.safetyPhotoUploaded || 'Uploaded ✓'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDisputeResolved(true)}
                    className="w-full py-3 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-extrabold text-xs shadow-md"
                  >
                    {t.safetySubmitEvidence || 'Submit Evidence & Request 15-Min Arbitrator'}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-3 py-4 animate-in fade-in">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">
                    {t.safetyDisputeInitiated || 'Dispute Ticket Initiated'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    {t.safetyDisputeInitiatedDesc || 'Escrow funds are safely frozen. A certified Mumbai tradesman supervisor has been assigned to review photo evidence. 100% money-back guarantee if unfixable.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    {t.btnClose || 'Close'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. Two-Way Rating Modal */}
          {mode === 'two_way_rating' && (
            <div className="space-y-4">
              {!ratingSubmitted ? (
                <>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {t.safetyRateWorker || 'Rate Worker'} ({activeWorker?.name || 'Rameshwar Jadhav'})
                      </span>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            onClick={() => setCustomerRatingForWorker(s)}
                            className={`w-5 h-5 cursor-pointer ${
                              s <= customerRatingForWorker ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          {t.safetyRateWorkerProtection || 'Worker Rates Customer Protection Shield'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {t.safetyRateWorkerSim || '(Simulates worker feedback: safe environment, prompt payment)'}
                        </span>
                      </div>
                      <div className="flex text-emerald-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            onClick={() => setWorkerRatingForCustomer(s)}
                            className={`w-5 h-5 cursor-pointer ${
                              s <= workerRatingForCustomer ? 'fill-emerald-400 text-emerald-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setRatingSubmitted(true);
                      playAudioCue('match_success');
                    }}
                    className="w-full py-3 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-black text-xs shadow-md"
                  >
                    {t.safetySubmitReviews || 'Submit Two-Way Mutual Reviews'}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-3 py-4 animate-in fade-in">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-slate-900 text-base">
                    {t.safetyReviewsRecorded || 'Reviews Recorded & Escrow Released!'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {t.safetyReviewsRecordedDesc || 'Both profiles updated with verified badges. Dignity of labor upheld!'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    {t.btnClose || 'Done'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

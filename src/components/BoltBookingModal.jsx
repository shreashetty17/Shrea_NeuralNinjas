import React, { useState, useEffect, useMemo } from 'react';
import { NearbyWorkersMap, CUSTOMER_LOCATION, distanceKm } from './NearbyWorkersMap';
import { 
  X, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Calendar, 
  Sparkles, 
  MessageSquare,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { SERVICE_CATEGORIES, WORKERS_DATABASE, playAudioCue } from '../data/mockData';
import { addBooking, createBookingRequest, cancelBooking, getBookings } from "../services/db";
import { CancellationModal } from './CancellationModal';
import { TRANSLATIONS } from '../data/translations';

export const BoltBookingModal = ({ isOpen, onClose, initialCategory, onBookingConfirmed, lang = 'en', currentUser }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Broadcasting, 3: Bids arriving & negotiation, 4: Live tracking
  const [category, setCategory] = useState(initialCategory || SERVICE_CATEGORIES[0]);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || currentUser?.email || '');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(currentUser?.locality || '');
  
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Slot Timing State
  const [timingType, setTimingType] = useState('immediate'); // 'immediate' | 'scheduled'
  const [selectedDate, setSelectedDate] = useState('Today'); // 'Today' | 'Tomorrow' | 'Day After Tomorrow'
  const [selectedSlot, setSelectedSlot] = useState(t.eveningSlot || 'Evening (05:00 PM - 08:00 PM)');
  const [exactTime, setExactTime] = useState('06:30 PM');

  const [minBudget, setMinBudget] = useState(250);
  const [maxBudget, setMaxBudget] = useState(450);

  // Incoming bids simulation
  const [bids, setBids] = useState([]);
  const [selectedBidForCounter, setSelectedBidForCounter] = useState(null);
  const [counterAmount, setCounterAmount] = useState(320);
  const [acceptedBooking, setAcceptedBooking] = useState(null);
  const [savedBooking, setSavedBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [etaCountdown, setEtaCountdown] = useState(8);

  // Specific job within the chosen category (e.g. Plumbing → "Fix pipe leaks")
  const [subService, setSubService] = useState('');
  const subServiceOptions = (t.subServices && t.subServices[category?.id]) || [];

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    setSubService('');
  }, [initialCategory]);

  const handleCategoryChange = (id) => {
    setCategory(SERVICE_CATEGORIES.find((c) => c.id === id) || category);
    // a job from the old category no longer applies
    if (subService && description === subService) setDescription('');
    setSubService('');
  };

  const handleSubServiceChange = (value) => {
    // fill the problem description with the chosen job unless the user wrote their own
    if (!description.trim() || description === subService) setDescription(value);
    setSubService(value);
  };

  const getCategoryName = (cat) => {
    if (lang === 'hi') return cat.nameHi || cat.name;
    if (lang === 'mr') return cat.nameMr || cat.name;
    return cat.name;
  };

  // Workers near the customer for the chosen service (closest first), shown on the live map
  const nearbyWorkers = useMemo(() => {
    const sameTrade = WORKERS_DATABASE.filter((w) => w.trade === category?.id && w.lat && w.lng);
    const pool = sameTrade.length ? sameTrade : WORKERS_DATABASE.filter((w) => w.lat && w.lng);
    return pool
      .map((w) => {
        const km = distanceKm([w.lat, w.lng], CUSTOMER_LOCATION);
        return { ...w, distanceKm: Math.round(km * 10) / 10, etaMins: Math.max(3, Math.round(km * 4)) };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 6);
  }, [category?.id]);

  const bidHighlightIds = useMemo(() => bids.map((b) => b.worker.id), [bids]);

  const makeBid = (idx, quoteAmount) => {
    const w = nearbyWorkers[idx];
    if (!w) return null;
    return { id: `b-${idx + 1}`, worker: w, quoteAmount, etaMins: w.etaMins, distanceKm: w.distanceKm, counterState: null };
  };

  // Customer's own price for the job (their bid). Workers accept it or send a new price.
  const [offerPrice, setOfferPrice] = useState(350);

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const amount = Math.max(100, Number(offerPrice) || 0);
    setBids([]);
    setStep(2); // Live map of nearby workers while the request is sent
    playAudioCue('bid_received');

    // Save the bid request in Supabase: it shows up on workers' Active Orders page
    const request = createBookingRequest({
      category: category.id,
      categoryName: getCategoryName(category),
      title: `${getCategoryName(category)} - ${(subService || description).slice(0, 40)}`,
      description,
      address,
      customerName: customerName.trim() || currentUser?.name || null,
      customerPhone: customerPhone.trim() || currentUser?.phone || currentUser?.email || null,
      urgency: timingType === 'immediate' ? t.slotImmediate : `${t.slotScheduled} (${selectedDate})`,
      timingSlot: { type: timingType, date: selectedDate, timeSlot: selectedSlot, exactTime: exactTime || '18:45' },
      budgetRange: { min: minBudget, max: maxBudget },
      quoteAmount: amount,
      worker: null,
      escrowLocked: false
    });

    setSavedBooking(request); // lets "Cancel" on the map screen cancel this request
    // after a moment on the map, open the booking page where bids and negotiation happen
    setTimeout(() => {
      if (getBookings().find((b) => b.id === request.id)?.status === "cancelled") return;
      setSavedBooking(null);
      setStep(1);
      if (onBookingConfirmed) onBookingConfirmed(request);
    }, 3000);
  };

  const handleApplyCounter = (bidId) => {
    // Strictly enforce minimum negotiation limit of ₹100
    if (counterAmount < 100) {
      alert(t.counterUnder100Warning || 'Fair Wage Protection: Minimum negotiation limit is ₹100. Offers below ₹100 are not permitted.');
      setCounterAmount(100);
      return;
    }
    const acceptMsg = lang === 'hi' 
      ? `कारीगर ने आपका ₹${counterAmount} का काउंटर ऑफर स्वीकार कर लिया!`
      : lang === 'mr'
      ? `कारागिराने आपला ₹${counterAmount} चा नवा दर स्वीकारला!`
      : `Worker accepted your counter of ₹${counterAmount}!`;

    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, quoteAmount: Number(counterAmount), counterState: acceptMsg } : b))
    );
    playAudioCue('match_success');
    setSelectedBidForCounter(null);
  };

  const handleConfirmCancellation = (bookingToCancel, fee, reason) => {
    if (savedBooking?.id) {
      cancelBooking(savedBooking.id, reason, fee);
    }
    const refund = Math.max(0, (bookingToCancel.quoteAmount || 0) - fee);
    const cancelMsg = lang === 'hi'
      ? `बुकिंग रद्द की गई। रद्दीकरण शुल्क: ₹${fee}। रिफंड राशि: ₹${refund} वापस जमा की गई।`
      : lang === 'mr'
      ? `बुकिंग रद्द झाली. रद्दीकरण शुल्क: ₹${fee}. परतावा रक्कम: ₹${refund} खात्यात जमा झाली.`
      : `Booking Cancelled. Cancellation Fee: ₹${fee}. Refund Amount: ₹${refund} credited back.`;
    alert(cancelMsg);
    setCancellingBooking(null);
    setAcceptedBooking(null);
    setSavedBooking(null);
    setStep(1);
    onClose();
  };

  const handleAcceptBid = (bid) => {
    setAcceptedBooking(bid);
    setStep(4); // Confirmed screen with Start OTP & Actions
    playAudioCue('match_success');

    // Save to Database!
    const newDbBooking = createBookingRequest({
      category: category.id,
      categoryName: getCategoryName(category),
      title: `${getCategoryName(category)} - ${description.slice(0, 35)}...`,
      description,
      address,
      customerName: customerName.trim() || currentUser?.name || null,
      customerPhone: customerPhone.trim() || currentUser?.phone || currentUser?.email || null,
      urgency: timingType === 'immediate' ? t.slotImmediate : `${t.slotScheduled} (${selectedDate})`,
      timingSlot: {
        type: timingType,
        date: selectedDate,
        timeSlot: selectedSlot,
        exactTime: exactTime || '18:45'
      },
      budgetRange: { min: minBudget, max: maxBudget },
      quoteAmount: bid.quoteAmount,
      worker: bid.worker,
      startOtp: '4829',
      etaMins: bid.etaMins,
      distanceKm: bid.distanceKm || 1.2,
      escrowLocked: false
    });

    setSavedBooking(newDbBooking);

    // Go straight to this booking's page (live map of the worker, chat, cancellation)
    setBids([]);
    setAcceptedBooking(null);
    setSavedBooking(null);
    setStep(1);
    if (onBookingConfirmed) onBookingConfirmed(newDbBooking);
  };

  if (!isOpen) return null;

  const dateOptions = [
    { id: 'Today', label: t.dateToday },
    { id: 'Tomorrow', label: t.dateTomorrow },
    { id: 'Day After', label: t.dateDayAfter }
  ];

  const slotOptions = [
    t.morningSlot,
    t.noonSlot,
    t.afternoonSlot,
    t.eveningSlot
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xl font-display font-bold text-slate-900">
              {step === 1 && t.postRequestTitle}
              {step === 2 && t.matchingRadarTitle}
              {step === 3 && t.liveQuotesTitle}
              {step === 4 && t.confirmedDispatchedTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {step === 1 && t.step1Subtitle}
              {step === 2 && t.step2Subtitle}
              {step === 3 && t.step3Subtitle}
              {step === 4 && t.step4Subtitle}
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: FORM */}
          {step === 1 && (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.serviceCategoryLabel}
                </label>
                <select
                  value={category.id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs focus:ring-2 focus:ring-primary-500 focus:bg-white"
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getCategoryName(c)} ({c.typicalRange})
                    </option>
                  ))}
                </select>

                {/* Specific job for the chosen category */}
                {subServiceOptions.length > 0 && (
                  <select
                    value={subService}
                    onChange={(e) => handleSubServiceChange(e.target.value)}
                    aria-label={t.commonRepairsCovered || 'Choose a service'}
                    className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white border border-[#149B8B]/60 text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-[#149B8B]/40"
                  >
                    <option value="">{t.chooseServiceOption || 'Choose what you need…'}</option>
                    {subServiceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* TIMING SELECTION: Immediate vs Scheduled Slot */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.serviceTimingLabel}
                </label>
                
                {/* 2 Big Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimingType('immediate')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      timingType === 'immediate'
                        ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <span>{t.optImmediate}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{t.immediateArrivalSla}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimingType('scheduled')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      timingType === 'scheduled'
                        ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Calendar className="w-4 h-4 text-primary-600" />
                      <span>{t.optScheduleSlot}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{t.pickDateSlot}</span>
                  </button>
                </div>

                {/* Sub-options for Scheduled Slot */}
                {timingType === 'scheduled' && (
                  <div className="pt-2 space-y-3 animate-in fade-in">
                    {/* Date Selector */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">{t.selectDateLabel}</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {dateOptions.map((d) => (
                          <button
                            type="button"
                            key={d.id}
                            onClick={() => setSelectedDate(d.id)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                              selectedDate === d.id
                                ? 'bg-primary-600 text-white font-bold'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">{t.selectWindowLabel}</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {slotOptions.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSelectedSlot(s)}
                            className={`p-2 rounded-lg text-[11px] text-left transition-all ${
                              selectedSlot === s
                                ? 'bg-primary-600 text-white font-bold'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specific time note */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-semibold shrink-0">{t.preferredExactTimeLabel}</span>
                      <input
                        type="text"
                        value={exactTime}
                        onChange={(e) => setExactTime(e.target.value)}
                        placeholder="e.g. 06:30 PM"
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 w-32 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.yourNameLabel}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.phoneNumberLabel}</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.describeProblemLabel}</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs resize-none focus:bg-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.addressLocalityLabel}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Budget Range: Min & Max */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{t.targetBudgetBandLabel}</span>
                  <span className="text-xs font-bold text-emerald-700">{t.fairBandLabel}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold mb-1">
                      <span>{t.minFloorLabel}</span>
                    </div>
                    <input
                      type="number"
                      min="100"
                      value={minBudget}
                      onChange={(e) => setMinBudget(Math.max(100, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold mb-1">
                      <span>{t.maxBudgetLabel}</span>
                    </div>
                    <input
                      type="number"
                      min="100"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Math.max(100, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold text-sm"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  {t.floorNoticeText}
                </p>
              </div>

              {/* Customer bid: the price they offer for the job */}
              <div className="p-3.5 rounded-2xl bg-[#149B8B]/5 border border-[#149B8B]/30 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your bid price (₹)</label>
                <input
                  type="number"
                  min="100"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold text-base"
                  required
                />
                <p className="text-[10px] text-slate-500">Nearby workers get your bid. They can accept it or send their price. You and the worker can each change the price up to 3 times.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-primary text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.broadcastRequestBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: BROADCASTING RADAR */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Live map of nearby workers */}
              <NearbyWorkersMap workers={nearbyWorkers} height={260} />

              <div className="flex items-center gap-2 text-xs font-bold text-[#0A2540]">
                <Radio className="w-4 h-4 text-[#149B8B] animate-pulse" />
                <span>{t.matchingRadarTitle}</span>
              </div>

              {/* Nearby workers list */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {nearbyWorkers.map((w) => (
                  <div key={w.id} className="flex items-center gap-3 p-3 bg-white">
                    <img src={w.photo} alt={w.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#0A2540]/80" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{w.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {w.etaMins} mins away • {w.distanceKm} km • ★ {w.rating}
                      </div>
                    </div>
                    {w.hourlyRate ? <div className="text-sm font-bold text-[#0A2540]">₹{w.hourlyRate}</div> : null}
                  </div>
                ))}
                {!nearbyWorkers.length && (
                  <div className="p-4 text-xs text-slate-500 text-center">No workers nearby right now.</div>
                )}
              </div>

              {/* Cancel Button during broadcasting */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCancellingBooking({
                      id: 'req_broadcasting',
                      title: `${getCategoryName(category)} Broadcast`,
                      quoteAmount: minBudget,
                      status: 'broadcasting'
                    });
                  }}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.cancelBroadcastFree}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LIVE BIDS STREAM & DIRECT NEGOTIATION */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Live map: workers who bid are highlighted and head toward the customer */}
              <NearbyWorkersMap workers={nearbyWorkers} highlightIds={bidHighlightIds} height={220} />
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.quotesReceivedCount.replace('{count}', bids.length)}</span>
                </span>
                <span className="text-slate-500 font-semibold">
                  {t.timingLabel}: {timingType === 'immediate' ? t.optImmediate : selectedDate}
                </span>
              </div>

              <div className="space-y-3">
                {bids.map((bid) => {
                  const w = bid.worker;
                  return (
                    <div
                      key={bid.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={w.photo}
                            alt={w.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-bold text-slate-900 text-sm">{w.name}</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>⭐ {w.rating}</span>
                              <span>•</span>
                              <span>{bid.etaMins} mins ETA</span>
                              <span>•</span>
                              <span>{bid.distanceKm} km</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Quote</span>
                          <span className="text-xl font-display font-bold text-slate-900">₹{bid.quoteAmount}</span>
                        </div>
                      </div>

                      {bid.counterState && (
                        <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100 p-2 rounded-lg border border-emerald-200">
                          {bid.counterState}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptBid(bid)}
                          className="flex-1 py-2 rounded-xl btn-primary text-xs shadow-xs"
                        >
                          {t.acceptEscrowBtn}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBidForCounter(bid);
                            setCounterAmount(Math.max(100, bid.quoteAmount > 130 ? bid.quoteAmount - 30 : 100));
                          }}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
                        >
                          {t.counterofferBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Counter Input Modal with ₹100 Minimum Floor Enforcement */}
              {selectedBidForCounter && (
                <div className="p-4 bg-white rounded-2xl border-2 border-primary-400 shadow-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{t.negotiateWithTitle.replace('{name}', selectedBidForCounter.worker.name)}</span>
                    <button onClick={() => setSelectedBidForCounter(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{t.yourCounterLabel}</span>
                      <span className="font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-full border border-secondary-200 text-[10px]">
                        {t.minNegotiationFloor}
                      </span>
                    </div>

                    <input
                      type="number"
                      min="100"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(Number(e.target.value))}
                      className={`w-full px-3.5 py-2 rounded-xl bg-slate-50 border text-slate-900 font-mono font-bold text-sm focus:bg-white ${
                        counterAmount < 100 ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300 focus:ring-2 focus:ring-primary-500'
                      }`}
                    />

                    {counterAmount < 100 ? (
                      <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.counterUnder100Warning}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{t.counterReviewNotice}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleApplyCounter(selectedBidForCounter.id)}
                    disabled={counterAmount < 100}
                    className="w-full py-2.5 btn-primary font-bold text-xs rounded-xl shadow-xs disabled:opacity-40"
                  >
                    {t.sendCounterofferBtn.replace('{amount}', Math.max(100, counterAmount))}
                  </button>
                </div>
              )}

              {/* Cancel Request during Step 3 */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  {t.wantToCancelPrompt}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCancellingBooking({
                      id: 'req_bidding',
                      title: `${getCategoryName(category)} Request`,
                      quoteAmount: 0,
                      status: 'bidding'
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.cancelBroadcastFree}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED & DISPATCHED */}
          {step === 4 && acceptedBooking && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">{t.confirmedDispatchedTitle}</span>
                  <div className="text-sm font-bold text-slate-900">
                    {timingType === 'immediate' ? t.technicianEnRoute : t.slotBookedFor.replace('{date}', selectedDate)}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {timingType === 'immediate' ? t.arrivingByBike : `${selectedSlot} (${exactTime})`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase">ETA</span>
                  <span className="text-lg font-display font-bold text-emerald-700">~{etaCountdown} mins</span>
                </div>
              </div>

              {/* Worker Card */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={acceptedBooking.worker.photo}
                  alt={acceptedBooking.worker.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                />
                <div className="flex-1">
                  <h4 className="font-display font-bold text-slate-900 text-base">
                    {acceptedBooking.worker.name}
                  </h4>
                  <p className="text-xs text-slate-600">{acceptedBooking.worker.tradeLabel || t.chatVerifiedPro}</p>
                  <p className="text-[11px] text-primary-700 font-bold mt-0.5">
                    {t.lockedInEscrowLabel.replace('{amount}', acceptedBooking.quoteAmount)}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                  <div className="text-[9px] uppercase text-slate-400 font-bold">{t.startOtpLabel}</div>
                  <div className="text-base font-mono font-bold text-secondary-600">4829</div>
                </div>
              </div>

              {/* Actions: Direct Chat with Worker or View in My Bookings */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    if (onBookingConfirmed) onBookingConfirmed(savedBooking || acceptedBooking);
                  }}
                  className="flex-1 py-3.5 rounded-xl btn-primary text-xs font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.chatWithWorkerNow.replace('{name}', acceptedBooking.worker.name.split(' ')[0])}</span>
                </button>

                <button
                  onClick={() => {
                    if (onBookingConfirmed) onBookingConfirmed(savedBooking || acceptedBooking);
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.viewInMyBookingsBtn}</span>
                </button>
              </div>

              {/* Cancel Button in Step 4 */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setCancellingBooking(savedBooking || {
                      id: 'bk_current',
                      title: `${getCategoryName(category)} - ${description.slice(0, 30)}...`,
                      worker: acceptedBooking.worker,
                      quoteAmount: acceptedBooking.quoteAmount,
                      status: 'en_route'
                    });
                  }}
                  className="w-full py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.cancelBookingWithCharges}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Cancellation Charges Popup Modal */}
      <CancellationModal
        isOpen={!!cancellingBooking}
        booking={cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onConfirmCancel={handleConfirmCancellation}
        lang={lang}
      />
    </div>
  );
};

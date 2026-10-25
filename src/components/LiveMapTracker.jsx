import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  KeyRound, 
  RefreshCw, 
  MessageSquare,
  X
} from 'lucide-react';
import { WORKERS_DATABASE, MUMBAI_CENTER } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const LiveMapTracker = ({
  activeBooking,
  onConfirmCompletion,
  onOpenSos,
  selectedWorker,
  onSelectWorker,
  onOpenChat,
  onCancelBooking,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);
  
  const [tradeFilter, setTradeFilter] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(true);
  const [otpCode, setOtpCode] = useState('4829'); // 4-digit OTP for secure job start
  const [jobProgressStep, setJobProgressStep] = useState(activeBooking ? 2 : 1); 
  // 1: Escrow Held, 2: Travelling (ETA 14m), 3: Arrived & OTP Verified, 4: In Progress, 5: Completed
  const [etaRemaining, setEtaRemaining] = useState(activeBooking?.quote?.etaMins || 14);

  // Customer location in Mumbai (Andheri West / Lokhandwala)
  const customerLoc = [19.1363, 72.8277];

  // Helper color per trade
  const getTradeColor = (trade) => {
    switch (trade) {
      case 'plumbing': return '#0284c7'; // Sky blue
      case 'electrical': return '#eab308'; // Amber/Yellow
      case 'cleaning': return '#10b981'; // Emerald
      case 'cooking': return '#f97316'; // Orange
      case 'ac_repair': return '#06b6d4'; // Cyan
      case 'carpentry': return '#8b5cf6'; // Purple
      default: return '#64748b';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: customerLoc,
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | KaamSetu Hyperlocal Engine',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    // Add Customer Marker
    const customerIcon = L.divIcon({
      className: 'custom-customer-icon',
      html: `
        <div style="background: #0f172a; color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(15, 23, 42, 0.4); border: 3px solid white; position: relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <div style="position: absolute; -top: 4px; -right: 4px; width: 12px; height: 12px; background: #ea580c; border: 2px solid white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const cMarker = L.marker(customerLoc, { icon: customerIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">📍 Your Job Location</div>
          <div style="font-size: 11px; color: #64748b;">Lokhandwala Complex, Andheri West</div>
          <div style="margin-top: 4px; display: inline-block; background: #ffedd5; color: #c2410c; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">Active Request Site</div>
        </div>
      `);
    markersRef.current.push(cMarker);

    // 3-Minute Radius Escalation Circles
    const radius3km = L.circle(customerLoc, {
      color: '#ea580c',
      fillColor: '#ea580c',
      fillOpacity: 0.04,
      radius: 3000,
      weight: 1.5,
      dashArray: '4, 6'
    }).addTo(map);
    markersRef.current.push(radius3km);

    // Filter workers
    const filteredWorkers = WORKERS_DATABASE.filter((w) => {
      const matchTrade = tradeFilter === 'all' || w.trade === tradeFilter;
      const matchAvail = !availableOnly || w.availableNow;
      return matchTrade && matchAvail;
    });

    // Add Worker Markers
    filteredWorkers.forEach((w) => {
      const color = getTradeColor(w.trade);
      const isSelected = activeBooking?.quote?.worker?.id === w.id || selectedWorker?.id === w.id;

      const workerIcon = L.divIcon({
        className: 'custom-worker-icon',
        html: `
          <div style="position: relative; cursor: pointer;">
            <div style="background: white; border-radius: 12px; padding: 3px; box-shadow: 0 4px 12px rgba(0,0,0,0.18); border: 2.5px solid ${isSelected ? '#ea580c' : color}; display: flex; align-items: center; gap: 4px; min-width: 65px;">
              <img src="${w.photo}" style="width: 24px; height: 24px; border-radius: 8px; object-fit: cover;" />
              <div style="font-family: system-ui; font-size: 10px; font-weight: 800; color: #1e293b; line-height: 1;">
                ${w.etaMins}m
              </div>
            </div>
            ${w.aadhaarVerified ? '<div style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; background: #10b981; border: 1.5px solid white; border-radius: 50%;"></div>' : ''}
          </div>
        `,
        iconSize: [68, 30],
        iconAnchor: [34, 15]
      });

      const marker = L.marker([w.lat, w.lng], { icon: workerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 200px; padding: 2px;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
            <img src="${w.photo}" style="width: 38px; height: 38px; border-radius: 10px; object-fit: cover;" />
            <div>
              <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${w.name}</div>
              <div style="font-size: 11px; color: #64748b;">${w.tradeLabel}</div>
            </div>
          </div>
          <div style="display: flex; gap: 4px; margin-bottom: 6px; font-size: 11px;">
            <span style="background: #ecfdf5; color: #065f46; font-weight: bold; padding: 2px 6px; border-radius: 4px;">⭐ ${w.rating}</span>
            <span style="background: #eff6ff; color: #1e40af; font-weight: bold; padding: 2px 6px; border-radius: 4px;">⚡ ${w.etaMins} mins ETA</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            <strong>Locality:</strong> ${w.locality} (${w.distanceKm} km away)
          </div>
          <div style="display: flex; gap: 4px;">
            <span style="font-size: 10px; background: #f1f5f9; padding: 2px 5px; border-radius: 4px; color: #334155;">✓ Aadhaar Verified</span>
            <span style="font-size: 10px; background: #f1f5f9; padding: 2px 5px; border-radius: 4px; color: #334155;">✓ Police Clearance</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectWorker(w);
      });

      markersRef.current.push(marker);
    });

    // If active booking, draw route line to customer!
    const activeWorker = activeBooking?.quote?.worker || selectedWorker;
    if (activeWorker) {
      const workerCoords = [activeWorker.lat, activeWorker.lng];
      const routeLine = L.polyline([workerCoords, customerLoc], {
        color: '#ea580c',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(map);

      routePolylineRef.current = routeLine;
      map.fitBounds([workerCoords, customerLoc], { padding: [50, 50] });
    }

  }, [tradeFilter, availableOnly, activeBooking, selectedWorker]);

  // Simulate ETA decreasing
  useEffect(() => {
    if (!activeBooking || jobProgressStep >= 3) return;
    const interval = setInterval(() => {
      setEtaRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBooking, jobProgressStep]);

  return (
    <div className="space-y-4">
      {/* Map Control Bar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              {t.liveMapTitle}
            </h4>
            <p className="text-xs text-slate-500">
              {t.liveMapSubtitle}
            </p>
          </div>
        </div>

        {/* Trade Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'all', label: t.tradeTabAll },
              { id: 'plumbing', label: t.tradeTabPlumbers },
              { id: 'electrical', label: t.tradeTabElectricians },
              { id: 'cleaning', label: t.tradeTabMaids },
              { id: 'cooking', label: t.tradeTabCooks },
              { id: 'ac_repair', label: t.tradeTabAc }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTradeFilter(item.id)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  tradeFilter === item.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Available Now Toggle */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              availableOnly ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'hi' ? 'केवल अभी उपलब्ध' : lang === 'mr' ? 'केवळ आता उपलब्ध' : 'Available Now Only'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
        <div ref={mapContainerRef} className="w-full h-[440px] sm:h-[480px] z-10" />

        {/* Floating 30-Minute Guarantee Badge on Map */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl border border-slate-700 shadow-lg pointer-events-none max-w-xs hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.slaBadge}</span>
          </div>
          <div className="text-xs text-slate-300">
            {t.slaDesc}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-[11px] flex items-center gap-3 font-semibold text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> {t.tradeTabPlumbers}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.tradeTabElectricians}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t.tradeTabMaids}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> {t.tradeTabCooks}
          </span>
        </div>
      </div>

      {/* Active Booking Live Tracker Bar */}
      {activeBooking && (
        <div className="bg-white rounded-3xl border-2 border-orange-400 p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
          {/* Header with OTP & ETA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <img
                src={activeBooking.quote.worker.photo}
                alt={activeBooking.quote.worker.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-400 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-lg">
                    {activeBooking.quote.worker.name}
                  </h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t.floatingVerifiedWorker}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {activeBooking.quote.worker.tradeLabel} • {t.arrivingByBike}
                </p>
              </div>
            </div>

            {/* OTP Start Code Box & Call button */}
            <div className="flex items-center gap-3">
              {/* OTP for Security */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 text-center">
                <div className="text-[10px] uppercase font-bold text-orange-800 flex items-center justify-center gap-1">
                  <KeyRound className="w-3 h-3" />
                  <span>{t.startOtpLabel}</span>
                </div>
                <div className="text-xl font-black font-mono tracking-widest text-orange-600">
                  {otpCode}
                </div>
                <div className="text-[9px] text-slate-500">{t.otpNotice}</div>
              </div>

              {/* Call Worker */}
              <a
                href={`tel:${activeBooking.quote.worker.phone}`}
                className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl border border-slate-200 transition-colors flex flex-col items-center justify-center text-xs font-bold"
                title="Direct call via masked phone relay"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 mb-0.5" />
                <span>{t.callBtn}</span>
              </a>

              {/* Chat Popup Button */}
              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="p-3.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-2xl border border-primary-200 transition-colors flex flex-col items-center justify-center text-xs font-bold"
                  title="Open direct chat popup with worker"
                >
                  <MessageSquare className="w-4 h-4 text-primary-600 mb-0.5" />
                  <span>{t.chatBtn}</span>
                </button>
              )}

              {/* Cancel Booking Button */}
              {onCancelBooking && (
                <button
                  onClick={onCancelBooking}
                  className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl border border-rose-200 transition-colors flex flex-col items-center justify-center text-xs font-bold"
                  title="Cancel this booking (Review cancellation policy)"
                >
                  <X className="w-4 h-4 text-rose-600 mb-0.5" />
                  <span>{t.cancelBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Step-by-step Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className={jobProgressStep >= 1 ? 'text-orange-600' : ''}>{t.stepEscrowHeld}</span>
              <span className={jobProgressStep >= 2 ? 'text-orange-600' : ''}>{t.stepTravelling.replace('{eta}', etaRemaining)}</span>
              <span className={jobProgressStep >= 3 ? 'text-orange-600' : ''}>{t.stepOtpVerified}</span>
              <span className={jobProgressStep >= 4 ? 'text-orange-600' : ''}>{t.stepWorkDone}</span>
            </div>

            {/* Visual Step Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div className={`h-full bg-orange-600 transition-all duration-500 ${
                jobProgressStep === 1 ? 'w-1/4' : jobProgressStep === 2 ? 'w-2/4' : jobProgressStep === 3 ? 'w-3/4' : 'w-full'
              }`} />
            </div>
          </div>

          {/* Interactive Progress Simulation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-600">
              {jobProgressStep === 2 && (
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600 animate-spin" />
                  {t.simDistanceAway.replace('{eta}', etaRemaining)}
                </span>
              )}
              {jobProgressStep === 3 && (
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.simVerifiedInProgress}
                </span>
              )}
              {jobProgressStep === 4 && (
                <span className="font-semibold text-slate-800">
                  {t.simCompletedPrompt}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {jobProgressStep === 2 && (
                <button
                  onClick={() => setJobProgressStep(3)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
                >
                  {t.btnSimArrived}
                </button>
              )}

              {jobProgressStep === 3 && (
                <button
                  onClick={() => setJobProgressStep(4)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
                >
                  {t.btnSimDone}
                </button>
              )}

              {jobProgressStep === 4 && (
                <button
                  onClick={() => onConfirmCompletion(activeBooking)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.btnInspectRelease.replace('{amount}', activeBooking.quote.quoteAmount)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

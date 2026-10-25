import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  MapPin, 
  MessageSquare, 
  Flame, 
  ArrowUpRight, 
  CheckCircle, 
  Wallet,
  Clock,
  Radio,
  Star,
  Send,
  Zap
} from 'lucide-react';
import { DEMAND_HEATMAP, playAudioCue } from '../data/mockData';

export const WorkerAppView = ({ currentWorker, language, setLanguage }) => {
  const [workerAvailable, setWorkerAvailable] = useState(true);
  const [smsFallbackActive, setSmsFallbackActive] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceSpokenText, setVoiceSpokenText] = useState('');
  const [parsedBid, setParsedBid] = useState(null);
  const [activeJobNotification, setActiveJobNotification] = useState({
    id: 'req-102',
    customerName: 'Priya Sharma (Lokhandwala, Andheri)',
    customerRating: 4.95,
    customerNotes: 'Prompt escrow release upon completion',
    serviceTitle: 'Kitchen Faucet Cartridge Leakage & Low Pressure',
    distance: '1.2 km away',
    estArrival: '12 mins',
    customerBudget: '₹350 - ₹450'
  });
  const [bidSubmittedSuccess, setBidSubmittedSuccess] = useState(false);

  const t = {
    en: {
      workerTitle: 'Kaarigar Partner App',
      dutyStatus: 'Duty Status',
      online: 'Online • Accepting Jobs',
      offline: 'Offline • Rest Mode',
      voiceQuoteTitle: 'Speak Your Quote (Voice-First)',
      speakPlaceholder: 'Tap mic and say e.g. "400 rupees, 15 minutes"',
      sendQuote: 'Submit Voice Bid',
      todayEarnings: "Today's Take-Home",
      weekEarnings: 'Weekly Total',
      trustScore: 'Kaarigar Trust Score',
      repeatClients: 'Repeat Clients',
      upskillTitle: 'Skill Upskilling & Income Boost',
      demandHeatmapTitle: 'Mumbai Live Job Demand Clusters',
      smsMode: 'WhatsApp / 2G SMS Mode'
    },
    hi: {
      workerTitle: 'कारीगर साथी ऐप',
      dutyStatus: 'काम की स्थिति',
      online: 'ड्यूटी पर हैं • काम चालू है',
      offline: 'ऑफ़लाइन • विश्राम',
      voiceQuoteTitle: 'बोलकर अपनी बोली लगाएं (वॉइस कोट)',
      speakPlaceholder: 'माइक दबाएं और बोलें "₹350, 15 मिनट"',
      sendQuote: 'बोली भेजें',
      todayEarnings: 'आज की कमाई',
      weekEarnings: 'इस हफ्ते की कमाई',
      trustScore: 'कारीगर भरोसा स्कोर',
      repeatClients: 'पुराने ग्राहक',
      upskillTitle: 'नई ट्रेनिंग लें, ₹30% ज्यादा कमाएं',
      demandHeatmapTitle: 'मुंबई में कहां काम ज्यादा है (लाइव मैप)',
      smsMode: 'व्हाट्सएप / 2G एसएमएस मोड'
    },
    mr: {
      workerTitle: 'कारागीर जोडीदार ॲप',
      dutyStatus: 'कामाची स्थिती',
      online: 'ऑनलाईन • काम सुरू आहे',
      offline: 'ऑफलाईन • विश्रांती',
      voiceQuoteTitle: 'आवाजाने बोली लावा (व्हॉइस कोट)',
      speakPlaceholder: 'माईक दाबून बोला "₹३५०, १५ मिनिटे"',
      sendQuote: 'बोली पाठवा',
      todayEarnings: 'आजची कमाई',
      weekEarnings: 'या आठवड्याची कमाई',
      trustScore: 'विश्वासू गुणांक',
      repeatClients: 'पुन्हा येणारे ग्राहक',
      upskillTitle: 'नवीन कौशल्य शिका, ३०% जास्त कमवा',
      demandHeatmapTitle: 'मुंबईतील जास्त मागणी असणारे परिसर',
      smsMode: 'व्हॉट्सॲप / एसएमएस २G मोड'
    }
  }[language || 'hi'];

  const handleSimulateVoiceQuote = (phrase, amount, eta) => {
    setIsListeningVoice(true);
    setVoiceSpokenText(phrase);
    playAudioCue('bid_received');

    setTimeout(() => {
      setIsListeningVoice(false);
      setParsedBid({
        amount,
        eta,
        note: `AI Voice Transcribed: "${phrase}"`
      });
    }, 1200);
  };

  const handleSubmitBid = () => {
    if (!parsedBid) return;
    setBidSubmittedSuccess(true);
    playAudioCue('match_success');
    setTimeout(() => {
      setBidSubmittedSuccess(false);
      setParsedBid(null);
      setVoiceSpokenText('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Partner Identity Card */}
      <div className="bg-charcoal-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-xl border border-charcoal-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentWorker.photo}
                alt={currentWorker.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-warm-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-charcoal-900 rounded-full flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentWorker.name}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/40">
                  Certified Ustaad
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5 font-medium">
                {currentWorker.tradeLabel} • {currentWorker.locality}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs font-bold text-stone-300">
                <span className="text-amber-400">⭐ {currentWorker.rating}</span>
                <span>•</span>
                <span className="text-emerald-400">🛡️ Aadhaar Verified</span>
                <span>•</span>
                <span>{currentWorker.jobsCompleted} Jobs Completed</span>
              </div>
            </div>
          </div>

          {/* Duty Status & 2G Fallback Mode */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setWorkerAvailable(!workerAvailable)}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-warm-sm ${
                workerAvailable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-charcoal-800 hover:bg-charcoal-700 text-stone-400'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${workerAvailable ? 'bg-white animate-pulse' : 'bg-stone-500'}`} />
              <span>{workerAvailable ? t.online : t.offline}</span>
            </button>

            <button
              onClick={() => setSmsFallbackActive(!smsFallbackActive)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border ${
                smsFallbackActive
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-charcoal-800 border-charcoal-700 text-stone-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.smsMode}</span>
            </button>
          </div>

        </div>

        {smsFallbackActive && (
          <div className="mt-4 p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              2G SMS / WhatsApp Dispatch active: "Send '350 15' to 567678 to submit bid without mobile data."
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Live Job Ping & Voice Quote vs Wallet Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Voice Quote & Job Dispatch */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border-2 border-brand-500 p-6 shadow-warm-md relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                <span className="text-[11px] uppercase font-black tracking-widest text-brand-600">
                  New Customer Request (1.2 km away)
                </span>
              </div>
              <span className="text-xs font-bold text-stone-400">Match window: 2:40</span>
            </div>

            <div className="py-4 space-y-2">
              <h4 className="text-lg font-black text-slate-900">
                {activeJobNotification.serviceTitle}
              </h4>
              <p className="text-xs text-stone-600 font-medium">
                Customer: <strong className="text-stone-900">{activeJobNotification.customerName}</strong> (⭐ {activeJobNotification.customerRating})
              </p>
              <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block font-semibold">
                🛡️ Customer Reputation: "{activeJobNotification.customerNotes}"
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-stone-700 pt-1">
                <span>Distance: {activeJobNotification.distance}</span>
                <span>•</span>
                <span>Client Budget: <strong className="text-brand-600">{activeJobNotification.customerBudget}</strong></span>
              </div>
            </div>

            {/* Voice-First Section */}
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E3DA] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm">
                      {t.voiceQuoteTitle}
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      Zero typing required • Speak naturally
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400">
                  <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Hindi / Marathi / English</span>
                </div>
              </div>

              {/* Simulated Speech Options */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700">
                  Tap to test voice quotation:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateVoiceQuote('₹350 रुपया, 15 मिनिटात पोहोचतो', 350, 15)}
                    className="p-3 bg-white hover:bg-brand-50/50 border border-stone-200 rounded-xl text-left transition-colors flex items-center justify-between group shadow-warm-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-devanagari">
                        "₹350 रुपया, 15 मिनिटात पोहोचतो"
                      </div>
                      <div className="text-[10px] text-stone-400">मराठी व्हॉइस कोट</div>
                    </div>
                    <Mic className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateVoiceQuote('₹400 रुपए, 20 मिनट में आ रहा हूं', 400, 20)}
                    className="p-3 bg-white hover:bg-brand-50/50 border border-stone-200 rounded-xl text-left transition-colors flex items-center justify-between group shadow-warm-sm"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-devanagari">
                        "₹400 रुपए, 20 मिनट में आ रहा हूं"
                      </div>
                      <div className="text-[10px] text-stone-400">हिंदी वॉइस कोट</div>
                    </div>
                    <Mic className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Sound Wave Animation if Listening */}
              {isListeningVoice && (
                <div className="p-3.5 bg-charcoal-900 text-white rounded-xl text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-brand-400 animate-pulse" />
                    <span>Listening: "{voiceSpokenText}"...</span>
                  </div>
                  {/* Visual Sound Waveform */}
                  <div className="flex items-center gap-1 h-6">
                    <span className="w-1 bg-brand-400 rounded-full soundwave-bar-1"></span>
                    <span className="w-1 bg-brand-400 rounded-full soundwave-bar-2"></span>
                    <span className="w-1 bg-brand-400 rounded-full soundwave-bar-3"></span>
                    <span className="w-1 bg-brand-400 rounded-full soundwave-bar-4"></span>
                    <span className="w-1 bg-brand-400 rounded-full soundwave-bar-5"></span>
                  </div>
                </div>
              )}

              {/* Parsed Bid */}
              {parsedBid && (
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-500 space-y-3 shadow-warm-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Voice Recognized
                    </span>
                    <span className="text-[11px] text-stone-400">{parsedBid.note}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-500 uppercase font-black">Your Rate</div>
                      <div className="text-2xl font-black text-slate-900">₹{parsedBid.amount}</div>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <div className="text-[10px] text-stone-500 uppercase font-black">Arrival Time</div>
                      <div className="text-2xl font-black text-brand-600">{parsedBid.eta} Mins</div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitBid}
                    className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-black text-white font-black text-xs shadow-warm-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.sendQuote}</span>
                  </button>
                </div>
              )}

              {bidSubmittedSuccess && (
                <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Bid delivered to customer! Awaiting match approval.</span>
                </div>
              )}
            </div>
          </div>

          {/* Upskilling Card */}
          <div className="bg-charcoal-900 text-white rounded-3xl p-6 shadow-warm-md border border-charcoal-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400" />
              <h4 className="font-black text-sm">
                {t.upskillTitle}
              </h4>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Based on Mumbai demand data, technicians who add <strong className="text-brand-400">Inverter Geyser & Diverter Repair</strong> earn an average of <strong className="text-white">₹14,500 extra/month (+32%)</strong>.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-semibold">
                ✓ Free NSDC Skill India Certificate
              </span>
              <button className="text-xs font-black text-white bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 rounded-xl transition-colors">
                Enroll Free
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Earnings & Heatmap */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Earnings Dashboard */}
          <div className="bg-white rounded-3xl border border-[#E8E3DA] p-6 shadow-warm-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-500" />
                <h4 className="font-black text-slate-900 text-sm">
                  Dignified Earnings (100% Payout)
                </h4>
              </div>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Zero Commission Cut
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                <div className="text-xs font-bold text-stone-500">{t.todayEarnings}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">₹1,450</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">✓ 3 Jobs done</div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                <div className="text-xs font-bold text-stone-500">{t.weekEarnings}</div>
                <div className="text-2xl font-black text-brand-500 mt-1">₹8,720</div>
                <div className="text-[10px] text-stone-500 font-medium mt-1">Direct to Bank/UPI</div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">{t.trustScore}</span>
                <span className="font-black text-slate-900">98 / 100 (Gold Partner)</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[98%]" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">{t.repeatClients}</span>
                <span className="font-black text-slate-900">42% (High Repeat Rate)</span>
              </div>
            </div>

            <button
              onClick={() => alert('Transferred ₹8,720 to Rameshwar Jadhav UPI (ID: rameshwar@oksbi)!')}
              className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-black text-white font-black text-xs shadow-warm-sm flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>Withdraw ₹8,720 to UPI (PhonePe / GPay)</span>
            </button>
          </div>

          {/* Mumbai Demand Heatmap */}
          <div className="bg-white rounded-3xl border border-[#E8E3DA] p-6 shadow-warm-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-500" />
                <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                  {t.demandHeatmapTitle}
                </h4>
              </div>
              <span className="text-[10px] bg-red-100 text-red-700 font-black px-2 py-0.5 rounded-full">
                Surge Active
              </span>
            </div>

            <div className="space-y-2.5">
              {DEMAND_HEATMAP.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{item.area}</div>
                    <div className="text-[10px] text-stone-500">
                      Needs: {item.topTrades.join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-brand-600">{item.count} jobs</span>
                    <span className="block text-[10px] font-bold text-emerald-700">{item.surge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

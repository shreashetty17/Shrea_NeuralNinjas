import React, { useState } from 'react';
import { 
  Camera, 
  Mic, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Wrench,
  Zap,
  Sparkles,
  Utensils,
  AirVent,
  Hammer
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/mockData';

export const AIProblemDiagnostics = ({ onJobCreated, language }) => {
  const [selectedCategory, setSelectedCategory] = useState(SERVICE_CATEGORIES[0]);
  const [problemDescription, setProblemDescription] = useState('Kitchen sink faucet cartridge is leaking continuously, water dripping into lower cabinet.');
  const [customerBudget, setCustomerBudget] = useState(380);
  const [isBundled, setIsBundled] = useState(false);
  const [bundledCategory, setBundledCategory] = useState(SERVICE_CATEGORIES[1]); // Electrician
  const [urgency, setUrgency] = useState('immediate');
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80');
  
  const [diagnosticResult, setDiagnosticResult] = useState({
    detectedIssue: 'Worn Brass Ceramic Cartridge Leak & P-Trap Pressure',
    severity: 'Medium-High (Continuous water wastage)',
    fairRange: '₹280 - ₹450',
    typicalSparesCost: '₹80 - ₹120 (Cartridge replacement)',
    estimatedFixTime: '25-35 minutes'
  });
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const sampleProblems = [
    {
      title: 'Kitchen Tap Drip',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      category: SERVICE_CATEGORIES[0],
      desc: 'Tap is leaking heavily even when tightly closed. Needs spindle/washer replacement.',
      ai: {
        detectedIssue: 'Defective Ceramic Faucet Valve Spindle',
        severity: 'Moderate Leakage',
        fairRange: '₹250 - ₹400',
        typicalSparesCost: '₹100',
        estimatedFixTime: '20 mins'
      },
      budget: 350
    },
    {
      title: 'Sparking MCB Box',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      category: SERVICE_CATEGORIES[1],
      desc: 'Main bedroom switchboard sparking and MCB trips whenever AC is turned on.',
      ai: {
        detectedIssue: 'Overloaded Terminal Contact & Neutral Arcing',
        severity: 'High Priority (Electrical Hazard)',
        fairRange: '₹300 - ₹500',
        typicalSparesCost: '₹150 (32A MCB)',
        estimatedFixTime: '30 mins'
      },
      budget: 420
    },
    {
      title: 'Deep Kitchen Degreasing',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      category: SERVICE_CATEGORIES[2],
      desc: 'Heavy oil stains on chimney, exhaust fan and tiles requiring thorough scrub.',
      ai: {
        detectedIssue: 'Carbonized Oil Deposits & Chimney Filter Blockage',
        severity: 'Sanitation Requirement',
        fairRange: '₹400 - ₹650',
        typicalSparesCost: '₹0 (Supplies included)',
        estimatedFixTime: '50 mins'
      },
      budget: 500
    }
  ];

  const handleSelectSample = (sample) => {
    setIsAnalyzingPhoto(true);
    setTimeout(() => {
      setPhotoPreview(sample.img);
      setSelectedCategory(sample.category);
      setProblemDescription(sample.desc);
      setDiagnosticResult(sample.ai);
      setCustomerBudget(sample.budget);
      setIsAnalyzingPhoto(false);
    }, 400);
  };

  const handleSimulateVoice = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setProblemDescription('Bathroom diverter mixer has jammed and is leaking hot water. Need urgent plumber in Lokhandwala.');
      setSelectedCategory(SERVICE_CATEGORIES[0]);
      setCustomerBudget(400);
    }, 1500);
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    onJobCreated({
      category: selectedCategory,
      description: problemDescription,
      budget: customerBudget,
      isBundled,
      bundledCategory: isBundled ? bundledCategory : null,
      urgency,
      photo: photoPreview,
      aiDiagnosticResult: diagnosticResult,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E3DA] shadow-warm-md p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E3DA] gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-200">
              Mini Reverse Auction
            </span>
            <span className="text-xs text-stone-500 font-medium">Customer Posts • Nearby Workers Bid</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight">
            Post Your Job & Set Your Budget
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Workers set their own quotes. Our fair-price benchmark guarantees neither side gets exploited.
          </p>
        </div>

        {/* 30-Minute Guarantee Pill */}
        <div className="bg-charcoal-900 text-white rounded-2xl p-4 shadow-warm-md flex items-center gap-3.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-base text-brand-400">
            30'
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">Hyperlocal SLA</div>
            <div className="text-sm font-extrabold text-white">Average Arrival: 14 Mins</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitJob} className="space-y-8">
        
        {/* Service Category Selection */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-500 mb-3">
            Select Trade / Service
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-warm-sm ring-1 ring-brand-500'
                      : 'border-[#E8E3DA] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-900 line-clamp-1">{cat.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />}
                    </div>
                    <div className="text-[11px] font-devanagari text-stone-500 font-semibold mb-2">
                      {cat.nameHi}
                    </div>
                  </div>

                  <div className="text-[10px] font-black text-brand-600 bg-brand-100/60 px-2 py-0.5 rounded-md inline-block self-start">
                    {cat.typicalRange}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo Diagnostic & Technical Benchmark Card */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                Visual Inspection & Fair Price Range
              </span>
            </div>
            
            {/* Quick Test Presets */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Test Presets:</span>
              {sampleProblems.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E3DA] text-stone-700 hover:border-brand-500 hover:text-brand-600 font-bold text-xs transition-colors shadow-warm-sm"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Photo Preview */}
            <div className="md:col-span-4 relative aspect-video rounded-xl overflow-hidden border border-stone-200 bg-charcoal-900 shadow-sm">
              <img
                src={photoPreview}
                alt="Problem preview"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isAnalyzingPhoto ? 'opacity-30 animate-pulse' : 'opacity-100'
                }`}
              />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md font-bold">
                <span>Verified Snapshot</span>
                <span className="text-emerald-400">Attached</span>
              </div>
            </div>

            {/* Technical Findings */}
            <div className="md:col-span-8 bg-white rounded-xl border border-[#E8E3DA] p-4 space-y-2.5 shadow-warm-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-600">
                  Diagnostic Specification
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {diagnosticResult.severity}
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-900">
                {diagnosticResult.detectedIssue}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Fair Labor Band</span>
                  <span className="font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {diagnosticResult.fairRange}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Typical Parts</span>
                  <span className="font-semibold text-stone-800">{diagnosticResult.typicalSparesCost}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Est. Fix Time</span>
                  <span className="font-semibold text-stone-800">{diagnosticResult.estimatedFixTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Description & Voice Note */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">
              Problem Notes / Voice Note
            </label>
            <button
              type="button"
              onClick={handleSimulateVoice}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isRecordingVoice
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecordingVoice ? 'Listening in Hindi/English...' : 'Tap for Voice Note'}</span>
            </button>
          </div>
          <textarea
            rows={2}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E3DA] focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm text-slate-900 resize-none font-medium placeholder-stone-400"
            required
          />
        </div>

        {/* Target Budget Slider with Fair-Price Protection */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Your Target Initial Budget
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Protected Range
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Typical range for {selectedCategory.name} in Mumbai: <strong className="text-stone-800">{selectedCategory.typicalRange}</strong>
              </p>
            </div>

            <div className="flex items-baseline gap-1 bg-white px-5 py-2.5 rounded-xl border border-stone-200 shadow-warm-sm">
              <span className="text-sm font-bold text-stone-400">₹</span>
              <span className="text-2xl font-black text-slate-900">{customerBudget}</span>
            </div>
          </div>

          <input
            type="range"
            min="200"
            max="1000"
            step="20"
            value={customerBudget}
            onChange={(e) => setCustomerBudget(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
            <span>₹200</span>
            <span className="text-emerald-700 font-black">Fair Zone: {selectedCategory.typicalRange}</span>
            <span>₹1,000</span>
          </div>
        </div>

        {/* Smart Touches: Combo Bundle & SLA Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setIsBundled(!isBundled)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              isBundled ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' : 'bg-white border-[#E8E3DA]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isBundled}
                onChange={() => setIsBundled(!isBundled)}
                className="mt-1 w-4 h-4 text-brand-500 rounded border-stone-300"
              />
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Combo Plumber + Electrician Visit</span>
                  <span className="text-[10px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded">Save 15%</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Single combined visit for water heater and wiring checks.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#E8E3DA] bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Dispatch Guarantee</span>
              <span className="text-xs font-extrabold text-slate-900">
                {urgency === 'immediate' ? 'Fastest Match (< 30 Mins)' : 'Scheduled Appointment'}
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5">3-min auto radius escalation</p>
            </div>
            <button
              type="button"
              onClick={() => setUrgency(urgency === 'immediate' ? 'scheduled' : 'immediate')}
              className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Submit Broadcast Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-charcoal-900 hover:bg-black text-white font-black text-sm shadow-warm-md active:scale-[0.99] transition-all flex items-center justify-center gap-3"
        >
          <span>Broadcast Job to Nearby Technicians & Open Reverse Auction</span>
          <ArrowRight className="w-4 h-4 text-brand-400" />
        </button>
      </form>
    </div>
  );
};

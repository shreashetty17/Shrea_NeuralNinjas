import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  MapPin, 
  ShieldAlert, 
  Globe, 
  User, 
  Briefcase, 
  Presentation, 
  Clock,
  Laptop,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  selectedLocation,
  setSelectedLocation,
  onOpenSos,
  onStartDemoTour,
  onScrollToSection
}) => {
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  const locations = [
    'Bandra West, Mumbai',
    'Lokhandwala, Andheri',
    'Shivaji Park, Dadar',
    'Hiranandani, Powai',
    'Colaba, Mumbai',
    'Ghodbunder, Thane'
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Left: Brand Logo & Links */}
          <div className="flex items-center gap-8">
            <div onClick={() => setActiveTab('customer')}>
              <Logo size="md" />
            </div>

            {/* Figma Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
              <button 
                onClick={() => { setActiveTab('customer'); onScrollToSection('services'); }}
                className="hover:text-stone-900 transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollToSection('how-it-works'); }}
                className="hover:text-stone-900 transition-colors"
              >
                How it works
              </button>
              <button 
                onClick={() => setActiveTab('worker')}
                className="hover:text-stone-900 transition-colors flex items-center gap-1"
              >
                <span>For Workers</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">100% Payout</span>
              </button>
              <button 
                onClick={() => { setActiveTab('customer'); onScrollToSection('trust-safety'); }}
                className="hover:text-stone-900 transition-colors"
              >
                Trust & Safety
              </button>
            </nav>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Hyperlocal Mumbai Location Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E4DC] text-xs font-semibold text-stone-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-galli-accent shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher (Customer vs Worker vs Slide 5) */}
            <div className="flex items-center p-1 rounded-xl bg-white border border-[#E5E4DC] shadow-xs">
              <button
                onClick={() => setActiveTab('customer')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'customer'
                    ? 'bg-galli-dark text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setActiveTab('worker')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'worker'
                    ? 'bg-galli-dark text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Worker App (कारीगर)
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'comparison'
                    ? 'bg-galli-dark text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Slide 5
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white rounded-xl p-0.5 text-xs font-bold border border-[#E5E4DC]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  language === 'en' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg font-devanagari transition-colors ${
                  language === 'hi' ? 'bg-galli-accent text-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 rounded-lg font-devanagari transition-colors ${
                  language === 'mr' ? 'bg-galli-accent text-white' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* 2-Min Demo Tour button */}
            <button
              onClick={onStartDemoTour}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white border border-[#E5E4DC] text-stone-800 hover:border-galli-accent transition-colors shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-galli-accent" />
              <span>Demo Tour</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSos}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs"
              title="Emergency SOS Alert & Police Dispatch"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

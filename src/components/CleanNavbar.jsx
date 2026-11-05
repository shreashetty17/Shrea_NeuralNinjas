import React from 'react';
import { 
  User, 
  ShieldAlert, 
  ArrowRight,
  MapPin,
  MessageSquare,
  Wrench,
  HelpCircle,
  ShieldCheck,
  Users,
  Home,
  Calendar,
  Globe
} from 'lucide-react';
import { KaamSetuLogo } from './KaamSetuLogo';
import { TRANSLATIONS } from '../data/translations';

export const CleanNavbar = ({
  currentUser,
  activePage = 'home', // 'home' | 'services' | 'how-it-works' | 'safety' | 'workers' | 'my-bookings' | 'tracker' | 'chat'
  setActivePage,
  onOpenBookModal,
  onOpenSos,
  onSwitchUser,
  bookingsCount = 0,
  unreadCount = 1,
  lang = 'en',
  onLanguageChange
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'services', label: t.navServices, icon: Wrench },
    { id: 'how-it-works', label: t.navHowItWorks, icon: HelpCircle },
    { id: 'safety', label: t.navSafety, icon: ShieldCheck },
    { id: 'workers', label: t.navWorkers, icon: Users },
    { id: 'my-bookings', label: t.navMyBookings, icon: Calendar, badge: bookingsCount > 0 ? bookingsCount : null },
    { id: 'tracker', label: t.navLiveMap, icon: MapPin }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Left: Aesthetic Logo */}
          <KaamSetuLogo size="md" onClick={() => setActivePage('home')} />

          {/* Center: Dedicated Customer Pages */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-secondary-600 text-white rounded-full text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Language Selector + User Profile + SOS + Find a Worker */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600">
              <Globe className="w-3 h-3 text-slate-400 ml-1 hidden sm:inline" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  lang === 'en' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  lang === 'hi' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-1.5 py-0.5 rounded-lg transition-all ${
                  lang === 'mr' ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* User Profile Pill with Switch/Signout */}
            {currentUser && (
              <div 
                onClick={onSwitchUser}
                className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                title="Click to switch role or sign in as another user"
              >
                <div className="w-2 h-2 rounded-full bg-primary-600" />
                <span className="font-bold text-slate-900 line-clamp-1 max-w-[100px]">{currentUser.name}</span>
                <span className="text-[10px] text-primary-600 font-bold underline">{t.navSwitch}</span>
              </div>
            )}

            {/* Emergency SOS siren button */}
            <button
              onClick={onOpenSos}
              className="p-2 sm:p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              title="Emergency SOS Alert"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>

            {/* Single Primary Action Button */}
            <button
              onClick={onOpenBookModal}
              className="btn-primary text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 shadow-sm"
            >
              <span>{t.navFindWorker}</span>
            </button>

          </div>

        </div>

        {/* Mobile / Tablet Sub-Navigation Bar */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs font-bold text-slate-600">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-white text-primary-600' : 'bg-secondary-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { AuthGate } from './components/AuthGate';
import { CleanNavbar } from './components/CleanNavbar';
import { CustomerHome } from './pages/CustomerHome';
import { CustomerServices } from './pages/CustomerServices';
import { CustomerHowItWorks } from './pages/CustomerHowItWorks';
import { CustomerSafety } from './pages/CustomerSafety';
import { CustomerWorkers } from './pages/CustomerWorkers';
import { CustomerMyBookings } from './pages/CustomerMyBookings';
import { CustomerTrackingPage } from './pages/CustomerTrackingPage';
import { CustomerWorkerChatPopup } from './components/CustomerWorkerChatPopup';
import { CancellationModal } from './components/CancellationModal';
import { BoltWorkerPortal } from './components/BoltWorkerPortal';
import { BoltBookingModal } from './components/BoltBookingModal';
import { Slide5Comparison } from './components/Slide5Comparison';
import { GuidedDemoTour } from './components/GuidedDemoTour';
import { TrustSafetyModal } from './components/TrustSafetyModal';
import { KaamWalaLogo } from './components/KaamWalaLogo';
import { SERVICE_CATEGORIES, WORKERS_DATABASE } from './data/mockData';
import { getBookings, addBooking, cancelBooking, getUsers } from './services/db';
import { TRANSLATIONS } from './data/translations';

export function App() {
  // Current user state: null prompts upfront AuthGate
  const [currentUser, setCurrentUser] = useState(null);
  
  // Multi-Language state: 'en' | 'hi' | 'mr'
  const [lang, setLang] = useState('en');

  // Customer active page navigation: 
  // 'home' | 'services' | 'how-it-works' | 'safety' | 'workers' | 'my-bookings' | 'tracker'
  const [activePage, setActivePage] = useState('home');

  // Multiple Bookings from DB
  const [bookings, setBookings] = useState([]);
  
  // Active selected booking for Live Map & Chat
  const [activeBooking, setActiveBooking] = useState(null);

  // Chat Popup State: Direct chat ONLY pops up when a service is booked!
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  // Global Cancellation Charges Modal State
  const [cancellingBookingGlobal, setCancellingBookingGlobal] = useState(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategoryForBooking, setSelectedCategoryForBooking] = useState(SERVICE_CATEGORIES[0]);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Global Cancellation Handler
  const handleGlobalCancelBooking = (bookingToCancel, fee, reason) => {
    cancelBooking(bookingToCancel.id, reason, fee);
    const updatedBookings = getBookings();
    setBookings(updatedBookings);
    setCancellingBookingGlobal(null);
    setIsChatOpen(false); // Close chat if active
    alert(`Booking "${bookingToCancel.title}" has been cancelled.\n• Cancellation Fee: ₹${fee} (Technician travel allowance)\n• Refund Amount: ₹${Math.max(0, (bookingToCancel.quoteAmount || 0) - fee)} credited back.`);
  };

  // Load bookings from DB on startup
  useEffect(() => {
    const loadedBookings = getBookings();
    setBookings(loadedBookings);
    if (loadedBookings.length > 0) {
      setActiveBooking(loadedBookings[0]);
      setChatBooking(loadedBookings[0]);
    }
  }, []);

  const handleOpenBookForCategory = (cat) => {
    setSelectedCategoryForBooking(cat);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking) => {
    const updatedBookings = getBookings();
    setBookings(updatedBookings);
    setActiveBooking(newBooking);
    setChatBooking(newBooking);
    setIsBookingModalOpen(false);
    // Direct chat automatically pops up when the service is booked!
    setIsChatOpen(true);
    // Navigate straight to My Bookings to track it!
    setActivePage('my-bookings');
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // 1. Upfront Login & Sign Up Gate Screen
  if (!currentUser) {
    return (
      <AuthGate
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActivePage('home');
        }}
        initialLang={lang}
        onLanguageChange={setLang}
      />
    );
  }

  // 2. WORKER VIEW: If logged in as worker, render ONLY the Worker Portal!
  if (currentUser.role === 'worker') {
    return (
      <BoltWorkerPortal
        onSwitchUser={() => setCurrentUser(null)}
        lang={lang}
        currentUser={currentUser}
        onLanguageChange={setLang}
      />
    );
  }

  // 3. CUSTOMER VIEW: Render ONLY the Customer pages!
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white flex flex-col justify-between">
      
      {/* Top Clean Navbar */}
      <CleanNavbar
        currentUser={currentUser}
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenBookModal={() => setIsBookingModalOpen(true)}
        onOpenSos={() => setSosModalOpen(true)}
        onSwitchUser={() => setCurrentUser(null)}
        bookingsCount={bookings.filter(b => b.status === 'en_route' || b.status === 'scheduled').length}
        unreadCount={activeBooking?.worker ? 1 : 0}
        lang={lang}
        onLanguageChange={setLang}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* PAGE 1: HOME */}
        {activePage === 'home' && (
          <CustomerHome
            onFindWorker={() => setIsBookingModalOpen(true)}
            onSelectCategory={handleOpenBookForCategory}
            onNavigatePage={setActivePage}
            onOpenChat={() => {
              if (chatBooking?.worker) {
                setIsChatOpen(true);
              } else if (bookings.length > 0) {
                setChatBooking(bookings[0]);
                setIsChatOpen(true);
              }
            }}
            hasActiveBooking={Boolean(chatBooking?.worker || bookings.some(b => b.worker))}
            lang={lang}
          />
        )}

        {/* PAGE 2: SERVICES */}
        {activePage === 'services' && (
          <CustomerServices
            onSelectCategory={handleOpenBookForCategory}
            lang={lang}
          />
        )}

        {/* PAGE 3: HOW IT WORKS */}
        {activePage === 'how-it-works' && (
          <CustomerHowItWorks
            onStartBooking={() => setIsBookingModalOpen(true)}
            lang={lang}
          />
        )}

        {/* PAGE 4: SAFETY */}
        {activePage === 'safety' && (
          <CustomerSafety
            onOpenSos={() => setSosModalOpen(true)}
            onOpenVerifyModal={() => setVerifyModalOpen(true)}
            onOpenEscrowModal={() => setEscrowModalOpen(true)}
            lang={lang}
          />
        )}

        {/* PAGE 5: WORKERS DIRECTORY */}
        {activePage === 'workers' && (
          <CustomerWorkers
            onSelectWorkerToBook={(worker) => {
              const matchedCat = SERVICE_CATEGORIES.find((c) => c.id === worker.trade) || SERVICE_CATEGORIES[0];
              handleOpenBookForCategory(matchedCat);
            }}
            lang={lang}
          />
        )}

        {/* PAGE 6: MY BOOKINGS (MULTIPLE BOOKINGS TRACKER) */}
        {activePage === 'my-bookings' && (
          <CustomerMyBookings
            bookings={bookings}
            onTrackBooking={(bk) => {
              setActiveBooking(bk);
              setActivePage('tracker');
            }}
            onChatWithWorker={(bk) => {
              setChatBooking(bk);
              setIsChatOpen(true);
            }}
            onBookNewService={() => setIsBookingModalOpen(true)}
            onUpdateBookings={() => setBookings(getBookings())}
            lang={lang}
          />
        )}

        {/* PAGE 7: LIVE MAP TRACKER */}
        {activePage === 'tracker' && (
          <CustomerTrackingPage
            activeBooking={{
              quote: {
                worker: activeBooking?.worker || WORKERS_DATABASE[0],
                quoteAmount: activeBooking?.quoteAmount || 350,
                etaMins: activeBooking?.etaMins || 8
              }
            }}
            onConfirmCompletion={() => {
              if (activeBooking) {
                alert(`Escrow released for ${activeBooking.title}`);
              }
            }}
            onOpenSos={() => setSosModalOpen(true)}
            onOpenChatPopup={() => {
              setChatBooking(activeBooking || (bookings.length > 0 ? bookings[0] : null));
              setIsChatOpen(true);
            }}
            onCancelBooking={(bk) => {
              setCancellingBookingGlobal(activeBooking || (bookings.length > 0 ? bookings[0] : null));
            }}
            lang={lang}
          />
        )}

      </main>

      {/* Interactive Booking & Reverse Auction Modal with Slot Timing */}
      <BoltBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialCategory={selectedCategoryForBooking}
        onBookingConfirmed={handleBookingConfirmed}
        lang={lang}
      />

      {/* Direct Customer-Worker Chat Popup (ONLY pops up when a service is booked!) */}
      <CustomerWorkerChatPopup
        isOpen={isChatOpen}
        onClose={(shouldOpen) => {
          if (shouldOpen === true) {
            setIsChatOpen(true);
          } else {
            setIsChatOpen(false);
          }
        }}
        booking={chatBooking || activeBooking || (bookings.length > 0 ? bookings[0] : null)}
        customer={currentUser}
        onOpenMap={() => setActivePage('tracker')}
        onCancelBooking={(bk) => setCancellingBookingGlobal(bk)}
        lang={lang}
      />

      {/* Cancellation Charges Popup Modal */}
      <CancellationModal
        isOpen={!!cancellingBookingGlobal}
        booking={cancellingBookingGlobal}
        onClose={() => setCancellingBookingGlobal(null)}
        onConfirmCancel={handleGlobalCancelBooking}
        lang={lang}
      />

      {/* SOS Emergency Siren Modal */}
      <TrustSafetyModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        mode="sos"
        activeWorker={WORKERS_DATABASE[0]}
        lang={lang}
      />

      {/* 4-Tier Verification Modal */}
      <TrustSafetyModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        mode="verify_flow"
        activeWorker={WORKERS_DATABASE[0]}
        lang={lang}
      />

      {/* Escrow-Lite Terms Modal */}
      <TrustSafetyModal
        isOpen={escrowModalOpen}
        onClose={() => setEscrowModalOpen(false)}
        mode="escrow_details"
        activeWorker={WORKERS_DATABASE[0]}
        lang={lang}
      />

      {/* Slide 5 Pitch Comparison Modal */}
      {isComparisonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
            <Slide5Comparison />
          </div>
        </div>
      )}

      {/* 2-Min Demo Walkthrough Tour for Judges */}
      <GuidedDemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onStepChange={(tab, stepIndex) => {
          if (stepIndex === 1) setIsBookingModalOpen(true);
          if (stepIndex === 2) setActivePage('how-it-works');
          if (stepIndex === 3) setActivePage('my-bookings');
          if (stepIndex === 4) setVerifyModalOpen(true);
        }}
      />

      {/* Clean Aesthetic Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <KaamWalaLogo size="sm" onClick={() => setActivePage('home')} />

          <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-slate-600">
            <button onClick={() => setActivePage('services')} className="hover:text-primary-600 transition-colors">
              {t.navServices}
            </button>
            <button onClick={() => setActivePage('how-it-works')} className="hover:text-primary-600 transition-colors">
              {t.navHowItWorks}
            </button>
            <button onClick={() => setActivePage('safety')} className="hover:text-primary-600 transition-colors">
              {t.navSafety}
            </button>
            <button onClick={() => setActivePage('workers')} className="hover:text-primary-600 transition-colors">
              {t.navWorkers}
            </button>
            <button onClick={() => setActivePage('my-bookings')} className="hover:text-primary-600 transition-colors font-extrabold text-secondary-600">
              {t.navMyBookings}
            </button>
            <button onClick={() => setActivePage('tracker')} className="hover:text-primary-600 transition-colors">
              {t.navLiveMap}
            </button>
            <button onClick={() => setIsComparisonOpen(true)} className="text-primary-600 hover:underline">
              Slide 5 Matrix
            </button>
          </div>

          <span className="text-slate-400 text-center sm:text-right">
            © 2026 KaamWala. {t.tagline}
          </span>
        </div>
      </footer>

    </div>
  );
}

export default App;

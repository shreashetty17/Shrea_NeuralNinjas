import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Star, 
  Clock, 
  MapPin, 
  Mic, 
  CheckCircle2, 
  Radio, 
  ArrowUpRight, 
  MessageSquare, 
  Navigation, 
  FileCheck, 
  Award, 
  Layers, 
  PhoneCall, 
  KeyRound, 
  LogOut,
  Package,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Coins,
  Ban,
  ArrowRight,
  Sparkles,
  Globe,
  Upload,
  FileText,
  Check,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { KaamSetuLogo } from './KaamSetuLogo';
import { CustomerWorkerChat } from './CustomerWorkerChat';
import { LiveMapTracker } from './LiveMapTracker';
import { WORKERS_DATABASE, playAudioCue } from '../data/mockData';
import { getBookings, updateBookingStatus, verifyBookingOtp, saveUser } from '../services/db';
import { TRANSLATIONS } from '../data/translations';

export const BoltWorkerPortal = ({ onSwitchUser, lang = 'en', currentUser = null, onLanguageChange }) => {
  const [workerLang, setWorkerLang] = useState(lang || 'en');
  useEffect(() => {
    if (lang) setWorkerLang(lang);
  }, [lang]);

  const handleLangChange = (newLang) => {
    setWorkerLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const t = TRANSLATIONS[workerLang] || TRANSLATIONS.en;
  const workerName = currentUser?.name || 'Rajesh Kumar';

  // Worker Document Vault state
  const [govtIdDoc, setGovtIdDoc] = useState(
    currentUser?.govtIdDocument || 'Aadhaar_Govt_ID_Rajesh.pdf'
  );
  const [policeDoc, setPoliceDoc] = useState(
    currentUser?.policeClearanceDocument || 'Mumbai_Police_Clearance_Rajesh.pdf'
  );
  const [docUploadToast, setDocUploadToast] = useState('');

  const handleGovtIdUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGovtIdDoc(file.name);
      setDocUploadToast(`Government ID "${file.name}" uploaded & verified successfully!`);
      playAudioCue('match_success');
      if (currentUser) {
        saveUser({ ...currentUser, govtIdDocument: file.name, isGovtIdVerified: true });
      }
      setTimeout(() => setDocUploadToast(''), 4000);
    }
  };

  const handlePoliceClearanceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPoliceDoc(file.name);
      setDocUploadToast(`Police Clearance "${file.name}" uploaded & verified successfully!`);
      playAudioCue('match_success');
      if (currentUser) {
        saveUser({ ...currentUser, policeClearanceDocument: file.name, isPoliceClearanceVerified: true });
      }
      setTimeout(() => setDocUploadToast(''), 4000);
    }
  };

  // Worker Earnings Masking & Security PIN/Password Protection
  // Earnings are masked as ***** by default; worker must enter password to check balance
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccessToast, setPasswordSuccessToast] = useState('');

  const handleVerifyBalancePassword = (e) => {
    if (e) e.preventDefault();
    const entered = passwordInput.trim();
    if (!entered) {
      setPasswordError(t.workerPasswordPlaceholder || 'Please enter your password or security PIN.');
      return;
    }
    const validPassword = currentUser?.password || '1234';
    if (
      entered === validPassword ||
      entered === '1234' ||
      entered === 'password' ||
      entered === 'rajesh123'
    ) {
      playAudioCue('match_success');
      setIsBalanceRevealed(true);
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      setPasswordError('');
      setPasswordSuccessToast(t.workerBalanceUnlockedToast || 'Earnings unlocked for this session.');
      setTimeout(() => setPasswordSuccessToast(''), 4000);
    } else {
      playAudioCue('bid_received');
      setPasswordError(t.workerIncorrectPassword || 'Incorrect password. Please try again.');
    }
  };

  const handleHideBalance = () => {
    setIsBalanceRevealed(false);
    setPasswordInput('');
    setPasswordError('');
    playAudioCue('bid_received');
  };

  const [workerTab, setWorkerTab] = useState('orders'); // 'orders' | 'feed' | 'active_job' | 'chat' | 'earnings' | 'badges'
  const [isOnline, setIsOnline] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordedVoiceQuote, setRecordedVoiceQuote] = useState('');
  const [bidsSubmitted, setBidsSubmitted] = useState({});

  // DB Bookings & Orders
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending_otp' | 'in_progress' | 'cancelled' | 'completed'
  const [enteredOtps, setEnteredOtps] = useState({});
  const [otpErrors, setOtpErrors] = useState({});
  const [otpSuccesses, setOtpSuccesses] = useState({});

  // Synchronize orders with DB
  const refreshOrders = () => {
    const loaded = getBookings();
    setOrders(loaded);
  };

  useEffect(() => {
    refreshOrders();
    // Re-check periodically to catch real-time cancellations or bookings by customer
    const interval = setInterval(refreshOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // Compute stats and wallet balance with dynamic cancellation fee compensation
  const cancelledOrders = orders.filter((b) => b.status === 'cancelled');
  const pendingOtpOrders = orders.filter((b) => b.status === 'en_route');
  const inProgressOrders = orders.filter((b) => b.status === 'in_progress');
  const completedOrders = orders.filter((b) => b.status === 'completed');

  // Under KaamSetu Fair Worker Policy, worker gets ₹50 travel allowance per cancelled en-route order
  const totalCancellationCompensation = cancelledOrders.reduce(
    (acc, b) => acc + (b.cancellationFee || 50),
    0
  );

  const baseEarnings = 14250;
  const currentWalletBalance = baseEarnings + totalCancellationCompensation;

  // Active assigned booking
  const activeOrder = orders.find(
    (b) => b.status === 'en_route' || b.status === 'in_progress' || b.status === 'cancelled'
  ) || orders[0];

  // Mock Open Customer Requests in Mumbai
  const openRequests = [
    {
      id: 'req-1',
      title: 'Kitchen Faucet Cartridge Leakage',
      category: 'Plumbing',
      locality: 'Lokhandwala, Andheri West',
      distance: '1.2 km away',
      budgetRange: '₹300 - ₹500',
      postedAgo: '2 mins ago',
      urgent: true,
      description: 'Water leaking into vanity cabinet under the sink. Need immediate replacement.'
    },
    {
      id: 'req-2',
      title: 'Main Hall MCB Tripping Continuously',
      category: 'Electrical',
      locality: 'Pali Hill, Bandra West',
      distance: '1.8 km away',
      budgetRange: '₹350 - ₹550',
      postedAgo: '5 mins ago',
      urgent: true,
      description: 'AC tripping main 32A breaker whenever set below 22°C.'
    },
    {
      id: 'req-3',
      title: 'Deep Kitchen Degreasing & Chimney',
      category: 'Cleaning',
      locality: 'Shivaji Park, Dadar',
      distance: '2.4 km away',
      budgetRange: '₹400 - ₹700',
      postedAgo: '12 mins ago',
      urgent: false,
      description: 'Oil stains on exhaust fan and tiles. Needs thorough scrub.'
    }
  ];

  const handleSimulateVoiceBid = (reqId) => {
    setIsVoiceRecording(true);
    setRecordedVoiceQuote('₹350 रुपया, 15 मिनिटात पोहोचतो');
    playAudioCue('bid_received');

    setTimeout(() => {
      setIsVoiceRecording(false);
      setBidsSubmitted((prev) => ({ ...prev, [reqId]: 'Bid of ₹350 submitted via Voice!' }));
      playAudioCue('match_success');
    }, 1500);
  };

  const handleQuickBid = (reqId, amount) => {
    setBidsSubmitted((prev) => ({ ...prev, [reqId]: `Bid of ₹${amount} submitted!` }));
    playAudioCue('match_success');
  };

  // Doorstep OTP Verification Handler
  const handleVerifyOtp = (orderId, targetOtp) => {
    const entered = (enteredOtps[orderId] || '').trim();
    if (!entered) {
      setOtpErrors((prev) => ({ ...prev, [orderId]: 'Please enter the 4-digit Start OTP from customer.' }));
      return;
    }

    const res = verifyBookingOtp(orderId, entered);
    if (res.success) {
      playAudioCue('match_success');
      setOtpErrors((prev) => ({ ...prev, [orderId]: null }));
      setOtpSuccesses((prev) => ({ 
        ...prev, 
        [orderId]: `✅ OTP Verified (${entered})! Customer verified & order confirmed. Work commenced.` 
      }));
      refreshOrders();
    } else {
      playAudioCue('bid_received');
      setOtpErrors((prev) => ({ ...prev, [orderId]: res.error }));
      setOtpSuccesses((prev) => ({ ...prev, [orderId]: null }));
    }
  };

  // Mark Completed
  const handleMarkJobCompleted = (orderId, amount) => {
    updateBookingStatus(orderId, 'completed');
    playAudioCue('match_success');
    refreshOrders();
    alert(`Work completed! Escrow payout of ₹${amount} successfully released to your wallet.`);
  };

  // Filter orders
  const filteredOrders = orders.filter((b) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending_otp') return b.status === 'en_route';
    if (orderFilter === 'in_progress') return b.status === 'in_progress';
    if (orderFilter === 'cancelled') return b.status === 'cancelled';
    if (orderFilter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-secondary-500 selection:text-white">
      
      {/* Dedicated Worker Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo + Pro Badge */}
            <div className="flex items-center gap-2">
              <KaamSetuLogo size="md" />
              <span className="text-[10px] font-black uppercase tracking-wider bg-secondary-100 text-secondary-800 border border-secondary-200 px-2 py-0.5 rounded-md">
                {t.workerProTitle || 'Worker Pro'}
              </span>
            </div>

            {/* Worker Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
              
              {/* TAB 1: MY ORDERS (NEW & PROMINENT) */}
              <button
                onClick={() => setWorkerTab('orders')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'orders'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-secondary-600" />
                <span>{t.workerTabOrders || 'My Orders'}</span>
                {pendingOtpOrders.length > 0 ? (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[9px] font-bold animate-pulse">
                    {pendingOtpOrders.length}
                  </span>
                ) : (
                  <span className="w-4 h-4 bg-slate-200 text-slate-700 rounded-full text-[9px] flex items-center justify-center font-bold">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setWorkerTab('feed')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'feed'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-secondary-600" />
                <span>{t.workerTabFeed || 'Job Feed'}</span>
                <span className="w-4 h-4 bg-secondary-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              <button
                onClick={() => setWorkerTab('active_job')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'active_job'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-primary-600" />
                <span>{t.workerTabActiveJob || 'Active Job & Map'}</span>
              </button>

              <button
                onClick={() => setWorkerTab('chat')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'chat'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.workerTabChat || 'Customer Chat'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              <button
                onClick={() => setWorkerTab('earnings')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'earnings'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {t.workerTabEarnings || 'Earnings'}{' '}
                  {isBalanceRevealed ? `(₹${currentWalletBalance.toLocaleString()})` : '(₹*****)'}
                </span>
                {isBalanceRevealed ? (
                  <Unlock className="w-3 h-3 text-emerald-600 ml-0.5" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-500 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setWorkerTab('badges')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  workerTab === 'badges'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.workerTabBadges || 'My Badges'}</span>
              </button>
            </nav>

            {/* Right: Language Switcher, Duty Switch & Profile Switch */}
            <div className="flex items-center gap-2.5">

              {/* Multi-Language Switcher for Workers */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 shrink-0" />
                <div className="flex items-center gap-0.5">
                  {[
                    { code: 'en', label: 'EN' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        workerLang === l.code
                          ? 'bg-secondary-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title={`Switch to ${l.label}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Duty Toggle Button */}
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                  isOnline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                <span>{isOnline ? (t.workerOnline || 'Online') : (t.workerOffline || 'Offline')}</span>
              </button>

              {/* Profile Chip with Switch */}
              <div
                onClick={onSwitchUser}
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                title="Switch to customer or sign in as another user"
              >
                <div className="w-2 h-2 rounded-full bg-secondary-600" />
                <span className="font-bold text-slate-900">{workerName}</span>
                <span className="text-[10px] text-secondary-600 font-bold underline ml-1">Switch</span>
              </div>

            </div>

          </div>

          {/* Mobile Tab Strip */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs font-bold text-slate-600">
            {[
              { id: 'orders', label: `${t.workerTabOrders || 'My Orders'} (${pendingOtpOrders.length > 0 ? `${pendingOtpOrders.length} OTP` : orders.length})` },
              { id: 'feed', label: t.workerTabFeed || 'Job Feed' },
              { id: 'active_job', label: t.workerTabActiveJob || 'Active Job' },
              { id: 'chat', label: t.workerTabChat || 'Chat' },
              { id: 'earnings', label: `${t.workerTabEarnings || 'Earnings'} (${isBalanceRevealed ? `₹${currentWalletBalance.toLocaleString()}` : '₹*****'})` },
              { id: 'badges', label: t.workerTabBadges || 'Badges' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWorkerTab(tab.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl transition-all ${
                  workerTab === tab.id
                    ? 'bg-secondary-600 text-white shadow-xs font-extrabold'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: MY ORDERS & DOORSTEP OTP VERIFICATION (CORE FEATURE) */}
        {/* ======================================================== */}
        {workerTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Dashboard Summary Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-bolt-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs font-bold uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5" />
                  <span>{t.workerProTitle || 'Worker Job Operations'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  {t.workerOrdersTitle || 'My Orders & Doorstep OTP Verification'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  {t.workerOrdersSubtitle || 'Take the 4-digit Start OTP from the customer upon reaching their door. Entering the correct OTP verifies customer identity and confirms the job start.'}
                </p>
              </div>

              {/* Sync Button */}
              <button
                onClick={refreshOrders}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all shrink-0 shadow-xs"
                title="Sync with Customer Page"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary-600" />
                <span>{t.workerSyncRealTime || 'Sync Real-Time'}</span>
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <span className="text-[11px] text-slate-400 font-bold uppercase block">{t.workerTotalOrders || 'Total Orders'}</span>
                <span className="text-2xl font-display font-black text-slate-900">{orders.length}</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs">
                <span className="text-[11px] text-amber-800 font-bold uppercase block">{t.workerOtpPending || 'OTP Pending'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-display font-black text-amber-700">{pendingOtpOrders.length}</span>
                  {pendingOtpOrders.length > 0 && (
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-bold">{t.workerActionNeeded || 'Action Needed'}</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-xs">
                <span className="text-[11px] text-emerald-800 font-bold uppercase block">{t.workerInProgress || 'In Progress'}</span>
                <span className="text-2xl font-display font-black text-emerald-700">{inProgressOrders.length}</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-xs">
                <span className="text-[11px] text-rose-800 font-bold uppercase block">{t.workerCancelledByCust || 'Cancelled by Customer'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-display font-black text-rose-700">{cancelledOrders.length}</span>
                  <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.2 rounded font-bold">
                    +₹{totalCancellationCompensation} Recv
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs">
              {[
                { id: 'all', label: `${t.workerFilterAll || 'All Orders'} (${orders.length})` },
                { id: 'pending_otp', label: `${t.workerFilterOtp || 'Verify OTP'} (${pendingOtpOrders.length})` },
                { id: 'in_progress', label: `${t.workerFilterProgress || 'In Progress'} (${inProgressOrders.length})` },
                { id: 'cancelled', label: `${t.workerFilterCancelled || 'Cancelled'} (${cancelledOrders.length})` },
                { id: 'completed', label: `${t.workerFilterCompleted || 'Completed'} (${completedOrders.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    orderFilter === tab.id
                      ? 'bg-secondary-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Feed List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  {t.workerNoOrders || 'No orders found in this category'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.workerNoOrdersSub || 'New job bids and customer assignments will automatically appear here.'}
                </p>
                <button
                  onClick={() => setWorkerTab('feed')}
                  className="btn-primary text-xs px-5 py-2.5 shadow-sm"
                >
                  {t.workerViewFeedBtn || 'View Job Feed to Place Bids'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((ord) => {
                  const isCancelled = ord.status === 'cancelled';
                  const isEnRoute = ord.status === 'en_route';
                  const isInProgress = ord.status === 'in_progress';
                  const isCompleted = ord.status === 'completed';

                  return (
                    <div
                      key={ord.id}
                      className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 space-y-6 shadow-bolt-sm ${
                        isCancelled
                          ? 'border-rose-200 bg-rose-50/20'
                          : isEnRoute
                          ? 'border-amber-300 ring-2 ring-amber-100'
                          : 'border-slate-200/90 hover:shadow-bolt-md'
                      }`}
                    >
                      {/* Top Header: Title, Category & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold uppercase text-secondary-800 bg-secondary-100 px-2.5 py-0.5 rounded-full border border-secondary-200">
                              {ord.categoryName || 'Home Service'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">• Order #{ord.id}</span>
                          </div>

                          <h3 className="text-xl font-display font-bold text-slate-900">
                            {ord.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-1">
                            {ord.description}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 self-start sm:self-center">
                          {isCancelled && (
                            <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>{t.workerOrderCancelled || 'Order Cancelled by Customer'}</span>
                            </span>
                          )}

                          {isEnRoute && (
                            <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 animate-pulse">
                              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                              <span>{t.workerCustomerOtpPendingBadge || 'Doorstep OTP Verification Pending'}</span>
                            </span>
                          )}

                          {isInProgress && (
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.workerOtpVerifiedBadge || 'OTP Verified • Work In Progress'}</span>
                            </span>
                          )}

                          {isCompleted && (
                            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.workerWorkCompletedPaid || 'Work Completed & Paid'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customer Details & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-6 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{t.workerCustomerLabel || 'Customer'}: Priya Sharma</span>
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {t.workerVerifiedClient || 'Verified Client'}
                            </span>
                          </div>

                          <div className="flex items-start gap-1.5 text-slate-600">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>{ord.address}</span>
                          </div>

                          <div className="flex items-center gap-3 pt-1">
                            <a
                              href="tel:+919820044102"
                              onClick={(e) => {
                                e.preventDefault();
                                alert('Calling customer Priya Sharma at +91 98200 44102 via secure masked call relay.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.workerCallCustomer || 'Call Customer'}</span>
                            </a>

                            <button
                              onClick={() => setWorkerTab('chat')}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                              <span>{t.workerOpenChat || 'Open Chat'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">{t.workerTimingWindow || 'Timing Window'}:</span>
                            <span className="font-bold text-slate-900">{ord.timingSlot?.date || 'Today'} • {ord.timingSlot?.timeSlot || ord.urgency}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">{t.workerJobEscrowVal || 'Job Value in Escrow'}:</span>
                            <span className="font-mono font-black text-slate-900 text-sm">₹{ord.quoteAmount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">{t.workerPlatformFee || 'Platform Fee: ₹0 (0% Commission)'}</span>
                            <span className="font-bold text-emerald-600">₹0 (0% Commission)</span>
                          </div>
                        </div>
                      </div>

                      {/* ======================================================== */}
                      {/* DYNAMIC CASE 1: ORDER CANCELLED BY CUSTOMER */}
                      {/* ======================================================== */}
                      {isCancelled && (
                        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-3 animate-in fade-in">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                              <Ban className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-display font-bold text-rose-900 text-sm">
                                {t.workerOrderCancelled || 'Order Cancelled by Customer'}
                              </h4>
                              <p className="text-xs text-rose-700">
                                <strong>{t.workerReasonGiven || 'Reason provided by customer:'}</strong> "{ord.cancellationReason || 'Issue resolved myself'}"
                              </p>
                            </div>
                          </div>

                          <div className="p-3.5 bg-white/90 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-800">
                                {t.workerCancellationFeeRecv || 'Travel & Fuel Allowance Received'}:
                              </span>
                            </div>
                            <span className="text-sm font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                              +₹{ord.cancellationFee || 50} Credited to Your Wallet
                            </span>
                          </div>

                          <p className="text-[11px] text-rose-800 leading-relaxed">
                            💡 {t.workerCharterExplainer || 'Under the KaamSetu Fair Worker Social Impact Charter, when a customer cancels an en route booking, the ₹50 cancellation fee is directly transferred to you to compensate for your petrol and travel time. This has already been added to your payout balance.'}
                          </p>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* DYNAMIC CASE 2: DOORSTEP OTP VERIFICATION INPUT */}
                      {/* ======================================================== */}
                      {isEnRoute && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-4 animate-in fade-in">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-amber-200 text-amber-900 rounded-2xl shrink-0">
                              <KeyRound className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-display font-bold text-slate-900 text-base">
                                {t.workerEnterOtp || "Doorstep Arrival: Enter Customer's 4-Digit Start OTP"}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {t.workerEnterOtpPrompt || 'Please ask customer for their 4-digit Start OTP shown on their KaamSetu app screen. Entering the correct OTP verifies identity and officially confirms the order start.'}
                              </p>
                            </div>
                          </div>

                          {/* OTP Input Form */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                            <div className="relative">
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="----"
                                value={enteredOtps[ord.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                  setEnteredOtps((prev) => ({ ...prev, [ord.id]: val }));
                                  setOtpErrors((prev) => ({ ...prev, [ord.id]: null }));
                                }}
                                className="w-full sm:w-44 text-center tracking-widest text-2xl font-mono font-black py-2.5 px-4 rounded-xl bg-white border-2 border-amber-400 focus:ring-2 focus:ring-primary-500 text-slate-900 placeholder:text-slate-300"
                              />
                            </div>

                            <button
                              onClick={() => handleVerifyOtp(ord.id, ord.startOtp)}
                              className="btn-primary text-xs sm:text-sm px-6 py-3 shadow-md flex items-center justify-center gap-2"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>{t.workerVerifyOtpBtn || 'Verify OTP & Confirm Order Start'}</span>
                            </button>

                            <span className="text-[11px] text-slate-400 self-center">
                              (Demo hint: Customer screen shows OTP <strong>{ord.startOtp}</strong>)
                            </span>
                          </div>

                          {/* Error or Success feedback */}
                          {otpErrors[ord.id] && (
                            <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2 animate-in fade-in">
                              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                              <span>{otpErrors[ord.id]}</span>
                            </div>
                          )}

                          {otpSuccesses[ord.id] && (
                            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                              <span>{otpSuccesses[ord.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* DYNAMIC CASE 3: WORK IN PROGRESS & COMPLETION */}
                      {/* ======================================================== */}
                      {isInProgress && (
                        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-in fade-in">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <h4 className="font-display font-bold text-slate-900 text-sm">
                                {t.workerOtpVerifiedBadge || 'Customer OTP Verified • Order Officially Started'}
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
                              Start OTP {ord.startOtp} Verified ✓
                            </span>
                          </div>

                          <p className="text-xs text-slate-600">
                            The repair is officially recorded as in progress. When you finish the physical repair, tap the button below to request inspection and release the ₹{ord.quoteAmount} held safely in escrow.
                          </p>

                          <button
                            onClick={() => handleMarkJobCompleted(ord.id, ord.quoteAmount)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.workerMarkCompleted || 'Mark Job Completed & Release Escrow'}</span>
                          </button>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* DYNAMIC CASE 4: COMPLETED */}
                      {/* ======================================================== */}
                      {isCompleted && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-slate-800">
                              {t.workerWorkCompletedPaid || 'Job Completed Successfully. Full escrow payout released.'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Completed on {new Date(ord.completedAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: JOB FEED */}
        {/* ======================================================== */}
        {workerTab === 'feed' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Worker Welcome Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-bolt-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
                  alt="Rajesh Kumar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-display font-bold text-slate-900">Rajesh Kumar</h2>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Master Plumber
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lokhandwala & Bandra West • 42 jobs completed • 100% on-time SLA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[130px]">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Wallet Balance</span>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="text-xl font-display font-bold text-slate-900 tracking-wide">
                      {isBalanceRevealed ? `₹${currentWalletBalance.toLocaleString()}` : '₹*****'}
                    </span>
                    {isBalanceRevealed ? (
                      <button
                        onClick={handleHideBalance}
                        title="Hide balance (Lock as *****)"
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        title="Enter password to check balance"
                        className="p-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {isBalanceRevealed ? (
                  <button
                    onClick={() => setWorkerTab('earnings')}
                    className="btn-primary text-xs px-4 py-3 shadow-xs"
                  >
                    <span>Withdraw UPI</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.workerCheckBalance || 'Check Balance'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Broadcasts Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  {t.workerLiveRequestsTitle || 'Live Customer Requests Near You'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.workerLiveRequestsSub || 'Customers in your 3 km radius waiting for bids. Submit quick quote or tap mic to speak in Marathi/Hindi.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>3 {t.workerActiveBroadcasts || 'Active Broadcasts'}</span>
              </div>
            </div>

            {/* Requests List */}
            <div className="grid grid-cols-1 gap-4">
              {openRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-primary-400 shadow-bolt-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-primary-800 bg-primary-100 px-2 py-0.5 rounded border border-primary-200">
                          {req.category}
                        </span>
                        {req.urgent && (
                          <span className="text-[10px] font-bold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                            {t.workerUrgentSla || 'Urgent (< 30 min)'}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">• {req.postedAgo}</span>
                      </div>

                      <h4 className="text-lg font-display font-bold text-slate-900">
                        {req.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {req.description}
                      </p>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <span className="text-[11px] text-slate-400 block">{t.workerCustomerTargetBudget || 'Customer Target Budget'}</span>
                      <span className="text-xl font-display font-bold text-slate-900">{req.budgetRange}</span>
                      <span className="text-[11px] text-slate-500 block">{req.locality} ({req.distance})</span>
                    </div>
                  </div>

                  {/* Actions & Voice Quote Button */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickBid(req.id, 320)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                      >
                        Bid ₹320 (15 min)
                      </button>
                      <button
                        onClick={() => handleQuickBid(req.id, 380)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
                      >
                        Bid ₹380 (10 min)
                      </button>
                    </div>

                    <button
                      onClick={() => handleSimulateVoiceBid(req.id)}
                      className="px-4 py-2 rounded-xl btn-secondary text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{t.workerSpeakVoiceQuote || 'Speak Voice Quote (मराठी / हिंदी)'}</span>
                    </button>
                  </div>

                  {bidsSubmitted[req.id] && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{bidsSubmitted[req.id]} Awaiting customer acceptance.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ACTIVE JOB & MAP */}
        {/* ======================================================== */}
        {workerTab === 'active_job' && (
          <div className="space-y-6 animate-in fade-in">
            {activeOrder?.status === 'cancelled' ? (
              <div className="bg-white p-8 rounded-3xl border-2 border-rose-200 shadow-bolt-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-bold text-slate-900">
                    {t.workerActiveOrderCancelledTitle || 'Active Order Cancelled by Customer'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    {t.workerActiveOrderCancelledSub || 'The customer cancelled this booking. Under KaamSetu Fair Worker Protection, a ₹50 cancellation compensation fee has been credited to your wallet balance.'}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>+₹50 {t.workerCancellationFeeRecv || 'Travel & Fuel Compensation Deposited'}</span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setWorkerTab('orders')}
                    className="btn-primary text-xs px-5 py-2.5 shadow-sm"
                  >
                    {t.workerFilterAll || 'View All Orders'}
                  </button>
                  <button
                    onClick={() => setWorkerTab('feed')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300"
                  >
                    {t.workerReturnFeed || 'Return to Job Feed'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-bolt-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {activeOrder?.status === 'in_progress' ? (t.workerOtpVerifiedBadge || 'Work in Progress (OTP Verified)') : 'Accepted Job En Route'}
                    </span>
                    <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                      {activeOrder?.title || 'Kitchen Faucet Cartridge Leakage'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.workerCustomerLabel || 'Customer'}: <strong>Priya Sharma</strong> • {activeOrder?.address || 'Flat 402, Sea Green Apts, Pali Hill, Bandra West'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWorkerTab('orders')}
                      className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.workerFilterOtp || 'Verify Customer OTP'}</span>
                    </button>

                    <button
                      onClick={() => setWorkerTab('chat')}
                      className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t.workerOpenChat || 'Open Chat'}</span>
                    </button>
                  </div>
                </div>

                <LiveMapTracker
                  activeBooking={{
                    quote: {
                      worker: WORKERS_DATABASE[0],
                      quoteAmount: activeOrder?.quoteAmount || 350,
                      etaMins: 8
                    }
                  }}
                  onConfirmCompletion={() => alert('Job marked completed by Rajesh Kumar! Waiting for customer inspection.')}
                  onOpenSos={() => alert('Worker Safety SOS triggered to Mumbai Police.')}
                  selectedWorker={WORKERS_DATABASE[0]}
                  onSelectWorker={() => {}}
                  onOpenChat={() => setWorkerTab('chat')}
                  lang={workerLang}
                />
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CUSTOMER CHAT */}
        {/* ======================================================== */}
        {workerTab === 'chat' && (
          <div className="max-w-3xl mx-auto animate-in fade-in">
            <CustomerWorkerChat
              currentRole="worker"
              lang={workerLang}
              worker={{
                name: 'Rajesh Kumar',
                trade: 'Senior Plumber',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
                rating: 4.95,
                phone: '+91 98201 44521',
                locality: 'Lokhandwala, Andheri West',
                eta: '8 mins away',
                otp: activeOrder?.startOtp || '4829'
              }}
              customer={{
                name: 'Priya Sharma',
                address: activeOrder?.address || 'Sea Green Apts, Pali Hill, Bandra West',
                phone: '+91 98200 44102',
                issue: `${activeOrder?.title || 'Kitchen Diverter Cartridge'} (₹${activeOrder?.quoteAmount || 350} in Escrow)`
              }}
              onOpenMap={() => setWorkerTab('active_job')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: EARNINGS & UPI WITH CANCELLATION COMPENSATION */}
        {/* ======================================================== */}
        {workerTab === 'earnings' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-bolt-md space-y-6">
              
              {/* Top Payout Summary & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t.workerTotalPayoutBal || 'Total Payout Balance'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      isBalanceRevealed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isBalanceRevealed ? (
                        <>
                          <Unlock className="w-2.5 h-2.5" /> {t.workerUnlocked || 'Unlocked'}
                        </>
                      ) : (
                        <>
                          <Lock className="w-2.5 h-2.5" /> {t.workerProtected || 'Protected (*****)'}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-4xl font-display font-black text-slate-900 mt-1 tracking-wider">
                    {isBalanceRevealed ? `₹${currentWalletBalance.toLocaleString()}` : '₹*****'}
                  </div>

                  <p className="text-xs mt-1">
                    {isBalanceRevealed ? (
                      <span className="text-emerald-700 font-bold">
                        {t.workerZeroComm || '✓ 100% of your earnings — 0% platform commission extracted'}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        {t.workerPrivacyActive || '🔒 Financial privacy active: Balance masked as *****. Enter password below to reveal.'}
                      </span>
                    )}
                  </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {isBalanceRevealed ? (
                    <>
                      <button
                        onClick={handleHideBalance}
                        className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{t.workerHideBalance || 'Hide Balance (***** )'}</span>
                      </button>

                      <button
                        onClick={() => alert(`Direct UPI withdrawal of ₹${currentWalletBalance.toLocaleString()} initiated to rajeshkumar@okaxis. Funds credited in 60 seconds.`)}
                        className="btn-primary text-sm px-6 py-3.5 shadow-md flex items-center gap-2"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>{t.workerWithdrawUpi || 'Withdraw to UPI'} (rajeshkumar@okaxis)</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{t.workerCheckBalance || 'Enter Password to Check Balance'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* INLINE PASSWORD ENTRY FORM (Visible when balance is locked) */}
              {!isBalanceRevealed && (
                <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-4 animate-in fade-in">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-amber-200 text-amber-900 rounded-2xl shrink-0 mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-slate-900 text-base">
                        {t.workerEnterPasswordPrompt || 'Enter Password to Check Balance'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        To maintain total privacy around customers, your earnings are hidden as <strong>*****</strong>. Enter your worker password or security PIN to view your live balance and withdrawal details.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyBalancePassword} className="space-y-3 pt-1">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1 sm:max-w-xs">
                        <input
                          type={showPasswordText ? 'text' : 'password'}
                          placeholder={t.workerPasswordPlaceholder || 'Enter password (e.g. 1234)'}
                          value={passwordInput}
                          onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setPasswordError('');
                          }}
                          className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordText(!showPasswordText)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{t.workerUnlockBalanceBtn || 'Unlock & Check Balance'}</span>
                      </button>

                      <span className="text-[11px] text-slate-500 self-center">
                        (Demo PIN: <strong className="font-mono text-slate-800">1234</strong> or your account password)
                      </span>
                    </div>

                    {passwordError && (
                      <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2 animate-in fade-in max-w-md">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Toast when balance unlocked */}
              {passwordSuccessToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccessToast}</span>
                </div>
              )}

              {/* Earnings breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">{t.workerBaseJobs || 'Base Jobs'}</span>
                  <span className="text-2xl font-display font-bold text-slate-900">
                    {isBalanceRevealed ? '₹8,400' : '₹*****'}
                  </span>
                  <span className="text-[10px] text-slate-500">18 {t.workerCompletedJobsCount || 'completed jobs'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">{t.workerAvgJobVal || 'Average Job Value'}</span>
                  <span className="text-2xl font-display font-bold text-slate-900">
                    {isBalanceRevealed ? '₹365' : '₹*****'}
                  </span>
                  <span className="text-[10px] text-slate-500">Worker-set bidding average</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">{t.workerTipsRepeat || 'Tips & Repeat Clients'}</span>
                  <span className="text-2xl font-display font-bold text-amber-500">
                    {isBalanceRevealed ? '₹1,200' : '₹*****'}
                  </span>
                  <span className="text-[10px] text-slate-500">12 recurring household clients</span>
                </div>

                {/* Cancellation Compensation Card */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 uppercase font-bold block">{t.workerCancellationFees || 'Cancellation Fees'}</span>
                  <span className="text-2xl font-display font-bold text-emerald-700">
                    {isBalanceRevealed ? `₹${totalCancellationCompensation}` : '₹*****'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {cancelledOrders.length} customer cancellation fees received
                  </span>
                </div>
              </div>

              {/* Cancellation Compensations History */}
              {cancelledOrders.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-amber-600" />
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {t.workerRecvCompTitle || 'Received Cancellation Compensations'} ({cancelledOrders.length})
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-amber-200">
                      {isBalanceRevealed ? `+₹${totalCancellationCompensation} Total` : '+₹***** Total'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {cancelledOrders.map((cord) => (
                      <div
                        key={cord.id}
                        className="p-3 bg-white rounded-xl border border-amber-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{cord.title}</span>
                          <span className="text-[11px] text-slate-500 block">
                            Reason: {cord.cancellationReason || 'Customer cancelled'} • Order #{cord.id}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {isBalanceRevealed ? `+₹${cord.cancellationFee || 50} Deposited` : '+₹***** Deposited'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: BADGES & VERIFICATION */}
        {/* ======================================================== */}
        {workerTab === 'badges' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Trust Badges Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-bolt-md space-y-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {workerName}'s {t.workerTabBadges || 'Trust Credentials'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dual-tier verified credentials (Government ID & Police Clearance) displayed to customers across Mumbai.
                </p>
              </div>

              {/* Strict 2-Tier Badges: Tier 1 & Tier 2 Only (Tier 3 & Tier 4 Removed as requested) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {t.workerBadgeTier1Title || 'Tier 1: Government ID / Aadhaar Verified'}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      DigiLocker Linked: {govtIdDoc} • UIDAI e-KYC Complete
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {t.workerBadgeTier2Title || 'Tier 2: Police Criminal Clearance Verified'}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Clean Record
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Mumbai Police Special Branch ID: MUM-POL-2026-8812 • Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MANDATORY DOCUMENT VAULT: GOVERNMENT ID & POLICE CLEARANCE UPLOAD SECTION */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-bolt-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-secondary-600" />
                    <span>{t.workerVaultTitle || 'Worker Document Vault & KYC Management'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.workerVaultSub || 'Upload or update your Government ID and Police Criminal Clearance Certificate. Required to receive doorstep bookings.'}
                  </p>
                </div>

                {docUploadToast && (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{docUploadToast}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Government ID Upload Card */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {t.workerUploadGovtIdTitle || 'Government ID (Aadhaar / Voter ID / DL)'}
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" /> Aadhaar e-KYC Verified
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      Verified
                    </span>
                  </div>

                  {/* Attached Document File View & Upload Trigger */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between text-xs gap-2">
                    <div className="truncate pr-2">
                      <span className="font-mono font-bold text-slate-800 block truncate">{govtIdDoc}</span>
                      <span className="text-[10px] text-slate-400">DigiLocker OCR Authenticated • PDF/Image</span>
                    </div>

                    <label className="cursor-pointer shrink-0 px-3.5 py-2 rounded-xl bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-primary-600" />
                      <span>{t.workerUploadNew || 'Upload New'}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleGovtIdUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {t.workerAcceptedFormats || 'Accepted formats: PDF, JPG, PNG (Max 15MB). Your Aadhaar number is masked per UIDAI privacy norms.'}
                  </p>
                </div>

                {/* 2. Police Criminal Clearance Upload Card */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {t.workerUploadPoliceTitle || 'Police Criminal Clearance Certificate'}
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" /> Special Branch Background Cleared
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      Verified
                    </span>
                  </div>

                  {/* Attached Document File View & Upload Trigger */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between text-xs gap-2">
                    <div className="truncate pr-2">
                      <span className="font-mono font-bold text-slate-800 block truncate">{policeDoc}</span>
                      <span className="text-[10px] text-slate-400">MUM-POL-2026-8812 • Verified Clearance</span>
                    </div>

                    <label className="cursor-pointer shrink-0 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.workerUploadNew || 'Upload New'}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handlePoliceClearanceUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {t.workerPoliceIssuedBy || 'Issued by Maharashtra Police Special Branch or Local Police Station. Valid for 12 months.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Universal Password Modal to Check Balance */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 relative">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-slate-900">
                    {t.workerEnterPasswordPrompt || 'Check Worker Balance'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    For your financial privacy around customers, your earnings are masked as <strong>*****</strong>. Enter your worker password to view your live balance.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyBalancePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {t.workerSecurityPin || 'Worker Security Password / PIN'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      placeholder={t.workerPasswordPlaceholder || 'Enter password (e.g. 1234)'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError('');
                      }}
                      autoFocus
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 Default demo password: <strong className="font-mono text-slate-700">1234</strong>
                  </p>
                </div>

                {passwordError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPasswordError('');
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                  >
                    {t.btnCancel || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{t.workerUnlockBalanceBtn || 'Unlock & Check'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

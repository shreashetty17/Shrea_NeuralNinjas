import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Lock, 
  Upload,
  FileCheck,
  AlertCircle,
  MapPin,
  Globe
} from 'lucide-react';
import { KaamSetuLogo } from './KaamSetuLogo';
import { playAudioCue } from '../data/mockData';
import { saveUser, authenticateUser } from '../services/db';
import { TRANSLATIONS } from '../data/translations';

export const AuthGate = ({ onLoginSuccess, initialLang = 'en', onLanguageChange }) => {
  const [lang, setLang] = useState(initialLang);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [role, setRole] = useState('customer'); // 'customer' | 'worker'
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [passwordOrOtp, setPasswordOrOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [locality, setLocality] = useState('Bandra West, Mumbai');
  const [trade, setTrade] = useState('Plumbing');
  
  // Worker Mandatory Document Upload States (Govt ID + Police Clearance)
  const [uploadedGovtId, setUploadedGovtId] = useState(null);
  const [uploadedPoliceClearance, setUploadedPoliceClearance] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleLanguageSelect = (newLang) => {
    setLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const handleGovtIdChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedGovtId({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Document'
      });
      setUploadError('');
      playAudioCue('bid_received');
    }
  };

  const handlePoliceClearanceChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPoliceClearance({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Document'
      });
      setUploadError('');
      playAudioCue('bid_received');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // STRICT VALIDATION FOR SIGN UP:
    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setUploadError(t.authErrorFullName || 'Please enter your full name.');
        return;
      }
      if (!phoneOrEmail.trim()) {
        setUploadError(t.authErrorPhoneEmail || 'Please enter your phone number or email.');
        return;
      }
      if (!passwordOrOtp.trim()) {
        setUploadError(t.authErrorPassword || 'Please enter a password.');
        return;
      }

      // Customer sign up is frictionless (no ID required)
      // Worker sign up strictly requires BOTH Govt ID AND Police Clearance!
      if (role === 'worker') {
        if (!uploadedGovtId) {
          setUploadError(t.authErrorWorkerGovtId || 'Mandatory for Workers: Please upload your Government ID (Aadhaar / Voter ID / DL).');
          return;
        }
        if (!uploadedPoliceClearance) {
          setUploadError(t.authErrorWorkerPolice || 'Mandatory for Workers: Please upload your Police Criminal Clearance Certificate.');
          return;
        }
      }
    }

    // Save user in Database!
    const savedUser = saveUser({
      role,
      name: fullName.trim() || (role === 'customer' ? 'Priya Sharma' : 'Rajesh Kumar'),
      phone: phoneOrEmail.trim() || '+91 98200 44102',
      locality: locality.trim() || 'Bandra West, Mumbai',
      trade: role === 'worker' ? trade : null,
      govtIdDocument: uploadedGovtId ? uploadedGovtId.name : (role === 'worker' ? 'Aadhaar_Govt_ID_Rajesh.pdf' : null),
      policeClearanceDocument: uploadedPoliceClearance ? uploadedPoliceClearance.name : (role === 'worker' ? 'Mumbai_Police_Clearance_Rajesh.pdf' : null),
      isGovtIdVerified: true,
      isPoliceClearanceVerified: true,
      isVerified: true,
      password: passwordOrOtp.trim() || '1234'
    });

    playAudioCue('match_success');
    onLoginSuccess(savedUser);
  };

  const handleQuickDemoCustomer = () => {
    const user = authenticateUser('+91 98200 44102', '', 'customer') || {
      role: 'customer',
      name: 'Priya Sharma',
      phone: '+91 98200 44102',
      locality: 'Pali Hill, Bandra West, Mumbai',
      documentName: 'Aadhaar_Priya_Sharma.pdf',
      isVerified: true,
      password: '1234'
    };
    playAudioCue('match_success');
    onLoginSuccess(user);
  };

  const handleQuickDemoWorker = () => {
    const user = authenticateUser('+91 98201 44521', '', 'worker') || {
      role: 'worker',
      name: 'Rajesh Kumar',
      phone: '+91 98201 44521',
      locality: 'Lokhandwala, Andheri West',
      trade: 'Plumbing',
      documentName: 'Govt_ID_NSDC_Rajesh.pdf',
      isVerified: true,
      password: '1234'
    };
    playAudioCue('match_success');
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
        <button
          onClick={() => handleLanguageSelect('en')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            lang === 'en' ? 'bg-primary-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageSelect('hi')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            lang === 'hi' ? 'bg-primary-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          हिंदी
        </button>
        <button
          onClick={() => handleLanguageSelect('mr')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            lang === 'mr' ? 'bg-primary-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          मराठी
        </button>
      </div>

      {/* Bright ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-100/60 via-secondary-100/40 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
        {/* Brand Logo */}
        <div className="flex justify-center mb-1">
          <KaamSetuLogo size="lg" />
        </div>

        <h2 className="text-2xl font-display font-bold text-slate-900 pt-2">
          {authMode === 'signin' ? t.authSignIn : t.authSignUp}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {t.tagline}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-bolt-xl rounded-3xl border border-slate-200/80 space-y-6">
          
          {/* Role Selector: Customer vs Worker */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              {t.authSelectRole || 'Select Your Role'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setRole('customer'); setUploadError(''); }}
                className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'customer'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-primary-600" />
                <span>{t.navRoleCustomer}</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('worker'); setUploadError(''); }}
                className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'worker'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4 text-secondary-600" />
                <span>{t.navRoleWorker} / Pro</span>
              </button>
            </div>
          </div>

          {/* Sign In vs Sign Up Tabs */}
          <div className="flex border-b border-slate-100 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('signin'); setUploadError(''); }}
              className={`flex-1 pb-3 text-center transition-colors border-b-2 ${
                authMode === 'signin'
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.authSignIn}
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setUploadError(''); }}
              className={`flex-1 pb-3 text-center transition-colors border-b-2 ${
                authMode === 'signup'
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.authSignUp}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name for Signup */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.authFullName || 'Full Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={role === 'customer' ? 'Priya Sharma' : 'Rajesh Kumar'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            )}

            {/* Phone or Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.authPhoneEmail || 'Mobile Number or Email'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="98200 44102 or name@example.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Trade for Worker */}
            {role === 'worker' && authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.authPrimaryTrade || 'Your Primary Trade'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Plumbing">{t.tradePlumbing || 'Plumber (नल / पाइप)'}</option>
                  <option value="Electrical">{t.tradeElectrical || 'Electrician (बिजली)'}</option>
                  <option value="Cleaning">{t.tradeCleaning || 'House Maid & Cleaning'}</option>
                  <option value="Cooking">{t.tradeCooking || 'Home Cook / Maharaj'}</option>
                  <option value="AC Repair">{t.tradeAcRepair || 'AC & Appliance Tech'}</option>
                  <option value="Carpentry">{t.tradeCarpentry || 'Carpenter (बढ़ई)'}</option>
                </select>
              </div>
            )}

            {/* Locality for Signup */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.authLocality || 'Locality / City Area'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Lokhandwala, Dadar"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            )}

            {/* FOR CUSTOMER SIGNUP: FRICTIONLESS SIGNUP (NO ID UPLOAD REQUIRED) */}
            {authMode === 'signup' && role === 'customer' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.authInstantSignup}</span>
              </div>
            )}

            {/* FOR WORKER SIGNUP: MANDATORY GOVT ID + POLICE CLEARANCE UPLOADS */}
            {authMode === 'signup' && role === 'worker' && (
              <div className="space-y-4 pt-1">
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.authWorkerVerificationReq}</span>
                </div>

                {/* 1. Government ID / Aadhaar Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {t.authGovtIdUploadTitle || '1. Government ID / Aadhaar Card'} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className={`p-3.5 border-2 border-dashed rounded-2xl transition-colors text-center relative ${
                    uploadedGovtId 
                      ? 'border-emerald-400 bg-emerald-50/50' 
                      : 'border-slate-300 hover:border-primary-400 bg-slate-50'
                  }`}>
                    <input
                      type="file"
                      id="govt-id-upload"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleGovtIdChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {uploadedGovtId ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <span className="truncate max-w-[200px]">{uploadedGovtId.name}</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {uploadedGovtId.size}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                        <div className="text-xs text-slate-600 font-semibold">
                          {t.authUploadAadhaarPrompt || 'Upload Aadhaar / Voter ID / DL'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.authFileSpecs || 'PDF, PNG, JPG up to 10MB'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Police Criminal Clearance Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {t.authPoliceClearanceUploadTitle || '2. Police Criminal Clearance Certificate'} <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className={`p-3.5 border-2 border-dashed rounded-2xl transition-colors text-center relative ${
                    uploadedPoliceClearance 
                      ? 'border-emerald-400 bg-emerald-50/50' 
                      : 'border-slate-300 hover:border-secondary-400 bg-slate-50'
                  }`}>
                    <input
                      type="file"
                      id="police-cert-upload"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handlePoliceClearanceChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {uploadedPoliceClearance ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <span className="truncate max-w-[200px]">{uploadedPoliceClearance.name}</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {uploadedPoliceClearance.size}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 text-secondary-500 mx-auto" />
                        <div className="text-xs text-slate-600 font-semibold">
                          {t.authUploadPolicePrompt || 'Upload Police Character / Clearance Slip'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.authPoliceCertDesc || 'Mumbai Police Certificate (PDF / Image)'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message if document missing */}
            {uploadError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {authMode === 'signin' ? (t.authPasswordLabel || 'Password / OTP') : (t.authCreatePasswordLabel || 'Create Password')} <span className="text-rose-500">*</span>
                </label>
                {authMode === 'signin' && (
                  <button type="button" className="text-[11px] font-bold text-primary-600 hover:underline">
                    {t.authUseOtp || 'Use OTP'}
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordOrOtp}
                onChange={(e) => setPasswordOrOtp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl btn-primary text-sm shadow-md shadow-teal-600/25 mt-2"
            >
              <span>{authMode === 'signin' ? `${t.authSignIn} (${role === 'customer' ? t.navRoleCustomer : t.navRoleWorker})` : (t.authVerifySignUpBtn || 'Verify Details & Sign Up')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins for Hackathon / Evaluation */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block text-center">
              {t.authInstantDemoAccess || '1-Click Instant Demo Access'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="p-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 border border-primary-200 text-left transition-colors text-xs flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 line-clamp-1">Priya Sharma</div>
                  <div className="text-[10px] text-primary-700 font-semibold">{t.authDemoCustomerTag || 'Demo Customer (ID Uploaded)'}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoWorker}
                className="p-2.5 rounded-xl bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 text-left transition-colors text-xs flex items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary-600 text-white flex items-center justify-center shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 line-clamp-1">Rajesh Kumar</div>
                  <div className="text-[10px] text-secondary-700 font-semibold">{t.authDemoWorkerTag || 'Demo Worker (NSDC Verified)'}</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

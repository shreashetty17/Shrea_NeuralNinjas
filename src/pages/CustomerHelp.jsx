import React, { useState } from 'react';
import { ChevronDown, PhoneCall, Mail, ShieldAlert, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I book a worker?',
    a: 'Go to Services, choose a service and tap "Request bids". Fill in the job, address and time, enter your bid price and send it. Nearby workers get your request.'
  },
  {
    q: 'Where do I see the prices workers send?',
    a: 'Open My Requests. Each request shows the worker who replied, their price and the full price history. You get a notification (bell icon) whenever a worker sends a price.'
  },
  {
    q: 'How does negotiation work?',
    a: 'You and the worker can each send a new price up to 3 times. When you are happy with the worker\'s price, tap "Accept offer". After 3 changes you can only accept or cancel.'
  },
  {
    q: 'What happens after I accept an offer?',
    a: 'The booking moves to My Bookings. Tap "View details" to see the live map of your worker, the booking details, the 4-digit Start OTP and the chat.'
  },
  {
    q: 'What is the Start OTP?',
    a: 'A 4-digit code shown on your booking page. Share it with the worker only when they reach your door. The worker enters it to start the job, so nobody else can claim your booking.'
  },
  {
    q: 'How do I cancel?',
    a: 'Open the booking from My Bookings and tap "Cancel booking". Open requests can be cancelled for free from My Requests. The worker is notified either way.'
  },
  {
    q: 'How do I pay?',
    a: 'Pay the worker the agreed price directly once the job is done. KaamSetu takes 0% commission from workers.'
  },
  {
    q: 'Are the workers verified?',
    a: 'Every worker uploads a Government ID and a Police Clearance Certificate before they can take bookings.'
  },
  {
    q: 'I am a worker. How do I get jobs?',
    a: 'Sign up as a worker. New bid requests appear in Active Orders and in your notification bell. Accept the customer\'s price or send your own; accepted jobs move to My Orders.'
  }
];

export const CustomerHelp = ({ onOpenSos }) => {
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#149B8B]/10 text-[#0f7a6e] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" /> Help
        </div>
        <h1 className="text-3xl font-display font-bold text-[#0A2540]">How can we help?</h1>
        <p className="text-sm text-slate-500">Answers to common questions about booking, negotiating and paying.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-bolt-sm divide-y divide-slate-100">
        {FAQS.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              aria-expanded={open === i}
            >
              <span className="font-bold text-sm text-slate-900">{f.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-6 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="tel:+911800000000" className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-bolt-sm hover:border-[#149B8B] transition-colors">
          <PhoneCall className="w-5 h-5 text-[#149B8B]" />
          <div className="mt-2 font-bold text-sm text-slate-900">Call support</div>
          <div className="text-xs text-slate-500">9 AM – 9 PM, every day</div>
        </a>
        <a href="mailto:support@kaamsetu.app" className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-bolt-sm hover:border-[#149B8B] transition-colors">
          <Mail className="w-5 h-5 text-[#149B8B]" />
          <div className="mt-2 font-bold text-sm text-slate-900">Email us</div>
          <div className="text-xs text-slate-500">support@kaamsetu.app</div>
        </a>
        <button onClick={onOpenSos} className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-left hover:border-rose-400 transition-colors">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div className="mt-2 font-bold text-sm text-rose-800">Emergency SOS</div>
          <div className="text-xs text-rose-600">Feel unsafe? Get help now</div>
        </button>
      </div>
    </div>
  );
};

export default CustomerHelp;

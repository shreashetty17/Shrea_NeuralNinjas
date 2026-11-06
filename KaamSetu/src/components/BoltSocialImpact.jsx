import React from 'react';
import { HeartHandshake, Mic, CheckCircle2 } from 'lucide-react';

export const BoltSocialImpact = ({ onOpenWorkerPortal }) => {
  return (
    <section id="social-impact" className="py-16 border-t border-slate-200 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <span>Social Impact</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
          Dignity for those who build our homes
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl">
          Fair work. Fair pay. On your doorstep. Built for Mumbai's 300,000+ blue-collar workforce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Worker Autonomy & Voice */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 flex items-center justify-center">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            Voice-First Regional Accessibility
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Many workers have low digital comfort. KaamSetu lets workers speak their quotes in Marathi or Hindi (e.g. <em>"₹350 रुपया, 15 मिनिटात पोहोचतो"</em>) and dispatches via 2G SMS / WhatsApp for feature phones.
          </p>
          <div className="text-xs text-emerald-700 font-bold pt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero typing hurdles • Accessible to every tradesperson</span>
          </div>
        </div>

        {/* 100% Take-home & Two-Way Rating */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-bolt-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-100 text-secondary-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            100% Payout & Two-Way Respect Shield
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike monopolistic gig apps that penalize workers and extract 35% cuts, KaamSetu charges 0% commission on worker-set bids with instant UPI settlement. Workers rate clients too, ending arbitrary deactivations.
          </p>
          <div className="text-xs text-secondary-800 font-bold pt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-secondary-600" />
            <span>Workers keep every single rupee they quote</span>
          </div>
        </div>

      </div>
    </section>
  );
};

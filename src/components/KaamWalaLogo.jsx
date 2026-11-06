import React from 'react';
import logoImg from '../assets/kaamsetu-logo.png';

export const KaamSetuLogo = ({ size = 'md', isWhite = false, showTagline = false, variant = 'standard', onClick }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSize = isSmall ? 'w-12 h-12' : isLarge ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14';
  const textSize = isSmall ? 'text-2xl' : isLarge ? 'text-4xl sm:text-5xl' : 'text-3xl';

  // Standalone full badge variant (used e.g. in auth / hero showcase)
  if (variant === 'full') {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${onClick ? 'cursor-pointer group' : ''}`}
      >
        <div className="relative p-1 rounded-2xl bg-white shadow-bolt-md border border-slate-200/90 overflow-hidden transition-transform group-hover:scale-105">
          <img 
            src={logoImg} 
            alt="KaamSetu - Local Help. Real People. Fair Prices." 
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''}`}
    >
      {/* Uploaded Official Logo Emblem */}
      <div className={`relative ${iconSize} rounded-xl overflow-hidden bg-[#faf8f5] shadow-xs border border-slate-200/90 p-0.5 flex items-center justify-center transition-all ${onClick ? 'group-hover:scale-105 group-hover:shadow-md' : ''}`}>
        <img 
          src={logoImg} 
          alt="KaamSetu Emblem" 
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Aesthetic Wordmark: Kaam (Navy) + Setu (Teal) */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span className={`font-display font-extrabold tracking-tight leading-none ${textSize} ${isWhite ? 'text-white' : ''}`}>
            <span className={isWhite ? 'text-sky-200' : 'text-[#0A2540]'}>Kaam</span>
            <span className={isWhite ? 'text-teal-300' : 'text-[#149B8B]'}>Setu</span>
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ml-1 self-baseline ${isWhite ? 'bg-teal-300' : 'bg-[#149B8B]'}`} />
        </div>
        {showTagline && !isSmall && (
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-tight leading-tight mt-0.5 ${isWhite ? 'text-slate-300' : 'text-slate-500'}`}>
            Local Help • Real People • Fair Prices
          </span>
        )}
      </div>
    </div>
  );
};

// Backwards compatibility alias
export const KaamWalaLogo = KaamSetuLogo;

export default KaamSetuLogo;


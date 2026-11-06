
import React from 'react';
import logoImg from '../assets/kaamsetu-logo-new.png';

export const KaamSetuLogo = ({ size = 'md', isWhite = false, showTagline = true, variant = 'standard', onClick }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconSize = isSmall
    ? 'w-11 h-11'
    : isLarge
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-16 h-16';

  const textSize = isSmall ? 'text-xl' : isLarge ? 'text-3xl sm:text-4xl' : 'text-2xl';

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center select-none ${onClick ? 'cursor-pointer group' : ''}`}
      >
        <div className="relative p-1 rounded-2xl bg-white shadow-bolt-md border border-slate-200/60 overflow-hidden transition-transform group-hover:scale-105">
          <img
            src={logoImg}
            alt="KaamSetu - Local Help. Real People. Fair Prices."
            className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl"
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
      <div className={`relative ${iconSize} rounded-xl overflow-hidden bg-white border border-slate-200/60 p-0.5 flex items-center justify-center transition-all ${onClick ? 'group-hover:scale-105 group-hover:shadow-md' : ''}`}>
        <img
          src={logoImg}
          alt="KaamSetu Emblem"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span className={`font-display font-extrabold tracking-tight leading-none ${textSize} ${isWhite ? 'text-white' : ''}`}>
            <span className={isWhite ? 'text-emerald-400' : 'text-[#13663b]'}>Kaam</span>
            <span className={isWhite ? 'text-orange-400' : 'text-[#ea5b24]'}>Setu</span>
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ml-1 self-baseline ${isWhite ? 'bg-orange-400' : 'bg-[#ea5b24]'}`} />
        </div>

        {showTagline && !isSmall && (
          <span className={`text-[9px] sm:text-[10px] font-semibold tracking-tight leading-tight mt-0.5 ${isWhite ? 'text-slate-300' : 'text-slate-500'}`}>
            Local Help • Real People • Fair Prices
          </span>
        )}
      </div>
    </div>
  );
};

export const KaamWalaLogo = KaamSetuLogo;

export default KaamSetuLogo;

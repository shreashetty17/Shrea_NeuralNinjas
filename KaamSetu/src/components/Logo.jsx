import React from 'react';

export const Logo = ({ size = 'md', light = false }) => {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconDim = isSmall ? 'w-6 h-6' : isLarge ? 'w-10 h-10' : 'w-7 h-7';
  const textClass = isSmall ? 'text-lg' : isLarge ? 'text-2xl sm:text-3xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2 select-none cursor-pointer group">
      {/* Figma Galli square brand mark with grid/street knot */}
      <div className={`relative ${iconDim} rounded-lg bg-galli-accent flex items-center justify-center shadow-xs transition-transform group-hover:scale-105`}>
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Stylized street grid intersection / house shape */}
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`font-display font-extrabold tracking-tight ${textClass} ${light ? 'text-white' : 'text-slate-900'}`}>
          galli
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-galli-accent self-end mb-1"></span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded ml-1 hidden sm:inline-block">
          Reverse Auction
        </span>
      </div>
    </div>
  );
};

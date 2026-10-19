import React from 'react';

export default function Lanterns() {
  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex justify-between px-4 sm:px-12 md:px-24">
      {/* Left Hanging Lantern */}
      <div className="flex flex-col items-center animate-lantern-left">
        {/* Chain */}
        <div className="w-[1.5px] h-16 sm:h-24 bg-gradient-to-b from-transparent via-[#d4af37] to-[#fbe08e]"></div>
        {/* Lantern Body */}
        <div className="relative animate-glow-pulse">
          <svg
            className="w-10 h-16 sm:w-14 sm:h-22 drop-shadow-[0_0_15px_rgba(251,224,142,0.6)]"
            viewBox="0 0 64 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Ring & Cap */}
            <circle cx="32" cy="6" r="4" stroke="#d4af37" strokeWidth="2" fill="none" />
            <path d="M22 14 L42 14 L36 10 L28 10 Z" fill="#d4af37" />
            <path d="M18 22 L46 22 L42 14 L22 14 Z" fill="#b38f2a" />
            
            {/* Glass Chamber with Glow */}
            <path d="M18 22 L12 55 L20 80 L44 80 L52 55 L46 22 Z" fill="rgba(251, 224, 142, 0.2)" stroke="#d4af37" strokeWidth="2" />
            {/* Inner Flame */}
            <ellipse cx="32" cy="52" rx="6" ry="12" fill="#ffd700" className="animate-pulse" />
            <ellipse cx="32" cy="50" rx="3" ry="7" fill="#ffffff" />
            
            {/* Ornate Lattice Lines */}
            <line x1="32" y1="22" x2="32" y2="80" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="20" y1="52" x2="44" y2="52" stroke="#d4af37" strokeWidth="1.5" />
            
            {/* Bottom Finial */}
            <path d="M24 80 L40 80 L32 94 Z" fill="#d4af37" />
            <circle cx="32" cy="97" r="2" fill="#fbe08e" />
          </svg>
        </div>
      </div>

      {/* Center Crescent Subtle Accent */}
      <div className="hidden lg:flex flex-col items-center mt-2 opacity-80 animate-float-slow">
        <svg className="w-8 h-8 text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 1 12 2z" />
        </svg>
      </div>

      {/* Right Hanging Lantern */}
      <div className="flex flex-col items-center animate-lantern-right">
        {/* Chain */}
        <div className="w-[1.5px] h-20 sm:h-32 bg-gradient-to-b from-transparent via-[#d4af37] to-[#fbe08e]"></div>
        {/* Lantern Body */}
        <div className="relative animate-glow-pulse">
          <svg
            className="w-12 h-18 sm:w-16 sm:h-24 drop-shadow-[0_0_18px_rgba(251,224,142,0.7)]"
            viewBox="0 0 64 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Ring & Cap */}
            <circle cx="32" cy="6" r="4" stroke="#d4af37" strokeWidth="2" fill="none" />
            <path d="M22 14 L42 14 L36 10 L28 10 Z" fill="#d4af37" />
            <path d="M18 22 L46 22 L42 14 L22 14 Z" fill="#b38f2a" />
            
            {/* Glass Chamber with Glow */}
            <path d="M18 22 L12 55 L20 80 L44 80 L52 55 L46 22 Z" fill="rgba(251, 224, 142, 0.25)" stroke="#d4af37" strokeWidth="2" />
            {/* Inner Flame */}
            <ellipse cx="32" cy="52" rx="7" ry="14" fill="#ffd700" className="animate-pulse" />
            <ellipse cx="32" cy="50" rx="3.5" ry="8" fill="#ffffff" />
            
            {/* Ornate Lattice Lines */}
            <line x1="32" y1="22" x2="32" y2="80" stroke="#d4af37" strokeWidth="1.5" />
            <line x1="20" y1="52" x2="44" y2="52" stroke="#d4af37" strokeWidth="1.5" />
            
            {/* Bottom Finial */}
            <path d="M24 80 L40 80 L32 94 Z" fill="#d4af37" />
            <circle cx="32" cy="97" r="2.5" fill="#fbe08e" />
          </svg>
        </div>
      </div>
    </div>
  );
}

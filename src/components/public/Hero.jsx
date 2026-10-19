import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';

export default function Hero({ settings, onOpenSurprise, isOpened }) {
  const [opening, setOpening] = useState(false);

  const handleRevealClick = () => {
    setOpening(true);

    // Launch celebratory golden and emerald confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fbe08e', '#10b981', '#047857', '#ffd700']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#d4af37', '#ffd700', '#fbe08e']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#d4af37', '#ffd700', '#fbe08e']
        });
      }, 300);
    } catch (e) {
      console.warn('Confetti animation error', e);
    }

    onOpenSurprise();

    setTimeout(() => {
      setOpening(false);
      const letterEl = document.getElementById('letter');
      if (letterEl) {
        letterEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  const mainHeading = settings?.mainHeading || 'JANAMDIN MUBARAK, BHAI JAAN ❤️';

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Arch Ornamentation */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
        <div className="w-[340px] sm:w-[540px] md:w-[700px] h-[550px] sm:h-[750px] border-[2px] border-[#d4af37] rounded-t-full"></div>
        <div className="absolute w-[300px] sm:w-[490px] md:w-[640px] h-[510px] sm:h-[700px] border-[1px] border-[#d4af37] rounded-t-full"></div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Animated Bismillah */}
        <div className="mb-6 sm:mb-8 inline-block animate-float-slow">
          <div className="px-6 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#064e3b]/60 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#fbe08e] tracking-wide leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>

        {/* Subtitle / Preface */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-cinzel text-[#d4af37] mb-3">
          {settings?.introSubheading || 'Mere azeez, muhtaram aur rehnuma bhai ke naam ek dil-se tohfa'}
        </p>

        {/* Main Heading - Guaranteed: "JANAMDIN MUBARAK, BHAI JAAN ❤️" */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight max-w-3xl drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          <span className="gold-gradient-text block">
            {mainHeading}
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-xl text-[#fdfbf7]/85 max-w-2xl font-light mb-10 leading-relaxed italic">
          "{settings?.heroTagline || 'Duaon, Mohabbat aur Qadardani se bhara ek pyara safar'}"
        </p>

        {/* Reveal Button */}
        {!isOpened ? (
          <button
            onClick={handleRevealClick}
            disabled={opening}
            className="group relative px-8 sm:px-12 py-4 rounded-full font-serif text-base sm:text-lg font-bold tracking-wide text-[#022c22] gold-gradient-bg shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_45px_rgba(251,224,142,0.8)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-[#022c22] animate-spin group-hover:scale-125 transition-transform" />
            <span>Surprise Kholiye, Bhai Jaan</span>
            <Heart className="w-5 h-5 text-red-600 fill-red-600 group-hover:scale-125 transition-transform" />
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3 animate-bounce">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel">
              Neeche Tashreef Laaiye
            </span>
            <ChevronDown className="w-6 h-6 text-[#d4af37]" />
          </div>
        )}
      </div>
    </section>
  );
}

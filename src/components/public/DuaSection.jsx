import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Check } from 'lucide-react';
import { sayAameen } from '../../api';

export default function DuaSection({ duas = [] }) {
  const [aameenCounts, setAameenCounts] = useState({});
  const [activeCards, setActiveCards] = useState({});

  const handleSayAameen = async (duaId, event) => {
    // Prevent duplicate rapid spam clicks
    if (activeCards[duaId]) return;

    setActiveCards((prev) => ({ ...prev, [duaId]: true }));

    // Particle burst from button location
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 25,
        spread: 45,
        origin: { x, y },
        colors: ['#d4af37', '#fbe08e', '#10b981', '#ffd700']
      });
    } catch (e) {
      console.warn('Particle trigger error', e);
    }

    try {
      const res = await sayAameen(duaId);
      if (res.data.success) {
        setAameenCounts((prev) => ({
          ...prev,
          [duaId]: res.data.aameenCount
        }));
      }
    } catch (err) {
      console.warn('Aameen recording error', err);
    } finally {
      setTimeout(() => {
        setActiveCards((prev) => ({ ...prev, [duaId]: false }));
      }, 1500);
    }
  };

  return (
    <section id="duas" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] text-xs uppercase tracking-widest font-cinzel mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Khas Duaen</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold gold-gradient-text tracking-tight mb-3">
            Bhai Jaan Ke Haq Mein Duaen
          </h2>
          <p className="text-sm sm:text-base text-[#fdfbf7]/75 max-w-xl mx-auto font-light">
            Har dua par 'Aameen' keh kar barkat aur duaon ke is silsile mein shamil hon.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </div>

        {/* Dua Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {duas.map((dua, index) => {
            const count = aameenCounts[dua._id] ?? dua.aameenCount ?? 0;
            const isClicked = activeCards[dua._id];

            return (
              <div
                key={dua._id || index}
                className="islamic-card p-6 sm:p-7 flex flex-col justify-between relative group"
              >
                {/* Category & Order Badge */}
                <div className="flex items-center justify-between mb-4 border-b border-[#d4af37]/15 pb-3">
                  <span className="text-[11px] font-cinzel uppercase tracking-wider text-[#d4af37] px-2.5 py-0.5 rounded-full bg-[#064e3b]/60 border border-[#d4af37]/30">
                    {dua.category || 'Barkat'}
                  </span>
                  <span className="text-xs font-serif text-[#d4af37]/50">
                    Dua #{index + 1}
                  </span>
                </div>

                {/* Dua Title */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fbe08e] mb-4">
                  {dua.title}
                </h3>

                {/* Arabic Calligraphy */}
                {dua.arabicText && (
                  <div className="bg-[#022c22]/70 p-4 rounded-xl border border-[#d4af37]/20 mb-4 text-center">
                    <p className="font-arabic text-xl sm:text-2xl text-[#fbe08e] leading-loose dir-rtl">
                      {dua.arabicText}
                    </p>
                  </div>
                )}

                {/* Urdu Prayer Meaning */}
                <p className="text-[#fdfbf7]/90 text-sm sm:text-base leading-relaxed mb-4 italic font-serif">
                  "{dua.urduText}"
                </p>

                {/* English Meaning */}
                {dua.englishMeaning && (
                  <p className="text-[#fdfbf7]/60 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {dua.englishMeaning}
                  </p>
                )}

                {/* Interactive Aameen Button & Counter */}
                <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37]">
                    <Heart className="w-3.5 h-3.5 fill-[#d4af37]" />
                    <span className="font-medium font-cinzel">{count} Aameen</span>
                  </div>

                  <button
                    onClick={(e) => handleSayAameen(dua._id, e)}
                    className={`px-4 py-2 rounded-full text-xs font-serif font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      isClicked
                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
                        : 'border border-[#d4af37]/50 text-[#fbe08e] bg-[#064e3b]/60 hover:bg-[#d4af37] hover:text-[#022c22] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    }`}
                  >
                    {isClicked ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Aameen Qabool Ho</span>
                      </>
                    ) : (
                      <>
                        <span>Aameen</span>
                        <span className="text-base">🤲</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

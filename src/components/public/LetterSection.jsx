import React from 'react';
import { Heart, Sparkles, BookOpen } from 'lucide-react';

export default function LetterSection({ letter }) {
  if (!letter) return null;

  return (
    <section id="letter" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] text-xs uppercase tracking-widest font-cinzel mb-4">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Dil Se Ek Paigham</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold gold-gradient-text tracking-tight mb-2">
            {letter.title || 'Mere Pyare Aur Azeez Bhai Jaan Ke Naam'}
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </div>

        {/* Letter Parchment / Card */}
        <div className="relative islamic-card p-6 sm:p-10 md:p-14 border border-[#d4af37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
          {/* Corner Floral Ornaments */}
          <div className="absolute top-3 left-3 text-[#d4af37]/40 text-xl font-serif">❖</div>
          <div className="absolute top-3 right-3 text-[#d4af37]/40 text-xl font-serif">❖</div>
          <div className="absolute bottom-3 left-3 text-[#d4af37]/40 text-xl font-serif">❖</div>
          <div className="absolute bottom-3 right-3 text-[#d4af37]/40 text-xl font-serif">❖</div>

          {/* Salutation */}
          <div className="mb-8 border-b border-[#d4af37]/20 pb-5">
            <p className="font-serif text-lg sm:text-xl font-semibold text-[#fbe08e] tracking-wide">
              {letter.salutation || 'Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh, Pyare Bhai Jaan,'}
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-6 text-[#fdfbf7]/90 text-base sm:text-lg leading-relaxed font-light text-justify sm:text-left">
            {(letter.paragraphs || []).map((paragraph, idx) => (
              <p key={idx} className="first-letter:text-2xl first-letter:font-serif first-letter:text-[#fbe08e]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Closing Dua */}
          {letter.closingDua && (
            <div className="mt-8 pt-6 border-t border-[#d4af37]/20 bg-[#064e3b]/30 p-5 rounded-xl border border-[#d4af37]/15">
              <p className="text-sm sm:text-base italic text-[#fbe08e] leading-relaxed font-serif">
                "{letter.closingDua}"
              </p>
            </div>
          )}

          {/* Sign-off */}
          <div className="mt-10 text-right">
            <div className="inline-block border-t border-[#d4af37]/30 pt-3">
              <p className="font-serif text-lg sm:text-xl font-bold gold-gradient-text">
                {letter.signOff || 'Aapke Chhote Bhai Ki Taraf Se ❤️'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

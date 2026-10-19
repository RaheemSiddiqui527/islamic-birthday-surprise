import React from 'react';
import { Heart, Book, Shield, Sparkles, Star, Calendar } from 'lucide-react';

export default function MemoryTimeline({ memories = [] }) {
  if (!memories || memories.length === 0) return null;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="w-5 h-5 text-[#fbe08e]" />;
      case 'book':
        return <Book className="w-5 h-5 text-[#fbe08e]" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-[#fbe08e]" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-[#fbe08e]" />;
    }
  };

  return (
    <section id="memories" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] text-xs uppercase tracking-widest font-cinzel mb-4">
            <Star className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Safarnama-e-Mohabbat</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold gold-gradient-text tracking-tight mb-3">
            Bhai Ki Shafqat Aur Yaadein
          </h2>
          <p className="text-sm sm:text-base text-[#fdfbf7]/75 max-w-xl mx-auto font-light">
            Bachpan ke ayyam se lekar aaj tak, har lamha aapki rehnumai aur mohabbat ka azeem tohfa hai.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-[#d4af37]/30 ml-4 sm:ml-32 space-y-12">
          {memories.map((mem, idx) => (
            <div key={mem._id || idx} className="relative pl-8 sm:pl-10 group">
              {/* Timeline Pin */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border border-[#d4af37] bg-[#022c22] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-115 transition-transform">
                {getIcon(mem.iconName)}
              </div>

              {/* Date / Period tag on left (desktop) or inline (mobile) */}
              {mem.dateOrPeriod && (
                <div className="sm:absolute sm:-left-36 sm:top-2 mb-2 sm:mb-0 text-xs font-cinzel tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  <span>{mem.dateOrPeriod}</span>
                </div>
              )}

              {/* Memory Card */}
              <div className="islamic-card p-6 sm:p-7">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fbe08e] mb-2.5">
                  {mem.title}
                </h3>
                <p className="text-[#fdfbf7]/85 text-sm sm:text-base leading-relaxed font-light">
                  {mem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

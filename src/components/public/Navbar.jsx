import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Shield, Heart, QrCode } from 'lucide-react';
import QrShareModal from './QrShareModal';

export default function Navbar({ brotherName, audioTrack, isPlaying, togglePlay, hasVideo }) {
  const [showQrModal, setShowQrModal] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#022c22]/85 backdrop-blur-md border-b border-[#d4af37]/20 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center bg-[#064e3b]/80 group-hover:border-[#d4af37] transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)]">
            <svg
              className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 1 12 2z" />
            </svg>
          </div>
          <div>
            <span className="text-base sm:text-lg font-serif tracking-wider font-semibold gold-gradient-text block">
              {brotherName || 'Kareem Bhai'}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#d4af37]/70 block font-cinzel">
              Mubarak Safar
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#fdfbf7]/80">
          <button
            onClick={() => scrollTo('letter')}
            className="hover:text-[#fbe08e] transition-colors cursor-pointer"
          >
            Khas Paigham
          </button>
          <button
            onClick={() => scrollTo('duas')}
            className="hover:text-[#fbe08e] transition-colors cursor-pointer"
          >
            Duaen
          </button>
          <button
            onClick={() => scrollTo('memories')}
            className="hover:text-[#fbe08e] transition-colors cursor-pointer"
          >
            Yaadein
          </button>
          <button
            onClick={() => scrollTo('gallery')}
            className="hover:text-[#fbe08e] transition-colors cursor-pointer"
          >
            Tasweerein
          </button>
          {hasVideo && (
            <button
              onClick={() => scrollTo('video')}
              className="hover:text-[#fbe08e] transition-colors cursor-pointer text-[#fbe08e] font-serif font-bold"
            >
              Video 
            </button>
          )}
        </nav>

        {/* Right Action Icons: Audio toggle & Admin Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          {audioTrack && (
            <button
              onClick={togglePlay}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-serif ${
                isPlaying
                  ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#fbe08e] shadow-[0_0_12px_rgba(212,175,55,0.5)] animate-pulse'
                  : 'border-[#d4af37]/60 bg-[#064e3b] text-[#fbe08e] hover:bg-[#d4af37]/25 hover:border-[#d4af37] shadow-sm'
              }`}
              title={isPlaying ? 'Pause Islamic Vocal Nasheed' : 'Play Islamic Vocal Nasheed'}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="font-bold">Playing 🎵</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-[#d4af37] fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="font-bold">Play Nasheed ▶</span>
                </>
              )}
            </button>
          )}

          {/* QR Code Scan & Share Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#d4af37]/40 bg-[#064e3b]/50 text-[#fbe08e] hover:bg-[#d4af37]/20 hover:border-[#d4af37] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-serif"
            title="Scan QR Code / Share Surprise"
          >
            <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline font-bold">QR Code </span>
          </button>

          <Link
            to="/admin"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] hover:bg-[#d4af37]/20 hover:border-[#d4af37] transition-all flex items-center gap-1.5"
            title="Admin Panel"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>

      <QrShareModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        brotherName={brotherName}
      />
    </header>
  );
}

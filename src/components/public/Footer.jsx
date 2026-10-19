import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, QrCode } from 'lucide-react';
import QrShareModal from './QrShareModal';

export default function Footer({ signOff, brotherName }) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin);
    }
  }, []);

  return (
    <footer className="relative border-t border-[#d4af37]/20 py-16 px-4 bg-[#022c22]/95 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Crescent Icon */}
        <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#064e3b]/60 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <svg className="w-6 h-6 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 1 12 2z" />
          </svg>
        </div>

        {/* Primary Greeting in Footer */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text tracking-wide mb-3">
          JANAMDIN MUBARAK, BHAI JAAN ❤️
        </h3>

        <p className="text-sm sm:text-base text-[#fdfbf7]/80 font-light leading-relaxed mb-6 italic max-w-lg">
          "Allah Ta'ala aapko hamesha salamati, khushiyan aur azeem barkatein ata farmaye aur hum dono bhaiyon ki mohabbat ko hamesha qaim wa daaim rakhe."
        </p>

        {/* Sign-off */}
        <div className="pt-4 border-t border-[#d4af37]/20 mb-8">
          <p className="font-serif text-base sm:text-lg font-bold text-[#fbe08e] flex items-center justify-center gap-2">
            <span>{signOff || 'Aapke Chhote Bhai Ki Taraf Se ❤️'}</span>
          </p>
        </div>

        {/* QR Code Section for Instant Phone Scan */}
        <div className="islamic-card p-5 border border-[#d4af37]/35 shadow-xl max-w-sm w-full my-4 flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#d4af37] mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Camera Se Scan Karein</span>
          </div>

          <div
            onClick={() => setShowQrModal(true)}
            className="p-3 bg-white rounded-xl shadow-lg border border-[#d4af37]/40 my-2 cursor-pointer hover:scale-105 transition-transform"
            title="Click karke download ya share karein"
          >
            <QRCodeSVG
              value={url || 'https://kareem-bhai-surprise.vercel.app'}
              size={140}
              bgColor="#ffffff"
              fgColor="#022c22"
              level="M"
            />
          </div>

          <p className="text-[11px] text-[#fdfbf7]/70 font-light mt-1 mb-3">
            Kisi bhi phone ke camera se scan karke ye surprise kholein
          </p>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-1.5 rounded-full text-xs font-serif font-bold gold-gradient-bg text-[#022c22] shadow hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code Download / Share</span>
          </button>
        </div>

        <p className="text-[10px] font-cinzel text-[#d4af37]/50 tracking-widest uppercase mt-6">
          Alhamdulillah • Barkat • Mohabbat • Ehtiram
        </p>
      </div>

      {/* QR Share Modal */}
      <QrShareModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        brotherName={brotherName}
      />
    </footer>
  );
}

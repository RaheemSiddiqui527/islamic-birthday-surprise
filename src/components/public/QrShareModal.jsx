import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, Share2, X, Smartphone } from 'lucide-react';

export default function QrShareModal({ isOpen, onClose, brotherName }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [qrSize, setQrSize] = useState(175);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.origin);

      const updateSize = () => {
        const w = window.innerWidth;
        if (w < 380) {
          setQrSize(155);
        } else if (w < 640) {
          setQrSize(180);
        } else {
          setQrSize(215);
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Lock body scroll while modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback copy
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById('bhai-jaan-qr-canvas');
    if (!canvas) return;

    // Create a higher-resolution framed canvas for luxury print
    const printCanvas = document.createElement('canvas');
    const pCtx = printCanvas.getContext('2d');
    const width = 600;
    const height = 750;
    printCanvas.width = width;
    printCanvas.height = height;

    // Background gradient: Emerald green
    const grad = pCtx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#022c22');
    grad.addColorStop(1, '#064e3b');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, width, height);

    // Gold decorative border
    pCtx.strokeStyle = '#d4af37';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(20, 20, width - 40, height - 40);

    // Inner subtle border
    pCtx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    pCtx.lineWidth = 1;
    pCtx.strokeRect(28, 28, width - 56, height - 56);

    // Top Arabic / Greeting Text
    pCtx.fillStyle = '#fbe08e';
    pCtx.font = 'bold 26px serif';
    pCtx.textAlign = 'center';
    pCtx.fillText('JANAMDIN MUBARAK, BHAI JAAN ❤️', width / 2, 75);

    pCtx.fillStyle = '#fdfbf7';
    pCtx.font = '16px sans-serif';
    pCtx.fillText('Scan this QR code with phone camera to open surprise', width / 2, 110);

    // White card behind QR
    pCtx.fillStyle = '#ffffff';
    pCtx.beginPath();
    pCtx.roundRect(100, 150, 400, 400, 24);
    pCtx.fill();

    // Draw the actual QR code from the canvas
    pCtx.drawImage(canvas, 130, 180, 340, 340);

    // Bottom Website URL
    pCtx.fillStyle = '#d4af37';
    pCtx.font = 'bold 18px sans-serif';
    pCtx.fillText(url, width / 2, 600);

    pCtx.fillStyle = 'rgba(253, 251, 247, 0.7)';
    pCtx.font = '14px serif';
    pCtx.fillText('Aapke Chhote Bhai Ki Taraf Se ❤️', width / 2, 645);

    pCtx.font = '12px sans-serif';
    pCtx.fillText('Alhamdulillah • Barkat • Mohabbat • Ehtiram', width / 2, 690);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Kareem_Bhai_Birthday_Surprise_QR.png`;
    link.href = printCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappText = encodeURIComponent(
    `JANAMDIN MUBARAK, BHAI JAAN ❤️\n\nKareem Bhai ke janamdin par duaon aur yaadon se bhara khas surprise website dekhiye:\n${url}`
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-[#022c22]/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="islamic-card p-4 sm:p-6 border border-[#d4af37]/40 max-w-[340px] sm:max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.85)] my-auto relative text-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#fdfbf7]/70 hover:text-white p-1.5 rounded-full bg-[#064e3b]/80 border border-[#d4af37]/30 hover:bg-[#064e3b] transition-all cursor-pointer z-10"
          title="Band karein"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#064e3b]/80 text-[#fbe08e] text-[11px] uppercase font-cinzel mb-2">
          <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Mobile Scan QR Code</span>
        </div>

        <h3 className="font-serif text-lg sm:text-2xl font-bold gold-gradient-text tracking-wide mb-1">
          Surprise Website QR Code
        </h3>
        <p className="text-[11px] sm:text-xs text-[#fdfbf7]/75 font-light mb-3 sm:mb-4">
          Phone camera se scan karke koi bhi foran ye surprise website open kar sakta hai.
        </p>

        {/* QR Code Card */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-2xl inline-block border-2 border-[#d4af37]/50 relative group mx-auto mb-3">
          <QRCodeCanvas
            id="bhai-jaan-qr-canvas"
            value={url || 'https://kareem-bhai-surprise.vercel.app'}
            size={qrSize}
            level="H"
            bgColor="#ffffff"
            fgColor="#022c22"
            includeMargin={true}
          />
        </div>

        {/* Website URL display */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/25 flex items-center justify-between gap-2 text-xs text-[#fdfbf7] mb-4">
          <span className="truncate font-mono text-[11px] text-[#fbe08e] text-left">{url}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all flex items-center gap-1 cursor-pointer font-sans text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Actions Button Group */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={handleDownload}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-[11px] sm:text-xs font-bold gold-gradient-bg text-[#022c22] shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-serif text-[11px] sm:text-xs font-semibold bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Share</span>
          </a>
        </div>

        <p className="text-[10px] font-cinzel text-[#d4af37]/60 mt-3 tracking-wider uppercase">
          Print on Gift Card • Cake Box • Photo Frame
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

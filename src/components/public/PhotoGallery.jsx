import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Star } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

export default function PhotoGallery({ photos = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos]);

  const nextPhoto = () => {
    if (lightboxIndex !== null && photos.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null && photos.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      nextPhoto(); // swiped left
    } else if (diff < -50) {
      prevPhoto(); // swiped right
    }
    setTouchStart(null);
  };

  return (
    <section id="gallery" className="relative py-20 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] text-xs uppercase tracking-widest font-cinzel mb-4">
            <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Yaadgaar Lamhaat</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold gold-gradient-text tracking-tight mb-3">
            Tasweeron Ka Haseen Guldasta
          </h2>
          <p className="text-sm sm:text-base text-[#fdfbf7]/75 max-w-xl mx-auto font-light">
            Har tasveer mein ek pyari kahani aur bhai-bhai ki sachi mohabbat posheeda hai.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </div>

        {/* Photos Grid or Empty State */}
        {photos.length === 0 ? (
          <div className="islamic-card p-12 text-center max-w-md mx-auto">
            <Camera className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#fbe08e] mb-2">
              Tasweerein Jald Hi Upload Ki Jayengi
            </h3>
            <p className="text-xs sm:text-sm text-[#fdfbf7]/60 leading-relaxed font-light">
              Admin panel se pyari tasweerein upload karne ke baad yahan numayan hongi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo._id || index}
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer islamic-card border border-[#d4af37]/30 transition-all duration-300 hover:border-[#d4af37] hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)]"
              >
                {/* Image Container with 4:3 Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#064e3b]/40">
                  <img
                    src={getMediaUrl(photo.thumbnailPath || photo.filePath)}
                    alt={photo.caption || 'Bhai Jaan Memory'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                </div>

                {/* Cover Photo Badge */}
                {photo.isCover && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-cinzel tracking-wider uppercase bg-[#d4af37] text-[#022c22] font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-[#022c22]" />
                    <span>Khas Tasveer</span>
                  </div>
                )}

                {/* Hover Zoom Icon */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-[#022c22]/70 text-[#fbe08e] opacity-0 group-hover:opacity-100 transition-opacity border border-[#d4af37]/40">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {/* Caption Card Body */}
                <div className="p-4 sm:p-5">
                  {photo.caption && (
                    <h3 className="font-serif font-semibold text-base sm:text-lg text-[#fbe08e] mb-1 line-clamp-1">
                      {photo.caption}
                    </h3>
                  )}
                  {photo.description && (
                    <p className="text-xs sm:text-sm text-[#fdfbf7]/75 font-light line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  )}
                  {photo.photoDate && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-cinzel text-[#d4af37]/70">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.photoDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-[#022c22]/95 backdrop-blur-xl flex flex-col justify-between items-center p-4 sm:p-8"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar with Counter & Close */}
            <div className="w-full max-w-5xl flex items-center justify-between text-[#fdfbf7]/80 pb-4">
              <span className="font-cinzel text-xs sm:text-sm tracking-wider text-[#d4af37]">
                Tasveer {lightboxIndex + 1} / {photos.length}
              </span>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-full bg-[#064e3b]/80 border border-[#d4af37]/40 text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all cursor-pointer"
                title="Band Kijiye (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto overflow-hidden">
              <button
                onClick={prevPhoto}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-[#064e3b]/80 border border-[#d4af37]/40 text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all cursor-pointer shadow-lg"
                title="Pichhli Tasveer (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={getMediaUrl(photos[lightboxIndex].filePath)}
                alt={photos[lightboxIndex].caption || 'Bhai Jaan'}
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-xl border border-[#d4af37]/40 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              />

              <button
                onClick={nextPhoto}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-[#064e3b]/80 border border-[#d4af37]/40 text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all cursor-pointer shadow-lg"
                title="Agli Tasveer (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full max-w-2xl text-center pt-4">
              {photos[lightboxIndex].caption && (
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#fbe08e] mb-1">
                  {photos[lightboxIndex].caption}
                </h4>
              )}
              {photos[lightboxIndex].description && (
                <p className="text-xs sm:text-sm text-[#fdfbf7]/80 font-light max-w-xl mx-auto">
                  {photos[lightboxIndex].description}
                </p>
              )}
              {photos[lightboxIndex].photoDate && (
                <p className="text-[11px] font-cinzel text-[#d4af37]/70 mt-1">
                  {photos[lightboxIndex].photoDate}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

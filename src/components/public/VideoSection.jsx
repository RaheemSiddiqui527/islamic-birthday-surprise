import React, { useState, useEffect } from 'react';
import { Film, Play, Sparkles } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

export default function VideoSection({ video, videos = [] }) {
  const allVideos = videos.length > 0 ? videos : (video ? [video] : []);
  const [activeVideo, setActiveVideo] = useState(allVideos[0] || video);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (allVideos.length > 0 && (!activeVideo || !allVideos.some(v => v._id === activeVideo._id))) {
      setActiveVideo(allVideos[0]);
    }
  }, [videos, video]);

  if (!activeVideo || activeVideo.isPublished === false) return null;

  const hasVideoSource = Boolean(activeVideo.filePath || activeVideo.videoUrl);

  const displayTitle =
    activeVideo.title && !/^\d+$/.test(activeVideo.title.trim())
      ? activeVideo.title
      : 'Kareem Bhai Ke Liye Khas Video Paigham ❤️';

  const displayDesc =
    activeVideo.description ||
    'Hamare azeez aur muhtaram bhai jaan ke janamdin par mohabbaton aur duaon se bhara ek pyara video tohfa.';

  const handleMetadata = (e) => {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight && videoHeight > videoWidth) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  return (
    <section id="video" className="relative pt-16 sm:pt-20 pb-24 px-4 scroll-mt-28 sm:scroll-mt-32">
      <div className={`mx-auto transition-all duration-500 ${isPortrait ? 'max-w-xl' : 'max-w-4xl'}`}>
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#064e3b]/40 text-[#fbe08e] text-xs uppercase tracking-widest font-cinzel mb-3 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Film className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Khas Video Paigham</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold gold-gradient-text tracking-tight mb-3">
            {displayTitle}
          </h2>
          {displayDesc && (
            <p className="text-sm sm:text-base text-[#fdfbf7]/80 max-w-xl mx-auto font-light leading-relaxed">
              {displayDesc}
            </p>
          )}
          {activeVideo.isGoogleFlow && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-cinzel bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbe08e]">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                Google Flow 6-Scenes Special Compilation
              </span>
            </div>
          )}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
        </div>

        {/* Video Selector Tabs if more than 1 video */}
        {allVideos.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            {allVideos.map((v, idx) => (
              <button
                key={v._id || idx}
                onClick={() => {
                  setActiveVideo(v);
                  setIsPortrait(false);
                }}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-serif text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  activeVideo?._id === v._id
                    ? 'gold-gradient-bg text-[#022c22] font-bold shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-105'
                    : 'bg-[#064e3b]/60 border border-[#d4af37]/35 text-[#fdfbf7]/80 hover:text-[#fbe08e] hover:border-[#d4af37]'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${activeVideo?._id === v._id ? 'fill-[#022c22]' : ''}`} />
                <span className="truncate max-w-[200px] sm:max-w-none">{v.title || `Video ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Video Player Card */}
        <div className="islamic-card p-3 sm:p-5 border border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden relative group">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/10 via-[#10b981]/10 to-[#d4af37]/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>

          {hasVideoSource ? (
            <div
              className={`relative rounded-2xl overflow-hidden bg-black/95 flex items-center justify-center border border-[#d4af37]/25 shadow-inner mx-auto transition-all duration-500 ${
                isPortrait
                  ? 'max-w-xs sm:max-w-sm aspect-[9/16] max-h-[75vh]'
                  : 'w-full aspect-video'
              }`}
            >
              {activeVideo.filePath ? (
                <video
                  key={activeVideo.filePath}
                  src={getMediaUrl(activeVideo.filePath)}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={handleMetadata}
                  poster={activeVideo.coverImagePath ? getMediaUrl(activeVideo.coverImagePath) : ''}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : activeVideo.videoUrl ? (
                <iframe
                  key={activeVideo.videoUrl}
                  src={activeVideo.videoUrl.replace('watch?v=', 'embed/')}
                  title={displayTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <Film className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
              <h4 className="font-serif text-lg font-bold text-[#fbe08e] mb-2">
                Video Filhal Tayyar Ho Rahi Hai
              </h4>
              <p className="text-xs sm:text-sm text-[#fdfbf7]/60 max-w-md mx-auto font-light leading-relaxed">
                Bhai jaan ke liye khas video upload hote hi yahan numayan ho jayegi.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

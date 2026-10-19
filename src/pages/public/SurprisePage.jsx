import React, { useState, useEffect, useRef } from 'react';
import { getPublicContent } from '../../api';
import Lanterns from '../../components/public/Lanterns';
import Particles from '../../components/public/Particles';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import LetterSection from '../../components/public/LetterSection';
import DuaSection from '../../components/public/DuaSection';
import MemoryTimeline from '../../components/public/MemoryTimeline';
import PhotoGallery from '../../components/public/PhotoGallery';
import VideoSection from '../../components/public/VideoSection';
import AudioPlayer from '../../components/public/AudioPlayer';
import Footer from '../../components/public/Footer';

export default function SurprisePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    loadContent();

    // Automatically refresh content if user switches between Admin and Public tabs
    const handleFocus = () => {
      loadContent(false);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Browser Autoplay Policy: Start audio on the very first user interaction anywhere
  useEffect(() => {
    if (!data?.audio?.filePath || isPlaying) return;

    const startAudioOnInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.log('Autoplay deferred:', e.message));
      }
    };

    window.addEventListener('click', startAudioOnInteraction, { once: true });
    window.addEventListener('touchstart', startAudioOnInteraction, { once: true });

    return () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };
  }, [data?.audio, isPlaying]);

  async function loadContent(showSpinner = true) {
    try {
      if (showSpinner) setLoading(true);
      const res = await getPublicContent();
      if (res.data.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load surprise content', err);
      if (showSpinner) setError('Unable to load surprise page. Please check connection.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  const handleOpenSurprise = () => {
    setIsOpened(true);
    // Attempt audio playback after user interaction (browser compliant)
    if (audioRef.current && data?.audio?.filePath) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Autoplay deferred:', e.message));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !data?.audio?.filePath) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Playback error:', e.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center text-[#fbe08e]">
        <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mb-4"></div>
        <p className="font-arabic text-2xl text-[#fbe08e] mb-2">بِسْمِ اللَّهِ</p>
        <p className="font-serif text-sm tracking-widest text-[#d4af37] uppercase font-cinzel">
          Surprise Tayyar Ho Raha Hai...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl text-red-400 mb-2">Surprise Load Nahi Ho Saka</h2>
        <p className="text-sm text-[#fdfbf7]/70 mb-6">{error || 'Server se rabta nahi ho saka.'}</p>
        <button
          onClick={loadContent}
          className="px-6 py-2.5 rounded-full border border-[#d4af37] text-[#fbe08e] bg-[#064e3b] hover:bg-[#d4af37] hover:text-[#022c22] transition-all cursor-pointer font-serif"
        >
          Dobara Koshish Kijiye
        </button>
      </div>
    );
  }

  const { settings, letter, duas, photos, memories, audio, video, videos } = data;
  const allVideos = videos && videos.length > 0 ? videos : (video ? [video] : []);

  return (
    <div className="relative min-h-screen bg-[#022c22] text-[#fdfbf7] selection:bg-[#d4af37] selection:text-[#022c22]">
      {/* Background Islamic Ambient Elements */}
      {settings.enableParticles && <Particles />}
      {settings.enableLanterns && <Lanterns />}

      {/* Header Navigation */}
      <Navbar
        brotherName={settings.brotherName}
        audioTrack={audio}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        hasVideo={Boolean(video || allVideos.length > 0)}
      />

      {/* Main Hero & Opening Experience */}
      <Hero
        settings={settings}
        onOpenSurprise={handleOpenSurprise}
        isOpened={isOpened}
      />

      {/* Surprise Content Sections (Revealed after opening or scrollable) */}
      <div className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-90'}`}>
        {settings.enableLetter && letter && <LetterSection letter={letter} />}

        {settings.enableDuas && duas && duas.length > 0 && <DuaSection duas={duas} />}

        {settings.enableMemories && memories && memories.length > 0 && (
          <MemoryTimeline memories={memories} />
        )}

        {settings.enableGallery && <PhotoGallery photos={photos} />}

        {settings.enableVideo && (video || allVideos.length > 0) && (
          <VideoSection video={video} videos={allVideos} />
        )}
      </div>

      {/* Audio Player Widget */}
      {settings.enableNasheed && audio && (
        <AudioPlayer
          audioTrack={audio}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
        />
      )}

      {/* Loving Footer */}
      <Footer signOff={settings.signOff} brotherName={settings.brotherName} />
    </div>
  );
}

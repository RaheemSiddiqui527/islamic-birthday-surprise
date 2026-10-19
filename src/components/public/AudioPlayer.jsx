import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

export default function AudioPlayer({ audioTrack, isPlaying, setIsPlaying, audioRef }) {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioTrack && audioTrack.volumeDefault !== undefined) {
      setVolume(audioTrack.volumeDefault);
      if (audioRef.current) {
        audioRef.current.volume = audioTrack.volumeDefault;
      }
    }
  }, [audioTrack]);

  // Synchronize audio tag playback with isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error / autoplay blocked:', err.message);
        setIsPlaying(false);
      });
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !audioTrack?.filePath) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // If no audio track exists, render nothing
  if (!audioTrack || !audioTrack.filePath) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-sm w-full transition-all">
      <audio
        ref={audioRef}
        src={getMediaUrl(audioTrack.filePath)}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio playback error:', e.target?.error)}
        loop
      />

      <div
        className={`islamic-card p-3 sm:p-4 border shadow-[0_12px_30px_rgba(0,0,0,0.7)] flex items-center gap-3.5 backdrop-blur-xl transition-all ${
          isPlaying
            ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-[#064e3b]/90'
            : 'border-[#d4af37]/40 bg-[#022c22]/95'
        }`}
      >
        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full gold-gradient-bg text-[#022c22] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? 'Pause Nasheed' : 'Play Islamic Vocal Nasheed'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-[#022c22]" /> : <Play className="w-5 h-5 fill-[#022c22] ml-0.5" />}
        </button>

        {/* Track Title and Artist */}
        <div className="flex-1 min-w-0">
          <p className="font-serif text-xs sm:text-sm font-semibold text-[#fbe08e] truncate">
            {audioTrack.title || 'Islamic Vocal Nasheed'}
          </p>
          <p className="text-[10px] text-[#fdfbf7]/60 truncate">
            {audioTrack.artist || 'Without Musical Instruments'}
          </p>

          {/* Progress Line */}
          <div className="w-full bg-[#022c22] h-1 rounded-full mt-1.5 overflow-hidden border border-[#d4af37]/20">
            <div
              className="bg-[#d4af37] h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Volume Button */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-[#d4af37] hover:text-[#fbe08e] transition-colors p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 accent-[#d4af37] h-1 bg-[#022c22] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

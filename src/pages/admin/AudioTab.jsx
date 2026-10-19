import React, { useState, useEffect, useRef } from 'react';
import {
  getAudioTracks,
  uploadAudio,
  setActiveAudio,
  updateAudio,
  deleteAudio
} from '../../api';
import { getMediaUrl } from '../../utils/media';
import { Music, Upload, Play, Pause, CheckCircle, Trash2, Volume2, Plus, X } from 'lucide-react';

export default function AudioTab({ showToast }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('Islamic Vocal Nasheed (No Instruments)');
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [uploadVolume, setUploadVolume] = useState(0.7);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Admin Preview player state
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const audioPreviewRef = useRef(null);

  useEffect(() => {
    loadTracks();
  }, []);

  async function loadTracks() {
    try {
      setLoading(true);
      const res = await getAudioTracks();
      if (res.data.success) {
        setTracks(res.data.tracks || []);
      }
    } catch (err) {
      showToast('Audio tracks load nahi ho sake.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Audio file muntakhab karein (MP3, M4A, AAC, WAV, OGG).', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('audio', uploadFile);
      formData.append('title', uploadTitle || uploadFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('artist', uploadArtist);
      formData.append('isActive', uploadIsActive);
      formData.append('volumeDefault', uploadVolume);

      const res = await uploadAudio(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });
      if (res.data.success) {
        showToast('Nasheed audio upload ho gayi! 🎵', 'success');
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadTitle('');
        setUploadProgress(0);
        loadTracks();
      }
    } catch (err) {
      showToast('Upload error: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (track) => {
    try {
      const res = await setActiveAudio(track._id);
      if (res.data.success) {
        showToast(`"${track.title}" ab website par active nasheed hai! ✨`, 'success');
        loadTracks();
      }
    } catch (err) {
      showToast('Activation error: ' + err.message, 'error');
    }
  };

  const handleDelete = async (track) => {
    if (!window.confirm(`Kya aap "${track.title}" ko delete karna chahte hain?`)) return;
    try {
      await deleteAudio(track._id);
      showToast('Audio track delete ho gaya.', 'success');
      if (currentPlayingId === track._id && audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        setCurrentPlayingId(null);
      }
      loadTracks();
    } catch (err) {
      showToast('Delete error: ' + err.message, 'error');
    }
  };

  const togglePreview = (track) => {
    if (!audioPreviewRef.current) return;

    if (currentPlayingId === track._id) {
      audioPreviewRef.current.pause();
      setCurrentPlayingId(null);
    } else {
      audioPreviewRef.current.src = getMediaUrl(track.filePath);
      audioPreviewRef.current
        .play()
        .then(() => setCurrentPlayingId(track._id))
        .catch((e) => showToast('Audio play error: ' + e.message, 'error'));
    }
  };

  return (
    <div className="space-y-6">
      <audio
        ref={audioPreviewRef}
        onEnded={() => setCurrentPlayingId(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Nasheed and Audio Management
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Vocal-only Islamic nasheed (baghair instruments) upload karein aur active track set karein.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Nasheed</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-[#d4af37]">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mr-3"></div>
          <span>Audio files load ho rahi hain...</span>
        </div>
      ) : tracks.length === 0 ? (
        <div className="islamic-card p-12 text-center border border-[#d4af37]/25">
          <Music className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#fbe08e] mb-1">
            Koi Audio Track Maujood Nahi Hai
          </h3>
          <p className="text-xs text-[#fdfbf7]/60 font-light mb-5 max-w-md mx-auto">
            Jab tak koi audio track upload nahi hota, public website par graceful empty state nazar aayegi.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] cursor-pointer"
          >
            Vocal Nasheed Upload Karein
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => {
            const isThisPlaying = currentPlayingId === track._id;

            return (
              <div
                key={track._id}
                className={`islamic-card p-5 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  track.isActive
                    ? 'border-[#d4af37] bg-[#064e3b]/70 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-[#d4af37]/25'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Play / Pause Preview Button */}
                  <button
                    onClick={() => togglePreview(track)}
                    className="w-11 h-11 rounded-full bg-[#022c22] border border-[#d4af37] flex items-center justify-center text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all cursor-pointer shrink-0"
                    title={isThisPlaying ? 'Pause Preview' : 'Play Preview'}
                  >
                    {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-serif font-bold text-base text-[#fbe08e]">
                        {track.title}
                      </h4>
                      {track.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#d4af37] text-[#022c22] flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active on Website</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#fdfbf7]/70 font-light">
                      {track.artist} • {(track.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!track.isActive && (
                    <button
                      onClick={() => handleActivate(track)}
                      className="px-4 py-1.5 rounded-full border border-[#d4af37]/40 text-xs text-[#fbe08e] hover:bg-[#d4af37] hover:text-[#022c22] transition-all font-cinzel cursor-pointer"
                    >
                      Set as Active
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(track)}
                    className="p-2 rounded-full hover:bg-red-950/50 text-red-400 cursor-pointer"
                    title="Delete Audio Track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                <Music className="w-5 h-5 text-[#d4af37]" />
                <span>Upload Nasheed Audio</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#fdfbf7]/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  Audio File (MP3, M4A, AAC, WAV, OGG - Max 100MB)
                </label>
                <input
                  type="file"
                  accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.webm,.flac"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setUploadFile(file);
                    if (file && !uploadTitle) {
                      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  required
                  className="w-full text-xs text-[#fdfbf7] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-[#022c22] hover:file:bg-[#fbe08e] cursor-pointer"
                />
                <p className="text-[10px] text-[#fdfbf7]/60 mt-1">
                  Mobile phone voice memos (.m4a), WhatsApp audio, aur MP3 format mukammal support hote hain.
                </p>
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Track Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Hasbi Rabbi (Vocal Only)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Artist / Munshid</label>
                <input
                  type="text"
                  value={uploadArtist}
                  onChange={(e) => setUploadArtist(e.target.value)}
                  placeholder="Islamic Vocal Nasheed (No Instruments)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  Default Volume: {Math.round(uploadVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={uploadVolume}
                  onChange={(e) => setUploadVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#d4af37]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                  <input
                    type="checkbox"
                    checked={uploadIsActive}
                    onChange={(e) => setUploadIsActive(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Upload hote hi active track banayein</span>
                </label>
              </div>

              {uploading && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/30">
                  <div className="flex justify-between text-xs text-[#fbe08e] font-serif">
                    <span>Uploading nasheed audio...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#022c22] rounded-full h-2 overflow-hidden border border-[#d4af37]/20">
                    <div
                      className="gold-gradient-bg h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? `Uploading (${uploadProgress}%)` : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

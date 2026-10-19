import React, { useState, useEffect, useRef } from 'react';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../api';
import { getMediaUrl } from '../../utils/media';
import {
  Film,
  Upload,
  Trash2,
  Edit2,
  Play,
  Plus,
  X,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  AlertTriangle,
  CloudUpload,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function VideoTab({ showToast }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoType, setVideoType] = useState('upload'); // 'upload' or 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({ loaded: '0', total: '0' });

  // Edit Video state
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      setLoading(true);
      const res = await getVideos();
      if (res.data.success) {
        setVideos(res.data.videos || []);
      }
    } catch (err) {
      showToast('Video entries load nahi ho sakeen.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleVideoFileSelect = (file) => {
    if (!file) return;
    const ext = (file.name.substring(file.name.lastIndexOf('.')) || '').toLowerCase();
    const allowedExts = ['.mp4', '.webm', '.mov', '.m4v', '.3gp', '.3gpp', '.mkv'];
    const isVideo =
      file.type?.startsWith('video/') ||
      allowedExts.includes(ext) ||
      file.type === 'application/octet-stream';

    if (!isVideo) {
      showToast('Sirf MP4, WebM, QuickTime (MOV) ya phone video file select karein.', 'error');
      return;
    }

    // Check size on client side (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      showToast(`Selected video ${(file.size / (1024 * 1024)).toFixed(1)}MB ki hai. Maximum limit 500MB hai.`, 'error');
      return;
    }

    setVideoFile(file);
    if (!videoTitle) {
      // Auto-populate title from filename without extension
      const name = file.name.replace(/\.[^/.]+$/, '');
      setVideoTitle(name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleVideoFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoType === 'upload' && !videoFile) {
      showToast('Barah-e-karam video file select karein.', 'error');
      return;
    }
    if (videoType === 'url' && !videoUrl.trim()) {
      showToast('Barah-e-karam video URL enter karein.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);
      setUploadStats({
        loaded: '0',
        total: videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) : '0'
      });

      const formData = new FormData();
      formData.append('title', videoTitle || 'Bhai Jaan Birthday Video');
      formData.append('description', videoDesc);
      formData.append('videoType', videoType);
      formData.append('isGoogleFlow', isGoogleFlow);
      formData.append('isPublished', true);

      if (videoType === 'upload' && videoFile) {
        formData.append('video', videoFile);
      } else if (videoType === 'url') {
        formData.append('videoUrl', videoUrl);
      }

      const res = await createVideo(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          setUploadStats({
            loaded: (progressEvent.loaded / (1024 * 1024)).toFixed(1),
            total: (progressEvent.total / (1024 * 1024)).toFixed(1)
          });
        }
      });

      if (res.data.success) {
        showToast('Video kamiyabi se upload aur shamil ho gayi! 🎬', 'success');
        setShowUploadModal(false);
        resetForm();
        loadVideos();
      }
    } catch (err) {
      showToast('Video save error: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
      setUploadStats({ loaded: '0', total: '0' });
    }
  };

  const resetForm = () => {
    setVideoTitle('');
    setVideoDesc('');
    setVideoType('upload');
    setVideoUrl('');
    setVideoFile(null);
    setIsGoogleFlow(false);
    setUploadProgress(0);
    setUploadStats({ loaded: '0', total: '0' });
  };

  const handleOpenEdit = (v) => {
    setEditingVideo(v);
    setEditTitle(v.title || '');
    setEditDesc(v.description || '');
    setEditVideoUrl(v.videoUrl || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;
    try {
      setSavingEdit(true);
      const updatePayload = {
        title: editTitle.trim() || 'Bhai Jaan Birthday Video',
        description: editDesc.trim(),
        videoUrl: editVideoUrl.trim()
      };
      if (editVideoUrl.trim()) {
        updatePayload.videoType = 'url';
      }
      const res = await updateVideo(editingVideo._id, updatePayload);
      if (res.data.success) {
        showToast('Video kamiyabi se update hogayi! ✅', 'success');
        setEditingVideo(null);
        loadVideos();
      }
    } catch (err) {
      showToast('Update error: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const togglePublish = async (video) => {
    try {
      const res = await updateVideo(video._id, { isPublished: !video.isPublished });
      if (res.data.success) {
        showToast(
          `Video ${!video.isPublished ? 'shaya (published)' : 'makhfi (hidden)'} kardi gayi.`,
          'success'
        );
        loadVideos();
      }
    } catch (err) {
      showToast('Status tabdeel nahi ho saka.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteModal) return;
    try {
      await deleteVideo(showDeleteModal._id);
      showToast('Video delete kardi gayi.', 'success');
      setShowDeleteModal(null);
      loadVideos();
    } catch (err) {
      showToast('Delete error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Video Management
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Google Flow 6 scenes ya birthday video drag & drop upload ya embed karein.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add Birthday Video</span>
        </button>
      </div>

      {/* View Switcher */}
      {videos.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#fdfbf7]/70">
            Total Videos: <span className="text-[#fbe08e] font-serif font-bold">{videos.length}</span>
          </p>
          <div className="flex items-center border border-[#d4af37]/30 rounded-xl overflow-hidden bg-[#022c22]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#d4af37] text-[#022c22]' : 'text-[#fdfbf7]/60 hover:text-[#fbe08e]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#d4af37] text-[#022c22]' : 'text-[#fdfbf7]/60 hover:text-[#fbe08e]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-[#d4af37]/20 bg-[#064e3b]/20 p-6 space-y-4">
              <div className="w-3/4 h-5 skeleton-shimmer rounded"></div>
              <div className="aspect-video w-full skeleton-shimmer rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        /* Empty State */
        <div className="islamic-card p-12 text-center border border-[#d4af37]/25 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#064e3b]/50 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#fbe08e]">
            Koi Video Dastiyab Nahi Hai
          </h3>
          <p className="text-xs text-[#fdfbf7]/60 font-light max-w-md mx-auto leading-relaxed">
            Agar abhi tak video tayyar nahi hai to public website par koi fake video nahi dikhegi, balke empty state aayegi. Jab aap chahein video yahan shamil kar sakte hain.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] cursor-pointer shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Video Shamil Karein</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <div key={vid._id} className="islamic-card p-6 border border-[#d4af37]/35 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#fbe08e]">{vid.title}</h4>
                    {vid.description && (
                      <p className="text-xs text-[#fdfbf7]/70 font-light mt-1">{vid.description}</p>
                    )}
                    {vid.isGoogleFlow && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-cinzel bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbe08e]">
                        Google Flow 6-Scenes Compilation
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => togglePublish(vid)}
                      className="p-1.5 rounded-lg text-[#fdfbf7]/60 hover:text-[#fbe08e] hover:bg-[#064e3b] cursor-pointer"
                      title={vid.isPublished ? 'Hide from public' : 'Publish publicly'}
                    >
                      {vid.isPublished ? (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(vid)}
                      className="p-1.5 rounded-lg text-[#fdfbf7]/60 hover:text-[#fbe08e] hover:bg-[#064e3b] cursor-pointer"
                      title="Edit Title & Description"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(vid)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Player */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/70 border border-[#d4af37]/25 shadow-inner">
                {vid.filePath ? (
                  <video src={getMediaUrl(vid.filePath)} controls className="w-full h-full object-contain">
                    Your browser does not support video.
                  </video>
                ) : vid.videoUrl ? (
                  <iframe
                    src={vid.videoUrl.replace('watch?v=', 'embed/')}
                    title={vid.title}
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#fdfbf7]/40">
                    No preview available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="islamic-card border border-[#d4af37]/30 overflow-x-auto rounded-2xl">
          <table className="w-full text-left saas-table">
            <thead>
              <tr>
                <th>Title & Description</th>
                <th>Type</th>
                <th>Flow Type</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((vid) => (
                <tr key={vid._id}>
                  <td className="font-serif font-bold text-[#fbe08e]">
                    <div>
                      <span>{vid.title}</span>
                      {vid.description && (
                        <p className="text-xs text-[#fdfbf7]/60 font-light font-sans truncate max-w-xs">
                          {vid.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-xs text-[#fdfbf7]/70 font-cinzel">
                    {vid.videoType === 'upload' ? 'MP4 Upload' : 'URL Embed'}
                  </td>
                  <td className="text-xs">
                    {vid.isGoogleFlow ? (
                      <span className="text-[#fbe08e] font-serif">Google Flow</span>
                    ) : (
                      <span className="text-[#fdfbf7]/40">Standard</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-cinzel font-semibold ${
                        vid.isPublished ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'
                      }`}
                    >
                      {vid.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => togglePublish(vid)}
                        className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] cursor-pointer"
                        title={vid.isPublished ? 'Hide' : 'Publish'}
                      >
                        {vid.isPublished ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(vid)}
                        className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] cursor-pointer"
                        title="Edit Title & Description"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(vid)}
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal with Drag & Drop */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                <Film className="w-5 h-5 text-[#d4af37]" />
                <span>Add Birthday Video</span>
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="text-[#fdfbf7]/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Video Title</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g. Kareem Bhai Ke 6 Google Flow Scenes"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Mukhtasar tafseel ya scene description..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Source Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#fdfbf7] cursor-pointer">
                    <input
                      type="radio"
                      name="vtype"
                      checked={videoType === 'upload'}
                      onChange={() => setVideoType('upload')}
                      className="accent-[#d4af37]"
                    />
                    <span>Upload Video File (MP4, WebM)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#fdfbf7] cursor-pointer">
                    <input
                      type="radio"
                      name="vtype"
                      checked={videoType === 'url'}
                      onChange={() => setVideoType('url')}
                      className="accent-[#d4af37]"
                    />
                    <span>External URL / Embed</span>
                  </label>
                </div>
              </div>

              {videoType === 'upload' ? (
                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                    Video File (Drag & Drop or Click)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-[#d4af37] bg-[#064e3b]/80'
                        : 'border-[#d4af37]/40 hover:border-[#d4af37] bg-[#064e3b]/30'
                    }`}
                  >
                    <CloudUpload className="w-9 h-9 text-[#d4af37] mx-auto mb-2" />
                    <p className="text-xs text-[#fdfbf7] font-medium break-all">
                      {videoFile
                        ? `${videoFile.name} (${(videoFile.size / (1024 * 1024)).toFixed(1)} MB)`
                        : 'MP4 / MOV / WebM video yahan drag karein ya browse karein'}
                    </p>
                    <p className="text-[11px] text-[#fdfbf7]/60 mt-1 font-light">
                      Max 500MB • Android MP4 & iPhone MOV supported
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*,video/mp4,video/webm,video/quicktime,.mp4,.mov,.m4v,.3gp"
                      onChange={(e) => handleVideoFileSelect(e.target.files?.[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              {/* Progress Indicator */}
              {submitting && (
                <div className="space-y-2.5 p-3.5 rounded-xl bg-[#022c22]/90 border border-[#d4af37]/40 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-[#fbe08e]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                      <span>{uploadProgress === 100 ? 'Saving video entry to database...' : 'Uploading video file to server...'}</span>
                    </span>
                    <span className="font-mono font-bold text-sm text-[#fbe08e]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#064e3b] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#d4af37]/20">
                    <div
                      className="bg-gradient-to-r from-[#d4af37] to-[#fbe08e] h-full transition-all duration-200 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadStats.total !== '0' && (
                    <div className="flex items-center justify-between text-[11px] text-[#fdfbf7]/70">
                      <span>Uploaded: {uploadStats.loaded} MB / {uploadStats.total} MB</span>
                      <span>{uploadProgress === 100 ? 'Finalizing...' : 'Please keep browser open'}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                  <input
                    type="checkbox"
                    checked={isGoogleFlow}
                    onChange={(e) => setIsGoogleFlow(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Is Google Flow 10-second scenes compilation</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  {submitting ? 'Uploading...' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-lg w-full my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#d4af37]" />
                <span>Edit Video Title & Description</span>
              </h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-[#fdfbf7]/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Video Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Kareem Bhai Ke Liye Khas Video Paigham ❤️"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Description / Paigham</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Bhai jaan ke liye pyara description ya scene ki tafseel..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  Video Link (YouTube Unlisted / Google Drive / URL)
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... ya youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
                <p className="text-[10px] text-[#fdfbf7]/60 mt-1">
                  💡 Live Render/Vercel par YouTube ka Unlisted video link paste karein taake video HD mein bina kisi buffering ke chal sake.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  {savingEdit ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 border border-red-500/40 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-red-200">
                Video Delete Confirm Karein
              </h4>
              <p className="text-xs text-[#fdfbf7]/70 mt-1">
                Kya aap waqayi is video ko delete karna chahte hain? Database record aur uploaded video file remove ho jayegi.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/20 text-left">
              <p className="font-serif font-bold text-xs text-[#fbe08e] truncate">
                {showDeleteModal.title}
              </p>
              <p className="text-[10px] text-[#fdfbf7]/50 font-cinzel">
                {showDeleteModal.videoType === 'upload' ? 'Uploaded Video File' : 'External Video URL'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 rounded-xl border border-[#d4af37]/30 text-xs text-[#fdfbf7]/80 hover:bg-[#064e3b] cursor-pointer"
              >
                Mansookh (Cancel)
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg cursor-pointer"
              >
                Haan, Delete Karein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

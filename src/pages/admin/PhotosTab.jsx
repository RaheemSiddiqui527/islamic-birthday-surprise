import React, { useState, useEffect, useRef } from 'react';
import {
  getPhotos,
  uploadPhotos,
  updatePhoto,
  replacePhoto,
  reorderPhotos,
  deletePhoto
} from '../../api';
import { getMediaUrl } from '../../utils/media';
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  Search,
  X,
  AlertTriangle,
  Check,
  FileImage,
  Calendar,
  CloudUpload,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCw
} from 'lucide-react';

export default function PhotosTab({ showToast }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState('');

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null); // photo object
  const [showReplaceModal, setShowReplaceModal] = useState(null); // photo object
  const [showDeleteModal, setShowDeleteModal] = useState(null); // photo object
  const [previewPhoto, setPreviewPhoto] = useState(null); // photo object

  // Upload Queue state for multi-file batches & progress
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [uploadIsCover, setUploadIsCover] = useState(false);
  const [uploadIsPublished, setUploadIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentBatchText, setCurrentBatchText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [batchSize, setBatchSize] = useState(5); // 5-8 photos per batch for maximum network stability

  // Replace Form state
  const [replaceFile, setReplaceFile] = useState(null);
  const [replacePreview, setReplacePreview] = useState(null);
  const [replacing, setReplacing] = useState(false);
  const [replaceDragActive, setReplaceDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, [searchTerm, filterPublished]);

  async function loadPhotos() {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterPublished !== '') params.published = filterPublished;

      const res = await getPhotos(params);
      if (res.data.success) {
        setPhotos(res.data.photos || []);
      }
    } catch (err) {
      showToast('Photos load karne mein masla hua.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Format file size nicely
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Process files selected from file picker or drag & drop
  const processFiles = (fileList) => {
    const rawFiles = Array.from(fileList);
    if (!rawFiles.length) return;

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif', '.jfif'];

    const validNewItems = [];
    const rejectedFiles = [];

    rawFiles.forEach((file, index) => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      const isAllowedExt = allowedExtensions.includes(ext);
      const isAllowedMime =
        file.type.startsWith('image/') ||
        file.type === 'application/octet-stream' ||
        ['image/heic', 'image/heif'].includes(file.type);

      if (!isAllowedExt && !isAllowedMime) {
        rejectedFiles.push(file.name);
        return;
      }

      // Check duplicate in current queue
      const alreadyInQueue = uploadQueue.some((item) => item.name === file.name && item.size === file.size);
      if (alreadyInQueue) return;

      let preview = null;
      try {
        // Most browsers can generate object URLs for jpg, png, webp, gif
        // HEIC might not render natively in <img> on some desktop browsers, but object URL is still valid
        preview = URL.createObjectURL(file);
      } catch (e) {
        preview = null;
      }

      validNewItems.push({
        id: `photo_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        preview,
        status: 'pending', // 'pending' | 'uploading' | 'saved' | 'failed'
        progress: 0,
        error: null,
        savedPhoto: null
      });
    });

    if (rejectedFiles.length > 0) {
      showToast(
        `${rejectedFiles.length} file(s) ghair-tasdeeq shuda format ki wajah se reject huin. (Allowed: JPG, PNG, WebP, HEIC, GIF)`,
        'error'
      );
    }

    if (validNewItems.length > 0) {
      setUploadQueue((prev) => [...prev, ...validNewItems]);
      showToast(`${validNewItems.length} tasveer(ein) upload queue mein shamil kardi gayin.`, 'success');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    // reset input so same file can be selected again if needed
    e.target.value = '';
  };

  // Drag and Drop handlers for upload
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
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Remove a photo from upload queue
  const removeFromQueue = (id) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear already-saved photos from upload queue
  const clearCompleted = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status !== 'saved'));
  };

  // Batch Upload Runner (Supports 5-10 photos per request, avoids network overload)
  const executeBatchUpload = async (onlyFailed = false) => {
    const queueToProcess = uploadQueue.filter((item) =>
      onlyFailed ? item.status === 'failed' : item.status === 'pending' || item.status === 'failed'
    );

    if (queueToProcess.length === 0) {
      showToast('Upload karne ke liye koi pending ya failed tasveer nahi hai.', 'error');
      return;
    }

    setUploading(true);

    const totalToProcess = queueToProcess.length;
    let totalProcessedCount = 0;
    let successfullySavedCount = 0;
    let failedCount = 0;

    // Reset status of items to be uploaded to 'pending'
    setUploadQueue((prev) =>
      prev.map((item) =>
        queueToProcess.some((q) => q.id === item.id)
          ? { ...item, status: 'pending', error: null, progress: 0 }
          : item
      )
    );

    // Split into batches
    const chunks = [];
    for (let i = 0; i < queueToProcess.length; i += batchSize) {
      chunks.push(queueToProcess.slice(i, i + batchSize));
    }

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const currentChunk = chunks[chunkIndex];
      const chunkIds = currentChunk.map((c) => c.id);

      setCurrentBatchText(
        `Batch ${chunkIndex + 1}/${chunks.length} (${currentChunk.length} photos)...`
      );

      // Mark current chunk items as uploading
      setUploadQueue((prev) =>
        prev.map((item) => (chunkIds.includes(item.id) ? { ...item, status: 'uploading', progress: 15 } : item))
      );

      const formData = new FormData();
      currentChunk.forEach((item) => {
        formData.append('photos', item.file);
      });
      formData.append('caption', uploadCaption);
      formData.append('description', uploadDescription);
      formData.append('photoDate', uploadDate);
      formData.append('isCover', uploadIsCover && chunkIndex === 0);
      formData.append('isPublished', uploadIsPublished);

      try {
        const res = await uploadPhotos(formData, (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 90) / progressEvent.total);
            setUploadQueue((prev) =>
              prev.map((item) => (chunkIds.includes(item.id) ? { ...item, progress: percent } : item))
            );
          }
        });

        const createdPhotos = res.data.photos || [];
        const failedPhotos = res.data.failed || [];

        setUploadQueue((prev) =>
          prev.map((item) => {
            if (!chunkIds.includes(item.id)) return item;

            // Check if this item is in failed list
            const failureInfo = failedPhotos.find((f) => f.originalName === item.name);
            if (failureInfo) {
              failedCount++;
              return {
                ...item,
                status: 'failed',
                progress: 0,
                error: failureInfo.error || 'Server processing error'
              };
            }

            // Otherwise marked as saved
            const savedMatch = createdPhotos.find((p) => p.originalName === item.name);
            successfullySavedCount++;
            return {
              ...item,
              status: 'saved',
              progress: 100,
              savedPhoto: savedMatch || null,
              error: null
            };
          })
        );

        totalProcessedCount += currentChunk.length;
        setOverallProgress(Math.round((totalProcessedCount / totalToProcess) * 100));

        // Refresh gallery in background after each batch
        loadPhotos();
      } catch (batchErr) {
        console.error('Batch upload error:', batchErr);
        const errMsg = batchErr.response?.data?.error || batchErr.message || 'Batch network error';

        setUploadQueue((prev) =>
          prev.map((item) =>
            chunkIds.includes(item.id)
              ? { ...item, status: 'failed', progress: 0, error: errMsg }
              : item
          )
        );

        failedCount += currentChunk.length;
        totalProcessedCount += currentChunk.length;
        setOverallProgress(Math.round((totalProcessedCount / totalToProcess) * 100));
      }
    }

    setUploading(false);
    setCurrentBatchText('');

    if (failedCount === 0) {
      showToast(`Mubarak! Tamam ${successfullySavedCount} tasweerein ba-kamyabi save ho gayin! 📸`, 'success');
      loadPhotos();
    } else {
      showToast(
        `${successfullySavedCount} tasweerein save huin, jabke ${failedCount} mein masla aya. 'Retry Failed' par click karein.`,
        'error'
      );
      loadPhotos();
    }
  };

  const resetUploadForm = () => {
    setUploadQueue([]);
    setUploadCaption('');
    setUploadDescription('');
    setUploadDate('');
    setUploadIsCover(false);
    setUploadIsPublished(true);
    setOverallProgress(0);
    setCurrentBatchText('');
    setDragActive(false);
  };

  // Handle Edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!showEditModal) return;

    try {
      const res = await updatePhoto(showEditModal._id, {
        caption: showEditModal.caption,
        description: showEditModal.description,
        photoDate: showEditModal.photoDate,
        isCover: showEditModal.isCover,
        isPublished: showEditModal.isPublished
      });

      if (res.data.success) {
        showToast('Tasveer ki maloomat update ho gayin!', 'success');
        setShowEditModal(null);
        loadPhotos();
      }
    } catch (err) {
      showToast('Update error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  // Handle Replace File select & drag
  const handleReplaceFileSelect = (file) => {
    if (!file) return;
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext) && !file.type.startsWith('image/')) {
      showToast('Sirf JPG, PNG, WebP, HEIC ya GIF image muntakhab karein.', 'error');
      return;
    }
    setReplaceFile(file);
    try {
      setReplacePreview(URL.createObjectURL(file));
    } catch (e) {
      setReplacePreview(null);
    }
  };

  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!showReplaceModal || !replaceFile) {
      showToast('Nayi tasveer file muntakhab karein.', 'error');
      return;
    }

    try {
      setReplacing(true);
      const formData = new FormData();
      formData.append('photo', replaceFile);

      const res = await replacePhoto(showReplaceModal._id, formData);
      if (res.data.success) {
        showToast('Tasveer ba-kamyabi tabdeel ho gayi!', 'success');
        setShowReplaceModal(null);
        setReplaceFile(null);
        setReplacePreview(null);
        loadPhotos();
      }
    } catch (err) {
      showToast('Replacement error: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setReplacing(false);
    }
  };

  // Handle Reorder Up / Down
  const movePhoto = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const updated = [...photos];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setPhotos(updated);

    try {
      const orderedIds = updated.map((p) => p._id);
      await reorderPhotos(orderedIds);
      showToast('Tasweeron ki tarteeb mehfooz ho gayi.', 'success');
    } catch (err) {
      showToast('Tarteeb save nahi ho saki.', 'error');
      loadPhotos();
    }
  };

  // Toggle publish quickly
  const togglePublish = async (photo) => {
    try {
      const res = await updatePhoto(photo._id, { isPublished: !photo.isPublished });
      if (res.data.success) {
        showToast(
          `Tasveer ${!photo.isPublished ? 'shaya (published)' : 'makhfi (hidden)'} kardi gayi.`,
          'success'
        );
        loadPhotos();
      }
    } catch (err) {
      showToast('Status tabdeel nahi ho saka.', 'error');
    }
  };

  // Set as Cover quickly
  const makeCover = async (photo) => {
    try {
      const res = await updatePhoto(photo._id, { isCover: true });
      if (res.data.success) {
        showToast('Khas Cover photo set kardi gayi! ⭐', 'success');
        loadPhotos();
      }
    } catch (err) {
      showToast('Cover set nahi ho saka.', 'error');
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!showDeleteModal) return;

    try {
      const res = await deletePhoto(showDeleteModal._id);
      if (res.data.success) {
        showToast('Tasveer aur uski files delete kardi gayin.', 'success');
        setShowDeleteModal(null);
        loadPhotos();
      }
    } catch (err) {
      showToast('Deletion error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  // Queue Statistics
  const savedCount = uploadQueue.filter((i) => i.status === 'saved').length;
  const failedCount = uploadQueue.filter((i) => i.status === 'failed').length;
  const pendingCount = uploadQueue.filter((i) => i.status === 'pending').length;
  const uploadingCount = uploadQueue.filter((i) => i.status === 'uploading').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Photo Gallery Management
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Batch-upload (5–10 photos/req), HEIC/iPhone support, retry failed, reorder, cover aur safe delete.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-full font-serif text-xs font-bold tracking-wider uppercase text-[#022c22] gold-gradient-bg shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(251,224,142,0.6)] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photos (Batch / Queue)</span>
        </button>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="islamic-card p-4 border border-[#d4af37]/25 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#d4af37]/60 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Caption ya description talash karein..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Publication Filter & View Toggles */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37] cursor-pointer"
          >
            <option value="">Tamam Tasweerein ({photos.length})</option>
            <option value="true">Sirf Published</option>
            <option value="false">Sirf Unpublished</option>
          </select>

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
      </div>

      {/* Photos Content */}
      {loading ? (
        /* Skeleton Loading State */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-[#d4af37]/20 bg-[#064e3b]/20 overflow-hidden">
              <div className="aspect-[4/3] skeleton-shimmer"></div>
              <div className="p-4 space-y-2.5">
                <div className="w-3/4 h-4 skeleton-shimmer rounded"></div>
                <div className="w-1/2 h-3 skeleton-shimmer rounded"></div>
                <div className="w-full h-8 skeleton-shimmer rounded-xl mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        /* Empty State */
        <div className="islamic-card p-12 text-center border border-[#d4af37]/25 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#064e3b]/50 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#fbe08e]">
            Koi Tasveer Dastiyab Nahi Hai
          </h3>
          <p className="text-xs text-[#fdfbf7]/60 font-light max-w-md mx-auto leading-relaxed">
            Bhai jaan ke liye pyari tasweerein upload karne ke liye button par click karein ya apne mobile se multiple photos select karein.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] cursor-pointer shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nayi Tasveer Upload Karein</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ==================== GRID VIEW ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo._id}
              className="islamic-card border border-[#d4af37]/30 overflow-hidden flex flex-col justify-between group hover:border-[#d4af37]/60"
            >
              <div className="relative aspect-[4/3] bg-[#022c22] overflow-hidden">
                <img
                  src={getMediaUrl(photo.thumbnailPath || photo.filePath)}
                  alt={photo.caption || 'Memory'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreviewPhoto(photo)}
                />

                {/* Cover Badge */}
                {photo.isCover && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold uppercase bg-[#d4af37] text-[#022c22] flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-[#022c22]" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Published / Hidden Badge */}
                <div
                  className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-semibold uppercase ${
                    photo.isPublished
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}
                >
                  {photo.isPublished ? 'Published' : 'Hidden'}
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#fbe08e] truncate mb-1">
                    {photo.caption || photo.originalName}
                  </h4>
                  {photo.description && (
                    <p className="text-xs text-[#fdfbf7]/70 line-clamp-2 font-light mb-2">
                      {photo.description}
                    </p>
                  )}
                  {photo.photoDate && (
                    <p className="text-[11px] font-cinzel text-[#d4af37]/70 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{photo.photoDate}</span>
                    </p>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePhoto(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePhoto(index, 1)}
                      disabled={index === photos.length - 1}
                      className="p-1 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => makeCover(photo)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        photo.isCover
                          ? 'text-[#d4af37]'
                          : 'text-[#fdfbf7]/40 hover:text-[#fbe08e]'
                      }`}
                      title="Make Cover Photo"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => togglePublish(photo)}
                      className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] transition-colors cursor-pointer"
                      title={photo.isPublished ? 'Hide from public' : 'Publish publicly'}
                    >
                      {photo.isPublished ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </button>

                    <button
                      onClick={() => setShowReplaceModal(photo)}
                      className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] transition-colors cursor-pointer"
                      title="Replace Image File"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setShowEditModal(photo)}
                      className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] transition-colors cursor-pointer"
                      title="Edit Caption & Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(photo)}
                      className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ==================== LIST / TABLE VIEW ==================== */
        <div className="islamic-card border border-[#d4af37]/30 overflow-x-auto rounded-2xl">
          <table className="w-full text-left saas-table">
            <thead>
              <tr>
                <th className="w-16">Tarteeb</th>
                <th className="w-20">Preview</th>
                <th>Caption & Name</th>
                <th>Tareeq (Date)</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {photos.map((photo, index) => (
                <tr key={photo._id}>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => movePhoto(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-[#d4af37] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => movePhoto(index, 1)}
                        disabled={index === photos.length - 1}
                        className="p-1 text-[#d4af37] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td>
                    <img
                      src={getMediaUrl(photo.thumbnailPath || photo.filePath)}
                      alt={photo.caption}
                      className="w-12 h-10 object-cover rounded-lg border border-[#d4af37]/30 cursor-pointer"
                      onClick={() => setPreviewPhoto(photo)}
                    />
                  </td>
                  <td className="font-serif font-medium text-[#fbe08e]">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-xs">{photo.caption || photo.originalName}</span>
                      {photo.isCover && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#d4af37] text-[#022c22] font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-[#fdfbf7]/60 font-cinzel text-xs">
                    {photo.photoDate || '—'}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-cinzel font-semibold ${
                        photo.isPublished ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'
                      }`}
                    >
                      {photo.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => makeCover(photo)}
                        className={`p-1.5 rounded cursor-pointer ${
                          photo.isCover ? 'text-[#d4af37]' : 'text-[#fdfbf7]/40 hover:text-[#fbe08e]'
                        }`}
                        title="Make Cover"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => togglePublish(photo)}
                        className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] cursor-pointer"
                        title={photo.isPublished ? 'Hide' : 'Publish'}
                      >
                        {photo.isPublished ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setShowReplaceModal(photo)}
                        className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] cursor-pointer"
                        title="Replace Image"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(photo)}
                        className="p-1.5 rounded text-[#fdfbf7]/60 hover:text-[#fbe08e] cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(photo)}
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

      {/* ==================== 1. MULTI-PHOTO BATCH UPLOAD MODAL ==================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="islamic-card border border-[#d4af37]/40 max-w-2xl w-full max-h-[94vh] flex flex-col my-auto shadow-2xl rounded-2xl overflow-hidden">
            {/* Modal Sticky Header */}
            <div className="p-4 sm:p-6 border-b border-[#d4af37]/20 flex items-center justify-between bg-[#064e3b]/40">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#d4af37]" />
                  <span>Multi-Photo Batch Upload (Mobile & Desktop)</span>
                </h3>
                <p className="text-[11px] text-[#fdfbf7]/70 font-light mt-0.5">
                  HEIC (iPhone), JPG, PNG, WebP supported • Safe batches of {batchSize} photos
                </p>
              </div>

              <button
                onClick={() => {
                  if (uploading && !window.confirm('Upload jari hai. Kya aap band karna chahte hain?')) {
                    return;
                  }
                  setShowUploadModal(false);
                }}
                className="text-[#fdfbf7]/50 hover:text-[#fbe08e] cursor-pointer p-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Overall Progress Bar (Visible during / after upload) */}
              {(uploading || savedCount > 0 || failedCount > 0) && (
                <div className="p-3.5 rounded-xl bg-[#022c22]/90 border border-[#d4af37]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#fbe08e] flex items-center gap-1.5">
                      {uploading ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" />
                          <span>{currentBatchText || 'Uploading in batches...'}</span>
                        </>
                      ) : (
                        <span>Upload Summary</span>
                      )}
                    </span>
                    <span className="font-mono text-[11px] text-[#fdfbf7]/80">
                      {savedCount} Saved • {failedCount} Failed • {pendingCount} Pending
                    </span>
                  </div>

                  <div className="w-full bg-[#064e3b] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c5a059] to-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${
                          uploadQueue.length > 0
                            ? Math.round((savedCount / uploadQueue.length) * 100)
                            : 0
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 sm:p-7 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-[#d4af37] bg-[#064e3b]/80 scale-[1.01] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'border-[#d4af37]/40 hover:border-[#d4af37] bg-[#064e3b]/30'
                  }`}
                >
                  <CloudUpload
                    className={`w-10 h-10 mx-auto mb-2 transition-transform ${
                      dragActive ? 'scale-110 text-[#fbe08e]' : 'text-[#d4af37]'
                    }`}
                  />
                  <p className="text-xs sm:text-sm text-[#fdfbf7] font-semibold">
                    {dragActive ? 'Files yahan chhorein (Drop now)' : 'Mobile Gallery se Tasweerein Select Karein'}
                  </p>
                  <p className="text-[11px] text-[#fdfbf7]/60 mt-1 font-light">
                    Click karein ya drag & drop karein • Tamam 66+ photos aik sath select kar sakte hain
                  </p>
                  <p className="text-[10px] text-[#d4af37]/80 font-cinzel mt-1.5 uppercase">
                    iPhone HEIC, JPG, PNG, WebP • Auto Sharp Conversion
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Upload Queue List (Individual status for each photo) */}
              {uploadQueue.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#d4af37]/20 pb-2">
                    <span className="font-serif font-bold text-[#fbe08e]">
                      Selected Queue ({uploadQueue.length} photos)
                    </span>
                    <div className="flex items-center gap-2">
                      {savedCount > 0 && (
                        <button
                          type="button"
                          onClick={clearCompleted}
                          className="text-[11px] text-[#d4af37] hover:underline cursor-pointer"
                        >
                          Clear Saved ({savedCount})
                        </button>
                      )}
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() => setUploadQueue([])}
                          className="text-[11px] text-red-400 hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-2 pr-1">
                    {uploadQueue.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                          item.status === 'saved'
                            ? 'bg-emerald-950/40 border-emerald-500/40'
                            : item.status === 'failed'
                            ? 'bg-red-950/40 border-red-500/50'
                            : item.status === 'uploading'
                            ? 'bg-[#064e3b]/70 border-[#d4af37]/60 animate-pulse'
                            : 'bg-[#022c22]/80 border-[#d4af37]/20'
                        }`}
                      >
                        {/* Thumbnail / File Icon */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.preview ? (
                            <img
                              src={item.preview}
                              alt="thumb"
                              className="w-10 h-10 rounded-lg object-cover border border-[#d4af37]/30 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#064e3b] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                              <FileImage className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 truncate">
                            <p className="font-medium text-[#fdfbf7] truncate max-w-[180px] sm:max-w-xs">
                              {index + 1}. {item.name}
                            </p>
                            <p className="text-[10px] text-[#fdfbf7]/50 font-cinzel">
                              {formatFileSize(item.size)}
                              {item.error && (
                                <span className="text-red-400 font-sans ml-1 truncate block">
                                  ⚠️ {item.error}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === 'saved' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Saved</span>
                            </span>
                          )}

                          {item.status === 'uploading' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 animate-spin text-cyan-400" />
                              <span>{item.progress > 0 ? `${item.progress}%` : 'Uploading...'}</span>
                            </span>
                          )}

                          {item.status === 'failed' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-400" />
                              <span>Failed</span>
                            </span>
                          )}

                          {item.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel text-[#fdfbf7]/60 bg-[#064e3b]/50 border border-[#d4af37]/20 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}

                          {/* Remove button for pending files */}
                          {!uploading && item.status !== 'saved' && (
                            <button
                              type="button"
                              onClick={() => removeFromQueue(item.id)}
                              className="p-1 rounded text-[#fdfbf7]/40 hover:text-red-400 cursor-pointer"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Form (Applies to uploaded batch) */}
              <div className="pt-2 border-t border-[#d4af37]/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-1">
                      Caption / Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="e.g. Kareem Bhai ki pyari yaadein"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-1">
                      Tareeq / Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      placeholder="e.g. 19 October 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-1">
                    Description / Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="In photos ke mutalliq koi pyari baat..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Batch Size & Options */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                      <input
                        type="checkbox"
                        checked={uploadIsPublished}
                        onChange={(e) => setUploadIsPublished(e.target.checked)}
                        className="accent-[#d4af37]"
                      />
                      <span>Shaya (Publish Immediately)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                      <input
                        type="checkbox"
                        checked={uploadIsCover}
                        onChange={(e) => setUploadIsCover(e.target.checked)}
                        className="accent-[#d4af37]"
                      />
                      <span>Pehli Photo Cover Banayein</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#d4af37]">
                    <span className="font-cinzel text-[10px]">Batch Size:</span>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      disabled={uploading}
                      className="px-2 py-1 rounded-lg bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7]"
                    >
                      <option value={3}>3 photos</option>
                      <option value={5}>5 photos (Recommended)</option>
                      <option value={8}>8 photos</option>
                      <option value={10}>10 photos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-[#d4af37]/20 bg-[#064e3b]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#fdfbf7]/70">
                {uploadQueue.length > 0 ? (
                  <span>
                    Queue: <strong className="text-[#fbe08e]">{uploadQueue.length}</strong> photos
                    {savedCount > 0 && ` (${savedCount} saved)`}
                  </span>
                ) : (
                  <span>Photos select karein</span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (uploading && !window.confirm('Upload jari hai. Kya aap band karna chahte hain?')) {
                      return;
                    }
                    setShowUploadModal(false);
                  }}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 hover:text-white cursor-pointer"
                >
                  {savedCount > 0 && pendingCount === 0 && failedCount === 0 ? 'Done' : 'Mansookh (Cancel)'}
                </button>

                {/* Retry Failed button */}
                {failedCount > 0 && !uploading && (
                  <button
                    type="button"
                    onClick={() => executeBatchUpload(true)}
                    className="px-4 py-2 rounded-full border border-red-400 bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Retry Failed ({failedCount})</span>
                  </button>
                )}

                {/* Start Upload Button */}
                <button
                  type="button"
                  disabled={uploading || (pendingCount === 0 && failedCount === 0)}
                  onClick={() => executeBatchUpload(false)}
                  className="px-6 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer shadow-md hover:scale-105 transition-transform flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#022c22]" />
                      <span>Uploading ({overallProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        Upload {pendingCount > 0 ? `${pendingCount} Photos` : 'Queue'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. EDIT MODAL ==================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#d4af37]" />
                <span>Edit Photo Details</span>
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-[#fdfbf7]/50 hover:text-[#fbe08e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#064e3b]/30 border border-[#d4af37]/20">
                <img
                  src={getMediaUrl(showEditModal.thumbnailPath || showEditModal.filePath)}
                  alt={showEditModal.caption}
                  className="w-14 h-14 object-cover rounded-lg border border-[#d4af37]/40"
                />
                <div className="text-xs text-[#fdfbf7]/70 truncate">
                  <p className="font-serif font-bold text-[#fbe08e] truncate">
                    {showEditModal.originalName || 'Image'}
                  </p>
                  <p className="font-cinzel text-[10px]">
                    Size: {formatFileSize(showEditModal.fileSize)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Caption</label>
                <input
                  type="text"
                  value={showEditModal.caption || ''}
                  onChange={(e) => setShowEditModal({ ...showEditModal, caption: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={showEditModal.description || ''}
                  onChange={(e) => setShowEditModal({ ...showEditModal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Tareeq (Date)</label>
                <input
                  type="text"
                  value={showEditModal.photoDate || ''}
                  onChange={(e) => setShowEditModal({ ...showEditModal, photoDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                  <input
                    type="checkbox"
                    checked={!!showEditModal.isCover}
                    onChange={(e) => setShowEditModal({ ...showEditModal, isCover: e.target.checked })}
                    className="accent-[#d4af37]"
                  />
                  <span>Cover Photo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                  <input
                    type="checkbox"
                    checked={!!showEditModal.isPublished}
                    onChange={(e) => setShowEditModal({ ...showEditModal, isPublished: e.target.checked })}
                    className="accent-[#d4af37]"
                  />
                  <span>Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 3. REPLACE MODAL WITH DRAG & DROP ==================== */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#d4af37]" />
                <span>Replace Image Binary File</span>
              </h3>
              <button
                onClick={() => {
                  setShowReplaceModal(null);
                  setReplaceFile(null);
                  setReplacePreview(null);
                }}
                className="text-[#fdfbf7]/50 hover:text-[#fbe08e] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceSubmit} className="space-y-4">
              <p className="text-xs text-[#fdfbf7]/70">
                Maujooda tasveer ki jagah nayi file upload karein. Metadata mehfooz rahegi jabke purani file delete ho jayegi.
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setReplaceDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setReplaceDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setReplaceDragActive(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleReplaceFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => replaceInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  replaceDragActive
                    ? 'border-[#d4af37] bg-[#064e3b]/80'
                    : 'border-[#d4af37]/40 hover:border-[#d4af37] bg-[#064e3b]/30'
                }`}
              >
                <Upload className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                <p className="text-xs text-[#fdfbf7] font-medium">
                  {replaceFile ? replaceFile.name : 'Click ya Drag & Drop karein'}
                </p>
                <p className="text-[11px] text-[#fdfbf7]/50 mt-1 font-light">
                  JPG, PNG, WebP, HEIC • Max 25MB
                </p>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleReplaceFileSelect(e.target.files?.[0])}
                  className="hidden"
                />
              </div>

              {/* Comparison Preview */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-[10px] font-cinzel text-[#d4af37] mb-1">Maujooda (Current)</p>
                  <img
                    src={getMediaUrl(showReplaceModal.thumbnailPath || showReplaceModal.filePath)}
                    alt="Current"
                    className="w-full h-24 object-cover rounded-xl border border-[#d4af37]/30"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-cinzel text-emerald-400 mb-1">Nayi (New Replacement)</p>
                  {replacePreview ? (
                    <img
                      src={replacePreview}
                      alt="New Replacement"
                      className="w-full h-24 object-cover rounded-xl border border-emerald-500/50"
                    />
                  ) : (
                    <div className="w-full h-24 rounded-xl border border-dashed border-[#d4af37]/30 flex items-center justify-center text-[11px] text-[#fdfbf7]/40">
                      File muntakhab karein
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowReplaceModal(null);
                    setReplaceFile(null);
                    setReplacePreview(null);
                  }}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replacing || !replaceFile}
                  className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer"
                >
                  {replacing ? 'Replacing...' : 'Confirm Replace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 4. DELETE CONFIRMATION DIALOG ==================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 border border-red-500/40 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-red-200">
                Tasveer Delete Confirm Karein
              </h4>
              <p className="text-xs text-[#fdfbf7]/70 mt-1">
                Kya aap waqayi is tasveer ko delete karna chahte hain? Database record aur storage files permanently hazf ho jayengi.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/20 flex items-center gap-3 text-left">
              <img
                src={getMediaUrl(showDeleteModal.thumbnailPath || showDeleteModal.filePath)}
                alt={showDeleteModal.caption}
                className="w-12 h-12 rounded-lg object-cover border border-[#d4af37]/30 shrink-0"
              />
              <div className="truncate">
                <p className="font-serif font-semibold text-xs text-[#fbe08e] truncate">
                  {showDeleteModal.caption || showDeleteModal.originalName}
                </p>
                <p className="text-[10px] text-[#fdfbf7]/50 font-cinzel">
                  {showDeleteModal.isCover ? '⭐ Active Cover Photo' : 'Gallery Item'}
                </p>
              </div>
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

      {/* ==================== 5. FULL PREVIEW MODAL ==================== */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getMediaUrl(previewPhoto.filePath)}
              alt={previewPhoto.caption || 'Preview'}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-[#d4af37]/30"
            />
            {previewPhoto.caption && (
              <p className="mt-3 font-serif text-sm font-semibold text-[#fbe08e] text-center">
                {previewPhoto.caption}
              </p>
            )}
            {previewPhoto.description && (
              <p className="text-xs text-[#fdfbf7]/70 font-light text-center max-w-lg mt-1">
                {previewPhoto.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api';
import { getMediaUrl } from '../../utils/media';
import {
  Camera,
  Heart,
  BookOpen,
  Music,
  Film,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowRight,
  Database,
  Cloud,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function DashboardTab({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      if (res.data.success) {
        setStats(res.data.stats);
      } else {
        setError('Stats data format ghair-mutawaqqi mila.');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
      setError('Aadad-o-shumar load karne mein masla pesh aya.');
    } finally {
      setLoading(false);
    }
  }

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="h-36 rounded-2xl bg-[#064e3b]/30 border border-[#d4af37]/20 p-6 flex flex-col justify-center gap-3">
          <div className="w-48 h-4 skeleton-shimmer rounded"></div>
          <div className="w-80 h-7 skeleton-shimmer rounded"></div>
          <div className="w-96 h-3 skeleton-shimmer rounded"></div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#064e3b]/30 border border-[#d4af37]/20 p-5 flex items-center justify-between">
              <div className="space-y-2">
                <div className="w-20 h-3 skeleton-shimmer rounded"></div>
                <div className="w-12 h-6 skeleton-shimmer rounded"></div>
                <div className="w-24 h-2.5 skeleton-shimmer rounded"></div>
              </div>
              <div className="w-12 h-12 rounded-xl skeleton-shimmer"></div>
            </div>
          ))}
        </div>

        {/* Big Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-[#064e3b]/30 border border-[#d4af37]/20 p-6 lg:col-span-1">
            <div className="w-32 h-4 skeleton-shimmer rounded mb-4"></div>
            <div className="w-full h-44 rounded-xl skeleton-shimmer"></div>
          </div>
          <div className="h-64 rounded-2xl bg-[#064e3b]/30 border border-[#d4af37]/20 p-6 lg:col-span-2 space-y-4">
            <div className="w-48 h-4 skeleton-shimmer rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 rounded-xl skeleton-shimmer"></div>
              <div className="h-20 rounded-xl skeleton-shimmer"></div>
              <div className="h-20 rounded-xl skeleton-shimmer"></div>
              <div className="h-20 rounded-xl skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State with Retry
  if (error || !stats) {
    return (
      <div className="islamic-card p-10 text-center border border-red-500/30 max-w-lg mx-auto my-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="font-serif text-lg font-bold text-red-200">Stats Load Nahi Ho Sake</h3>
        <p className="text-xs text-[#fdfbf7]/70 font-light">{error || 'Server se rabta toot gaya.'}</p>
        <button
          onClick={loadStats}
          className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-transform"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Dobara Koshish Karein (Retry)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-cinzel text-[#d4af37] uppercase tracking-widest block">
              Bhai Jaan Surprise • Admin Control Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-emerald-300 font-mono">Live Atlas Database</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fbe08e] mb-2 tracking-tight">
            {stats.settings?.mainHeading || 'JANAMDIN MUBARAK, BHAI JAAN ❤️'}
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/75 font-light max-w-2xl leading-relaxed">
            Aap yahan se photos, authentic duas, dil se likha birthday letter, vocal-only nasheed audio, memories aur site configuration ko MongoDB database mein ba-aasani manage kar sakte hain.
          </p>
        </div>
      </div>

      {/* Top 4 Real Metric Cards from MongoDB Atlas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Photos Card */}
        <div className="islamic-card p-5 border border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-cinzel text-[#d4af37] uppercase tracking-wider">Tasweerein (Photos)</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfbf7] mt-1">
              {stats.photos?.total ?? 0}
            </h3>
            <p className="text-[11px] text-[#fdfbf7]/60 mt-1">
              <span className="text-emerald-400 font-medium">{stats.photos?.published ?? 0} Shaya</span> • {stats.photos?.unpublished ?? 0} Makhfi
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#fbe08e] shadow-sm">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        {/* Duas Card */}
        <div className="islamic-card p-5 border border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-cinzel text-[#d4af37] uppercase tracking-wider">Khas Duaen (Duas)</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfbf7] mt-1">
              {stats.duas?.total ?? 0}
            </h3>
            <p className="text-[11px] text-[#fdfbf7]/60 mt-1">
              <span className="text-[#fbe08e] font-medium">{stats.duas?.totalAameen ?? 0}</span> Kul Aameen Darj
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#fbe08e] shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Memories Card */}
        <div className="islamic-card p-5 border border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-cinzel text-[#d4af37] uppercase tracking-wider">Yaadgaar Lamhaat</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfbf7] mt-1">
              {stats.memories?.total ?? 0}
            </h3>
            <p className="text-[11px] text-[#fdfbf7]/60 mt-1">
              <span className="text-emerald-400 font-medium">{stats.memories?.published ?? 0}</span> Published Milestones
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#fbe08e] shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Active Audio Status */}
        <div className="islamic-card p-5 border border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-cinzel text-[#d4af37] uppercase tracking-wider">Nasheed Audio</p>
            <h3 className="text-sm font-serif font-bold text-[#fbe08e] mt-1 truncate max-w-[140px]">
              {stats.activeAudio?.title || 'No Audio Active'}
            </h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 shrink-0" />
              <span>{stats.activeAudio ? 'Active & Ready' : 'Empty State'}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#fbe08e] shadow-sm">
            <Music className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Featured Cover Photo & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cover Photo Status */}
        <div className="islamic-card p-6 border border-[#d4af37]/30 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-base font-bold text-[#fbe08e] mb-4 flex items-center justify-between">
              <span>Muntakhab Cover Photo</span>
              <button
                onClick={() => onNavigate('photos')}
                className="text-xs font-cinzel text-[#d4af37] hover:underline cursor-pointer"
              >
                Gallery
              </button>
            </h4>

            {stats.coverPhoto ? (
              <div className="rounded-xl overflow-hidden border border-[#d4af37]/30 bg-[#064e3b]/40">
                <img
                  src={getMediaUrl(stats.coverPhoto.thumbnailPath || stats.coverPhoto.filePath)}
                  alt="Cover"
                  className="w-full h-44 object-cover"
                />
                <div className="p-3">
                  <p className="text-xs font-serif font-semibold text-[#fdfbf7] truncate">
                    {stats.coverPhoto.caption || 'Cover Photo'}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-cinzel mt-0.5">
                    Active on Public Surprise Page
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-44 rounded-xl border border-dashed border-[#d4af37]/30 flex flex-col items-center justify-center text-center p-4 text-[#fdfbf7]/50">
                <Camera className="w-8 h-8 text-[#d4af37]/40 mb-2" />
                <p className="text-xs font-serif">Koi cover photo muntakhab nahi hai.</p>
                <button
                  onClick={() => onNavigate('photos')}
                  className="mt-3 text-xs text-[#fbe08e] underline cursor-pointer"
                >
                  Tasveer Upload Karein
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs text-[#fdfbf7]/60">
            <span>Cover Photo Display</span>
            <span className="text-[#fbe08e] font-serif font-semibold">Hero Section</span>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="islamic-card p-6 border border-[#d4af37]/30 lg:col-span-2 space-y-4">
          <h4 className="font-serif text-base font-bold text-[#fbe08e]">
            Fauri Kamo Ki Dastras (Quick Actions)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('photos')}
              className="p-4 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/25 hover:border-[#d4af37] text-left transition-all hover:bg-[#064e3b]/80 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <p className="font-serif text-sm font-semibold text-[#fbe08e]">Nayi Tasweerein Upload Karein</p>
                <p className="text-xs text-[#fdfbf7]/60 mt-0.5">JPG, PNG, WebP tasweerein shamil karein</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('letter')}
              className="p-4 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/25 hover:border-[#d4af37] text-left transition-all hover:bg-[#064e3b]/80 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <p className="font-serif text-sm font-semibold text-[#fbe08e]">Birthday Letter Edit Karein</p>
                <p className="text-xs text-[#fdfbf7]/60 mt-0.5">Dil se likha paigham tabdeel karein</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('duas')}
              className="p-4 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/25 hover:border-[#d4af37] text-left transition-all hover:bg-[#064e3b]/80 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <p className="font-serif text-sm font-semibold text-[#fbe08e]">Khas Duaen Manage Karein</p>
                <p className="text-xs text-[#fdfbf7]/60 mt-0.5">Dua cards add, edit ya reorder karein</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('audio')}
              className="p-4 rounded-xl bg-[#064e3b]/50 border border-[#d4af37]/25 hover:border-[#d4af37] text-left transition-all hover:bg-[#064e3b]/80 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <p className="font-serif text-sm font-semibold text-[#fbe08e]">Nasheed Audio Set Karein</p>
                <p className="text-xs text-[#fdfbf7]/60 mt-0.5">Baghair saaz vocal nasheed upload karein</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* System & Architecture Info Card */}
          <div className="pt-4 border-t border-[#d4af37]/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#022c22]/60 border border-[#d4af37]/20">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-medium text-[#fdfbf7]">MongoDB Atlas</p>
                <p className="text-[10px] text-[#fdfbf7]/50">Cloud Cluster Connected</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#022c22]/60 border border-[#d4af37]/20">
              <Cloud className="w-4 h-4 text-[#d4af37] shrink-0" />
              <div>
                <p className="font-medium text-[#fdfbf7]">Media Storage</p>
                <p className="text-[10px] text-[#fdfbf7]/50">Local / Cloudinary Ready</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#022c22]/60 border border-[#d4af37]/20">
              <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-medium text-[#fdfbf7]">Keep-Alive Worker</p>
                <p className="text-[10px] text-[#fdfbf7]/50">5000ms Configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

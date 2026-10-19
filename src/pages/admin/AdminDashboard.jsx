import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Camera,
  BookOpen,
  Mail,
  Sparkles,
  Music,
  Film,
  Palette,
  Eye,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Database,
  CheckCircle,
  User
} from 'lucide-react';

import DashboardTab from './DashboardTab';
import SettingsTab from './SettingsTab';
import PhotosTab from './PhotosTab';
import MemoriesTab from './MemoriesTab';
import LetterTab from './LetterTab';
import DuasTab from './DuasTab';
import AudioTab from './AudioTab';
import VideoTab from './VideoTab';
import ThemeTab from './ThemeTab';
import PreviewTab from './PreviewTab';
import SecurityTab from './SecurityTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Birthday Settings', icon: Settings },
    { id: 'photos', label: 'Photo Gallery', icon: Camera },
    { id: 'memories', label: 'Memories & Captions', icon: BookOpen },
    { id: 'letter', label: 'Birthday Letter', icon: Mail },
    { id: 'duas', label: 'Dua Management', icon: Sparkles },
    { id: 'audio', label: 'Nasheed & Audio', icon: Music },
    { id: 'video', label: 'Video Management', icon: Film },
    { id: 'theme', label: 'Theme & Appearance', icon: Palette },
    { id: 'preview', label: 'Preview Website', icon: Eye },
    { id: 'security', label: 'Security & Account', icon: Shield }
  ];

  const activeItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-[#022c22] text-[#fdfbf7] flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl border shadow-2xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2.5 backdrop-blur-xl ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-500/50'
              : 'bg-[#064e3b]/90 text-[#fbe08e] border-[#d4af37]/60'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 border border-[#d4af37]/40 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#fdfbf7]">Logout Confirm Karein</h4>
              <p className="text-xs text-[#fdfbf7]/70 mt-1">
                Kya aap waqayi admin session band karke logout karna chahte hain?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#d4af37]/30 text-xs text-[#fdfbf7]/80 hover:bg-[#064e3b] cursor-pointer"
              >
                Mansookh (Cancel)
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg cursor-pointer"
              >
                Haan, Logout Karein
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#064e3b]/80 border-b border-[#d4af37]/20 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#d4af37] bg-[#022c22] flex items-center justify-center text-[#d4af37]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-xs text-[#fbe08e] block">Admin Portal</span>
            <span className="text-[9px] font-cinzel text-[#d4af37]/70 uppercase">Bhai Jaan Surprise</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#d4af37] border border-[#d4af37]/30 bg-[#022c22]/50 text-xs flex items-center gap-1"
            title="Public Site"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px]">Site</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#d4af37] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation (Desktop Collapsible & Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#022c22]/95 md:bg-[#022c22]/90 border-r border-[#d4af37]/20 flex flex-col justify-between transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 sm:p-5 border-b border-[#d4af37]/20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-full border border-[#d4af37] bg-[#064e3b] flex items-center justify-center text-[#d4af37] group-hover:scale-105 transition-transform shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 1 12 2z" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <span className="font-serif font-bold text-sm gold-gradient-text block truncate">
                    Admin Portal
                  </span>
                  <span className="text-[10px] font-cinzel text-[#d4af37]/70 uppercase tracking-widest block truncate">
                    Bhai Jaan Surprise
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle Inside Sidebar Header */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-[#d4af37]/70 hover:text-[#fbe08e] hover:bg-[#064e3b]/50 transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full p-2.5 rounded-xl text-xs font-serif font-medium flex items-center transition-all cursor-pointer ${
                    sidebarCollapsed ? 'justify-center' : 'justify-between'
                  } ${
                    isActive
                      ? 'bg-[#d4af37] text-[#022c22] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'text-[#fdfbf7]/75 hover:bg-[#064e3b]/50 hover:text-[#fbe08e]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Status & Bottom Actions */}
        <div className="p-3 border-t border-[#d4af37]/20 bg-[#064e3b]/30">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-serif font-semibold text-[#fbe08e] truncate">
                      {user?.username || 'Admin'}
                    </p>
                    <p className="text-[10px] text-[#fdfbf7]/50 font-cinzel">Super Admin</p>
                  </div>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#d4af37] hover:bg-[#022c22] transition-colors"
                  title="View Public Surprise"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-2 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-950/40 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-950/40 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container Area with Top SaaS Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern SaaS Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#064e3b]/40 border-b border-[#d4af37]/20 backdrop-blur-md sticky top-0 z-30">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg border border-[#d4af37]/25 hover:border-[#d4af37] text-[#d4af37] hover:bg-[#064e3b] transition-all cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-cinzel text-[#d4af37]/70">Admin CMS</span>
              <ChevronRight className="w-3 h-3 text-[#d4af37]/40" />
              <span className="font-serif font-bold text-[#fbe08e]">{activeItem.label}</span>
            </div>
          </div>

          {/* Right Status & Profile Controls */}
          <div className="flex items-center gap-4">
            {/* MongoDB Atlas Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#022c22]/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>MongoDB Atlas Connected</span>
            </div>

            {/* View Live Site Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-[#d4af37]/30 hover:border-[#d4af37] bg-[#022c22]/60 hover:bg-[#064e3b]/50 text-[#fbe08e] text-xs font-serif font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Surprise Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
            </a>

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#d4af37]/20">
              <div className="w-8 h-8 rounded-full border border-[#d4af37]/50 bg-[#064e3b] flex items-center justify-center text-[#d4af37] font-serif font-bold text-xs shadow">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-serif font-semibold text-[#fdfbf7] leading-tight">
                  {user?.username || 'Admin'}
                </p>
                <p className="text-[10px] text-[#d4af37]/70 font-cinzel leading-tight">Super Admin</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-1.5 ml-1 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-950/50 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Admin Work Area */}
        <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardTab onNavigate={setActiveTab} />}
            {activeTab === 'settings' && <SettingsTab showToast={showToast} />}
            {activeTab === 'photos' && <PhotosTab showToast={showToast} />}
            {activeTab === 'memories' && <MemoriesTab showToast={showToast} />}
            {activeTab === 'letter' && <LetterTab showToast={showToast} />}
            {activeTab === 'duas' && <DuasTab showToast={showToast} />}
            {activeTab === 'audio' && <AudioTab showToast={showToast} />}
            {activeTab === 'video' && <VideoTab showToast={showToast} />}
            {activeTab === 'theme' && <ThemeTab showToast={showToast} />}
            {activeTab === 'preview' && <PreviewTab />}
            {activeTab === 'security' && <SecurityTab showToast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  );
}

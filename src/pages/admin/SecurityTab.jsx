import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword, changeUsername } from '../../api';
import { Shield, Lock, User, Key, Check, AlertCircle } from 'lucide-react';

export default function SecurityTab({ showToast }) {
  const { user, refreshUser } = useAuth();

  const [currentUsername, setCurrentUsername] = useState(user?.username || '');
  const [newUsername, setNewUsername] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername || newUsername.trim().length < 3) {
      showToast('Naya username kam az kam 3 characters ka hona zaroori hai.', 'error');
      return;
    }

    try {
      setUpdatingUsername(true);
      const res = await changeUsername(newUsername.trim());
      if (res.data.success) {
        showToast('Username ba-kamyabi tabdeel ho gaya! 🛡️', 'success');
        setCurrentUsername(res.data.username);
        setNewUsername('');
        refreshUser();
      }
    } catch (err) {
      showToast('Username tabdeel nahi ho saka: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Naya password kam az kam 8 characters ka hona zaroori hai.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Naya password aur confirm password aapas mein match nahi karte.', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await changePassword(currentPassword, newPassword);
      if (res.data.success) {
        showToast('Password ba-kamyabi update ho gaya! 🔐', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast('Password tabdeel nahi ho saka: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
          Security and Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
          Admin account ka username, password aur session security manage karein.
        </p>
      </div>

      {/* Account Info Box */}
      <div className="islamic-card p-6 border border-[#d4af37]/35 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-[#d4af37] bg-[#064e3b] flex items-center justify-center text-[#fbe08e]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#fbe08e]">
              {user?.username || currentUsername}
            </h4>
            <p className="text-xs text-[#fdfbf7]/60 font-cinzel">
              Role: {user?.role || 'Administrator'} • Active Session
            </p>
          </div>
        </div>
      </div>

      {/* 1. Change Username Form */}
      <form onSubmit={handleUsernameSubmit} className="islamic-card p-6 sm:p-8 border border-[#d4af37]/30 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
          <User className="w-4 h-4 text-[#d4af37]" />
          <span>Change Admin Username</span>
        </h3>

        <div>
          <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Current Username</label>
          <input
            type="text"
            value={currentUsername}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22]/50 border border-[#d4af37]/20 text-xs text-[#fdfbf7]/50"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">New Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Naya username darj karein..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updatingUsername || !newUsername}
            className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer"
          >
            {updatingUsername ? 'Updating...' : 'Update Username'}
          </button>
        </div>
      </form>

      {/* 2. Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="islamic-card p-6 sm:p-8 border border-[#d4af37]/30 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#fbe08e] flex items-center gap-2 border-b border-[#d4af37]/20 pb-3">
          <Lock className="w-4 h-4 text-[#d4af37]" />
          <span>Change Admin Password</span>
        </h3>

        <div>
          <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Maujooda password..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">New Password (8+ Chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Naya password..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Dobara naya password..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updatingPassword || !newPassword || !currentPassword}
            className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] disabled:opacity-50 cursor-pointer"
          >
            {updatingPassword ? 'Changing Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

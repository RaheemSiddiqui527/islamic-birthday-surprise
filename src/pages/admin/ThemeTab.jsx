import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../api';
import { Palette, Save, Check } from 'lucide-react';

export default function ThemeTab({ showToast }) {
  const [primary, setPrimary] = useState('#047857');
  const [secondary, setSecondary] = useState('#d4af37');
  const [bgDark, setBgDark] = useState('#022c22');
  const [enableParticles, setEnableParticles] = useState(true);
  const [enableLanterns, setEnableLanterns] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      setLoading(true);
      const res = await getSettings();
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        setPrimary(s.themePrimary || '#047857');
        setSecondary(s.themeSecondary || '#d4af37');
        setBgDark(s.themeBgDark || '#022c22');
        setEnableParticles(Boolean(s.enableParticles));
        setEnableLanterns(Boolean(s.enableLanterns));
      }
    } catch (err) {
      showToast('Theme load error', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateSettings({
        themePrimary: primary,
        themeSecondary: secondary,
        themeBgDark: bgDark,
        enableParticles,
        enableLanterns
      });
      if (res.data.success) {
        showToast('Theme preferences updated successfully! 🎨', 'success');
      }
    } catch (err) {
      showToast('Theme update error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-[#d4af37] text-center">Loading theme...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
          Theme and Appearance
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
          Islamic emerald green aur luxury gold palette aur background effects customize karein.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="islamic-card p-6 sm:p-8 border border-[#d4af37]/35 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-2">
              Primary Emerald
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-[#fdfbf7]">{primary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-2">
              Secondary Gold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-[#fdfbf7]">{secondary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-2">
              Deep Background
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgDark}
                onChange={(e) => setBgDark(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-[#fdfbf7]">{bgDark}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#d4af37]/20 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-[#fdfbf7]">
            <input
              type="checkbox"
              checked={enableLanterns}
              onChange={(e) => setEnableLanterns(e.target.checked)}
              className="accent-[#d4af37] w-4 h-4"
            />
            <span>Enable Glowing Islamic Hanging Lanterns</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-[#fdfbf7]">
            <input
              type="checkbox"
              checked={enableParticles}
              onChange={(e) => setEnableParticles(e.target.checked)}
              className="accent-[#d4af37] w-4 h-4"
            />
            <span>Enable Golden Ambient Floating Stars & Particles</span>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#d4af37]/20">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Theme Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../api';
import { Save, Check, AlertCircle } from 'lucide-react';

export default function SettingsTab({ showToast }) {
  const [formData, setFormData] = useState({
    brotherName: '',
    mainHeading: 'JANAMDIN MUBARAK, BHAI JAAN ❤️',
    introGreeting: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    introSubheading: '',
    heroTagline: '',
    signOff: 'Aapke Chhote Bhai Ki Taraf Se ❤️',
    metaTitle: 'JANAMDIN MUBARAK, BHAI JAAN ❤️',
    metaDescription: '',
    enableParticles: true,
    enableLanterns: true,
    enableNasheed: true,
    enableLetter: true,
    enableDuas: true,
    enableGallery: true,
    enableMemories: true,
    enableVideo: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await getSettings();
      if (res.data.success && res.data.settings) {
        setFormData(res.data.settings);
      }
    } catch (err) {
      showToast('Settings load karne mein khata aayi.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateSettings(formData);
      if (res.data.success) {
        setFormData(res.data.settings);
        showToast('Settings ba-kamyabi mehfooz ho gayi hain! ✨', 'success');
      }
    } catch (err) {
      showToast('Settings save nahi ho sakin: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#d4af37]">
        <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mr-3"></div>
        <span>Settings load ho rahi hain...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-2">
          Birthday Settings Management
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
          Bhai jaan ka naam, main unwan (heading), sign-off aur sections ki numayash control karein.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Text Settings */}
        <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/30 space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#fbe08e] border-b border-[#d4af37]/20 pb-3">
            Bunyadi Maloomat (Core Headings & Text)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
                Bhai Jaan Ka Naam
              </label>
              <input
                type="text"
                name="brotherName"
                value={formData.brotherName || ''}
                onChange={handleChange}
                placeholder="Kareem Bhai"
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
                Younger Brother Sign-Off
              </label>
              <input
                type="text"
                name="signOff"
                value={formData.signOff || ''}
                onChange={handleChange}
                placeholder="Aapke Chhote Bhai Ki Taraf Se ❤️"
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
              Markazi Unwan (Main Heading)
            </label>
            <input
              type="text"
              name="mainHeading"
              value={formData.mainHeading || ''}
              onChange={handleChange}
              placeholder="JANAMDIN MUBARAK, BHAI JAAN ❤️"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm font-serif font-bold focus:outline-none focus:border-[#d4af37]"
            />
            <p className="text-[11px] text-[#d4af37]/70 mt-1.5 font-light">
              Mustahiq greeting: "JANAMDIN MUBARAK, BHAI JAAN ❤️". "Happy Birthday" alfaz haram/mamnoo hain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
                Intro Greeting
              </label>
              <input
                type="text"
                name="introGreeting"
                value={formData.introGreeting || ''}
                onChange={handleChange}
                placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm font-arabic focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
                Intro Subheading
              </label>
              <input
                type="text"
                name="introSubheading"
                value={formData.introSubheading || ''}
                onChange={handleChange}
                placeholder="Mere azeez, muhtaram aur rehnuma bhai ke naam ek dil-se tohfa"
                className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
              Hero Tagline
            </label>
            <input
              type="text"
              name="heroTagline"
              value={formData.heroTagline || ''}
              onChange={handleChange}
              placeholder="Duaon, Mohabbat aur Qadardani se bhara ek pyara safar"
              className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-[#fdfbf7] text-sm focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/30 space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#fbe08e] border-b border-[#d4af37]/20 pb-3">
            Sections Ki Numayash (Section Visibility Toggles)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'enableLetter', label: 'Birthday Letter Section', desc: 'Chhote bhai ka pyara paigham' },
              { id: 'enableDuas', label: 'Dua Cards Section', desc: 'Interactive Aameen button ke sath' },
              { id: 'enableGallery', label: 'Photo Gallery Section', desc: 'Tasweerein aur lightbox' },
              { id: 'enableMemories', label: 'Memories Timeline', desc: 'Bachpan aur rehnumai ke milestones' },
              { id: 'enableNasheed', label: 'Vocal Nasheed Audio Player', desc: 'Baghair saaz islami audio' },
              { id: 'enableVideo', label: 'Video Section', desc: 'Google Flow scenes ya birthday video' },
              { id: 'enableLanterns', label: 'Glowing Lanterns', desc: 'Jhoolte hue fanoos aur noorani chamak' },
              { id: 'enableParticles', label: 'Golden Ambient Particles', desc: 'Canvas par sunehray zarrat' }
            ].map((sec) => (
              <label
                key={sec.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#064e3b]/30 border border-[#d4af37]/20 hover:border-[#d4af37]/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  name={sec.id}
                  checked={Boolean(formData[sec.id])}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-[#d4af37] cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-[#fdfbf7]">{sec.label}</p>
                  <p className="text-xs text-[#fdfbf7]/60 font-light">{sec.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full font-serif text-sm font-bold tracking-wider uppercase text-[#022c22] gold-gradient-bg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(251,224,142,0.6)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Mehfooz Ho Raha Hai...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Settings Mehfooz Kijiye</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { getLetter, updateLetter } from '../../api';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, BookOpen, Eye } from 'lucide-react';

export default function LetterTab({ showToast }) {
  const [title, setTitle] = useState('');
  const [salutation, setSalutation] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const [closingDua, setClosingDua] = useState('');
  const [signOff, setSignOff] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadLetter();
  }, []);

  async function loadLetter() {
    try {
      setLoading(true);
      const res = await getLetter();
      if (res.data.success && res.data.letter) {
        const l = res.data.letter;
        setTitle(l.title || '');
        setSalutation(l.salutation || '');
        setParagraphs(l.paragraphs || []);
        setClosingDua(l.closingDua || '');
        setSignOff(l.signOff || '');
      }
    } catch (err) {
      showToast('Letter load karne mein khata aayi.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleParagraphChange = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index) => {
    if (paragraphs.length <= 1) {
      showToast('Kam az kam ek paragraph rehna zaroori hai.', 'error');
      return;
    }
    const updated = paragraphs.filter((_, i) => i !== index);
    setParagraphs(updated);
  };

  const moveParagraph = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= paragraphs.length) return;
    const updated = [...paragraphs];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setParagraphs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateLetter({
        title,
        salutation,
        paragraphs,
        closingDua,
        signOff
      });

      if (res.data.success) {
        showToast('Birthday letter ba-kamyabi update ho gaya! 💌', 'success');
      }
    } catch (err) {
      showToast('Letter save nahi ho saka: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#d4af37]">
        <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mr-3"></div>
        <span>Letter load ho raha hai...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Birthday Letter Management
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Chhote bhai ki taraf se likha gaya dilchasp aur ba-adab paigham mukammal taur par edit karein.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 rounded-full border border-[#d4af37]/40 text-xs text-[#fbe08e] hover:bg-[#064e3b] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? 'Hide Preview' : 'Show Live Preview'}</span>
        </button>
      </div>

      {/* Live Preview Card */}
      {showPreview && (
        <div className="islamic-card p-6 sm:p-8 border-2 border-[#d4af37]/50 shadow-2xl relative">
          <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-widest block mb-4">
            Live Preview (Public Website Look)
          </span>

          <h3 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text mb-4 text-center">
            {title}
          </h3>

          <p className="font-serif text-sm sm:text-base font-semibold text-[#fbe08e] mb-4">
            {salutation}
          </p>

          <div className="space-y-4 text-xs sm:text-sm text-[#fdfbf7]/90 leading-relaxed font-light">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {closingDua && (
            <div className="mt-6 pt-4 border-t border-[#d4af37]/20 text-xs sm:text-sm italic text-[#fbe08e]">
              "{closingDua}"
            </div>
          )}

          <div className="mt-6 text-right font-serif font-bold gold-gradient-text text-sm">
            {signOff}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="islamic-card p-6 sm:p-8 border border-[#d4af37]/30 space-y-6">
        <div>
          <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
            Letter Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
            Salutation (Alqaab)
          </label>
          <input
            type="text"
            value={salutation}
            onChange={(e) => setSalutation(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Paragraphs Manager */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37]">
              Letter Paragraphs ({paragraphs.length})
            </label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-xs text-[#fbe08e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Naya Paragraph Shamil Karein</span>
            </button>
          </div>

          <div className="space-y-4">
            {paragraphs.map((p, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#022c22]/60 border border-[#d4af37]/20 relative">
                <div className="flex items-center justify-between mb-2 text-xs text-[#d4af37]/80">
                  <span className="font-cinzel">Paragraph #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, -1)}
                      disabled={index === 0}
                      className="p-1 hover:text-[#fbe08e] disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, 1)}
                      disabled={index === paragraphs.length - 1}
                      className="p-1 hover:text-[#fbe08e] disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="p-1 text-red-400 hover:text-red-300 ml-1 cursor-pointer"
                      title="Remove Paragraph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  placeholder={`Paragraph #${index + 1} ka matan...`}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#022c22] border border-[#d4af37]/20 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
            Closing Dua
          </label>
          <textarea
            rows={2}
            value={closingDua}
            onChange={(e) => setClosingDua(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="block text-xs font-cinzel uppercase tracking-wider text-[#d4af37] mb-2">
            Sign-Off
          </label>
          <input
            type="text"
            value={signOff}
            onChange={(e) => setSignOff(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-[#022c22]/80 border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#d4af37]/20">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-full font-serif text-sm font-bold uppercase gold-gradient-bg text-[#022c22] shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Letter...' : 'Save Letter Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

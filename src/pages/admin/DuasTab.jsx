import React, { useState, useEffect } from 'react';
import { getDuas, createDua, updateDua, reorderDuas, deleteDua } from '../../api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Sparkles, Heart, Eye, EyeOff, X } from 'lucide-react';

export default function DuasTab({ showToast }) {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDua, setEditingDua] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formArabic, setFormArabic] = useState('');
  const [formUrdu, setFormUrdu] = useState('');
  const [formEnglish, setFormEnglish] = useState('');
  const [formCategory, setFormCategory] = useState('Barkat');
  const [formPublished, setFormPublished] = useState(true);

  useEffect(() => {
    loadDuas();
  }, []);

  async function loadDuas() {
    try {
      setLoading(true);
      const res = await getDuas();
      if (res.data.success) {
        setDuas(res.data.duas || []);
      }
    } catch (err) {
      showToast('Dua cards load nahi ho sake.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingDua(null);
    setFormTitle('');
    setFormArabic('');
    setFormUrdu('');
    setFormEnglish('');
    setFormCategory('Barkat');
    setFormPublished(true);
    setShowModal(true);
  };

  const openEditModal = (dua) => {
    setEditingDua(dua);
    setFormTitle(dua.title || '');
    setFormArabic(dua.arabicText || '');
    setFormUrdu(dua.urduText || '');
    setFormEnglish(dua.englishMeaning || '');
    setFormCategory(dua.category || 'Barkat');
    setFormPublished(dua.isPublished);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formUrdu) {
      showToast('Title aur Urdu translation zaroori hain.', 'error');
      return;
    }

    try {
      const payload = {
        title: formTitle,
        arabicText: formArabic,
        urduText: formUrdu,
        englishMeaning: formEnglish,
        category: formCategory,
        isPublished: formPublished
      };

      if (editingDua) {
        await updateDua(editingDua._id, payload);
        showToast('Dua card update ho gaya!', 'success');
      } else {
        await createDua(payload);
        showToast('Naya Dua card shamil ho gaya!', 'success');
      }

      setShowModal(false);
      loadDuas();
    } catch (err) {
      showToast('Save error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const moveDua = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= duas.length) return;

    const updated = [...duas];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setDuas(updated);

    try {
      await reorderDuas(updated.map((d) => d._id));
      showToast('Dua cards ki tarteeb update ho gayi.', 'success');
    } catch (err) {
      showToast('Tarteeb save nahi ho saki.', 'error');
      loadDuas();
    }
  };

  const togglePublish = async (dua) => {
    try {
      await updateDua(dua._id, { isPublished: !dua.isPublished });
      showToast(`Dua card ${!dua.isPublished ? 'published' : 'hidden'} kardi gayi.`, 'success');
      loadDuas();
    } catch (err) {
      showToast('Status update error', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap is Dua card ko delete karna chahte hain?')) return;
    try {
      await deleteDua(id);
      showToast('Dua card delete ho gaya.', 'success');
      loadDuas();
    } catch (err) {
      showToast('Delete error: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Dua Management
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Interactive Dua cards add, edit, reorder aur unka Aameen count check karein.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dua Card</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-[#d4af37]">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mr-3"></div>
          <span>Dua cards load ho rahe hain...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {duas.map((dua, index) => (
            <div
              key={dua._id}
              className="islamic-card p-5 border border-[#d4af37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-cinzel text-[#d4af37]">#{index + 1}</span>
                  <span className="text-[10px] font-cinzel px-2.5 py-0.5 rounded-full bg-[#064e3b] text-[#fbe08e] border border-[#d4af37]/25">
                    {dua.category || 'Barkat'}
                  </span>
                  <span className="text-xs font-cinzel text-emerald-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-emerald-400" />
                    <span>{dua.aameenCount || 0} Aameen</span>
                  </span>
                  <span
                    className={`text-[10px] font-cinzel px-2 py-0.5 rounded-full ${
                      dua.isPublished ? 'bg-emerald-950/80 text-emerald-300' : 'bg-red-950/80 text-red-300'
                    }`}
                  >
                    {dua.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#fbe08e] mb-1">
                  {dua.title}
                </h4>

                {dua.arabicText && (
                  <p className="font-arabic text-sm text-[#fbe08e]/80 truncate max-w-xl mb-1">
                    {dua.arabicText}
                  </p>
                )}

                <p className="text-xs text-[#fdfbf7]/80 italic font-serif line-clamp-1">
                  "{dua.urduText}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-[#d4af37]/15">
                <button
                  onClick={() => moveDua(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-20 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDua(index, 1)}
                  disabled={index === duas.length - 1}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => togglePublish(dua)}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#fdfbf7]/70 cursor-pointer"
                  title={dua.isPublished ? 'Hide' : 'Publish'}
                >
                  {dua.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-400" />}
                </button>
                <button
                  onClick={() => openEditModal(dua)}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#fbe08e] cursor-pointer"
                  title="Edit Dua Card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(dua._id)}
                  className="p-1.5 rounded hover:bg-red-950/50 text-red-400 cursor-pointer"
                  title="Delete Dua Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-lg w-full max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e]">
                {editingDua ? 'Edit Dua Card' : 'Naya Dua Card Shamil Karein'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#fdfbf7]/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Dua Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Sehat aur Lambi Zindagi"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  Arabic Invocation (Optional Authentic Arabic)
                </label>
                <input
                  type="text"
                  value={formArabic}
                  onChange={(e) => setFormArabic(e.target.value)}
                  placeholder="e.g. اَللّٰهُمَّ عَافِنِيْ فِيْ بَدَنِيْ..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm font-arabic text-[#fbe08e] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  Urdu Prayer Text (Dua)
                </label>
                <textarea
                  rows={3}
                  value={formUrdu}
                  onChange={(e) => setFormUrdu(e.target.value)}
                  placeholder="Ya Allah! Mere pyare bhai jaan ko kamil sehat ata farma..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">
                  English Meaning / Translation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formEnglish}
                  onChange={(e) => setFormEnglish(e.target.value)}
                  placeholder="May Allah bless my elder brother with enduring vitality..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Sehat, Sukoon, Rizq"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fdfbf7]">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="accent-[#d4af37]"
                    />
                    <span>Is Published</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-[#fdfbf7]/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22]"
                >
                  Save Dua Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

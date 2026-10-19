import React, { useState, useEffect } from 'react';
import {
  getMemories,
  createMemory,
  updateMemory,
  reorderMemories,
  deleteMemory
} from '../../api';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Sparkles, Heart, Book, Shield, Star, X } from 'lucide-react';

export default function MemoriesTab({ showToast }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPeriod, setFormPeriod] = useState('');
  const [formIcon, setFormIcon] = useState('sparkles');
  const [formPublished, setFormPublished] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    try {
      setLoading(true);
      const res = await getMemories();
      if (res.data.success) {
        setMemories(res.data.memories || []);
      }
    } catch (err) {
      showToast('Memories load nahi ho sakin.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingMemory(null);
    setFormTitle('');
    setFormDescription('');
    setFormPeriod('');
    setFormIcon('sparkles');
    setFormPublished(true);
    setShowModal(true);
  };

  const openEditModal = (mem) => {
    setEditingMemory(mem);
    setFormTitle(mem.title || '');
    setFormDescription(mem.description || '');
    setFormPeriod(mem.dateOrPeriod || '');
    setFormIcon(mem.iconName || 'sparkles');
    setFormPublished(mem.isPublished);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) {
      showToast('Title aur description dono darkar hain.', 'error');
      return;
    }

    try {
      const payload = {
        title: formTitle,
        description: formDescription,
        dateOrPeriod: formPeriod,
        iconName: formIcon,
        isPublished: formPublished
      };

      if (editingMemory) {
        await updateMemory(editingMemory._id, payload);
        showToast('Memory update ho gayi!', 'success');
      } else {
        await createMemory(payload);
        showToast('Nayi memory shamil ho gayi!', 'success');
      }

      setShowModal(false);
      loadMemories();
    } catch (err) {
      showToast('Save error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const moveMemory = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= memories.length) return;

    const updated = [...memories];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setMemories(updated);

    try {
      await reorderMemories(updated.map((m) => m._id));
      showToast('Tarteeb mehfooz ho gayi.', 'success');
    } catch (err) {
      showToast('Tarteeb save nahi ho saki.', 'error');
      loadMemories();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap is memory ko delete karna chahte hain?')) return;
    try {
      await deleteMemory(id);
      showToast('Memory delete ho gayi.', 'success');
      loadMemories();
    } catch (err) {
      showToast('Delete error: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold gold-gradient-text tracking-tight mb-1">
            Memories and Captions
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfbf7]/70 font-light">
            Bachpan aur bhai-bhai ke rishte ke ahem tareen lamhaat aur yaadein.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full font-serif text-xs font-bold uppercase gold-gradient-bg text-[#022c22] flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-[#d4af37]">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin mr-3"></div>
          <span>Memories load ho rahi hain...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {memories.map((mem, index) => (
            <div
              key={mem._id}
              className="islamic-card p-5 border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#064e3b] border border-[#d4af37]/40 flex items-center justify-center text-[#fbe08e] shrink-0 mt-0.5">
                  {mem.iconName === 'heart' && <Heart className="w-5 h-5" />}
                  {mem.iconName === 'book' && <Book className="w-5 h-5" />}
                  {mem.iconName === 'shield' && <Shield className="w-5 h-5" />}
                  {mem.iconName === 'sparkles' && <Sparkles className="w-5 h-5" />}
                  {!['heart', 'book', 'shield', 'sparkles'].includes(mem.iconName) && (
                    <Star className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-cinzel text-[#d4af37]">#{index + 1}</span>
                    <h4 className="font-serif font-bold text-base text-[#fbe08e]">{mem.title}</h4>
                    {mem.dateOrPeriod && (
                      <span className="text-[11px] font-cinzel text-[#d4af37]/70 px-2 py-0.5 rounded-full bg-[#022c22]">
                        {mem.dateOrPeriod}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#fdfbf7]/80 font-light leading-relaxed max-w-2xl">
                    {mem.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#d4af37]/15">
                <button
                  onClick={() => moveMemory(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-20 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveMemory(index, 1)}
                  disabled={index === memories.length - 1}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#d4af37] disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(mem)}
                  className="p-1.5 rounded hover:bg-[#064e3b] text-[#fbe08e] cursor-pointer"
                  title="Edit Memory"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(mem._id)}
                  className="p-1.5 rounded hover:bg-red-950/50 text-red-400 cursor-pointer"
                  title="Delete Memory"
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
        <div className="fixed inset-0 z-50 bg-[#022c22]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="islamic-card p-6 sm:p-8 border border-[#d4af37]/40 max-w-lg w-full">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#fbe08e]">
                {editingMemory ? 'Edit Memory' : 'Nayi Memory Shamil Karein'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#fdfbf7]/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Bachpan Ka Saya aur Shafqat"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Date / Period</label>
                <input
                  type="text"
                  value={formPeriod}
                  onChange={(e) => setFormPeriod(e.target.value)}
                  placeholder="e.g. Bachpan Ke Ayyam, School ke din"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Is lamhe ki pyari tafseel..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-sm text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#d4af37] mb-1">Icon</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#022c22] border border-[#d4af37]/30 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="sparkles">Sparkles ✨</option>
                    <option value="heart">Heart ❤️</option>
                    <option value="book">Book 📖</option>
                    <option value="shield">Shield 🛡️</option>
                    <option value="star">Star ⭐</option>
                  </select>
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
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FolderPlus, Trash2, Edit3, Save, Layers, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "../../utils/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: "", error: "" });
  
  const [formData, setFormData] = useState({ name: "", slug: "", image: "", sortOrder: 1 });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      // Safely map data arrays down from payload responses
      setCategories(res.data?.categories || res.data || []);
    } catch (err) {
      setFeedback({ success: "", error: "Failed to fetch categories schema records." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSlugAutoFill = (nameVal) => {
    const computedSlug = nameVal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData(prev => ({ ...prev, name: nameVal, slug: computedSlug }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    setIsSubmitting(true);
    setFeedback({ success: "", error: "" });

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        setFeedback({ success: "Category record updated successfully.", error: "" });
      } else {
        await api.post("/categories", formData);
        setFeedback({ success: "New shop category instantiated successfully.", error: "" });
      }
      setFormData({ name: "", slug: "", image: "", sortOrder: 1 });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setFeedback({ success: "", error: err.response?.data?.message || "Operation write execution failure." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTrigger = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image?.url || cat.image || "",
      sortOrder: cat.sortOrder || 1
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Purge this category index line? All linked items will lose structural mappings.")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      setFeedback({ success: "Category purged successfully.", error: "" });
    } catch (err) {
      setFeedback({ success: "", error: "Failed to clear the selected category node." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>READING CATEGORY RELATIONSHIP INDEX ARRAYS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Category Taxonomy <span className="text-primary-gold">Studio</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Configure structural inventory channels, modify layout priorities, and map catalog nodes.</p>
      </div>

      {feedback.success && (
        <div className="p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 size={14} /> <span>{feedback.success}</span>
        </div>
      )}

      {feedback.error && (
        <div className="p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-semibold">
          <AlertCircle size={14} /> <span>{feedback.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Taxonomy Record Management Form */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md lg:col-span-1">
          <h3 className="font-heading font-bold uppercase tracking-wider text-xs text-pure-white border-b border-border-dark pb-3 mb-4 flex items-center gap-2">
            <Layers size={14} className="text-primary-gold" /> {editingId ? "Modify Channel Specs" : "Instantiate Catalog Channel"}
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Category Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleSlugAutoFill(e.target.value)}
                placeholder="e.g., Visors & Guards"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">SEO Path Slug URL Reference</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="visors-and-guards"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Resource Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Layout Priority Order Index</label>
              <input
                type="number"
                required
                min="1"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-primary-gold hover:bg-gold-hover disabled:bg-primary-gold/40 text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg transition-all text-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <FolderPlus size={13} />}
                <span>{editingId ? "Commit Adjustments" : "Build Category Link"}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setFormData({ name: "", slug: "", image: "", sortOrder: 1 }); }}
                  className="w-full h-8 mt-2 bg-deep-black hover:bg-border-dark border border-border-dark text-muted-gray rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  Abort Modification
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Data Table View Grid */}
        <div className="lg:col-span-2 bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="bg-deep-black px-4 py-3 border-b border-border-dark">
            <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">Live Catalog Taxonomy Map</h3>
          </div>
          <div className="divide-y divide-border-dark/60">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-muted-gray/50 italic">No configuration entries discovered in the store taxonomy nodes.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center justify-between gap-4 hover:bg-deep-black/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <img 
                      src={cat.image?.url || cat.image || "https://via.placeholder.com/40x30/1A1A1A/666666?text=No+Media"} 
                      alt={cat.name} 
                      className="h-10 w-14 object-cover rounded border border-border-dark bg-deep-black"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-pure-white uppercase tracking-wide text-xs">{cat.name}</h4>
                      <p className="font-mono text-[10px] text-muted-gray/60 mt-0.5">slug: {cat.slug}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-primary-gold bg-primary-gold/10 px-2 py-0.5 border border-primary-gold/20 rounded font-bold" title="Layout Priority Rank">
                      IDX: {cat.sortOrder || 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditTrigger(cat)}
                        className="h-7 w-7 bg-deep-black border border-border-dark hover:border-primary-gold text-muted-gray hover:text-primary-gold rounded flex items-center justify-center transition-all"
                        title="Modify Node Configuration"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat._id)}
                        className="h-7 w-7 bg-deep-black border border-border-dark hover:border-error-red text-muted-gray hover:text-error-red rounded flex items-center justify-center transition-all"
                        title="Purge Node Line"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
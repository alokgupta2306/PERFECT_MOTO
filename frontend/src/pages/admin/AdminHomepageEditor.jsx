import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2, Image, Bell, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../../utils/api";

const AdminHomepageEditor = () => {
  const [content, setContent] = useState({
    announcementText: "",
    announcementBgColor: "#FFB800",
    heroBanners: [],
    trustBadges: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get("/homepage");
        setContent(res.data.content || {});
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/homepage", content);
      setSuccessBanner("Homepage updated successfully.");
      setTimeout(() => setSuccessBanner(""), 3000);
    } catch {
      setSuccessBanner("Failed to save. Try again.");
      setTimeout(() => setSuccessBanner(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    setContent(prev => ({
      ...prev,
      heroBanners: [...(prev.heroBanners || []), {
        image: "",
        title: "",
        subtitle: "",
        buttonText: "Shop Now",
        link: "/shop",
        isActive: true
      }]
    }));
  };

  const updateBanner = (index, field, value) => {
    const updated = [...content.heroBanners];
    updated[index][field] = value;
    setContent(prev => ({ ...prev, heroBanners: updated }));
  };

  const removeBanner = (index) => {
    setContent(prev => ({
      ...prev,
      heroBanners: prev.heroBanners.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="text-center py-20 text-muted-gray">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-border-dark pb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
            Homepage <span className="text-primary-gold">Editor</span>
          </h1>
          <p className="text-xs text-muted-gray mt-1">Manage banners, announcement bar and trust badges.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-9 px-5 bg-primary-gold text-deep-black font-heading font-bold uppercase text-xs rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {successBanner && (
        <div className="p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold">
          <CheckCircle2 size={14} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Announcement Bar */}
      <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-primary-gold">
          <Bell size={16} />
          <h2 className="font-heading font-bold uppercase text-sm tracking-wide">Announcement Bar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
              Announcement Text
            </label>
            <input
              type="text"
              value={content.announcementText || ""}
              onChange={e => setContent(prev => ({ ...prev, announcementText: e.target.value }))}
              placeholder="FREE DELIVERY ON ORDERS ABOVE RS 999! USE CODE WELCOME10"
              className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={content.announcementBgColor || "#FFB800"}
                onChange={e => setContent(prev => ({ ...prev, announcementBgColor: e.target.value }))}
                className="h-10 w-16 rounded cursor-pointer border border-border-dark bg-deep-black"
              />
              <span className="text-xs text-muted-gray font-mono">{content.announcementBgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banners */}
      <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary-gold">
            <Image size={16} />
            <h2 className="font-heading font-bold uppercase text-sm tracking-wide">Hero Banners</h2>
          </div>
          <button
            onClick={addBanner}
            className="h-8 px-3 bg-deep-black border border-border-dark text-primary-gold text-xs font-heading font-bold uppercase rounded-lg flex items-center gap-1 hover:border-primary-gold"
          >
            <Plus size={13} /> Add Banner
          </button>
        </div>

        {(!content.heroBanners || content.heroBanners.length === 0) && (
          <div className="text-center py-8 text-muted-gray text-xs border border-dashed border-border-dark rounded-lg">
            No banners yet. Click Add Banner to create one.
          </div>
        )}

        <div className="space-y-6">
          {content.heroBanners?.map((banner, index) => (
            <div key={index} className="border border-border-dark rounded-xl p-4 space-y-4 relative">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted-gray">
                  Banner {index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateBanner(index, "isActive", !banner.isActive)}
                    className="flex items-center gap-1 text-xs"
                  >
                    {banner.isActive
                      ? <ToggleRight size={18} className="text-success-green" />
                      : <ToggleLeft size={18} className="text-muted-gray" />
                    }
                    <span className={banner.isActive ? "text-success-green" : "text-muted-gray"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                  <button
                    onClick={() => removeBanner(index)}
                    className="text-muted-gray hover:text-error-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* ✅ FIXED: Implemented unified Image text path mapping combined with direct binary multipart upload triggers */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Image URL or Upload from PC
                  </label>
                  <input
                    type="text"
                    value={banner.image || ""}
                    onChange={e => updateBanner(index, "image", e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted-gray uppercase tracking-wider font-bold">OR</span>
                    <label className="cursor-pointer h-8 px-4 bg-deep-black border border-border-dark hover:border-primary-gold text-primary-gold text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors">
                      <Image size={12} />
                      <span>Upload from PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("image", file);
                          try {
                            const res = await api.post("/upload", formData, {
                              headers: { "Content-Type": "multipart/form-data" }
                            });
                            updateBanner(index, "image", res.data.url);
                          } catch {
                            alert("Upload failed. Try again.");
                          }
                        }}
                      />
                    </label>
                    {banner.image && (
                      <span className="text-[10px] text-success-green font-semibold">✓ Image set</span>
                    )}
                  </div>
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt="Banner preview"
                      className="mt-2 h-24 w-full object-cover rounded-lg border border-border-dark"
                      onError={e => e.target.style.display = "none"}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={banner.title || ""}
                    onChange={e => updateBanner(index, "title", e.target.value)}
                    placeholder="COMPATIBLE ACCESSORIES"
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={banner.subtitle || ""}
                    onChange={e => updateBanner(index, "subtitle", e.target.value)}
                    placeholder="Save your bike model to auto-filter..."
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={banner.buttonText || ""}
                    onChange={e => updateBanner(index, "buttonText", e.target.value)}
                    placeholder="Shop Now"
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={banner.link || ""}
                    onChange={e => updateBanner(index, "link", e.target.value)}
                    placeholder="/shop"
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Valid From (optional)
                  </label>
                  <input
                    type="date"
                    value={banner.validFrom ? banner.validFrom.split("T")[0] : ""}
                    onChange={e => updateBanner(index, "validFrom", e.target.value)}
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                    Valid To (optional)
                  </label>
                  <input
                    type="date"
                    value={banner.validTo ? banner.validTo.split("T")[0] : ""}
                    onChange={e => updateBanner(index, "validTo", e.target.value)}
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-8 bg-primary-gold text-deep-black font-heading font-bold uppercase text-xs rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminHomepageEditor;
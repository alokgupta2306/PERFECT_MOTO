import React, { useState, useEffect } from "react";
import { Save, FileText, Globe, Landmark, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminContentEditor = () => {
  const [settings, setSettings] = useState({
    siteName: "", tagline: "", contactEmail: "", contactPhone: "", address: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchCoreSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.settings) setSettings(res.data.settings);
      } catch (err) {
        console.error("Failed to query central configuration parameters.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoreSettings();
  }, []);

  const handleFormSaveSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      await api.put("/settings", settings);
      setSuccessMsg("System configuration metrics re-indexed successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to preserve settings tree changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>READING STATIC TEXT STRINGS POOL OVERLAYS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <form onSubmit={handleFormSaveSubmit} className="space-y-6">
        <div className="flex justify-between items-center border-b border-border-dark pb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
              Global Variable <span className="text-primary-gold">Workspace</span>
            </h1>
            <p className="text-xs text-muted-gray mt-1">Configure site metadata, phone lines, addresses, and layout text strings.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-9 px-5 bg-primary-gold text-deep-black font-heading font-bold uppercase text-xs rounded-lg flex items-center gap-2 disabled:opacity-50 shadow-md"
          >
            <Save size={14} /> {saving ? "Preserving..." : "Commit Variables"}
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold">
            <ShieldCheck size={14} /> <span>{successMsg}</span>
          </div>
        )}

        {/* Global Metadata Block */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-primary-gold border-b border-border-dark/60 pb-2 mb-2">
            <Globe size={15} />
            <h3 className="font-heading font-bold uppercase text-xs tracking-wider">Corporate Identity Strings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Application Title Name</label>
              <input
                type="text"
                required
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Primary Hero Tagline</label>
              <input
                type="text"
                required
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
              />
            </div>
          </div>
        </div>

        {/* Support Routing Contacts */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-primary-gold border-b border-border-dark/60 pb-2 mb-2">
            <Landmark size={15} />
            <h3 className="font-heading font-bold uppercase text-xs tracking-wider">Logistical & Contact Routing Parameters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Customer Care Mail Inbox</label>
              <input
                type="email"
                required
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Customer Care Phone Hotline</label>
              <input
                type="text"
                required
                value={settings.contactPhone || ""}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">HQ Physical Node Address</label>
              <textarea
                required
                rows={3}
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-deep-black text-pure-white border border-border-dark rounded-lg p-4 text-xs focus:outline-none focus:border-primary-gold resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminContentEditor;
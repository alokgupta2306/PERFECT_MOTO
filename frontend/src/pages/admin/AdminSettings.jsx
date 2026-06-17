import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ShieldCheck, ToggleRight, ToggleLeft, Percent, Loader2, Globe, Phone, Mail, Award, Truck, Lock } from "lucide-react";
import api from "../../utils/api";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  // Initializing state vectors to align explicitly with the live SiteSettings database model + Shiprocket Credentials
  const [settings, setSettings] = useState({
    siteName: "",
    gstNumber: "",
    contactEmail: "",
    contactPhone: "",
    shippingRules: { freeAbove: 999, standardCharge: 50 }, // PATCH: Removed COD tracking charges parameters natively
    shiprocketEmail: "", // PATCH: Added reactive fields to support dynamic shiprocket keys mapping
    shiprocketPassword: "",
    shiprocketChannelId: "",
    maintenanceMode: false,
    loyaltySettings: { pointsPerRupee: 1, pointValue: 0.1 },
    referralSettings: { referrerReward: 200, refereeDiscount: 10 }
  });
  const [loading, setLoading] = useState(true);

  // Fetch global configuration settings fields from the database on component load
  useEffect(() => {
    const fetchGlobalSiteSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Back-office control terminal settings hydration error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalSiteSettings();
  }, []);

  // Re-engineered function to commit changes directly via an asynchronous PUT execution loop
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessBanner("");

    try {
      await api.put("/settings", settings);
      setSuccessBanner("Global operational variables committed to the remote configuration matrix.");
      setTimeout(() => setSuccessBanner(""), 3500);
    } catch (err) {
      console.error("Administrative global variables modification sync error:", err);
      setSuccessBanner(err.response?.data?.message || "Failed to synchronize system variables. Try again.");
      setTimeout(() => setSuccessBanner(""), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-hexagon-pattern">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Store System Parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-5">
        <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
          Terminal <span className="text-pure-white">Variables</span> Settings
        </h1>
        <p className="text-xs text-muted-gray mt-1">Configure global platform metadata values, standard taxation bounds, and logistics switches.</p>
      </div>

      {successBanner && (
        <div className={`p-3 text-xs rounded-lg flex items-center gap-2 font-semibold border animate-fade-in ${
          successBanner.toLowerCase().includes("failed") || successBanner.toLowerCase().includes("error")
            ? "bg-error-red/10 border-error-red text-error-red"
            : "bg-success-green/10 border-success-green text-success-green"
        }`}>
          <ShieldCheck size={16} className="shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-md hover:shadow-gold-glow transition-all">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-primary-gold border-b border-border-dark/60 pb-2 flex items-center gap-1.5">
            <Globe size={14} />
            <span>1. Core Metadata & Comm-Lines Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Platform Brand Name</label>
              <input
                type="text"
                required
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="e.g. Perfect Moto"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Corporate Communications Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={14} />
                <input
                  type="email"
                  required
                  value={settings.contactEmail || ""}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="perfectmoto.accessories@gmail.com"
                  className="w-full h-10 pl-9 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors border-solid"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Customer Support Hotline</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={14} />
                <input
                  type="text"
                  required
                  value={settings.contactPhone || ""}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+91 8356968789"
                  className="w-full h-10 pl-9 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Free Logistics Floor Threshold (INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-gray">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.shippingRules?.freeAbove !== undefined ? settings.shippingRules.freeAbove : 999}
                  onChange={(e) => setSettings({
                    ...settings,
                    shippingRules: { ...settings.shippingRules, freeAbove: Number(e.target.value) }
                  })}
                  placeholder="999"
                  className="w-full h-10 pl-8 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid"
                />
              </div>
            </div>
          </div>

          {/* 🔥 PATCH: Integrated Back-Office Shiprocket Logistics Configuration Gateway Card Block */}
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-primary-gold border-b border-border-dark/60 pb-2 flex items-center gap-1.5 pt-2">
            <Lock size={14} />
            <span>2. Secure Shiprocket Core Credentials (Replaces Razorpay API Panels)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Shiprocket Account Email</label>
              <input
                type="email"
                required
                value={settings.shiprocketEmail || ""}
                onChange={(e) => setSettings({ ...settings, shiprocketEmail: e.target.value })}
                placeholder="logistics@perfectmoto.in"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Shiprocket Secure Password</label>
              <input
                type="password"
                required
                value={settings.shiprocketPassword || ""}
                onChange={(e) => setSettings({ ...settings, shiprocketPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Shiprocket Channel ID</label>
              <input
                type="text"
                required
                value={settings.shiprocketChannelId || ""}
                onChange={(e) => setSettings({ ...settings, shiprocketChannelId: e.target.value })}
                placeholder="e.g. 432512"
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid"
              />
            </div>
          </div>

          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-primary-gold border-b border-border-dark/60 pb-2 flex items-center gap-1.5 pt-2">
            <Truck size={14} />
            <span>3. Regional Logistics Pricing & Indian Taxation Mapping</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Standard Base Flat Shipping Fee (Sub-₹999 Orders)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-gray">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.shippingRules?.standardCharge !== undefined ? settings.shippingRules.standardCharge : 50}
                  onChange={(e) => setSettings({
                    ...settings,
                    shippingRules: { ...settings.shippingRules, standardCharge: Number(e.target.value) }
                  })}
                  placeholder="50"
                  className="w-full h-10 pl-8 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Government GST Registration Number</label>
              <div className="relative">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-gray" size={14} />
                <input
                  type="text"
                  required
                  value={settings.gstNumber || ""}
                  onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. 29AAAAA1111A1Z1"
                  className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors uppercase tracking-wider border-solid"
                />
              </div>
            </div>
          </div>

          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-primary-gold border-b border-border-dark/60 pb-2 flex items-center gap-1.5 pt-2">
            <Award size={14} />
            <span>4. Loyalty Programs & Referral Yield Constraints</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Points Accrual Frequency (Per ₹100 Spent)</label>
              <input 
                type="number" 
                required
                min="1"
                value={settings.loyaltySettings?.pointsPerRupee !== undefined ? settings.loyaltySettings.pointsPerRupee : 1}
                onChange={(e) => setSettings({
                  ...settings,
                  loyaltySettings: { ...settings.loyaltySettings, pointsPerRupee: Number(e.target.value) }
                })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Referrer Reward Allocation (Points Bundle)</label>
              <input 
                type="number" 
                required
                min="0"
                value={settings.referralSettings?.referrerReward !== undefined ? settings.referralSettings.referrerReward : 200}
                onChange={(e) => setSettings({
                  ...settings,
                  referralSettings: { ...settings.referralSettings, referrerReward: Number(e.target.value) }
                })}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors border-solid" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-dark/40 pt-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Platform Production Maintenance Mode</label>
              <div 
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className="w-full h-10 px-4 bg-deep-black border border-border-dark rounded-lg flex items-center justify-between cursor-pointer group hover:border-muted-gray transition-colors border-solid"
              >
                <span className="text-xs text-muted-gray font-heading uppercase tracking-wider font-semibold">Switch State</span>
                {settings.maintenanceMode ? (
                  <ToggleRight className="text-error-red animate-pulse" size={24} />
                ) : (
                  <ToggleLeft className="text-muted-gray" size={24} />
                )}
              </div>
            </div>
            
            <div className="text-[10px] text-muted-gray flex items-center bg-deep-black/60 p-3 rounded-lg border border-border-dark/30 normal-case font-medium leading-relaxed border-solid">
              ⚠️ Warning: Flipping the live maintenance switch locks user storefront gateways instantly, generating a fallback staging block screen message while protecting critical active checkout pipelines.
            </div>
          </div>

          <div className="pt-3 border-t border-border-dark/60 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 transform active:scale-95 cursor-pointer border-transparent"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Committing Constants...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Synchronize System Variables</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
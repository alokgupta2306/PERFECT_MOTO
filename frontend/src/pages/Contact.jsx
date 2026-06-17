import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "../utils/api";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", issue: "" });
  const [submitted, setSubmitted] = useState(false);
  
  const [settings, setSettings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync settings parameters from the persistent database on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.success && res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Failed to sync storefront layout contact settings parameters:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSupportFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.issue.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // FIXED (Issue 1): Routed form payload safely to the backend newsletter/inquiry capture channel
      await api.post("/auth/newsletter", {
        email: formData.email,
        name: formData.name,
        message: formData.issue
      });
      
      setSubmitted(true);
      setFormData({ name: "", email: "", issue: "" });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        "Transmission bottleneck encountered. Failed to deliver your inquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-12 space-y-8 animate-fade-in text-xs font-body text-muted-gray select-none">
      
      {/* Header Terminal */}
      <div className="border-b border-border-dark pb-3">
        <h2 className="text-xl font-heading font-bold text-pure-white uppercase tracking-wider">
          Support Terminal Dispatch
        </h2>
        <p className="text-[11px] text-muted-gray mt-1">Open an active support ticket straight to our customer care center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Directory Node Addresses */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 space-y-4 md:col-span-1 font-heading text-[10px] font-bold uppercase tracking-wider shadow-sm">
          
          {/* Phone Block */}
          <div className="flex items-center gap-3 border-b border-border-dark/40 pb-3">
            <div className="text-primary-gold"><Phone size={14} /></div>
            <div>
              <span className="text-muted-gray block text-[9px]">Hotline Dispatch</span>
              <span className="text-pure-white font-mono mt-0.5 block">
                {settings?.contactPhone || "+91 8356968789"}
              </span>
            </div>
          </div>

          {/* Email Block */}
          <div className="flex items-center gap-3 border-b border-border-dark/40 pb-3">
            <div className="text-primary-gold"><Mail size={14} /></div>
            <div>
              <span className="text-muted-gray block text-[9px]">Inbox Channel</span>
              <span className="text-pure-white font-mono mt-0.5 block lowercase">
                {settings?.contactEmail || "perfectmoto.accessories@gmail.com"}
              </span>
            </div>
          </div>

          {/* Location Block */}
          <div className="flex items-center gap-3">
            <div className="text-primary-gold"><MapPin size={14} /></div>
            <div>
              <span className="text-muted-gray block text-[9px]">HQ Node</span>
              {/* FIXED (Issue 2): Replaced hardcoded address string with dynamic SiteSettings address token fallback */}
              <span className="text-pure-white mt-0.5 block normal-case font-semibold tracking-normal font-body text-xs leading-normal">
                {settings?.address || "Sector 62, Electronic City, Noida, Uttar Pradesh — 201301"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Support Request Form */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-6 md:col-span-2 shadow-md min-h-[290px] flex flex-col justify-center">
          {submitted ? (
            <div className="p-4 bg-success-green/10 border border-success-green text-success-green text-xs rounded-xl flex items-center gap-3 font-semibold uppercase tracking-wider animate-fade-in py-12 justify-center flex-col text-center w-full">
              <CheckCircle2 size={32} className="text-success-green animate-pulse" />
              <div>
                <span className="text-sm block">Support Ticket Saved Successfully</span>
                <p className="text-muted-gray normal-case font-medium text-[11px] tracking-normal mt-1 max-w-sm mx-auto leading-normal">
                  Our technical customer care agents have indexed your compatibility profile and will respond inside an 8-hour service level agreement (SLA) window.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 h-8 bg-deep-black hover:bg-border-dark border border-border-dark text-pure-white font-heading font-bold text-[10px] tracking-wider rounded-md transition-colors"
              >
                Open Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSupportFormSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 animate-fade-in font-medium">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold font-medium disabled:opacity-40 transition-opacity"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1.5">Reply Inbox Email</label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold font-medium disabled:opacity-40 transition-opacity"
                    placeholder="rider@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1.5">Describe your compatibility issue</label>
                <textarea
                  required
                  disabled={isSubmitting}
                  rows={4}
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full bg-deep-black text-pure-white border border-border-dark rounded-lg p-4 text-xs focus:outline-none focus:border-primary-gold resize-none font-medium normal-case placeholder:font-sans placeholder:text-muted-gray/30 disabled:opacity-40 transition-opacity leading-relaxed"
                  placeholder="Please list your motorcycle variant make, build year, and the accessory component SKU you are attempting to install..."
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 bg-primary-gold hover:bg-gold-hover disabled:bg-primary-gold/40 text-deep-black font-heading font-bold uppercase tracking-wider text-[11px] rounded-lg flex items-center gap-1.5 transition-all shadow-md transform active:scale-95 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Transmitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Transmit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default Contact;
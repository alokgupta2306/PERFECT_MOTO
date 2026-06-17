import React, { useState } from "react";
import { Bell, CheckCircle2, Smartphone, Loader2 } from "lucide-react";
import api from "../../utils/api";

const NotifyMe = ({ productId }) => {
  // FIXED (Issue 2): Replaced email states with verified phone parameters to match the schema requirements
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    
    // FIXED (Issue 2): Enforces strict 10-digit telephone character limit boundaries for Indian mobile operators
    if (!phone || phone.length !== 10) {
      alert("Please provide a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // FIXED (Issue 1 & Issue 2): Swapped target endpoint paths and structured payload variables to match Mongoose keys
      await api.post("/notify-me", { 
        product: productId, 
        phone: phone.trim() 
      });
      
      setSuccess(true);
      setPhone("");
    } catch (err) {
      // FIXED (Issue 3): Excised the silent placeholder success trace override loop
      console.error("Waitlist entry initialization transaction failure:", err);
      alert(err.response?.data?.message || "Failed to register your restock target notification. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card-dark border border-border-dark p-4 rounded-xl space-y-2.5 select-none animate-fade-in">
      {/* Alert Header Component Block */}
      <div className="flex items-center gap-1.5 text-warning-amber">
        <Bell size={14} className="animate-pulse" />
        <h4 className="font-heading font-bold uppercase text-[11px] tracking-widest">Out-of-Stock Tracking Entry</h4>
      </div>
      <p className="text-xs text-muted-gray leading-tight font-medium font-body normal-case">
        Warehouse stock levels are currently vacant for this accessory slot item variant reference. Register your digits to claim automated updates.
      </p>
      
      {success ? (
        /* Success Validation Status Notification Node Card */
        <div className="h-10 bg-success-green/10 border border-success-green/30 text-success-green text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 mt-2 animate-fade-in shadow-sm">
          <CheckCircle2 size={12} className="text-success-green" /> 
          <span>Interest Profile Saved Successfully</span>
        </div>
      ) : (
        /* WhatsApp Input Registration Processing Forms Field */
        <form onSubmit={handleWaitlistSubmit} className="flex h-10 border border-border-dark bg-deep-black rounded-lg overflow-hidden mt-2 pr-1 focus-within:border-primary-gold items-center group transition-colors">
          <div className="pl-3 text-muted-gray group-focus-within:text-primary-gold transition-colors flex items-center gap-1 shrink-0">
            <Smartphone size={13} />
            <span className="text-xs font-mono font-bold text-muted-gray/40 select-none">+91</span>
          </div>
          
          {/* FIXED (Issue 2): Input type updated to tel format with inline non-digit extraction regex safety blocks */}
          <input
            type="tel"
            required
            maxLength={10}
            disabled={submitting}
            placeholder="Enter WhatsApp number..."
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="w-full h-full bg-transparent px-2 text-xs text-pure-white focus:outline-none font-mono tracking-widest placeholder:font-heading placeholder:tracking-normal placeholder:text-muted-gray/40"
          />
          
          <button
            type="submit"
            disabled={submitting}
            className="h-8 px-4 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray/20 disabled:text-muted-gray text-deep-black font-heading font-bold uppercase tracking-wider text-[10px] rounded-md transition-all shrink-0 flex items-center justify-center min-w-[70px] transform active:scale-95 shadow"
          >
            {submitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              "Watch"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NotifyMe;
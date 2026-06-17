import React, { useState } from "react";
import { Ticket, X, Loader2, CheckCircle2 } from "lucide-react";
// FIXED (Issue 1): Standardized custom hook resolution path to point directly to the central directory
import useCart from "../../hooks/useCart";

const CouponInput = () => {
  // FIXED (Issue 2): Consolidated context values consumer layout hooks matching production parameters
  const { appliedCoupon, applyCouponCode, removeCouponCode } = useCart();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState({ error: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    const sanitizedCode = code.trim().toUpperCase();
    if (!sanitizedCode) return;

    setLoading(true);
    setFeedback({ error: false, message: "" });

    try {
      // Passes sanitized token directly to context network dispatch pipelines
      const res = await applyCouponCode(sanitizedCode);
      
      if (res && res.success) {
        setCode("");
        setFeedback({ error: false, message: "Promo coupon code linked to active session!" });
      } else {
        setFeedback({ 
          error: true, 
          message: res?.message || "Voucher invalid or minimum order conditions not reached" 
        });
      }
    } catch (err) {
      console.error("Voucher application layer runtime exception caught:", err);
      setFeedback({ error: true, message: "System failure syncing promo parameters." });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = () => {
    removeCouponCode();
    setFeedback({ error: false, message: "" });
  };

  return (
    <div className="space-y-2 select-none animate-fade-in">
      {appliedCoupon ? (
        /* FIXED (Issue 3): Upgraded active display layout badge to natively calculate and render saved Rupee amount deductions */
        <div className="flex items-center justify-between p-2.5 bg-success-green/10 border border-success-green/20 rounded-lg text-success-green animate-fade-in font-medium text-[11px]">
          <div className="flex items-center gap-1.5 truncate">
            <Ticket size={13} className="shrink-0 animate-pulse text-success-green" />
            <span className="uppercase font-heading font-extrabold tracking-wider truncate">
              CODE LOCKED: {appliedCoupon.code} — SAVE ₹{(appliedCoupon.discount || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <button 
            type="button"
            onClick={handleRemoveClick} 
            className="text-muted-gray hover:text-error-red p-1 transition-colors shrink-0 rounded focus:outline-none"
            title="Erase applied promo code"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Open alphanumeric text form input field */
        <form onSubmit={handleApply} className="flex h-10 border border-border-dark bg-deep-black rounded-lg overflow-hidden pr-1 focus-within:border-primary-gold transition-colors items-center group">
          <div className="pl-3 text-muted-gray group-focus-within:text-primary-gold transition-colors flex items-center shrink-0">
            <Ticket size={14} />
          </div>
          <input
            type="text"
            disabled={loading}
            placeholder="PROMO CODE (WELCOME10)..."
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (feedback.message) setFeedback({ error: false, message: "" });
            }}
            className="w-full h-full bg-transparent px-2.5 font-heading uppercase tracking-widest text-[11px] text-pure-white focus:outline-none placeholder:tracking-normal placeholder:normal-case placeholder:text-muted-gray/40"
          />
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="h-8 my-1 px-4 bg-card-dark hover:bg-border-dark border border-border-dark/60 text-pure-white font-heading font-bold uppercase tracking-wider text-[10px] rounded-md transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0 flex items-center justify-center min-w-[64px] transform active:scale-95"
          >
            {loading ? (
              <Loader2 size={11} className="animate-spin text-muted-gray" />
            ) : (
              "Link"
            )}
          </button>
        </form>
      )}

      {/* Real-time Validation Action Feedback Label */}
      {feedback.message && (
        <p className={`text-[10px] font-semibold uppercase tracking-wider px-1 flex items-center gap-1 animate-fade-in ${
          feedback.error ? "text-error-red" : "text-success-green"
        }`}>
          {!feedback.error && <CheckCircle2 size={10} />}
          <span>{feedback.message}</span>
        </p>
      )}
    </div>
  );
};

export default CouponInput;
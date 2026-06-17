import React, { useState } from "react";
import { Award, UserMinus, Plus, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import api from "../../utils/api";

const AdminLoyalty = () => {
  const [adjustment, setAdjustment] = useState({ email: "", points: "", description: "Manual Customer Service Adjustment" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: "", error: "" });

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustment.email.trim() || !adjustment.points) return;

    setIsSubmitting(true);
    setFeedback({ success: "", error: "" });

    try {
      const res = await api.post("/loyalty/admin/adjust", {
        email: adjustment.email.trim().toLowerCase(),
        points: Number(adjustment.points),
        reason: adjustment.description.trim()
      });
      setFeedback({ success: res.data?.message || "Rider rewards profile re-indexed successfully.", error: "" });
      setAdjustment({ email: "", points: "", description: "Manual Customer Service Adjustment" });
    } catch (err) {
      setFeedback({ success: "", error: err.response?.data?.message || "Profile lookup failed. Target email resource not found." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Loyalty Adjustment <span className="text-primary-gold">Terminal</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Manually credit or debit reward points on verified rider accounts.</p>
      </div>

      <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-primary-gold border-b border-border-dark/60 pb-3 mb-4">
          <Award size={16} />
          <h2 className="font-heading font-bold uppercase text-sm tracking-wide">Discretionary Reward Modifiers</h2>
        </div>

        {feedback.success && (
          <div className="mb-4 p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-medium">
            <ShieldCheck size={15} className="shrink-0" /> <span>{feedback.success}</span>
          </div>
        )}

        {feedback.error && (
          <div className="mb-4 p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-medium">
            <AlertCircle size={15} className="shrink-0" /> <span>{feedback.error}</span>
          </div>
        )}

        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Rider Account Email Target</label>
            <input
              type="email"
              required
              value={adjustment.email}
              onChange={(e) => setAdjustment({ ...adjustment, email: e.target.value })}
              className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              placeholder="rider@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Points Quantum Offset</label>
            <input
              type="number"
              required
              value={adjustment.points}
              onChange={(e) => setAdjustment({ ...adjustment, points: e.target.value })}
              className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold"
              placeholder="Use positive numbers to grant, negative to deduct (e.g. 500 or -250)"
            />
          </div>

          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Audit Trail Justification Reference</label>
            <input
              type="text"
              required
              value={adjustment.description}
              onChange={(e) => setAdjustment({ ...adjustment, description: e.target.value })}
              className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary-gold hover:bg-gold-hover disabled:bg-primary-gold/40 text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Committing Point Changes...</span>
                </>
              ) : (
                <span>Commit Reward Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoyalty;
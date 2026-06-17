import React, { useState } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2, Lock } from "lucide-react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

// FIXED (Issue 3): Added productId parameter hook to props layout block
const ReviewSection = ({ reviews = [], productId }) => {
  const { isAuthenticated } = useAuth();

  // Controlled Review Form State Managers
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FIXED (Issue 3): Real implementation loop connecting submission forms to the backend
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      // Commits review data payload straight to backend review creation endpoints
      await api.post("/reviews", {
        product: productId,
        rating: newRating,
        comment: newComment.trim()
      });

      setIsSubmitted(true);
      setNewComment("");
    } catch (err) {
      console.error("Back-office review insertion pipeline error dropped:", err);
      alert(err.response?.data?.message || "Review pipeline rejected submission. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="w-full bg-card-dark border border-border-dark rounded-xl p-5 space-y-6 select-none animate-fade-in">
      
      {/* Aggregated Rating Headers Matrix Section */}
      <div className="flex items-center gap-4 border-b border-border-dark pb-4">
        <div className="text-center bg-deep-black/60 px-4 py-2 border border-border-dark rounded-xl min-w-[70px]">
          <span className="text-xl font-heading font-bold text-primary-gold block">{averageRating}</span>
          <span className="text-[9px] text-muted-gray font-heading font-bold uppercase tracking-widest">Overall</span>
        </div>
        <div className="space-y-0.5">
          <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-pure-white flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary-gold" />
            <span>Rider Telemetry Reviews</span>
          </h3>
          <p className="text-[11px] text-muted-gray font-medium">
            Aggregated verification loops from authenticated operators ({reviews.length} logs)
          </p>
        </div>
      </div>

      {/* Reviews Feeds Log Grid Canvas Layout */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-dark">
        {reviews.length === 0 ? (
          <p className="text-xs text-muted-gray italic text-center py-4">No reviews submitted for this tracking node reference yet.</p>
        ) : (
          reviews.map((rev, index) => {
            // FIXED (Issue 2): Adjusted variable properties to map with proper backend model schemas
            const reviewId = rev._id || index;
            const operatorHandleName = rev.user?.name || "Verified Rider";
            const processedTimestampDate = rev.createdAt 
              ? new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) 
              : "Recent Log";

            return (
              <div key={reviewId} className="border-b border-border-dark/30 pb-3.5 last:border-0 last:pb-0 space-y-1.5 animate-fade-in">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-pure-white font-heading font-bold uppercase tracking-wider">
                    {operatorHandleName}
                  </span>
                  <span className="text-muted-gray font-mono">
                    {processedTimestampDate}
                  </span>
                </div>
                
                {/* Visual Star Matrix Array Output Component */}
                <div className="flex text-primary-gold gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={10} 
                      fill={i < rev.rating ? "currentColor" : "none"} 
                      className={i < rev.rating ? "text-primary-gold" : "text-muted-gray/40"}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-gray leading-relaxed normal-case font-medium font-body">
                  {rev.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* FIXED (Issue 3): Interactive Customer Review Submission Form Framework Section */}
      <div className="border-t border-border-dark/60 pt-4">
        {isAuthenticated && !isSubmitted && (
          <form onSubmit={handleSubmitReview} className="space-y-4 animate-fade-in">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white">
              Write a Review
            </h4>
            
            {/* Interactive Rating Picker Control Selection Elements Row */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mr-1">
                Score Metric:
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setNewRating(star)}
                    className="transform transition-transform active:scale-90 hover:scale-110"
                  >
                    <Star 
                      size={16} 
                      fill={star <= newRating ? "currentColor" : "none"} 
                      className={star <= newRating ? "text-primary-gold" : "text-muted-gray"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Inputs Text Box Frame */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray">
                 Rationale Log Notes
              </label>
              <textarea 
                required 
                rows="3" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your e-commerce experience regarding protective gear material density, dimensions fit, or structural riding comfort..."
                className="w-full p-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold resize-none leading-relaxed transition-colors placeholder:text-muted-gray/40 font-medium font-body" 
              />
            </div>

            {/* Submit Action Control CTA Row */}
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="h-10 px-5 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-all shadow transform active:scale-95 disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Transmitting Log...</span>
                  </>
                ) : (
                  <span>Submit Operational Log</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success Form Execution Banner Token */}
        {isSubmitted && (
          <div className="p-3 bg-success-green/10 border border-success-green/30 text-success-green text-xs rounded-lg flex items-center justify-center gap-2 font-semibold text-center animate-fade-in font-body">
            <CheckCircle2 size={14} className="text-success-green shrink-0" />
            <span>Review logged successfully! It will appear sitewide across catalog sections instantly following back-office supervisor verification clearance.</span>
          </div>
        )}

        {/* Lock Banner Placeholder if Guest Session is Tracked */}
        {!isAuthenticated && (
          <div className="p-3 bg-deep-black border border-border-dark/80 rounded-lg flex items-center justify-between text-xs text-muted-gray font-medium font-body">
            <span className="flex items-center gap-1.5"><Lock size={12} className="text-muted-gray" /> Authenticated operators mode locked.</span>
            <button 
              onClick={() => navigate("/login")}
              className="text-primary-gold hover:text-gold-hover hover:underline uppercase font-heading font-bold text-[10px] tracking-wider transition-colors"
            >
              Sign In To Log Data
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewSection;
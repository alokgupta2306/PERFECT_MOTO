import React, { useState, useEffect } from "react";
import { MessageSquare, Check, X, Trash2, Star, ThumbsUp, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data?.reviews || []);
    } catch (err) {
      setError("Failed to synchronize moderation ledger feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, action) => {
    setActioningId(id);
    try {
      await api.put(`/reviews/${id}/${action}`);
      setReviews(prev =>
        prev.map(rev => (rev._id === id ? { ...rev, isApproved: action === "approve" } : rev))
      );
    } catch (err) {
      alert(`Operation failed while attempting to ${action} review.`);
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this review permanently from storefront index arrays?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(rev => rev._id !== id));
    } catch (err) {
      alert("Failed to delete review asset entry.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>SYNCHRONIZING REVIEWS MODERATION LEDGER...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Content Moderation <span className="text-primary-gold">Terminal</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Approve, reject, or purge public customer feedback and media attachments.</p>
      </div>

      {error && (
        <div className="p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-medium">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center">
          <MessageSquare size={36} className="text-muted-gray/40 mx-auto mb-2" />
          <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide">Ledger Clean</h4>
          <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1 normal-case">No customer reviews are pending moderation analysis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-card-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-border-dark/80 transition-all shadow-md">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-heading font-bold text-pure-white uppercase tracking-wider bg-deep-black border border-border-dark/60 px-2.5 py-0.5 rounded text-[10px]">
                    {review.user?.name || "Anonymous Rider"}
                  </span>
                  <div className="flex text-primary-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-muted-gray/30" : ""} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                    review.isApproved ? "bg-success-green/10 border border-success-green/20 text-success-green" : "bg-warning-amber/10 border border-warning-amber/20 text-warning-amber"
                  }`}>
                    {review.isApproved ? "Approved" : "Pending Sandbox"}
                  </span>
                </div>
                <h4 className="text-pure-white font-heading font-bold text-xs uppercase tracking-wide">
                  Product Focus: <span className="text-muted-gray font-body font-medium text-xs normal-case">{review.product?.name || "Unknown SKU Mapping"}</span>
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed normal-case font-medium">"{review.comment}"</p>
                {review.images?.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {review.images.map((img, i) => (
                      <img key={i} src={img.url} alt="Review attachment" className="h-14 w-14 object-cover rounded-md border border-border-dark" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 border-border-dark/40 pt-3 md:pt-0 justify-end">
                {!review.isApproved ? (
                  <button
                    disabled={actioningId === review._id}
                    onClick={() => handleStatusChange(review._id, "approve")}
                    className="h-8 w-8 bg-success-green/10 hover:bg-success-green text-success-green hover:text-deep-black rounded-lg border border-success-green/20 flex items-center justify-center transition-all disabled:opacity-40"
                    title="Approve and Publish Content"
                  >
                    <Check size={14} />
                  </button>
                ) : (
                  <button
                    disabled={actioningId === review._id}
                    onClick={() => handleStatusChange(review._id, "reject")}
                    className="h-8 w-8 bg-warning-amber/10 hover:bg-warning-amber text-warning-amber hover:text-deep-black rounded-lg border border-warning-amber/20 flex items-center justify-center transition-all disabled:opacity-40"
                    title="Reject and Unpublish Content"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="h-8 w-8 bg-deep-black hover:bg-error-red border border-border-dark hover:border-error-red/40 text-muted-gray hover:text-pure-white rounded-lg flex items-center justify-center transition-all"
                  title="Purge Document Entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
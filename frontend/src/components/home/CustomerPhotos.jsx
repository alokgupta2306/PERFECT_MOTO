import React, { useState, useEffect } from "react";
// FIXED: Removed broken Instagram brand icon from Lucide import
import { Camera, Heart, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const CustomerPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get("/reviews/photos?limit=8");
        setPhotos(res.data?.photos || []);
      } catch (err) {
        console.error("Failed to fetch gallery feed:", err);
        setError("Could not load gallery feed.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center text-muted-gray font-heading text-[10px] tracking-widest gap-2">
        <Loader2 size={16} className="animate-spin text-primary-gold" />
        <span>LOADING RIDER GALLERY FEED...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-error-red font-heading text-[10px] tracking-widest gap-1.5">
        <AlertCircle size={14} />
        <span>{error.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-deep-black py-12 px-4 sm:px-6 lg:px-8 text-xs font-body text-muted-gray select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="border-b border-border-dark/40 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-primary-gold font-heading font-extrabold uppercase tracking-widest block mb-1">
              Social Proof Pipeline
            </span>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
              #PerfectMotoCrew Lookbook
            </h2>
          </div>
          <Camera size={18} className="text-muted-gray/40" />
        </div>

        {/* Gallery Grid */}
        {photos.length === 0 ? (
          <div className="border border-dashed border-border-dark rounded-xl p-8 text-center text-muted-gray/60 bg-card-dark/10">
            No customer lookbook photos verified yet. Be the first to upload yours!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {photos.map((review, index) => {
              const displayImage = review.images?.[0]?.url || "/placeholder.jpg";
              return (
                <div 
                  key={review._id || index} 
                  className="bg-card-dark border border-border-dark/60 rounded-xl overflow-hidden group hover:border-primary-gold/40 transition-all duration-300 shadow-sm relative aspect-square"
                >
                  <img 
                    src={displayImage} 
                    alt={review.product?.name || "Rider Gear"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Hover Overlay Box */}
                  <div className="absolute inset-0 bg-deep-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between items-start backdrop-blur-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] text-primary-gold font-heading font-extrabold uppercase tracking-wider block">
                        @{review.user?.name || "Rider"}
                      </span>
                      <h4 className="text-[11px] font-heading font-bold text-pure-white uppercase tracking-wide line-clamp-2 leading-tight">
                        {review.product?.name || "Premium Upgrade"}
                      </h4>
                      <p className="text-[10px] text-muted-gray normal-case line-clamp-3 leading-normal mt-1">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* FIXED: Replaced lucide brand icon with a native inline vector SVG element */}
                    <div className="w-full flex items-center justify-between border-t border-border-dark/40 pt-2 text-muted-gray/60 text-[9px] font-mono">
                      <div className="flex items-center gap-1 text-error-red">
                        <Heart size={10} fill="currentColor" />
                        <span className="font-bold">{review.rating}/5</span>
                      </div>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-gray hover:text-primary-gold transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerPhotos;
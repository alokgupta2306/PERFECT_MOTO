import React, { useEffect, useState } from "react";
import { Camera, Image as ImageIcon, Star, MapPin, Loader2 } from "lucide-react";
import api from "../../utils/api";

const CustomerPhotos = ({ productId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerPhotos = async () => {
      if (!productId) return;
      try {
        // Hooks directly into approved public review media stream arrays
        const res = await api.get(`/reviews/${productId}/photos`);
        setPhotos(res.data?.photos || res.data || []);
      } catch (err) {
        console.error("Failed to extract customer masonry photo ledger fields:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerPhotos();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center text-muted-gray gap-2 font-heading tracking-wider">
        <Loader2 size={16} className="animate-spin text-primary-gold" />
        <span>PARSING REAL RIDER EXPERIENCES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Structural Header Grid */}
      <div className="flex items-center gap-2 border-b border-border-dark/60 pb-3">
        <Camera size={16} className="text-primary-gold" />
        <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-pure-white">
          Photos From Our Customers
        </h3>
      </div>

      {/* Conditionally show fallback empty states matching Feature 7 PRD rules */}
      {photos.length === 0 ? (
        <div className="border border-dashed border-border-dark rounded-xl p-8 text-center bg-card-dark/10">
          <ImageIcon size={28} className="text-muted-gray/30 mx-auto mb-2" />
          <p className="text-xs text-muted-gray uppercase font-heading font-bold tracking-wide">
            Be the first to share a photo!
          </p>
          <p className="text-[11px] text-muted-gray/50 mt-0.5 normal-case">
            Upload your on-bike fitment matching profiles during review lookup to unlock loyalty bonuses.
          </p>
        </div>
      ) : (
        /* CSS Column Masonry Grid Layout: 4 columns desktop, 2 columns mobile */
        <div className="columns-2 md:columns-4 gap-4 space-y-4 [column-fill:_balance] box-border">
          {photos.map((photo, index) => (
            <div 
              key={photo._id || index} 
              className="break-inside-avoid bg-card-dark border border-border-dark rounded-xl overflow-hidden relative group aspect-auto shadow-md"
            >
              <img
                src={photo.url}
                alt="Rider setup submission mapping"
                className="w-full h-auto object-cover max-h-72 transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              
              {/* Contextual Interaction Hover Overlay Card */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 pointer-events-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-[10px] tracking-wider text-pure-white uppercase">
                      {photo.reviewerName || "Verified Rider"}
                    </span>
                    {photo.reviewerRating && (
                      <div className="flex text-primary-gold items-center gap-0.5 text-[9px] font-mono font-bold">
                        <Star size={8} fill="currentColor" />
                        <span>{photo.reviewerRating}</span>
                      </div>
                    )}
                  </div>
                  
                  {photo.reviewerCity && (
                    <div className="flex items-center gap-1 text-muted-gray text-[9px] font-medium font-sans">
                      <MapPin size={8} className="text-primary-gold" />
                      <span className="truncate">{photo.reviewerCity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerPhotos;
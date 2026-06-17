import React, { useState } from "react";

const ImageGallery = ({ images = [] }) => {
  const fallbackImg = "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80";

  // FIXED (Issue 1 & Issue 2): Sort by isMain property flag first, then extract the secure Cloudinary media URLs
  const sortedImages = Array.isArray(images) ? [...images].sort((a, b) => {
    const aMain = typeof a === "object" && a !== null ? !!a.isMain : false;
    const bMain = typeof b === "object" && b !== null ? !!b.isMain : false;
    return bMain - aMain; // Descending placement pushes true markers to index 0
  }) : [];

  const normalizedImages = sortedImages.length > 0
    ? sortedImages.map((img) => {
        if (!img) return null;
        return typeof img === "string" ? img : img.url;
      }).filter(Boolean)
    : [];

  const activeImages = normalizedImages.length > 0 ? normalizedImages : [fallbackImg];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="w-full space-y-3 shrink-0 select-none animate-fade-in">
      {/* Primary Display Sheet Frame */}
      <div className="w-full h-80 md:h-96 bg-card-dark border border-border-dark rounded-xl overflow-hidden relative group shadow-md flex items-center justify-center">
        {/* FIXED (Issue 4): Appended an explicit runtime onError handler to recover from broken media asset fetches */}
        <img 
          src={activeImages[activeIdx]} 
          alt="Product Shell Overview" 
          onError={(e) => {
            e.target.onerror = null; // Kill loop cycles if fallback image itself encounters a break
            e.target.src = fallbackImg;
          }}
          // FIXED (Issue 3): Shifted scale adjustments over to use valid core Tailwind structural properties
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Roll Slider Matrix */}
      {activeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-border-dark max-w-full">
          {activeImages.map((img, idx) => {
            const isSelected = idx === activeIdx;

            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border bg-deep-black shrink-0 transition-all transform active:scale-95 duration-200 ${
                  isSelected 
                    ? "border-primary-gold shadow-gold-glow-subtle opacity-100 scale-102" 
                    : "border-border-dark opacity-40 hover:opacity-80"
                }`}
                title={`View image variant panel ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt={`Snapshot variant profile ${idx + 1}`} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                  className="w-full h-full object-cover object-center group-hover:opacity-100 transition-opacity" 
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
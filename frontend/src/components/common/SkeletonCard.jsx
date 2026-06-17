import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-4 space-y-4 w-full animate-pulse">
      {/* Thumbnail Shell Image Block */}
      <div className="w-full h-40 bg-deep-black/60 rounded-lg" />
      
      {/* Metadata Indicators Blocks */}
      <div className="space-y-2">
        <div className="h-3 bg-deep-black/60 rounded w-1/4" />
        <div className="h-4 bg-deep-black/60 rounded w-3/4" />
        <div className="h-4 bg-deep-black/60 rounded w-1/2" />
      </div>
      
      {/* Footer Action Matrix Block */}
      <div className="flex justify-between items-center pt-2 border-t border-border-dark/40">
        <div className="h-4 bg-deep-black/60 rounded w-1/3" />
        <div className="h-8 bg-deep-black/60 rounded w-1/4" />
      </div>
    </div>
  );
};

export default SkeletonCard;
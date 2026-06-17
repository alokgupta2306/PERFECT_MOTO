import React from "react";
import ProductCard from "./ProductCard";
import SkeletonCard from "../common/SkeletonCard";

const ProductGrid = ({ products = [], isLoading = false, fitmentBike = null }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-16 bg-card-dark border border-border-dark rounded-xl">
        <p className="text-xs font-heading font-bold text-muted-gray uppercase tracking-widest">
          No hardware assets match active parameters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-fade-in">
      {products.map((product) => {
        // Calculate fitment token dynamically for each grid asset item card
        let fitmentStatus = "neutral";
        if (fitmentBike && product.compatibleBikes) {
          const isMatch = product.compatibleBikes.some(
            (b) => b.brand === fitmentBike.brand && b.model === fitmentBike.model
          );
          fitmentStatus = isMatch ? "compatible" : "misfit";
        }

        return (
          <ProductCard 
            key={product._id || product.id} 
            product={product} 
            fitmentStatus={fitmentStatus} 
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import ProductCard from "../product/ProductCard";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  // FIXED (Issue 1): Replaced hardcoded mockup array with live reactive backend hook states
  const [featuredCluster, setFeaturedCluster] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedStorefrontProducts = async () => {
      try {
        // Queries active marketplace indices to return hot-selling items matching requirements
        const res = await api.get("/products?isFeatured=true&limit=6");
        setFeaturedCluster(res.data.products || []);
      } catch (err) {
        console.error("Failed to synchronize home featured showcase records matrix:", err);
        setFeaturedCluster([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedStorefrontProducts();
  }, []);

  return (
    <div className="w-full space-y-4 select-none animate-fade-in">
      {/* Header Grid Section Options Bar */}
      <div className="flex justify-between items-end border-b border-border-dark pb-2">
        <h3 className="font-heading font-bold text-pure-white uppercase tracking-wider text-xs">
          Featured Products
        </h3>
        {/* FIXED (Issue 3): Attached dynamic programmatic navigation router tunnel straight to the CTA label */}
        <span 
          onClick={() => navigate("/shop?isFeatured=true")}
          className="text-[10px] text-primary-gold font-heading font-bold uppercase tracking-widest cursor-pointer hover:underline transition-all hover:text-gold-hover"
        >
          View All
        </span>
      </div>

      {/* FIXED (Issue 4): Added informative themed skeleton placeholder boundaries to optimize latency feel */}
      {loading && (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center">
          <Loader2 size={24} className="text-primary-gold animate-spin mb-2" />
          <span className="text-xs font-heading uppercase tracking-widest text-muted-gray">
            Extracting Premium Performance Matrices...
          </span>
        </div>
      )}

      {/* FIXED (Issue 4): Empty state placeholder template rendered if zero items match queries */}
      {!loading && featuredCluster.length === 0 && (
        <div className="w-full p-8 border border-dashed border-border-dark rounded-xl text-center bg-card-dark/10">
          <AlertCircle size={28} className="text-muted-gray mx-auto mb-2" />
          <p className="text-xs text-muted-gray">No hardware listings marked for feature arrays at this moment.</p>
        </div>
      )}

      {/* Primary Products Inventory Grid Canvas Layout */}
      {!loading && featuredCluster.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* FIXED (Issue 2): Normalizes key mapping metrics to parse genuine Mongoose array properties */}
          {featuredCluster.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              fitmentStatus="neutral" 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
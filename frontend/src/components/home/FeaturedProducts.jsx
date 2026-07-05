import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";
import ProductCard from "../product/ProductCard";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  // Replaced hardcoded mockup array with live reactive backend hook states
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
        {/* Attached dynamic programmatic navigation router tunnel straight to the CTA label */}
        <span 
          onClick={() => navigate("/shop?isFeatured=true")}
          className="text-[10px] text-primary-gold font-heading font-bold uppercase tracking-widest cursor-pointer hover:underline transition-all hover:text-gold-hover"
        >
          View All
        </span>
      </div>

      {/* Added informative themed skeleton placeholder boundaries to optimize latency feel */}
      {loading && (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center">
          <Loader2 size={24} className="text-primary-gold animate-spin mb-2" />
          <span className="text-xs font-heading uppercase tracking-widest text-muted-gray">
            Extracting Premium Performance Matrices...
          </span>
        </div>
      )}

      {/* Empty state placeholder template rendered if zero items match queries */}
      {!loading && featuredCluster.length === 0 && (
        <div className="w-full p-8 border border-dashed border-border-dark rounded-xl text-center bg-card-dark/10">
          <AlertCircle size={28} className="text-muted-gray mx-auto mb-2" />
          <p className="text-xs text-muted-gray">No hardware listings marked for feature arrays at this moment.</p>
        </div>
      )}

      {/* Horizontal Scroll-Snap Carousel Layout Deck */}
      {!loading && featuredCluster.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {featuredCluster.map((product) => (
            <div 
              key={product._id} 
              className="shrink-0 snap-start w-[62%] xs:w-[48%] sm:w-[40%] md:w-[30%] lg:w-[23%]"
            >
              <ProductCard 
                product={product} 
                fitmentStatus="neutral" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Sliders, Loader2 } from "lucide-react";
// FIXED (Issue 1 & 4): Imported central API orchestration utility
import api from "../utils/api";
// FIXED (Issue 2): Sourced the standardized, global product card layout component
import ProductCard from "../components/product/ProductCard";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  // FIXED (Issue 1): Replaced static in-memory lists with dynamic backend state variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED (Issue 1 & 4): Real-time network pipeline fetches category collections cleanly on parameter shifts
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Dispatches the active url tracking slug parameter straight to productController.getProducts
        const res = await api.get("/products", {
          params: { category: categorySlug }
        });
        
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to synchronize category collection arrays:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  // FIXED (Issue 4): Structured text formatting utility to capitalize incoming URL slug strings cleanly
  const formattedCategoryTitle = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).toLowerCase()
    : "Collection";

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in font-body text-xs text-muted-gray select-none">
      
      {/* Breadcrumb Path Trace */}
      <nav className="flex items-center gap-2 text-xs text-muted-gray uppercase tracking-wider mb-6 font-heading font-bold">
        <span className="cursor-pointer hover:text-primary-gold transition-colors" onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={11} className="text-muted-gray/40" />
        <span className="cursor-pointer hover:text-primary-gold transition-colors" onClick={() => navigate("/shop")}>Shop</span>
        <ChevronRight size={11} className="text-muted-gray/40" />
        <span className="text-pure-white truncate">{formattedCategoryTitle}</span>
      </nav>

      {/* Dynamic Section Header Layout */}
      <div className="border-b border-border-dark/60 pb-4 mb-6">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Category: <span className="text-primary-gold">{formattedCategoryTitle}</span>
        </h1>
      </div>

      {/* FIXED (Issue 4): Conditional Pipeline States Matrix Render Blocks */}
      {loading ? (
        <div className="min-h-[350px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
          <Loader2 size={24} className="animate-spin text-primary-gold" />
          <span>SYNCHRONIZING LIVE CATEGORY STREAM DATA...</span>
        </div>
      ) : products.length === 0 ? (
        /* Empty Fallback Collection Template Box */
        <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16 animate-fade-in">
          <Sliders size={36} className="text-muted-gray/40 mx-auto mb-3 animate-pulse" />
          <h4 className="text-pure-white font-heading font-bold uppercase text-sm tracking-wide">No items found in this collection</h4>
          <p className="text-xs text-muted-gray mt-1 max-w-xs mx-auto leading-normal normal-case font-medium">
            Our technical logistics terminal has not allocated catalog stock under the <span className="text-primary-gold font-bold font-mono">"{categorySlug}"</span> profile index yet.
          </p>
          <button 
            type="button"
            onClick={() => navigate("/shop")} 
            className="mt-6 h-10 px-5 bg-primary-gold hover:bg-gold-hover text-deep-black text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all shadow-md transform active:scale-95 duration-100"
          >
            Browse All Gear
          </button>
        </div>
      ) : (
        /* FIXED (Issue 2 & 3): Multi-Grid Output processing mapped variables cleanly through pre-audited components */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {products.map((productItem) => (
            <ProductCard 
              key={productItem._id} 
              product={productItem} 
              fitmentStatus="neutral" // Instructs the card layer to process garage compatibility parameters on the fly
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Loader2 } from "lucide-react";
import api from "../../utils/api";

const CategoryGrid = () => {
  const navigate = useNavigate();

  // FIXED (Issue 1): Replaced hardcoded mockup dataset with active data hydration hooks
  const [taxonomyNodes, setTaxonomyNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesFromDatabase = async () => {
      try {
        // Queries active category registries as planned in step #2 of your testing sequence
        const res = await api.get("/categories");
        setTaxonomyNodes(res.data.categories || []);
      } catch (err) {
        console.error("Storefront category taxonomy sync trace failure:", err);
        setTaxonomyNodes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriesFromDatabase();
  }, []);

  // FIXED (Issue 3): Explicit themed loading state boundary overlay
  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center">
        <Loader2 size={24} className="text-primary-gold animate-spin mb-2" />
        <span className="text-xs font-heading uppercase tracking-widest text-muted-gray">
          Hydrating Accessory Spheres...
        </span>
      </div>
    );
  }

  // FIXED (Issue 3): Empty state placeholder view fallback
  if (!loading && taxonomyNodes.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-border-dark rounded-xl text-center">
        <Layers size={32} className="text-muted-gray mx-auto mb-2" />
        <p className="text-xs text-muted-gray">No categories found in active cluster registry segments.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 select-none">
      <div className="border-b border-border-dark pb-2">
        <h3 className="font-heading font-bold text-pure-white uppercase tracking-wider text-xs">
          Shop By Category
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* FIXED (Issue 2): Re-engineered mapping loop to parse true Mongoose model criteria schema keys */}
        {taxonomyNodes.map((node) => {
          const categoryId = node._id;
          const categoryName = node.name;
          const categorySlug = node.slug;
          const categoryImage = node.image?.url;

          return (
            <div
              key={categoryId}
              onClick={() => navigate(`/shop?category=${categorySlug}`)}
              className="bg-card-dark border border-border-dark hover:border-primary-gold hover:shadow-gold-glow p-5 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col justify-between h-32"
            >
              {/* Thumbnail asset layout frame rendering with optimization fallbacks */}
              <div className="w-10 h-10 bg-deep-black rounded-lg overflow-hidden border border-border-dark shrink-0 flex items-center justify-center">
                {categoryImage ? (
                  <img 
                    src={categoryImage} 
                    alt={categoryName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                ) : (
                  <div className="text-primary-gold group-hover:scale-105 transition-transform">
                    <Layers size={20} />
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-heading font-bold uppercase text-[11px] text-pure-white tracking-wide mt-3 group-hover:text-primary-gold transition-colors">
                  {categoryName}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
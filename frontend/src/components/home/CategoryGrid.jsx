import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Loader2 } from "lucide-react";
import api from "../../utils/api";

const CategoryGrid = () => {
  const navigate = useNavigate();

  // Replaced hardcoded mockup dataset with active data hydration hooks
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

  // Explicit themed loading state boundary overlay
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

  // Empty state placeholder view fallback
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
      
      {/* Horizontal Scroll-Snap Carousel Layout Deck */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        {taxonomyNodes.map((node) => {
          const categoryId = node._id;
          const categoryName = node.name;
          const categorySlug = node.slug;
          const categoryImage = node.image?.url || node.image;

          return (
            <div
              key={categoryId}
              onClick={() => navigate(`/shop?category=${categorySlug}`)}
              className="shrink-0 snap-start w-[38%] xs:w-[30%] sm:w-[22%] md:w-[16%] lg:w-[13%] bg-card-dark border border-border-dark hover:border-primary-gold hover:shadow-gold-glow p-4 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col items-center text-center gap-2 aspect-square justify-center"
            >
              {/* Thumbnail asset layout frame rendering with optimization fallbacks */}
              <div className="w-12 h-12 bg-deep-black rounded-lg overflow-hidden border border-border-dark shrink-0 flex items-center justify-center">
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
              
              <h4 className="font-heading font-bold uppercase text-[10px] text-pure-white tracking-wide group-hover:text-primary-gold transition-colors leading-tight">
                {categoryName}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, CheckCircle2, AlertTriangle, ShoppingCart, Sliders } from "lucide-react";
import useCart from "../hooks/useCart";
import api from "../utils/api";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  // URL Parameter Sync
  const urlBrand = searchParams.get("brand") || "";
  const urlModel = searchParams.get("model") || "";
  const urlYear  = searchParams.get("year")  || "";
  const urlCategory = searchParams.get("category") || "";

  // Filter UI States
  const [activeCategory, setActiveCategory]       = useState(urlCategory || "all");
  const [priceRange, setPriceRange]               = useState(6000);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("all");
  const [activeGarageBike, setActiveGarageBike]   = useState(null);

  // API Data States
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Priority 1: URL params → Priority 2: localStorage garage cache
  useEffect(() => {
    if (urlBrand && urlModel) {
      setActiveGarageBike({
        brand: urlBrand,
        model: urlModel,
        year: urlYear ? parseInt(urlYear) : null
      });
    } else {
      const savedGarage = localStorage.getItem("perfectmoto_garage_primary");
      setActiveGarageBike(savedGarage ? JSON.parse(savedGarage) : null);
    }
  }, [urlBrand, urlModel, urlYear, searchParams]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories || res.data.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from API whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== "all") params.category = activeCategory;
        if (selectedBrandFilter !== "all") params.brand = selectedBrandFilter;
        params.maxPrice = priceRange;

        const res = await api.get("/products", { params });
        setProducts(res.data.products || res.data.data || []);
        setTotalCount(res.data.total || 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, selectedBrandFilter, priceRange]);

  // Compatibility check against active garage bike
  const checkBikeCompatibility = (product) => {
    if (!activeGarageBike) return "neutral";
    const isMatch = product.compatibleBikes?.some(
      (bike) =>
        bike.brand.toLowerCase() === activeGarageBike.brand.toLowerCase() &&
        bike.model.toLowerCase() === activeGarageBike.model.toLowerCase()
    );
    return isMatch ? "compatible" : "misfit";
  };

  const clearGarageFilter = () => {
    localStorage.removeItem("perfectmoto_garage_primary");
    setSearchParams({});
    setActiveGarageBike(null);
  };

  // Unique brand list derived from fetched products
  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Active Garage Filter Header */}
      {activeGarageBike && (
        <div className="w-full bg-card-dark border border-primary-gold/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
          <div>
            <span className="text-[10px] text-primary-gold uppercase tracking-widest font-heading font-bold block">Active Filtering Diagnostic</span>
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-pure-white mt-0.5">
              Showing gear compatible with:{" "}
              <span className="text-primary-gold font-extrabold">
                {activeGarageBike.brand} {activeGarageBike.model}
              </span>{" "}
              {activeGarageBike.year && `(${activeGarageBike.year})`}
            </h3>
          </div>
          <button
            onClick={clearGarageFilter}
            className="text-xs bg-deep-black hover:bg-error-red/10 border border-border-dark hover:border-error-red text-muted-gray hover:text-error-red px-4 h-9 rounded-lg uppercase tracking-wider font-heading font-bold transition-colors"
          >
            Reset Vehicle Filter
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ================= SIDEBAR FILTER CONTROLS ================= */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-card-dark border border-border-dark p-5 rounded-xl shadow-sm">

            <div className="flex items-center gap-2 mb-4 border-b border-border-dark pb-3">
              <SlidersHorizontal size={16} className="text-primary-gold" />
              <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">Catalog Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray mb-2">Category</h4>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                <button
                  onClick={() => { setActiveCategory("all"); setSearchParams({}); }}
                  className={`h-9 px-3 text-left rounded-md text-xs font-heading uppercase tracking-wider font-semibold transition-all border ${
                    activeCategory === "all"
                      ? "bg-primary-gold text-deep-black border-primary-gold"
                      : "bg-deep-black text-muted-gray border-border-dark hover:text-pure-white"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    onClick={() => { setActiveCategory(cat.slug); setSearchParams({ category: cat.slug }); }}
                    className={`h-9 px-3 text-left rounded-md text-xs font-heading uppercase tracking-wider font-semibold transition-all border ${
                      activeCategory === cat.slug
                        ? "bg-primary-gold text-deep-black border-primary-gold"
                        : "bg-deep-black text-muted-gray border-border-dark hover:text-pure-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray">Max Price</h4>
                <span className="text-xs font-mono font-bold text-primary-gold">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-deep-black rounded-lg appearance-none cursor-pointer accent-primary-gold"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray mb-2">Brand</h4>
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="w-full h-10 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-heading uppercase tracking-wider focus:outline-none focus:border-primary-gold"
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

          </div>
        </aside>

        {/* ================= PRODUCT GRID ================= */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs text-muted-gray uppercase tracking-wider font-semibold">
              Found <span className="text-pure-white font-bold">{totalCount || products.length}</span> Riding Accessories
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-muted-gray py-12 font-heading text-sm tracking-widest animate-pulse">
              LOADING CATALOGUE INVENTORY...
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="w-full border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center">
              <Sliders size={40} className="text-muted-gray mx-auto mb-3 animate-pulse" />
              <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide">No Matches Found</h4>
              <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1">Try relaxing your price constraints or expanding your brand selections.</p>
            </div>
          )}

          {/* Product Cards */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const compatibility = checkBikeCompatibility(product);
                const displayPrice = product.salePrice && product.salePrice > 0
                  ? product.salePrice
                  : product.price;

                return (
                  <div
  key={product._id}
  onClick={() => navigate(`/product/${product.slug || product._id}`)}
  className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md flex flex-col group transition-all duration-300 hover:border-muted-gray relative cursor-pointer"
>
                    {/* Compatibility Badge */}
                    {compatibility === "compatible" && (
                      <div className="absolute top-3 left-3 z-10 bg-success-green text-deep-black font-heading text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md border border-success-green">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        <span>100% Fit</span>
                      </div>
                    )}
                    {compatibility === "misfit" && (
                      <div className="absolute top-3 left-3 z-10 bg-error-red text-pure-white font-heading text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md border border-error-red animate-pulse">
                        <AlertTriangle size={12} strokeWidth={3} />
                        <span>Misfit Warning</span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-48 bg-deep-black overflow-hidden shrink-0">
                      <img
                        src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-primary-gold font-heading font-bold uppercase tracking-widest block">{product.brand}</span>
                        <h4 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wide group-hover:text-primary-gold transition-colors mt-0.5 line-clamp-2">
                          {product.name}
                        </h4>
                      </div>

                      <div className="flex justify-between items-center mt-auto border-t border-border-dark pt-3">
                        <div>
                          <span className="text-lg font-mono font-bold text-pure-white">₹{displayPrice}</span>
                          {product.salePrice && product.salePrice > 0 && product.salePrice < product.price && (
                            <span className="text-xs text-muted-gray line-through ml-2">₹{product.price}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.slug || product._id}`); }}
                          disabled={compatibility === "misfit" || product.stock <= 0}
                          className="h-9 px-4 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray disabled:opacity-30 disabled:cursor-not-allowed text-deep-black font-heading font-bold uppercase text-xs tracking-wider rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <ShoppingCart size={14} />
                          <span>{product.stock <= 0 ? "Out" : "Add"}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
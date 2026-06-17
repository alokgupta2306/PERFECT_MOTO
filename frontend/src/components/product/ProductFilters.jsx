import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  availableBrands = ["Vega", "Steelbird", "Axor", "KTM Parts"] 
}) => {
  return (
    <div className="w-full md:w-64 bg-card-dark border border-border-dark p-5 rounded-xl space-y-6 shrink-0 h-fit">
      <div className="flex items-center justify-between border-b border-border-dark pb-3">
        <div className="flex items-center gap-1.5 text-pure-white font-heading font-bold uppercase text-xs tracking-wider">
          <SlidersHorizontal size={14} className="text-primary-gold" />
          <span>Filter Parameters</span>
        </div>
        <button 
          onClick={onResetFilters}
          className="text-[10px] text-muted-gray hover:text-primary-gold uppercase tracking-widest font-heading font-bold flex items-center gap-0.5"
        >
          <RotateCcw size={10} /> <span>Reset</span>
        </button>
      </div>

      {/* Pricing Range Inputs */}
      <div className="space-y-2">
        <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray">
          Price Range Boundary (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => onFilterChange("minPrice", parseInt(e.target.value) || 0)}
            className="w-full h-9 px-2 bg-deep-black border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold text-pure-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange("maxPrice", parseInt(e.target.value) || 0)}
            className="w-full h-9 px-2 bg-deep-black border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold text-pure-white"
          />
        </div>
      </div>

      {/* Brands Selector */}
      <div className="space-y-2">
        <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray">
          Manufacturer Brand
        </label>
        <div className="space-y-1.5">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-xs text-muted-gray cursor-pointer hover:text-pure-white select-none">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) || false}
                onChange={(e) => {
                  const updated = filters.brands ? [...filters.brands] : [];
                  if (e.target.checked) updated.push(brand);
                  else {
                    const idx = updated.indexOf(brand);
                    if (idx > -1) updated.splice(idx, 1);
                  }
                  onFilterChange("brands", updated);
                }}
                className="accent-primary-gold cursor-pointer"
              />
              <span className="pt-0.5 font-medium">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Only Show In-Stock Switch */}
      <div className="pt-2 border-t border-border-dark/60">
        <label className="flex items-center justify-between text-[11px] font-heading font-bold uppercase tracking-wider text-muted-gray cursor-pointer hover:text-pure-white">
          <span>In-Stock Logistics Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly || false}
            onChange={(e) => onFilterChange("inStockOnly", e.target.checked)}
            className="accent-primary-gold cursor-pointer h-3.5 w-3.5"
          />
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
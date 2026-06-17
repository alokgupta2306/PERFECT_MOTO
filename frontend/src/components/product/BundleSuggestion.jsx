import React from "react";
import { Plus, Link2, ShoppingCart } from "lucide-react";
// FIXED (Issue 1): Standardized context hook path matching your unified modular layout structure
import useCart from "../../hooks/useCart";

// FIXED (Issue 4 & Issue 6): Signature adjusted to ingest the complete backend Bundle object model 
const BundleSuggestion = ({ bundle }) => {
  // FIXED (Issue 1): Extracted correct modular method exposed by useCart
  const { addItemToCart } = useCart();

  if (!bundle || !bundle.products || bundle.products.length < 2) return null;

  // FIXED (Issue 4): Read pricing and total savings parameters natively from database settings
  const bundlePrice = bundle.bundlePrice || 0;
  const computedSavings = bundle.savings || ((bundle.originalTotal || 0) - bundlePrice);

  // FIXED (Issue 3): Dynamically parse item definitions securely off Mongoose nested models
  const firstProduct = bundle.products[0]?.product;
  const secondProduct = bundle.products[1]?.product;

  // Safeguard view assembly layer if referenced products inside the bundle are incomplete
  if (!firstProduct || !secondProduct) return null;

  // FIXED (Issue 2): Re-engineered function loop to map item metrics accurately into cart handlers
  const handleDeployBundle = () => {
    bundle.products.forEach((item) => {
      const targetProduct = item.product;
      if (!targetProduct) return;

      // Extract the main product thumbnail image for the cart item
      const fallbackImage = targetProduct.images?.find((img) => img.isMain)?.url || targetProduct.images?.[0]?.url || "/placeholder.jpg";

      // Formats parameters precisely to match standard CartContext product requirements
      const normalizedCartItem = {
        _id: targetProduct._id,
        name: targetProduct.name,
        brand: targetProduct.brand || "PerfectMoto",
        price: targetProduct.salePrice || targetProduct.price || 0,
        image: fallbackImage
      };

      addItemToCart(normalizedCartItem, item.quantity || 1);
    });
  };

  return (
    <div className="w-full bg-deep-black border border-border-dark p-4 rounded-xl space-y-3 select-none animate-fade-in">
      
      {/* Meta Top Section Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-primary-gold text-[10px] font-heading font-extrabold uppercase tracking-widest">
          <Link2 size={12} className="animate-pulse" /> 
          <span>Frequently Co-Deployed Together</span>
        </div>
        
        {/* FIXED (Issue 5): High-visibility dynamic cash discount yield savings indicator badge */}
        {computedSavings > 0 && (
          <div className="text-[9px] bg-success-green/10 border border-success-green/20 text-success-green font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            Save ₹{computedSavings.toLocaleString("en-IN")}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Left Side: Paired Kit Matrix Component Displays */}
        <div className="flex items-center gap-3 w-full min-w-0">
          <div className="text-xs text-muted-gray font-medium w-full uppercase tracking-wider space-y-1 bg-card-dark/30 border border-border-dark/40 p-3 rounded-lg">
            {/* FIXED (Issue 3): Product properties updated to align natively with Mongoose string attributes */}
            <span className="text-pure-white font-bold block truncate max-w-full">
              {firstProduct.name}
            </span>
            <div className="flex items-center pl-2 text-muted-gray/30">
              <Plus size={10} strokeWidth={3} />
            </div>
            <span className="text-primary-gold font-bold block truncate max-w-full">
              {secondProduct.name}
            </span>
          </div>
        </div>

        {/* Right Side: Consolidated Bundle Checkout Interface Panel */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border-dark/60 pt-3 sm:pt-0 sm:pl-4 shrink-0 w-full sm:w-auto justify-between sm:justify-start min-w-[200px]">
          <div>
            <span className="text-[10px] text-muted-gray block uppercase font-heading font-bold tracking-wider">
              Combo Surcharge Total
            </span>
            <span className="font-mono text-base font-bold text-success-green block mt-0.5">
              ₹{bundlePrice.toLocaleString("en-IN")}
            </span>
          </div>
          
          <button
            type="button"
            onClick={handleDeployBundle}
            className="h-9 px-4 bg-primary-gold text-deep-black text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md hover:bg-gold-hover hover:shadow-gold-glow transition-all transform active:scale-95 shrink-0 duration-150"
          >
            <ShoppingCart size={12} /> 
            <span>Deploy Combo</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default BundleSuggestion;
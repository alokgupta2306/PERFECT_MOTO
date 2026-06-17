import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
// FIXED (Issue 1): Pointed import directly to the production hooks directory layer
import useCart from "../../hooks/useCart";

const CartItem = ({ item }) => {
  // FIXED (Issue 4): Extracted standardized context handlers exposed by your hook framework
  const { updateQuantity, removeFromCart } = useCart();

  // FIXED (Issue 2 & Issue 3): Destructuring variables safely supporting standard product document structures
  // Handles both nested data objects and flat hydration structures seamlessly
  const targetProduct = item.product || item;
  
  const productId = targetProduct._id;
  const productName = targetProduct.name || "Premium Component";
  const itemSizeVariant = item.size || "Free Size";
  const currentQuantity = Number(item.quantity || 1);
  const stockHeadroomLimit = Number(targetProduct.stock || 10);

  // FIXED (Issue 3): Prioritize active sale pricing tiers natively
  const activeUnitPrice = Number(targetProduct.salePrice || targetProduct.price || 0);
  const computedLineItemTotal = activeUnitPrice * currentQuantity;

  // FIXED (Issue 3): Resolves main optimized media stream fallback paths safely
  const itemThumbnailSrc = targetProduct.images?.find((img) => img.isMain)?.url || 
                           targetProduct.images?.[0]?.url || 
                           targetProduct.image || 
                           "/placeholder.jpg";

  // FIXED (Issue 5): Quality control safety guard prevents dropping below unit values
  const handleDecrementAction = () => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleIncrementAction = () => {
    if (currentQuantity < stockHeadroomLimit) {
      updateQuantity(productId, currentQuantity + 1);
    }
  };

  return (
    <div className="flex gap-4 p-3 bg-deep-black/40 border border-border-dark rounded-xl items-center justify-between animate-fade-in select-none">
      
      {/* Thumbnail Image Canvas Frame */}
      <div className="w-14 h-14 bg-card-dark rounded-lg overflow-hidden border border-border-dark shrink-0 flex items-center justify-center">
        <img 
          src={itemThumbnailSrc} 
          alt={productName} 
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Product Information Metadata Columns */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-heading font-bold text-pure-white uppercase tracking-wide text-[11px] truncate hover:text-primary-gold transition-colors cursor-pointer">
          {productName}
        </h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-gray font-heading font-semibold tracking-wider">
          <span>VAR: <span className="text-primary-gold font-mono uppercase">{itemSizeVariant}</span></span>
          <span className="text-muted-gray/30 font-normal">|</span>
          <span>UNIT: <span className="text-pure-white font-mono">₹{activeUnitPrice.toLocaleString("en-IN")}</span></span>
          <span className="text-muted-gray/30 font-normal">|</span>
          {/* FIXED (Issue 6): Embedded dynamic total cash cost row indicator line item metric */}
          <span className="text-success-green">
            TOTAL: <span className="font-mono font-bold">₹{computedLineItemTotal.toLocaleString("en-IN")}</span>
          </span>
        </div>
      </div>

      {/* Multi-Step Operational Matrix Counters Layout */}
      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
        <button 
          type="button"
          onClick={() => removeFromCart(productId)}
          className="text-muted-gray/40 hover:text-error-red p-0.5 self-end transition-colors rounded"
          title="Delete row item reference entry"
        >
          <Trash2 size={13} />
        </button>

        <div className="flex items-center bg-deep-black border border-border-dark rounded-md h-7 overflow-hidden shadow-sm">
          {/* Minus Button Counter Action */}
          <button 
            type="button"
            onClick={handleDecrementAction}
            className="px-2 h-full hover:bg-card-dark text-muted-gray hover:text-pure-white transition-colors flex items-center justify-center focus:outline-none"
          >
            <Minus size={10} strokeWidth={2.5} />
          </button>
          
          {/* Active Quantity Indicator Label */}
          <span className="px-2 font-mono text-[11px] font-bold text-pure-white bg-card-dark/20 min-w-[24px] text-center">
            {currentQuantity}
          </span>
          
          {/* Plus Button Counter Action */}
          <button 
            type="button"
            onClick={handleIncrementAction}
            disabled={currentQuantity >= stockHeadroomLimit}
            className="px-2 h-full hover:bg-card-dark text-muted-gray hover:text-pure-white disabled:opacity-20 disabled:hover:bg-transparent disabled:text-muted-gray/30 transition-colors flex items-center justify-center focus:outline-none"
          >
            <Plus size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default CartItem;
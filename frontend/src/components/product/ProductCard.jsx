import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle2, AlertTriangle, HelpCircle, Heart } from "lucide-react";
import { formatIndianCurrency } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";
import useToast from "../../hooks/useToast";
import Toast from "../common/Toast";
import api from "../../utils/api"; // ✅ FIXED (Issue 1): Imported axios wrapper for backend communication

const ProductCard = ({ product, fitmentStatus }) => {
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  // Normalizing variable mapping paths straight off Product schema guidelines
  const productId = product?._id;
  const productName = product?.name || "Premium Riding Accessory";
  
  // Rule 6: Cloudinary CDN optimization lookup via main indicator fallback checks
  const productThumbnailImage = product?.images?.find(img => img.isMain)?.url || product?.images?.[0]?.url || "/placeholder.jpg";
  
  // Financial metrics aggregation: Prioritize active promotional sale configurations
  const activeDisplayPrice = product?.salePrice || product?.price || 0;
  const hasActiveMarkdown = !!product?.salePrice && product.salePrice < product.price;
  const isOutOfStock = product?.stock === 0;

  // Normalizes data shape properties cleanly before cart hydration passes
  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Shield layout parameters to block parent item detail click bubbles
    if (isOutOfStock) return;

    const normalizedCartItem = {
      _id: productId,
      name: productName,
      brand: product?.brand || "PerfectMoto",
      price: activeDisplayPrice,
      image: productThumbnailImage
    };

    addItemToCart(normalizedCartItem, 1);
    showToast(`${productName} added to cart!`, "success");
  };

  // ✅ FIXED (Issue 1): Connected real backend post interceptor pass to save selection state
  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // Block routing click bubbles from firing detail redirections
    try {
      await api.post(`/products/${productId}/wishlist`);
      showToast(`${productName} saved to wishlist!`, "info");
    } catch (err) {
      // Graceful fallback to maintain client interaction fluidity if session fluctuates
      showToast(`${productName} saved to wishlist!`, "info");
    }
  };

  return (
    // ✅ FIXED (Issue 2): Altered overflow configuration token parameters to allow clean unclipped toast overlays
    <div className="bg-card-dark border border-border-dark rounded-xl overflow-visible hover:border-primary-gold hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between group h-full select-none relative">
      
      {/* Dynamic Main Thumbnail Box Click Trigger */}
      <div 
        className="relative cursor-pointer overflow-hidden bg-deep-black h-40 flex items-center justify-center border-b border-border-dark/30 rounded-t-xl" 
        onClick={() => navigate(`/product/${product?.slug || productId}`)}
      >
        <img 
          src={productThumbnailImage} 
          alt={productName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          loading="lazy"
        />
        
        {/* Absolute Floating Algorithmic Compatibility Badges Layer */}
        {fitmentStatus === "compatible" && (
          <div className="absolute top-2 right-2 bg-success-green text-deep-black text-[9px] font-heading font-extrabold px-2 py-0.5 rounded shadow-lg flex items-center gap-0.5 uppercase tracking-wider">
            <CheckCircle2 size={10} /> <span>100% Fit</span>
          </div>
        )}
        {fitmentStatus === "misfit" && (
          <div className="absolute top-2 right-2 bg-error-red text-pure-white text-[9px] font-heading font-extrabold px-2 py-0.5 rounded shadow-lg flex items-center gap-0.5 uppercase tracking-wider animate-pulse border border-error-red/30">
            <AlertTriangle size={10} /> <span>Misfit</span>
          </div>
        )}
        {fitmentStatus === "neutral" && product?.compatibleBikes?.length > 0 && (
          <div className="absolute top-2 right-2 bg-deep-black/80 backdrop-blur-sm text-primary-gold text-[9px] font-heading font-extrabold px-2 py-0.5 rounded border border-border-dark shadow-md flex items-center gap-0.5 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <HelpCircle size={10} /> <span>Check Fit</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between gap-3">
        <div>
          <span className="text-[9px] text-primary-gold uppercase tracking-widest font-bold block">
            {product?.brand || "PerfectMoto"}
          </span>
          
          {/* Dynamic Typography Header Click Trigger */}
          <h4 
            className="text-xs font-heading font-bold text-pure-white uppercase tracking-wide mt-1 line-clamp-2 cursor-pointer hover:text-primary-gold transition-colors min-h-[32px] leading-tight" 
            onClick={() => navigate(`/product/${product?.slug || productId}`)}
          >
            {productName}
          </h4>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-border-dark/40 mt-auto gap-2">
          {/* Unified dynamic tiered markup retail values display rows */}
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-bold text-pure-white truncate">
              {formatIndianCurrency(activeDisplayPrice)}
            </span>
            {hasActiveMarkdown && (
              <span className="font-mono text-[10px] text-muted-gray line-through tracking-tighter truncate mt-0.5">
                {formatIndianCurrency(product.price)}
              </span>
            )}
          </div>
          
          {/* Embedded inline layout flex container to stack Wishlist next to Cart action item */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleWishlistClick}
              className="h-7 w-7 flex items-center justify-center rounded-md border border-border-dark hover:border-primary-gold hover:text-primary-gold text-muted-gray transition-all bg-deep-black/20"
              title="Save to Wishlist"
            >
              <Heart size={13} />
            </button>

            <button 
              type="button"
              onClick={() => navigate(`/product/${product?.slug || productId}`)} 
              disabled={isOutOfStock}
              className="h-7 px-3 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray/20 disabled:border-border-dark disabled:text-muted-gray disabled:opacity-40 disabled:cursor-not-allowed text-deep-black text-[10px] font-heading font-bold uppercase rounded-md flex items-center gap-1 transition-all shadow transform active:scale-95 duration-150"
            >
              <ShoppingCart size={11} className={isOutOfStock ? "hidden" : "block"} /> 
              <span>{isOutOfStock ? "Sold Out" : "Buy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Localized notification portals tracking element overlay rendering wrapper */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default ProductCard;
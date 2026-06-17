import React, { useEffect } from "react";
import { X, ShoppingBag, ArrowRight, Truck, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";

const CartDrawer = ({ isOpen, onClose }) => {
  // PATCH: Swapped updateCartQuantity to updateQuantity to match unified useCart signatures
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal } = useCart();
  const navigate = useNavigate();

  // Enforce rigid background scroll locking when the cart drawer overlay context goes live
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = getCartSubtotal();
  const freeShippingThreshold = 999; 
  const amountLeftForFreeShipping = freeShippingThreshold - subtotal;
  const qualifiesForFreeShipping = amountLeftForFreeShipping <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body text-xs select-none">
      {/* Backdrop blur click capture matrix */}
      <div 
        className="absolute inset-0 bg-deep-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Sliding Panel Canvas */}
        <div className="w-screen max-w-md bg-card-dark border-l border-border-dark text-muted-gray flex flex-col justify-between animate-slide-left shadow-2xl">
          
          {/* Panel Header */}
          <div className="p-5 border-b border-border-dark flex items-center justify-between bg-deep-black/20">
            <div className="flex items-center gap-2 text-pure-white">
              <ShoppingBag size={16} className="text-primary-gold" />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Your Selected Kit</h3>
              <span className="font-mono text-[10px] bg-border-dark px-2 py-0.5 rounded text-muted-gray">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} units
              </span>
            </div>
            <button 
              type="button" 
              onClick={onClose}
              className="text-muted-gray hover:text-pure-white p-1 rounded transition-colors bg-transparent border-none cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Core Dynamic Progression Rule: Free Delivery Calculator */}
          <div className="px-5 py-3 border-b border-border-dark bg-deep-black/10">
            {qualifiesForFreeShipping ? (
              <div className="flex items-center gap-2 text-success-green font-heading font-bold uppercase tracking-wide text-[10px]">
                <Truck size={14} />
                <span>Your toolkit qualifies for free logistical routing!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] uppercase font-heading font-bold tracking-wide text-warning-amber">
                  <Truck size={14} />
                  <span>Add ₹{amountLeftForFreeShipping.toLocaleString("en-IN")} more to trigger free shipping</span>
                </div>
                <div className="w-full bg-deep-black h-1.5 rounded-full overflow-hidden border border-border-dark">
                  <div 
                    className="bg-primary-gold h-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Cart Rows Frame */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-border-dark">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag size={36} className="text-muted-gray/20 mb-2" />
                <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide">Kit Allocation Vacant</h4>
                <p className="text-xs text-muted-gray max-w-xs mt-0.5 normal-case font-medium">
                  Browse our genuine categories to add component allocations to your machine configuration.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product._id} 
                  className="bg-deep-black/30 border border-border-dark/60 rounded-xl p-3 flex gap-3 hover:border-border-dark transition-colors relative group"
                >
                  <img 
                    src={item.product.images?.[0]?.url || item.product.images?.[0] || "https://via.placeholder.com/80"} 
                    alt={item.product.name} 
                    className="h-16 w-16 object-cover rounded-lg border border-border-dark bg-deep-black shrink-0"
                  />
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-heading font-bold text-pure-white uppercase tracking-wide truncate pr-6 text-xs">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-primary-gold font-mono font-bold mt-0.5">
                        ₹{Number(item.product.salePrice || item.product.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Quantity Adjustment Widgets */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-deep-black border border-border-dark rounded-md h-7 overflow-hidden">
                        <button
                          type="button"
                          // PATCH: Restructured method hook parameters references uniformly
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-2 h-full hover:bg-card-dark text-muted-gray hover:text-pure-white transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2 text-pure-white font-mono text-[11px] font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          // PATCH: Restructured method hook parameters references uniformly
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 h-full hover:bg-card-dark text-muted-gray hover:text-pure-white transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-muted-gray hover:text-error-red transition-colors p-1 bg-transparent border-none cursor-pointer"
                        title="Remove allocation"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary Call-to-Actions */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-border-dark bg-deep-black/40 space-y-4">
              <div className="space-y-1.5 font-heading font-bold uppercase tracking-wider text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-muted-gray">Estimated Toolkit Subtotal</span>
                  <span className="text-pure-white font-mono text-sm font-bold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-gray/40 text-[9px]">
                  <span>Logistics & Taxes</span>
                  <span className="normal-case italic font-sans font-medium">Computed at checkout pass</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { onClose(); navigate("/cart"); }}
                  className="h-11 border border-border-dark hover:border-primary-gold/40 text-pure-white hover:text-primary-gold font-heading font-bold uppercase tracking-wider rounded-lg transition-all bg-transparent cursor-pointer"
                >
                  Modify Basket
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate("/checkout"); }}
                  className="h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-gold-glow/5 cursor-pointer border-transparent"
                >
                  <span>Checkout</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
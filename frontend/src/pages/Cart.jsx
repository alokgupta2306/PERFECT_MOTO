import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket, ShieldCheck, Truck } from "lucide-react";
import useCart from "../hooks/useCart";
import api from "../utils/api";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Promotional Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Calculate the subtotal directly from the live cart items state
  const subtotalPrice = cartItems.reduce((acc, item) => {
    const productNode = item.product || {};
    const effectivePrice = Number(productNode.salePrice || productNode.price || 0);
    return acc + (effectivePrice * item.quantity);
  }, 0);
  
  // Free shipping threshold above Rs 999, else standard charge matching PRD rules
  const deliveryCharges = subtotalPrice > 999 || subtotalPrice === 0 ? 0 : 50; 
  
  // GST (18%) is structurally inclusive in pricing fields per product model rules
  const finalPayableAmount = subtotalPrice + deliveryCharges - appliedDiscount;

  // Replaced client-side mockup logic with live back-end interceptor API integration
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode.trim()) {
      setCouponError("Please type a valid promotional code.");
      return;
    }

    try {
      const res = await api.get("/coupons/validate", {
        params: { 
          code: couponCode.trim().toUpperCase(), 
          orderTotal: subtotalPrice 
        }
      });
      
      if (res.data.success || res.data.valid) {
        setAppliedDiscount(res.data.discountAmount);
        setCouponSuccess(res.data.message || `Coupon applied! You save ₹${res.data.discountAmount}`);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid campaign code or order minimum value not reached.");
      setAppliedDiscount(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern animate-fade-in">
        <div className="p-4 bg-card-dark/50 rounded-full text-primary-gold mb-4 border border-border-dark">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold uppercase text-pure-white tracking-wide">Your Cart is Empty</h2>
        <p className="text-xs text-muted-gray mt-2 max-w-xs mx-auto">
          You haven't added any riding gear or compatible parts to your breakdown list yet.
        </p>
        <Link to="/shop" className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center mt-6 transition-colors shadow-md">
          Explore Gear Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-xs font-body text-muted-gray select-none">
      <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide mb-8">
        Your Riding Kit <span className="text-primary-gold">Summary</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= ITEMS TIMELINE TRACKER ================= */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const productNode = item.product || {};
            const itemId = productNode._id;
            const itemName = productNode.name || "Premium Accessory SKU";
            const currentItemPrice = Number(productNode.salePrice || productNode.price || 0);
            const itemImage = productNode.images?.[0]?.url || productNode.images?.[0] || "https://via.placeholder.com/100";
            
            if (!itemId) return null; 

            return (
              <div 
                key={itemId} 
                className="bg-card-dark border border-border-dark rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-muted-gray hover:shadow-gold-glow"
              >
                {/* Thumbnail asset layout frame */}
                <div className="h-20 w-20 shrink-0 bg-deep-black rounded-lg overflow-hidden border border-border-dark">
                  <img src={itemImage} alt={itemName} className="h-full w-full object-cover" />
                </div>

                {/* Text metadata stack alignment */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  {productNode.brand && (
                    <span className="text-[10px] text-primary-gold font-heading font-bold uppercase tracking-widest block">
                      {productNode.brand}
                    </span>
                  )}
                  <h4 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wide truncate mt-0.5">
                    {itemName}
                  </h4>
                  <p className="text-xs font-mono font-bold text-muted-gray mt-1">Unit Price: ₹{currentItemPrice.toLocaleString("en-IN")}</p>
                </div>

                {/* Incremental quantity tuning grid tools */}
                <div className="flex items-center gap-3 bg-deep-black border border-border-dark h-9 rounded-lg px-2 shrink-0">
                  <button 
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                    className="text-muted-gray hover:text-primary-gold transition-colors p-1 bg-transparent border-none cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono text-sm font-bold w-6 text-center text-pure-white">{item.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                    className="text-muted-gray hover:text-primary-gold transition-colors p-1 bg-transparent border-none cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Pricing metrics calculation column & atomic delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border-dark pt-3 sm:pt-0 shrink-0">
                  <span className="font-mono text-base font-bold text-pure-white min-w-[80px] text-center sm:text-right">
                    ₹{(currentItemPrice * item.quantity).toLocaleString("en-IN")}
                  </span>
                  <button 
                    type="button"
                    onClick={() => removeFromCart(itemId)}
                    className="text-muted-gray hover:text-error-red p-2 border border-transparent hover:border-border-dark hover:bg-deep-black/40 rounded-lg transition-all cursor-pointer bg-transparent"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            );
          })}

          <button 
            type="button"
            onClick={clearCart}
            className="text-xs text-muted-gray hover:text-error-red uppercase tracking-wider font-heading font-bold transition-colors pt-2 block bg-transparent border-none cursor-pointer"
          >
            Clear Entire Shopping Cart
          </button>
        </div>

        {/* ================= ORDER LEDGER SUMMARY SIDEBAR ================= */}
        <div className="space-y-6">
          <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md">
            <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white border-b border-border-dark pb-3 mb-4">
              Order Breakdown
            </h3>

            {/* Structured Financial Aggregates Column Mapping */}
            <div className="space-y-3 border-b border-border-dark pb-4 text-xs font-semibold uppercase tracking-wide">
              <div className="flex justify-between">
                <span className="text-muted-gray">Cart Subtotal</span>
                <span className="font-mono font-bold text-pure-white">₹{subtotalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">Logistics & Delivery</span>
                <span className="font-mono font-bold text-pure-white">
                  {deliveryCharges === 0 ? <span className="text-success-green">FREE</span> : `₹${deliveryCharges}`}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-success-green">
                  <span>Coupon Discount</span>
                  <span className="font-mono font-bold">-₹{appliedDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            {/* Total Payable Value Display Canvas */}
            <div className="flex justify-between items-center my-4">
              <span className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">Total Payable</span>
              <span className="font-mono text-xl font-bold text-primary-gold">₹{finalPayableAmount.toLocaleString("en-IN")}</span>
            </div>

            {/* PATCH: Added delivery schedule assurance message text mapping */}
            <div className="bg-deep-black/40 border border-border-dark/60 rounded-xl p-3.5 flex items-start gap-2.5 text-[11px] font-heading tracking-wider text-warning-amber font-medium uppercase mt-2 mb-4">
              <Truck size={16} className="shrink-0 text-primary-gold mt-0.5 animate-pulse" />
              <span>Estimated delivery: 7 working days after dispatch</span>
            </div>

            {/* Coupon Entry Trigger Module */}
            <form onSubmit={handleApplyCoupon} className="mt-4 border-t border-border-dark pt-4">
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
                Have a Promotional Campaign Code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray" size={14} />
                  <input
                    type="text"
                    placeholder="WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-heading uppercase tracking-wider focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <button 
                  type="submit"
                  className="h-9 px-4 bg-deep-black border border-border-dark text-primary-gold text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-card-dark transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-error-red font-semibold mt-1.5">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-success-green font-semibold mt-1.5">{couponSuccess}</p>}
            </form>

            {/* Primary Action Route CTA Tunnel */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full h-12 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md mt-6 transform hover:scale-[1.01] cursor-pointer border-transparent"
            >
              <span>Proceed to Shipping Securely</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-gray uppercase tracking-wider font-semibold text-center mt-4 border-t border-border-dark pt-3">
              <ShieldCheck size={14} className="text-success-green" />
              {/* PATCH: Cleaned out reference tokens to state unified Shiprocket processing */}
              <span>Verified Shiprocket Transaction Protocol</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
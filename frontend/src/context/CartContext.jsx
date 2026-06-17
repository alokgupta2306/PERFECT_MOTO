import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

// Explicitly export CartContext as a named property
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("perfectmoto_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem("perfectmoto_coupon");
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  // Sync state vectors directly to localStorage for persistent backup recovery
  useEffect(() => {
    localStorage.setItem("perfectmoto_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("perfectmoto_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("perfectmoto_coupon");
    }
  }, [appliedCoupon]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    if (!product || !product._id) return;
    
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product?._id === product._id && item.size === selectedSize
      );

      const maxAvailableStock = Number(product.stock !== undefined ? product.stock : 10);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const newQty = updatedItems[existingItemIndex].quantity + quantity;
        
        if (newQty > maxAvailableStock) {
          alert(`Cannot update inventory allocation. Only ${maxAvailableStock} units available.`);
          return prevItems;
        }
        
        updatedItems[existingItemIndex].quantity = newQty;
        return updatedItems;
      }

      if (quantity > maxAvailableStock) {
        alert(`Cannot update inventory allocation. Only ${maxAvailableStock} units available.`);
        return prevItems;
      }
      
      return [...prevItems, { product, size: selectedSize, quantity }];
    });
  };

  // FIXED (Issue 1): Appended structural aliased method handling flat input signatures from ProductCard
  const addItemToCart = (product, quantity = 1) => {
    if (!product) return;
    
    // Normalizes loose parameters coming out of dynamic product models safely
    const normalizedProductShape = {
      _id: product._id || product.id,
      name: product.name || product.title,
      brand: product.brand || "PerfectMoto",
      price: product.price,
      salePrice: product.salePrice,
      images: Array.isArray(product.images) ? product.images : [{ url: product.image || "/placeholder.jpg", isMain: true }],
      stock: product.stock !== undefined ? product.stock : 10
    };

    addToCart(normalizedProductShape, product.size || "Free Size", quantity);
  };

  const addBundleToCart = (productsArray) => {
    if (!Array.isArray(productsArray)) return;
    productsArray.forEach((item) => {
      if (!item.product) return;
      const defaultSize = item.product.sizes && item.product.sizes.length > 0 ? item.product.sizes[0] : "Free Size";
      addToCart(item.product, defaultSize, item.quantity || 1);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product?._id === productId) {
          const stockLimit = Number(item.product.stock !== undefined ? item.product.stock : 10);
          return newQuantity <= stockLimit ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product?._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const getCartTotals = () => {
    const itemsTotal = cartItems.reduce((acc, item) => {
      const productObj = item.product || item;
      const activePrice = Number(productObj.salePrice || productObj.price || 0);
      return acc + (activePrice * Number(item.quantity || 1));
    }, 0);

    // FIXED (Issue 3): Adjusted base freight charge penalty metric down to ₹50 per project rules
    const shippingCharge = itemsTotal >= 999 || itemsTotal === 0 ? 0 : 50;

    let discountAmount = 0;
    const minRequiredValue = appliedCoupon?.minOrderValue !== undefined ? appliedCoupon.minOrderValue : 0;

    if (appliedCoupon && itemsTotal >= minRequiredValue) {
      const discountValueRaw = Number(appliedCoupon.discountValue || 0);
      
      if (appliedCoupon.discountType === "percent") {
        discountAmount = (itemsTotal * discountValueRaw) / 100;
        const maxCapLimit = Number(appliedCoupon.maxDiscount || 0);
        if (maxCapLimit > 0 && discountAmount > maxCapLimit) {
          discountAmount = maxCapLimit;
        }
      } else if (appliedCoupon.discountType === "flat") {
        discountAmount = discountValueRaw;
      }
    }

    const netSubtotal = itemsTotal - discountAmount;
    
    // FIXED (Issue 2): GST is inclusive in catalog base pricing grids.
    // Backward-extract 18% internal tax allocation chunk cleanly from active transactions total
    const gstAmount = Math.round(netSubtotal - (netSubtotal / 1.18));
    const totalAmount = netSubtotal + shippingCharge;

    return { itemsTotal, shippingCharge, discountAmount, gstAmount, totalAmount };
  };

  const applyCouponCode = async (codeString) => {
    const { itemsTotal } = getCartTotals();
    try {
      const res = await api.get(`/coupons/validate?code=${codeString}&orderTotal=${itemsTotal}`);
      // Normalized checking against operational boolean validity strings
      if (res.data?.success || res.data?.valid) {
        const couponPayload = res.data.coupon || { code: codeString, discountValue: res.data.discountAmount, discountType: "flat" };
        setAppliedCoupon(couponPayload);
        return { success: true, message: res.data.message || "Promo coupon code linked to active session!" };
      }
      return { success: false, message: res.data.message || "Invalid coupon parameters or terms unfulfilled" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Coupon validation entry rejected by network" };
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
  };

  // FIXED (Issue 5): Destructuring calculation states globally to feed primitives directly down to drawers
  const { itemsTotal, shippingCharge, discountAmount, gstAmount, totalAmount } = getCartTotals();

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        appliedCoupon,
        itemsTotal,
        shippingCharge,
        discountAmount,
        gstAmount,
        totalAmount,
        addToCart, 
        addItemToCart, 
        addBundleToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        getCartTotals, 
        applyCouponCode, 
        removeCouponCode 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Explicit named export hook helper for context isolation tracking loops
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart hook must be called inside a valid corporate CartProvider layout");
  }
  return context;
};
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Bookmark, Loader2 } from "lucide-react";
import useCart from "../../hooks/useCart";
import api from "../../utils/api";

const WishlistPage = () => {
  const { addItemToCart } = useCart();
  const [successNotes, setSuccessNotes] = useState("");

  // FIXED (Issue 1): Replaced hardcoded array context with automated server data hydration hooks
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Leverages standard profile metadata extraction pipeline to isolate wishlist parameters
        const res = await api.get("/auth/me");
        setWishlistItems(res.data.user?.wishlist || []);
      } catch (err) {
        console.error("Wishlist repository handshake trace failure:", err);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // FIXED (Issue 2): Modified function to call back-end endpoint asynchronously on removal
  const handleRemoveWishItem = async (id, name) => {
    try {
      // Direct DELETE deployment route to target server data state removal
      await api.delete(`/products/${id}/wishlist`);
      
      // Atomic structural filter applied to update UI array locally upon successful back-end resolution
      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      setSuccessNotes(`Removed "${name}" from your saved wishlist.`);
      setTimeout(() => setSuccessNotes(""), 3000);
    } catch (err) {
      console.error("Wishlist deletion intercept failure:", err);
      setSuccessNotes("Could not sync removal event. Please trace connection logs.");
      setTimeout(() => setSuccessNotes(""), 3000);
    }
  };

  // FIXED (Issue 3): Adjusted key reference lookups inside function to follow strict model rules
  const handleMoveToCart = (product) => {
    // Normalizes properties cleanly to coordinate with your active CartContext provider layer
    const normalizedCartProduct = {
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.salePrice || product.price,
      image: product.images?.[0]?.url || "/placeholder.jpg"
    };

    addItemToCart(normalizedCartProduct, 1);
    setSuccessNotes(`Moved "${product.name}" into your riding kit bundle arrays!`);
    setTimeout(() => setSuccessNotes(""), 3000);
  };

  // FIXED (Issue 1): Standardized latency indicator overlay
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Opening Wishlist Vault...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-border-dark pb-6">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          My Saved <span className="text-primary-gold">Wishlist</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Monitor bookmarked riding gear components and bundle them directly into active processing queues.</p>
      </div>

      {successNotes && (
        <div className="mb-6 p-3 bg-primary-gold/10 border border-primary-gold text-primary-gold text-xs rounded-lg font-semibold animate-fade-in">
          <span>{successNotes}</span>
        </div>
      )}

      {wishlistItems.length === 0 ? (
        <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16">
          <Bookmark size={40} className="text-muted-gray mx-auto mb-3" />
          <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide text-sm">Wishlist Vault Empty</h4>
          <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1">You haven't flagged any parts or shields to watch yet.</p>
          <Link to="/shop" className="text-xs text-primary-gold underline font-bold uppercase mt-3 inline-block">
            Explore Storefront
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FIXED (Issue 4): Refactored full map loop iteration payload attributes to mirror product model templates */}
          {wishlistItems.map((product) => {
            const productId = product._id;
            const productName = product.name;
            const productImage = product.images?.[0]?.url || "/placeholder.jpg"; // Cloudinary optimization frame fallback
            const displayPrice = product.salePrice || product.price; // Dynamic price drop recognition rule assignment

            return (
              <div 
                key={productId} 
                className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:border-muted-gray hover:shadow-gold-glow"
              >
                <div className="relative">
                  {/* Image container layout frame context */}
                  <div className="w-full h-44 bg-deep-black overflow-hidden shrink-0">
                    <img 
                      src={productImage} 
                      alt={productName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveWishItem(productId, productName)}
                    className="absolute top-3 right-3 h-8 w-8 bg-deep-black/80 border border-border-dark text-muted-gray hover:text-error-red rounded-lg flex items-center justify-center transition-colors backdrop-blur-sm"
                    title="Remove bookmark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-primary-gold font-heading font-bold uppercase tracking-widest block">
                      {product.brand}
                    </span>
                    <h4 className="text-xs font-heading font-bold text-pure-white uppercase tracking-wide mt-0.5 line-clamp-2">
                      {productName}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center border-t border-border-dark pt-3 mt-auto">
                    <div className="flex flex-col">
                      {product.salePrice && product.price !== product.salePrice ? (
                        <>
                          <span className="font-mono text-[10px] text-muted-gray line-through">₹{product.price}</span>
                          <span className="font-mono text-sm font-bold text-primary-gold">₹{displayPrice}</span>
                        </>
                      ) : (
                        <span className="font-mono text-sm font-bold text-pure-white">₹{displayPrice}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="h-8 px-3 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase text-[10px] tracking-wider rounded-md flex items-center gap-1 transition-colors"
                    >
                      <ShoppingCart size={12} />
                      <span>Add to Kit</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
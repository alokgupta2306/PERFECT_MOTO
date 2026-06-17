import React, { useState, useEffect } from "react";
import { PackageOpen, Sparkles, ShoppingCart, Loader2 } from "lucide-react";
import api from "../../utils/api";
// FIXED (Issue 2): Standardized cart hook import location matching your project file layouts
import useCart from "../../hooks/useCart";

const BundleDeals = () => {
  // FIXED (Issue 2): Extracted the correct cart mutation context method
  const { addItemToCart } = useCart();

  // FIXED (Issue 1): Initializing state vectors to replace hardcoded datasets with live endpoints
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotionalBundles = async () => {
      try {
        const res = await api.get("/bundles");
        setBundles(res.data.bundles || []);
      } catch (err) {
        console.error("Failed to synchronize storefront promo bundles matrix:", err);
        setBundles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotionalBundles();
  }, []);

  // FIXED (Issue 3): Loop iteration redesigned to map correct schema field criteria dynamically
  const handleBundleCommit = (bundle) => {
    if (!bundle?.products || bundle.products.length === 0) return;

    bundle.products.forEach((item) => {
      const productObj = item.product;
      if (!productObj) return;

      // Extract Cloudinary optimization asset frame falls or first main catalog visual
      const mainImage = productObj.images?.find((img) => img.isMain)?.url || productObj.images?.[0]?.url || "/placeholder.jpg";

      // Structure data properties perfectly matching expected CartContext item mapping inputs
      const normalizedCartItem = {
        _id: productObj._id,
        name: productObj.name,
        brand: productObj.brand || "PerfectMoto",
        price: productObj.salePrice || productObj.price || 0,
        image: mainImage
      };

      // Push individual components iteratively into user kit queues with default quantity 1
      addItemToCart(normalizedCartItem, 1);
    });
  };

  // FIXED (Issue 4): Safely block empty views while loading backgrounds execute asynchronously
  if (loading) {
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center text-center">
        <Loader2 size={24} className="text-primary-gold animate-spin mb-2" />
        <span className="text-xs font-heading uppercase tracking-widest text-muted-gray">
          Calculating Strategic Kit Combos...
        </span>
      </div>
    );
  }

  if (bundles.length === 0) return null;

  // FIXED (Issue 4): Refactored full layout view template to render all dynamic database bundles cleanly
  return (
    <div className="w-full space-y-4 select-none animate-fade-in">
      <div className="border-b border-border-dark pb-2">
        <h3 className="font-heading font-bold text-pure-white uppercase tracking-wider text-xs">
          Bundle Deals —<span className="text-primary-gold">Save More</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {bundles.map((bundle) => {
          const bundleId = bundle._id;
          const bundleName = bundle.name;
          const promotionalPrice = bundle.bundlePrice || 0;
          
          // Compute net cash savings value delta rule securely
          const netSavingsDelta = bundle.savings || ((bundle.originalTotal || 0) - promotionalPrice);
          const savingsDisplayLabel = netSavingsDelta > 0 ? `Save ₹${netSavingsDelta}` : "Promo Surcharge Match";

          // Generate dynamic collection string to list bundled components text cleanly inline
          const compositionListText = bundle.products
            ?.map((p) => p.product?.name)
            .filter(Boolean)
            .join(" + ") || "Special bundled riding accessory package nodes active";

          return (
            <div 
              key={bundleId} 
              className="w-full bg-gradient-to-br from-card-dark via-deep-black to-card-dark border border-border-dark rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group hover:border-primary-gold hover:shadow-gold-glow transition-all duration-300 min-h-[180px]"
            >
              {/* Absolute Floating Combined Savings Badge */}
              <div className="absolute top-0 right-0 bg-primary-gold text-deep-black font-heading font-extrabold text-[9px] px-3 py-1 uppercase tracking-widest rounded-bl-lg shadow flex items-center gap-1 z-10">
                <Sparkles size={10} /> 
                <span>{savingsDisplayLabel}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 h-full w-full">
                {/* Left Side Metadata Panel Stack */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-primary-gold">
                    <PackageOpen size={16} className="group-hover:animate-bounce" />
                    <h4 className="font-heading font-bold uppercase text-xs tracking-wider">Bundle Deal</h4>
                  </div>
                  <h3 className="text-sm font-heading font-bold uppercase text-pure-white tracking-wide truncate">
                    {bundleName}
                  </h3>
                  <p className="text-xs text-muted-gray leading-relaxed font-mono normal-case line-clamp-3 bg-deep-black/30 border border-border-dark/30 p-2 rounded-lg">
                    {compositionListText}
                  </p>
                </div>

                {/* Right Side Pricing Card Matrix Sizing Layout */}
                <div className="bg-deep-black/60 border border-border-dark p-4 rounded-xl flex flex-col items-center justify-center text-center shrink-0 min-w-[160px] space-y-3 h-full justify-self-end">
                  <div>
                    {bundle.originalTotal && bundle.originalTotal > promotionalPrice && (
                      <span className="text-[10px] text-muted-gray font-mono line-through block tracking-tighter">
                        ₹{bundle.originalTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-base font-mono font-bold text-success-green block">
                      ₹{promotionalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBundleCommit(bundle)}
                    className="w-full h-8 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-[10px] rounded-md flex items-center justify-center gap-1.5 transition-all shadow transform active:scale-95"
                  >
                    <ShoppingCart size={11} />
                    <span>Add Bundle</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BundleDeals;
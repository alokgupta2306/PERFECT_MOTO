import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageSquare, ShieldCheck, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../utils/api";

// Core Layout UI Child Components
import ImageGallery from "../components/product/ImageGallery";
import BikeCompatibility from "../components/product/BikeCompatibility";
import PriceHistory from "../components/product/PriceHistory";
import BundleSuggestion from "../components/product/BundleSuggestion";
import ReviewSection from "../components/product/ReviewSection";
import TrustBadges from "../components/home/TrustBadges";

const ProductDetail = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { user } = useAuth();

  // Core Product API States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [reviews, setReviews] = useState([]);

  // UI States
  const [activeGarageBike, setActiveGarageBike] = useState(null);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");

  // ============================================================================
  // 🛠️ CLEAN DIRECT LOOKUP SLUG PARSER
  // ============================================================================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      setLoading(true);
      try {
        // ✅ FIXED: Restored clean, direct backend routing endpoints pass
        const res = await api.get(`/products/slug/${productSlug}`);
        const fetchedProduct = res.data.product;
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          navigate("/shop");
        }
      } catch (err) {
        console.error("Error retrieving base product specs:", err);
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug, navigate]);

  // Parallel query engine triggers cross-sell bundles and reviews instantly once product ID handles resolve
  useEffect(() => {
    if (!product?._id) return;
    const fetchExtraProductData = async () => {
      try {
        const [bundleRes, reviewRes] = await Promise.all([
          api.get(`/bundles/product/${product._id}`),
          api.get(`/reviews/${product._id}`)
        ]);
        
        setBundle(bundleRes.data?.bundles?.[0] || null);
        setReviews(reviewRes.data?.reviews || []);
      } catch (err) {
        console.error("Non-blocking telemetry fetching error catching secondary fields:", err);
      }
    };
    fetchExtraProductData();
  }, [product]);

  // Hierarchical machine config syncing algorithm maps user data before guest localStorage fallbacks
  useEffect(() => {
    if (user?.garage && user.garage.length > 0) {
      const primaryBike = user.garage.find(b => b.isPrimary) || user.garage[0];
      if (primaryBike) {
        setActiveGarageBike(primaryBike);
        return;
      }
    }

    const savedGarage = localStorage.getItem("perfectmoto_garage_primary");
    if (savedGarage) {
      setActiveGarageBike(JSON.parse(savedGarage));
    }
  }, [user]);

  // Asynchronous waitlist processing handler
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistError("");
    try {
      await api.post("/notify-me", {
        product: product._id,
        phone: whatsappNumber
      });
      setWaitlistSuccess(true);
      setTimeout(() => {
        setIsWaitlistModalOpen(false);
        setWaitlistSuccess(false);
        setWhatsappNumber("");
      }, 2500);
    } catch (err) {
      setWaitlistError(err.response?.data?.message || "Failed to join waitlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <RefreshCw size={24} className="animate-spin text-primary-gold" />
        <span>LOADING TECHNICAL ARCHITECTURE BLUEPRINTS...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-error-red font-heading text-xs tracking-widest gap-2 select-none">
        <AlertCircle size={24} />
        <span>PRODUCT DATA MATRIX UNRESOLVABLE.</span>
      </div>
    );
  }

  const displayPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const isOutOfStock = Number(product.stock || 0) <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in font-body text-xs text-muted-gray selection:bg-primary-gold selection:text-deep-black">

      {/* Breadcrumb Path Trace */}
      <nav className="flex items-center gap-2 text-xs text-muted-gray uppercase tracking-wider mb-8 font-heading font-bold">
        <span className="cursor-pointer hover:text-primary-gold transition-colors" onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={11} className="text-muted-gray/40" />
        <span className="cursor-pointer hover:text-primary-gold transition-colors" onClick={() => navigate("/shop")}>Shop</span>
        <ChevronRight size={11} className="text-muted-gray/40" />
        <span className="text-pure-white truncate max-w-[240px]">{product.name}</span>
      </nav>

      {/* Main Core Layout Splits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* ================= LEFT COLUMN: CANVAS VISUAL MEDIA LAYOUTS ================= */}
        <div className="space-y-6">
          <ImageGallery images={product.images || []} />
        </div>

        {/* ================= RIGHT COLUMN: CONVERSION SPECS & TRANSACTION FILTERS ================= */}
        <div className="space-y-6">
          
          {/* Headline Typography Panel */}
          <div>
            <span className="text-xs text-primary-gold font-heading font-extrabold uppercase tracking-widest block">
              {product.brand || "PerfectMoto"} Genuine Component Group
            </span>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-pure-white uppercase tracking-wide mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-[11px] text-muted-gray/50 mt-2 font-mono tracking-normal">LOGICAL_SKU_INDEX: {product.slug || product._id}</p>
          </div>

          {/* Dynamic Garage Fitment Verification Check Component Engine */}
          <BikeCompatibility 
            productCompatibleBikes={product.compatibleBikes || []} 
            activeGarageBike={activeGarageBike} 
          />

          {/* Price Tracking Summary Section */}
          <div className="border-t border-b border-border-dark/60 py-4 flex items-center justify-between bg-deep-black/10 px-1">
            <div>
              <span className="text-[10px] text-muted-gray uppercase tracking-widest font-heading font-bold block">Net Store Payable Total</span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-mono font-bold text-pure-white">₹{Number(displayPrice).toLocaleString("en-IN")}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-gray/60 line-through font-mono">₹{Number(product.price).toLocaleString("en-IN")}</span>
                )}
                <span className="text-[10px] text-success-green font-heading font-extrabold uppercase tracking-wider bg-success-green/10 px-1.5 py-0.5 rounded">Incl. GST</span>
              </div>
            </div>
            
            {hasDiscount && (
              <span className="bg-error-red text-pure-white text-[10px] font-heading font-bold tracking-widest px-2.5 py-1 uppercase shadow-md animate-pulse">
                SAVE {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          {/* Historical Price Valuation Graphing Layer Widget Asset (90-Day Trend Chart) */}
          <PriceHistory productId={product._id} />

          <TrustBadges />

          {/* Active Call-to-Action Operational Matrix Triggers */}
          <div className="pt-2">
            {isOutOfStock ? (
              <button
                type="button"
                onClick={() => setIsWaitlistModalOpen(true)}
                className="w-full h-12 bg-deep-black/40 hover:bg-card-dark border border-error-red text-error-red hover:text-pure-white font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md transform active:scale-98 duration-150"
              >
                <MessageSquare size={15} />
                <span>Notify Me on WhatsApp</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { addItemToCart(product, 1); navigate("/cart"); }}
                className="w-full h-12 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-glow/5 transform hover:scale-[1.005] active:scale-98 duration-150"
              >
                <ShoppingCart size={15} />
                <span>Buy Now</span>
              </button>
            )}
          </div>

          {/* Text Summary Information Descriptions */}
          {product.description && (
            <div className="border border-border-dark rounded-xl p-4 bg-card-dark/20 leading-relaxed">
              <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white mb-2">Product Overview</h3>
              <p className="text-xs text-muted-gray font-medium normal-case">{product.description}</p>
            </div>
          )}

          {/* Detailed Technical Blueprint Parameter Data Grid */}
          {product.specifications?.length > 0 && (
            <div className="border border-border-dark rounded-xl overflow-hidden bg-card-dark/40 shadow-sm">
              <div className="bg-card-dark px-4 py-3 border-b border-border-dark">
                <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">Technical Architecture Blueprint</h3>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className="border-b border-border-dark/40 last:border-none hover:bg-deep-black/20 transition-colors">
                      <td className="p-3 font-heading font-bold text-muted-gray uppercase tracking-wider w-1/3 border-r border-border-dark/40 bg-deep-black/10">
                        {spec.key}
                      </td>
                      <td className="p-3 text-pure-white font-medium pl-4 normal-case font-mono text-[11px]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <BundleSuggestion bundle={bundle} />

        </div>
      </div>

      {/* Approved Public Customer Review Evaluation Feed Grid Module Segment */}
      <div className="mt-16 pt-8 border-t border-border-dark/40">
        <ReviewSection reviews={reviews} productId={product._id} />
      </div>

      {/* ================= TELEMETRY WHATSAPP WAITLIST OVERLAY INTERFACE MODAL ================= */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-card-dark border border-border-dark rounded-xl p-6 shadow-2xl animate-scale-up relative">

            <button
              type="button"
              onClick={() => { setIsWaitlistModalOpen(false); setWaitlistError(""); }}
              className="absolute top-4 right-4 text-muted-gray hover:text-pure-white font-mono text-sm p-1 rounded focus:outline-none"
            >
              ✕
            </button>

            <h3 className="text-lg font-heading font-bold text-pure-white uppercase tracking-wide mb-1">
              Join Variant <span className="text-primary-gold">Waitlist</span>
            </h3>
            <p className="text-xs text-muted-gray leading-normal mb-4 normal-case">
              This premium accessory component tier configuration is temporarily out. Drop your mobile number below to trigger an automated instance alert on WhatsApp the exact second our logistics terminal restocks inventory.
            </p>

            {waitlistSuccess ? (
              <div className="p-4 bg-success-green/10 border border-success-green/20 text-success-green text-xs font-semibold rounded-lg flex items-center gap-2 uppercase tracking-wider justify-center py-8 animate-fade-in">
                <ShieldCheck size={18} className="animate-pulse" />
                <span>Waitlist Registered Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1.5">WhatsApp Mobile Number</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-gray/50 group-focus-within:text-primary-gold transition-colors">+91</span>
                    <input
                      type="tel"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      required
                      placeholder="9876543210"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-11 pl-12 pr-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:border-primary-gold transition-colors"
                    />
                  </div>
                </div>

                {waitlistError && (
                  <p className="text-xs text-error-red font-semibold uppercase tracking-wide px-1 animate-fade-in">{waitlistError}</p>
                )}

                <button
                  type="submit"
                  disabled={whatsappNumber.length < 10}
                  className="w-full h-11 bg-success-green hover:bg-success-green/90 text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95 duration-100"
                >
                  <MessageSquare size={14} />
                  <span>Authorize Tracking Notification</span>
                </button>
              </form>
            )}

            <p className="text-[9px] text-muted-gray/40 text-center mt-4 uppercase tracking-wider leading-normal">
              Privacy locked. No automated spam sequences. Only a single inventory tracking re-allocation dispatch alert will be fired.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
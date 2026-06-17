import React, { useState, useEffect } from "react";
import { Ticket, Plus, Trash2, ShieldCheck, ToggleLeft, ToggleRight, X, Loader2, Calendar, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminCoupons = () => {
  const [successBanner, setSuccessBanner] = useState("");

  // FIXED (Issue 1): Substituted placeholder arrays with real reactive backend database hooks
  const [promotionalCouponsList, setPromotionalCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED (Issue 5): Added infrastructure states for inline coupon generation
  const [showForm, setShowForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: "",
    maxUses: "",
    expiryDate: ""
  });

  // Pull existing campaign vouchers from back-office endpoints on mount
  useEffect(() => {
    const fetchCampaignCoupons = async () => {
      try {
        const res = await api.get("/coupons");
        setPromotionalCouponsList(res.data.coupons || []);
      } catch (err) {
        console.error("Voucher configuration matrix retrieval failure:", err);
        setPromotionalCouponsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignCoupons();
  }, []);

  // FIXED (Issue 2): Re-engineered function to coordinate status modifications with database states
  const handleToggleStatus = async (id) => {
    try {
      const couponTarget = promotionalCouponsList.find(c => c._id === id);
      if (!couponTarget) return;

      const updatedStatus = !couponTarget.isActive;
      
      // Fires dynamic state payload change out to backend administrative controllers
      await api.put(`/coupons/${id}`, { isActive: updatedStatus });
      
      // Refreshes the local UI layout state array instantly upon successful execution
      setPromotionalCouponsList(prev =>
        prev.map(c => c._id === id ? { ...c, isActive: updatedStatus } : c)
      );
      
      setSuccessBanner(`Voucher parameters switched successfully for tracking reference.`);
      setTimeout(() => setSuccessBanner(""), 3000);
    } catch (err) {
      console.error("Failed to alter remote campaign toggle status:", err);
      setSuccessBanner("Failed to execute status change rules on server.");
      setTimeout(() => setSuccessBanner(""), 3000);
    }
  };

  // FIXED (Issue 3): Replaced client array sweeps with permanent API delete transactions
  const handleDeleteVoucher = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this promotional code configuration rule?")) {
      try {
        await api.delete(`/coupons/${id}`);
        setPromotionalCouponsList(prev => prev.filter(v => v._id !== id));
        setSuccessBanner("Promotional coupon rule trace permanently removed.");
        setTimeout(() => setSuccessBanner(""), 3000);
      } catch (err) {
        console.error("Voucher absolute eviction terminal loop error:", err);
        setSuccessBanner("Failed to delete coupon rule. Verify connectivity logs.");
        setTimeout(() => setSuccessBanner(""), 3000);
      }
    }
  };

  // FIXED (Issue 5): Form submission action module handler
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      // Structure paylaod schemas correctly mapping straight to back-end controllers
      const res = await api.post("/coupons", {
        code: newCoupon.code.trim().toUpperCase(),
        discountType: newCoupon.discountType,
        discountValue: Number(newCoupon.discountValue),
        minOrderValue: Number(newCoupon.minOrderValue),
        maxUses: Number(newCoupon.maxUses),
        expiryDate: newCoupon.expiryDate ? new Date(newCoupon.expiryDate).toISOString() : undefined,
        isActive: true,
        validFrom: new Date().toISOString()
      });

      // Hydrate local state array by appending newly generated response model object
      setPromotionalCouponsList(prev => [...prev, res.data.coupon]);
      setShowForm(false);
      
      // Safely clear inputs
      setNewCoupon({ code: "", discountType: "percent", discountValue: "", minOrderValue: "", maxUses: "", expiryDate: "" });
      setSuccessBanner("Campaign voucher authorized and compiled successfully.");
      setTimeout(() => setSuccessBanner(""), 3000);
    } catch (err) {
      console.error("Administrative coupon addition pipeline failure:", err);
      setSuccessBanner(err.response?.data?.message || "Failed to launch campaign rules.");
      setTimeout(() => setSuccessBanner(""), 3500);
    }
  };

  // FIXED (Issue 1): Standardized system loading boundary overlay
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Voucher Campaign Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Banner Action Controllers Panel Layer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-dark pb-5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Campaign <span className="text-pure-white">Voucher</span> Engine
          </h1>
          <p className="text-xs text-muted-gray mt-1">Configure automated promo code definitions, discount distributions, and minimum expenditure caps.</p>
        </div>
        
        {/* FIXED (Issue 5): Linked state form toggler straight into active CTA button */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`h-10 px-5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
            showForm
              ? "bg-deep-black border border-error-red text-error-red hover:bg-error-red/5"
              : "bg-primary-gold hover:bg-gold-hover text-deep-black"
          }`}
        >
          {showForm ? <X size={14} /> : <Plus size={14} strokeWidth={2.5} />}
          <span>{showForm ? "Close Workshop" : "Launch Campaign Rules"}</span>
        </button>
      </div>

      {successBanner && (
        <div className={`p-3 text-xs rounded-lg flex items-center gap-2 font-semibold border animate-fade-in ${
          successBanner.toLowerCase().includes("failed") || successBanner.toLowerCase().includes("error")
            ? "bg-error-red/10 border-error-red text-error-red"
            : "bg-success-green/10 border-success-green text-success-green"
        }`}>
          <ShieldCheck size={16} className="shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* FIXED (Issue 5): Responsive multi-input voucher creation sub-form layout wrapper */}
      {showForm && (
        <form onSubmit={handleCreateCoupon} className="bg-card-dark border border-primary-gold/30 rounded-xl p-5 shadow-md animate-fade-in space-y-4">
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white border-b border-border-dark pb-2">
            Construct New Promotion Threshold Node
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Coupon Mask Code</label>
              <input required placeholder="e.g. WELCOME10" name="code" value={newCoupon.code}
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-heading uppercase focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Discount Mode</label>
              <select name="discountType" value={newCoupon.discountType}
                onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}
                className="w-full h-10 px-3 bg-deep-black text-primary-gold border border-border-dark rounded-lg text-xs font-heading focus:outline-none focus:border-primary-gold cursor-pointer transition-colors"
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Cash Surcharge (₹)</option>
                <option value="free_shipping">Free Logistics Shipping</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Discount Multiplier Value</label>
              <input required={newCoupon.discountType !== "free_shipping"} placeholder="e.g. 10 or 500" type="number" min="1" name="discountValue" disabled={newCoupon.discountType === "free_shipping"}
                value={newCoupon.discountType === "free_shipping" ? "" : newCoupon.discountValue}
                onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Expenditure Floor (Min Order ₹)</label>
              <input required placeholder="e.g. 999" type="number" min="0" name="minOrderValue" value={newCoupon.minOrderValue}
                onChange={e => setNewCoupon({...newCoupon, minOrderValue: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Global Usage Max Limit (Uses)</label>
              <input required placeholder="e.g. 500" type="number" min="1" name="maxUses" value={newCoupon.maxUses}
                onChange={e => setNewCoupon({...newCoupon, maxUses: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Calendar Expiry Timeline</label>
              <input required type="date" name="expiryDate" value={newCoupon.expiryDate} min={new Date().toISOString().split("T")[0]}
                onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors cursor-pointer text-muted-gray"
              />
            </div>
          </div>

          <button type="submit" className="w-full h-10 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase text-xs tracking-wider rounded-lg shadow-md transition-colors transform active:scale-[0.995]">
            Authorize Campaign Matrix Node
          </button>
        </form>
      )}

      {/* FIXED (Issue 6): Added clean visual context fallback frame if zero matching coupon traces are in memory */}
      {promotionalCouponsList.length === 0 && !showForm ? (
        <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16 max-w-5xl mx-auto">
          <AlertCircle size={36} className="text-muted-gray mx-auto mb-2" />
          <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide text-sm">Campaign Matrix Vacant</h4>
          <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1">Populate promo frameworks by launching structural campaign criteria grids above.</p>
        </div>
      ) : (
        /* Main Campaign Rules Board Grid Rendering Canvas Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FIXED (Issue 4): Standardized layout field variables to parse genuine database Mongoose parameters */}
          {promotionalCouponsList.map((voucher) => {
            const voucherId = voucher._id;
            const isCouponActive = voucher.isActive;
            const totalRedemptions = voucher.usedCount || 0;
            
            // Computes descriptive labels based on dynamic system configuration settings rules
            let yieldLabel = "Free Shipping";
            if (voucher.discountType === "percent") {
              yieldLabel = `${voucher.discountValue}% Off`;
            } else if (voucher.discountType === "flat") {
              yieldLabel = `₹${voucher.discountValue} Off`;
            }

            return (
              <div 
                key={voucherId} 
                className={`bg-card-dark border rounded-xl p-5 shadow-md flex flex-col justify-between min-h-[170px] transition-all relative ${
                  isCouponActive 
                    ? "border-primary-gold/30 hover:border-primary-gold shadow-gold-glow-subtle hover:shadow-gold-glow" 
                    : "border-border-dark opacity-50"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center border-b border-border-dark/40 pb-2.5">
                    <div className="flex items-center gap-1.5 text-primary-gold bg-primary-gold/10 border border-primary-gold/20 font-mono text-xs font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md">
                      <Ticket size={12} />
                      <span className="select-all">{voucher.code}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {/* FIXED (Issue 4): Pointed execution handlers contextually down through _id maps */}
                      <button 
                        onClick={() => handleToggleStatus(voucherId)}
                        className="text-muted-gray hover:text-pure-white transition-colors"
                        title={isCouponActive ? "Deactivate campaign" : "Activate campaign"}
                      >
                        {isCouponActive ? <ToggleRight className="text-success-green" size={24} /> : <ToggleLeft size={24} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteVoucher(voucherId)}
                        className="text-muted-gray hover:text-error-red p-1 rounded transition-colors"
                        title="Delete rule"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wide">
                    <div>
                      <span className="text-[10px] text-muted-gray block font-bold tracking-widest">Yield Multiplier</span>
                      <span className="text-pure-white font-mono font-bold text-sm block mt-0.5">{yieldLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-gray block font-bold tracking-widest">Expenditure Floor</span>
                      <span className="text-pure-white font-mono block mt-0.5">₹{voucher.minOrderValue || 0}</span>
                    </div>
                  </div>
                </div>

                {voucher.expiryDate && (
                  <div className="mt-2 text-[10px] font-mono text-muted-gray flex items-center gap-1 normal-case font-medium">
                    <Calendar size={10} className="text-primary-gold" />
                    <span>Expires: {new Date(voucher.expiryDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                )}

                <div className="mt-4 pt-2 border-t border-border-dark/30 flex justify-between items-center text-[10px] text-muted-gray uppercase tracking-widest font-bold">
                  <span>Total Redemptions Logged</span>
                  <span className="text-primary-gold font-mono text-xs">{totalRedemptions} Times</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
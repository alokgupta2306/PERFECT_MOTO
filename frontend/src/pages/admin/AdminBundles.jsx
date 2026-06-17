import React, { useState, useEffect } from "react";
import { Sliders, Plus, Trash2, Tag, Percent, FolderTree, Loader2, Save, CheckCircle } from "lucide-react";
import api from "../../utils/api";

const AdminBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State for creating a new bundle combo matching PRD guidelines
  const [newBundle, setNewBundle] = useState({
    title: "",
    discountPercentage: 10,
    selectedProducts: ["", ""], // Pre-fills two empty slot pickers as the structural baseline
    isActive: true
  });

  // ============================================================================
  // 🛠️ FIXED: Combined initialization fetch call for bundles and full product arrays
  // ============================================================================
  const fetchCampaignBundlesAndCatalog = async () => {
    setLoading(true);
    try {
      // Parallel network requests to avoid sequential latency water-falling
      const [bundlesRes, productsRes] = await Promise.all([
        api.get("/bundles"),
        api.get("/products")
      ]);

      setBundles(bundlesRes.data?.bundles || bundlesRes.data || []);
      setProducts(productsRes.data?.products || productsRes.data || []);
    } catch (err) {
      console.error("Failed to parse administration campaign layout bounds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignBundlesAndCatalog();
  }, []);

  const handleAddProductSlot = () => {
    setNewBundle(prev => ({
      ...prev,
      selectedProducts: [...prev.selectedProducts, ""]
    }));
  };

  const handleProductSlotChange = (index, val) => {
    const updated = [...newBundle.selectedProducts];
    updated[index] = val;
    setNewBundle(prev => ({ ...prev, selectedProducts: updated }));
  };

  const handleRemoveProductSlot = (index) => {
    if (newBundle.selectedProducts.length <= 2) return; // Enforce minimum 2 items per cluster combo
    const updated = newBundle.selectedProducts.filter((_, i) => i !== index);
    setNewBundle(prev => ({ ...prev, selectedProducts: updated }));
  };

  const handleCreateBundleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up empty selectors prior to posting to node cluster models
    const targetProductIds = newBundle.selectedProducts.filter(id => id.trim() !== "");
    if (targetProductIds.length < 2) {
      alert("A cross-sell collection configuration must contain a minimum of 2 accessories.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bundles", {
        name: newBundle.title,
        discountPercentage: Number(newBundle.discountPercentage),
        products: targetProductIds,
        isActive: newBundle.isActive
      });
      
      // Reset form variables smoothly
      setNewBundle({
        title: "",
        discountPercentage: 10,
        selectedProducts: ["", ""],
        isActive: true
      });
      
      await fetchCampaignBundlesAndCatalog(); // Pull raw metrics updates cleanly
    } catch (err) {
      console.error("Failed to commit package combo definition mapping:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBundle = async (bundleId) => {
    if (!window.confirm("Are you confident you want to un-publish this package discount matrix?")) return;
    try {
      await api.delete(`/bundles/${bundleId}`);
      await fetchCampaignBundlesAndCatalog();
    } catch (err) {
      console.error("Failed to discard bundle parameters:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <Loader2 className="animate-spin text-primary-gold" size={24} />
        <span>CONSTRUCTING CROSS-SELL CAMPAIGN LEDGER...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none font-body text-xs">
      {/* Module Title Header Context */}
      <div className="flex items-center justify-between border-b border-border-dark/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold flex items-center justify-center rounded-xl">
            <Sliders size={18} />
          </div>
          <div>
            <h1 className="text-base font-heading font-black uppercase tracking-wider text-pure-white leading-none">
              Cross-Sell Bundle Campaigns
            </h1>
            <p className="text-[10px] text-muted-gray mt-1 font-sans font-medium normal-case">
              Configure bundled product pairs to automatically award discounts when checked out in a single sequence.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* SECTION A: BUNDLE CREATION SCHEMATIC FORM BLOCK */}
        <form onSubmit={handleCreateBundleSubmit} className="xl:col-span-1 bg-card-dark border border-border-dark p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-border-dark/60 pb-2 mb-2">
            <Tag size={13} className="text-primary-gold" />
            <h3 className="font-heading font-bold text-pure-white uppercase tracking-wider text-[11px]">
              Engine New Package Rule
            </h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray block">Campaign Title Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Crash Protection Combo Pack"
              value={newBundle.title}
              onChange={(e) => setNewBundle(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-9 bg-deep-black border border-border-dark rounded-lg px-3 text-pure-white focus:border-primary-gold/40 outline-none transition-colors font-medium text-xs normal-case"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray block">Deduction Discount (%)</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="90"
                required
                value={newBundle.discountPercentage}
                onChange={(e) => setNewBundle(prev => ({ ...prev, discountPercentage: e.target.value }))}
                className="w-full h-9 bg-deep-black border border-border-dark rounded-lg pl-3 pr-8 text-pure-white focus:border-primary-gold/40 outline-none font-mono font-bold text-xs"
              />
              <Percent size={12} className="absolute right-3 top-3 text-muted-gray/60" />
            </div>
          </div>

          {/* DYNAMIC COMBINATION ALLOCATION REPEATER FIELD ROWS */}
          <div className="space-y-2 pt-1">
            <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray block">Bundled Accessories Catalog Allocation</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {newBundle.selectedProducts.map((selectedId, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    required
                    value={selectedId}
                    onChange={(e) => handleProductSlotChange(idx, e.target.value)}
                    className="flex-1 h-9 bg-deep-black border border-border-dark rounded-lg px-2 text-pure-white focus:border-primary-gold/40 outline-none text-xs uppercase tracking-wide font-heading font-semibold"
                  >
                    <option value="" disabled className="normal-case">-- Choose Accessory Item --</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name.toUpperCase()} (₹{p.price})
                      </option>
                    ))}
                  </select>
                  
                  {newBundle.selectedProducts.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProductSlot(idx)}
                      className="h-9 w-9 bg-error-red/10 border border-error-red/20 text-error-red hover:bg-error-red hover:text-pure-white rounded-lg flex items-center justify-center transition-all shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddProductSlot}
              className="mt-2 w-full h-8 border border-dashed border-border-dark hover:border-primary-gold/40 text-muted-gray hover:text-primary-gold rounded-lg flex items-center justify-center gap-1.5 transition-colors uppercase font-heading font-bold text-[10px] tracking-wider"
            >
              <Plus size={12} />
              <span>Append Combination Slot</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray/30 text-deep-black rounded-lg font-heading font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors pt-0.5 shadow-lg shadow-gold-glow/5"
          >
            {submitting ? <Loader2 className="animate-spin" size={13} /> : <Save size={13} />}
            <span>Commit Incentive Bundle</span>
          </button>
        </form>

        {/* SECTION B: LIVE ACTIVE CONVERSIONS CAMPAIGNS RENDERING TABLE GRID */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-dark/60 pb-2">
            <FolderTree size={13} className="text-primary-gold" />
            <h3 className="font-heading font-bold text-pure-white uppercase tracking-wider text-[11px]">
              Active Live System Combo Deployments
            </h3>
          </div>

          {bundles.length === 0 ? (
            <div className="border border-border-dark bg-card-dark/20 p-12 text-center rounded-xl">
              <Sliders size={28} className="text-muted-gray/20 mx-auto mb-2" />
              <p className="text-[11px] font-heading font-bold text-muted-gray uppercase tracking-wide">
                No Promotional Bundles Active Instantly
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundles.map((bundle) => (
                <div key={bundle._id} className="bg-card-dark border border-border-dark rounded-xl p-4 flex flex-col justify-between hover:border-border-dark/90 transition-all group relative">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-pure-white font-heading font-extrabold text-xs uppercase tracking-wide truncate">
                        {bundle.name}
                      </h4>
                      <span className="bg-success-green/10 text-success-green border border-success-green/20 px-2 py-0.5 font-mono font-bold text-[10px] rounded shrink-0">
                        -{bundle.discountPercentage}% OFF
                      </span>
                    </div>

                    {/* Associated components chain indicator map */}
                    <div className="mt-3 space-y-1.5 border-t border-border-dark/40 pt-2">
                      <span className="text-[9px] uppercase font-heading font-bold tracking-widest text-muted-gray block">Included Array:</span>
                      <ul className="space-y-1">
                        {bundle.products?.map((p, pIdx) => (
                          <li key={p._id || pIdx} className="flex items-center gap-1.5 text-muted-gray text-[11px] font-medium normal-case truncate">
                            <CheckCircle size={10} className="text-primary-gold shrink-0" />
                            <span>{p.name || "Accessory Component SKU"}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-border-dark/30">
                    <span className="text-[10px] font-mono text-muted-gray/40">
                      ID: {bundle._id?.substring(0, 8)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBundle(bundle._id)}
                      className="h-7 px-2.5 text-muted-gray hover:text-error-red border border-border-dark hover:border-error-red/20 rounded-md bg-deep-black/40 flex items-center gap-1 transition-all uppercase font-heading font-bold text-[10px] tracking-wide"
                    >
                      <Trash2 size={10} />
                      <span>Purge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBundles;
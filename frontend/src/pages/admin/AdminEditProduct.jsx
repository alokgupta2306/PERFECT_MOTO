import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Wrench, CheckCircle2, ArrowLeft, Save, Loader2, Info, Calendar } from "lucide-react";
import api from "../../utils/api";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Controlled Interface Framework States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState("");
  const [loading, setLoading] = useState(true);

  // Dynamic Lookup Dataset State Tables
  const [categories, setCategories] = useState([]);

  // Complete structural configuration form metrics tracking Product schema layout
  const [formState, setFormState] = useState({
    title: "",
    brand: "",
    category: "",
    price: "",
    salePrice: "",
    stock: "",
    weight: "",
    length: "",
    breadth: "",
    description: "",
    targetBikeBrand: "",
    targetBikeModel: "",
    yearFrom: "2019",
    yearTo: "2026"
  });

  // Concurrent Promise payload execution layer to safely pull operational configurations on mount
  useEffect(() => {
    const fetchAllProductMetadata = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories")
        ]);

        const p = productRes.data.product;
        const initialBikeMatch = p.compatibleBikes?.[0] || {};

        setFormState({
          title: p.name || "",
          brand: p.brand || "",
          category: p.category?._id || p.category || "",
          price: p.price || "",
          salePrice: p.salePrice || "",
          stock: p.stock || "",
          weight: p.dimensions?.weight || "",
          length: p.dimensions?.length || "",
          breadth: p.dimensions?.breadth || "",
          description: p.description || "",
          targetBikeBrand: initialBikeMatch.brand || "",
          targetBikeModel: initialBikeMatch.model || "",
          yearFrom: initialBikeMatch.yearFrom || "2019",
          yearTo: initialBikeMatch.yearTo || "2026"
        });

        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error("Back-office database integration initialization failure loop tripped:", err);
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProductMetadata();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessState("");

    if (formState.salePrice && Number(formState.salePrice) >= Number(formState.price)) {
      setSuccessState("Error: Promotional Sale Price must be strictly lower than regular retail price.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Maps localized variables safely straight into the e-commerce Mongoose layout properties
      const putPayload = {
        name: formState.title.trim(),
        brand: formState.brand.trim(),
        category: formState.category,
        price: Number(formState.price),
        salePrice: formState.salePrice ? Number(formState.salePrice) : undefined,
        stock: Number(formState.stock),
        dimensions: {
          weight: formState.weight ? Number(formState.weight) : undefined,
          length: formState.length ? Number(formState.length) : undefined,
          breadth: formState.breadth ? Number(formState.breadth) : undefined
        },
        description: formState.description.trim(),
        compatibleBikes: formState.targetBikeBrand && formState.targetBikeModel ? [{
          brand: formState.targetBikeBrand.trim(),
          model: formState.targetBikeModel.trim(),
          yearFrom: Number(formState.yearFrom) || 2019,
          yearTo: Number(formState.yearTo) || 2026
        }] : []
      };

      await api.put(`/products/${id}`, putPayload);
      
      setSuccessState("Product node parameters updated securely on the remote server.");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("Back-office inventory adjustment mutation failure trace:", err);
      setSuccessState(err.response?.data?.message || "Modification transmission rejected. Verify indices values.");
      setTimeout(() => setSuccessState(""), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Themed latency indicator template boundary
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Hydrating Staging Matrix Core Parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-xs text-muted-gray hover:text-primary-gold font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Cancel Modifications</span>
        </button>
      </div>

      {successState && (
        <div className={`p-3 text-xs rounded-lg flex items-center gap-2 font-semibold border animate-fade-in ${
          successState.toLowerCase().includes("error") || successState.toLowerCase().includes("failed")
            ? "bg-error-red/10 border-error-red text-error-red" 
            : "bg-success-green/10 border-success-green text-success-green"
        }`}>
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successState}</span>
        </div>
      )}

      <div className="bg-card-dark border border-border-dark rounded-xl p-6 shadow-md hover:shadow-gold-glow transition-all">
        <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white border-b border-border-dark pb-3 mb-6">
          Modify Existing Catalogue Allocation Node
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Section A: Title Spec Definitions & Slug Conversions Frame */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Product Listing Title</label>
              <input
                type="text"
                name="title"
                required
                value={formState.title}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">System Reference URL Slug (Locked)</label>
              <input
                type="text"
                disabled
                value={formState.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "generating-slug..."}
                className="w-full h-10 px-4 bg-deep-black/50 text-muted-gray border border-border-dark/80 rounded-lg text-xs font-mono uppercase tracking-wider cursor-not-allowed select-all opacity-70"
              />
            </div>
          </div>

          {/* Storefront Description Specifications */}
          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Storefront Description Specifications</label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="Provide item configuration descriptions including product density, material configurations, safety badges or riding dimensions..."
              value={formState.description}
              onChange={handleInputChange}
              className="w-full p-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-medium focus:outline-none focus:border-primary-gold resize-none leading-relaxed transition-colors"
            />
          </div>

          {/* Section B: Financial Metrics Allocation Parameters Array grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Category Domain</label>
              <select
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                className="w-full h-10 px-3 bg-deep-black text-primary-gold border border-border-dark rounded-lg text-xs font-heading uppercase tracking-wider focus:outline-none focus:border-primary-gold cursor-pointer transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Retail Price (INR)</label>
              <input
                type="number"
                name="price"
                required
                min="1"
                value={formState.price}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Promo Sale Price (Optional)</label>
              <input
                type="number"
                name="salePrice"
                min="0"
                placeholder="e.g. 799"
                value={formState.salePrice}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-success-green border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Active Stock Inventory</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formState.stock}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          {/* Logistics Dimensions Sub-Object Inputs Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Weight (grams)</label>
              <input
                type="number"
                name="weight"
                min="0"
                placeholder="e.g. 1400"
                value={formState.weight}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Length (cm)</label>
              <input
                type="number"
                name="length"
                min="0"
                placeholder="e.g. 30"
                value={formState.length}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Breadth (cm)</label>
              <input
                type="number"
                name="breadth"
                min="0"
                placeholder="e.g. 25"
                value={formState.breadth}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          {/* Section C: Core Fitment Validation Logic Panel Frame */}
          <div className="p-4 bg-deep-black border border-border-dark rounded-xl space-y-4">
            <h4 className="text-[11px] font-heading font-bold text-primary-gold uppercase tracking-widest flex items-center gap-1.5 border-b border-border-dark pb-2">
              <Wrench size={12} />
              <span>Update Fitment Compatibility Limits</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Target Bike Brand</label>
                <input
                  type="text"
                  name="targetBikeBrand"
                  value={formState.targetBikeBrand}
                  onChange={handleInputChange}
                  placeholder="e.g. Royal Enfield"
                  className="w-full h-10 px-3 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Target Bike Variant Model</label>
                <input
                  type="text"
                  name="targetBikeModel"
                  value={formState.targetBikeModel}
                  onChange={handleInputChange}
                  placeholder="e.g. Classic 350"
                  className="w-full h-10 px-3 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs normal-case focus:outline-none focus:border-primary-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border-dark/30">
              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-muted-gray" />
                  <span>Batch Production From (Year)</span>
                </label>
                <input
                  type="number"
                  name="yearFrom"
                  min="2000"
                  max="2030"
                  value={formState.yearFrom}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1 flex items-center gap-1">
                  <Calendar size={10} className="text-muted-gray" />
                  <span>Batch Production To (Year)</span>
                </label>
                <input
                  type="number"
                  name="yearTo"
                  min="2000"
                  max="2030"
                  value={formState.yearTo}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
                />
              </div>
            </div>

            <div className="text-[10px] text-muted-gray flex items-center gap-1 bg-deep-black p-2 rounded border border-border-dark/30">
              <Info size={12} className="text-primary-gold shrink-0" />
              <span>Updating batch production thresholds forces real-time filter warnings for mismatched customer garage setups.</span>
            </div>
          </div>

          {/* Submission CTA Matrix controls */}
          <div className="pt-2 border-t border-border-dark/60 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 transform active:scale-95"
            >
              <Save size={14} />
              <span>{isSubmitting ? "Updating Database..." : "Commit Parameter Changes"}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminEditProduct;
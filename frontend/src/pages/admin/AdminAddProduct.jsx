import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, CheckCircle2, ArrowLeft, Save, Loader2, Info, Calendar } from "lucide-react";
import api from "../../utils/api";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState("");
  
  // Asynchronous lookup dataset states
  const [categories, setCategories] = useState([]);
  const [bikesData, setBikesData] = useState({ brands: [] });
  const [availableModels, setAvailableModels] = useState([]);

  // ✅ FIXED (Change 1): Added binary file array tracker and baseline image previews
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Comprehensive Form State aligned with Product schema model fields
  const [formState, setFormState] = useState({
    title: "",
    brand: "",
    category: "",
    price: "",
    salePrice: "",
    stock: "",
    description: "",
    targetBikeBrand: "",
    targetBikeModel: "",
    yearFrom: "2019",
    yearTo: "2026",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false
  });

  // Fetch real system categories from backend infrastructure
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data.categories || [];
        setCategories(cats);
        if (cats.length > 0) {
          setFormState((prev) => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        console.error("Failed to hydrate storefront categories database:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch unified Indian bikes catalog for fitment parameters mapping
  useEffect(() => {
    const fetchBikesCatalog = async () => {
      try {
        const res = await api.get("/bikes");
        setBikesData(res.data || { brands: [] });
        if (res.data?.brands?.length > 0) {
          const firstBrand = res.data.brands[0];
          setFormState((prev) => ({
            ...prev,
            targetBikeBrand: firstBrand.brand,
            targetBikeModel: firstBrand.models?.[0]?.model || firstBrand.models?.[0] || ""
          }));
        }
      } catch (err) {
        console.error("Failed to hydrate motorcycle configuration datasets:", err);
      }
    };
    fetchBikesCatalog();
  }, []);

  // Synchronize model profiles variant dropdown dynamically when manufacturer brand transitions
  useEffect(() => {
    if (formState.targetBikeBrand && bikesData.brands.length > 0) {
      const selectedBrandData = bikesData.brands.find(b => b.brand === formState.targetBikeBrand);
      if (selectedBrandData?.models) {
        const modelNames = selectedBrandData.models.map(m => m.model || m);
        setAvailableModels(modelNames);
        setFormState((prev) => ({ ...prev, targetBikeModel: modelNames[0] || "" }));
      } else {
        setAvailableModels([]);
      }
    }
  }, [formState.targetBikeBrand, bikesData]);

  // ✅ FIXED (Change 2): Sourced file system local object endpoint parser capping uploads at 4 items
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setSelectedImages(files);
    setImagePreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Complete real API authorization pipeline handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessState("");

    // Enforce basic mathematical validation boundaries
    if (formState.salePrice && Number(formState.salePrice) >= Number(formState.price)) {
      setSuccessState("Error: Promotional Sale Price must be strictly lower than regular retail price.");
      setIsSubmitting(false);
      return;
    }

    try {
      const productPayload = {
        name: formState.title.trim(),
        brand: formState.brand.trim(),
        category: formState.category,
        price: Number(formState.price),
        salePrice: formState.salePrice ? Number(formState.salePrice) : undefined,
        stock: Number(formState.stock),
        description: formState.description.trim(),
        status: "active",
        isFeatured: formState.isFeatured,
        isNewArrival: formState.isNewArrival,
        isBestSeller: formState.isBestSeller,
        compatibleBikes: formState.targetBikeBrand && formState.targetBikeModel ? [{
          brand: formState.targetBikeBrand,
          model: formState.targetBikeModel,
          yearFrom: Number(formState.yearFrom) || 2019,
          yearTo: Number(formState.yearTo) || 2026
        }] : []
      };

      const productRes = await api.post("/products", productPayload);
const newProductId = productRes.data.product._id;

if (selectedImages.filter(Boolean).length > 0) {
  const formData = new FormData();
  selectedImages.filter(Boolean).forEach(image => formData.append("images", image));
  await api.post(`/products/${newProductId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
      
      setSuccessState("Product node authorized and compiled successfully inside active catalog.");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);

    } catch (err) {
      console.error("Back-office item insertion pipeline fault:", err);
      setSuccessState(err.response?.data?.message || "Failed to finalize product node. Verify parameters.");
      setTimeout(() => setSuccessState(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-xs text-muted-gray hover:text-primary-gold font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Ledger Index</span>
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
          Product Construction Matrix Workshop
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Section A: Primary Metadata Title Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Product Listing Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Steelbird High-Ventilation Race Shield"
                value={formState.title}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Manufacturer Brand</label>
              <input
                type="text"
                name="brand"
                required
                placeholder="Steelbird"
                value={formState.brand}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
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
              placeholder="Provide a detailed log layout regarding material density, helmet shell configuration, structural ventilation, or riding ergonomics..."
              value={formState.description}
              onChange={handleInputChange}
              className="w-full p-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-medium focus:outline-none focus:border-primary-gold resize-none leading-relaxed transition-colors"
            />
          </div>

          {/* Section B: Financial Aggregates & Inventory Stock Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Category Domain</label>
              <select
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                className="w-full h-10 px-3 bg-deep-black text-primary-gold border border-border-dark rounded-lg text-xs font-heading uppercase tracking-wider focus:outline-none focus:border-primary-gold cursor-pointer transition-colors"
              >
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Standard Price (INR)</label>
              <input
                type="number"
                name="price"
                required
                min="1"
                placeholder="1850"
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
                placeholder="e.g. 1499"
                value={formState.salePrice}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-success-green border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">Initial Stock Volume</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                placeholder="15"
                value={formState.stock}
                onChange={handleInputChange}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          {/* Section C: Algorithmic Fitment Core USP Linking Configuration Setup */}
          <div className="p-4 bg-deep-black border border-border-dark rounded-xl space-y-4">
            <h4 className="text-[11px] font-heading font-bold text-primary-gold uppercase tracking-widest flex items-center gap-1.5 border-b border-border-dark pb-2">
              <Wrench size={12} />
              <span>Algorithmic Fitment Compatibility Mapping</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Target Bike Manufacturer</label>
                <select
                  name="targetBikeBrand"
                  value={formState.targetBikeBrand}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold cursor-pointer transition-colors"
                >
                  {bikesData.brands.length === 0 ? (
                    <option value="">Loading manufacturing data...</option>
                  ) : (
                    bikesData.brands.map((b) => (
                      <option key={b.brand} value={b.brand}>{b.brand}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Target Bike Variant Model</label>
                <select
                  name="targetBikeModel"
                  value={formState.targetBikeModel}
                  onChange={handleInputChange}
                  disabled={availableModels.length === 0}
                  className="w-full h-10 px-3 bg-card-dark text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold cursor-pointer transition-colors disabled:opacity-40"
                >
                  {availableModels.length === 0 ? (
                    <option value="">-- No models available --</option>
                  ) : (
                    availableModels.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))
                  )}
                </select>
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
              <span>Specifying custom year limits flags a safety compatibility grid label dynamically inside matching user interfaces.</span>
            </div>
          </div>

          {/* ✅ FIXED (Change 3): Mounted interactive file input module wrapper with absolute grid viewports mapping */}
          <div>
            <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1.5">
              Product Images (Max 4)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-xs text-muted-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-gold file:text-deep-black file:font-bold file:uppercase file:text-xs cursor-pointer focus:outline-none"
            />
            {imagePreview.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {imagePreview.map((src, i) => (
                  <img 
                    key={i} 
                    src={src} 
                    alt={`Preview node allocation #${i + 1}`} 
                    className="w-20 h-20 object-cover rounded-lg border border-border-dark shadow-sm bg-deep-black" 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Section */}

          {/* Image Upload Section */}
<div className="space-y-4">
  <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray">
    Product Images
  </label>

  {/* Main Image */}
  <div>
    <label className="block text-[10px] text-primary-gold font-bold uppercase tracking-wider mb-1">Main Image (1)</label>
    <input type="file" accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) setSelectedImages(prev => { const arr = [...prev]; arr[0] = file; return arr; });
        if (file) setImagePreview(prev => { const arr = [...prev]; arr[0] = URL.createObjectURL(file); return arr; });
      }}
      className="w-full text-xs text-muted-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-gold file:text-deep-black file:font-bold file:uppercase file:text-xs cursor-pointer"
    />
    {imagePreview[0] && <img src={imagePreview[0]} className="w-24 h-24 object-cover rounded-lg border-2 border-primary-gold mt-2" />}
  </div>

  {/* Sub Images */}
  {[1, 2, 3].map((i) => (
    <div key={i}>
      <label className="block text-[10px] text-muted-gray font-bold uppercase tracking-wider mb-1">Sub Image {i}</label>
      <input type="file" accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) setSelectedImages(prev => { const arr = [...prev]; arr[i] = file; return arr; });
          if (file) setImagePreview(prev => { const arr = [...prev]; arr[i] = URL.createObjectURL(file); return arr; });
        }}
        className="w-full text-xs text-muted-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-border-dark file:text-pure-white file:font-bold file:uppercase file:text-xs cursor-pointer"
      />
      {imagePreview[i] && <img src={imagePreview[i]} className="w-20 h-20 object-cover rounded-lg border border-border-dark mt-2" />}
    </div>
  ))}
</div>

          {/* Homepage Visibility Toggles */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-border-dark/30">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formState.isFeatured}
                onChange={(e) => setFormState((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="accent-primary-gold w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white group-hover:text-primary-gold transition-colors">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formState.isNewArrival}
                onChange={(e) => setFormState((prev) => ({ ...prev, isNewArrival: e.target.checked }))}
                className="accent-primary-gold w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white group-hover:text-primary-gold transition-colors">New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formState.isBestSeller}
                onChange={(e) => setFormState((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
                className="accent-primary-gold w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-pure-white group-hover:text-primary-gold transition-colors">Best Seller</span>
            </label>
          </div>

          {/* Form Action Matrix Actions Trigger Row */}
          <div className="pt-3 border-t border-border-dark/60 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md disabled:opacity-40 transform active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Authorizing Matrix Node...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Authorize Entry Matrix</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminAddProduct;
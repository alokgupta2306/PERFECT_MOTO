import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, Layers, Calendar, Search, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const ShopByBike = () => {
  const navigate = useNavigate();

  // Core Selector Matrix Array States
  const [brandsData, setBrandsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tracking State Values
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchBikeCompatibilityMatrix = async () => {
      try {
        setError("");
        // ============================================================================
        // 🛠️ FIXED (Gap 22): Query the correct public route instead of secure /admin endpoints
        // ============================================================================
        const res = await api.get("/bikes");
        
        // Unpack payload data structures safely (supports direct arrays or brands objects)
        const parsedBrands = res.data?.brands || res.data || [];
        setBrandsData(parsedBrands);
      } catch (err) {
        console.error("Machine matrix alignment syncing runtime boundary issue:", err);
        setError("Failed to fetch bike alignment parameters from server.");
        
        // Resilient Fallback: Hydrate with popular Indian brands matching Section 25 if network drops
        setBrandsData([
          {
            brand: "Royal Enfield",
            models: [
              { model: "Classic 350", years: [2019, 2020, 2021, 2022, 2023, 2024] },
              { model: "Himalayan", years: [2019, 2020, 2021, 2022, 2023, 2024] }
            ]
          },
          {
            brand: "KTM",
            models: [
              { model: "Duke 390", years: [2019, 2020, 2021, 2022, 2023, 2024] }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBikeCompatibilityMatrix();
  }, []);

  // Filter models based on chosen brand node array
  const activeBrandConfig = brandsData.find(b => b.brand === selectedBrand);
  const availableModels = activeBrandConfig ? activeBrandConfig.models : [];

  // Filter years based on chosen model node array
  const activeModelConfig = availableModels.find(m => m.model === selectedModel);
  const availableYears = activeModelConfig ? activeModelConfig.years : [];

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
    setSelectedYear("");
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSelectedYear("");
  };

  const handleFindMyGearSubmit = (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !selectedYear) return;

    // Direct user to shop page with query filter mapping strings (PRD Step 3)
    navigate(
      `/shop?brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}&year=${selectedYear}`
    );
  };

  if (loading) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-2 select-none">
        <Loader2 size={20} className="animate-spin text-primary-gold" />
        <span>PARSING INDIAN MOTORCYCLE HARDWARE SCHEMA...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-card-dark border border-border-dark rounded-xl p-6 shadow-xl select-none font-body text-xs">
      
      {/* Selector Header Grid */}
      <div className="flex items-center gap-2 border-b border-border-dark/60 pb-3 mb-5">
        <Bike size={16} className="text-primary-gold animate-pulse" />
        <h3 className="text-xs font-heading font-black uppercase tracking-wider text-pure-white">
          Shop By Motorcycle Compatibility
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-2.5 bg-error-red/10 border border-error-red/20 text-error-red rounded-lg flex items-center gap-1.5 font-medium normal-case">
          <AlertCircle size={12} />
          <span>Using offline alignment dataset preset parameters.</span>
        </div>
      )}

      {/* Dynamic Dropdowns Layout Matrix */}
      <form onSubmit={handleFindMyGearSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Brand Dropdown Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray flex items-center gap-1">
            <Bike size={10} /> 1. Select Brand
          </label>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="w-full h-9 bg-deep-black border border-border-dark rounded-lg px-2 text-pure-white text-xs font-heading font-semibold uppercase tracking-wide focus:border-primary-gold/40 outline-none cursor-pointer"
          >
            <option value="" className="normal-case">-- Choose Brand --</option>
            {brandsData.map((b, idx) => (
              <option key={idx} value={b.brand}>{b.brand.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Model Dropdown Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray flex items-center gap-1">
            <Layers size={10} /> 2. Select Model
          </label>
          <select
            disabled={!selectedBrand}
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full h-9 bg-deep-black border border-border-dark rounded-lg px-2 text-pure-white text-xs font-heading font-semibold uppercase tracking-wide focus:border-primary-gold/40 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="" className="normal-case">-- Choose Model --</option>
            {availableModels.map((m, idx) => (
              <option key={idx} value={m.model}>{m.model.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Year Dropdown Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-heading font-bold tracking-wider text-muted-gray flex items-center gap-1">
            <Calendar size={10} /> 3. Select Year
          </label>
          <select
            disabled={!selectedModel}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-9 bg-deep-black border border-border-dark rounded-lg px-2 text-pure-white text-xs font-mono font-bold focus:border-primary-gold/40 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="" className="font-heading font-semibold uppercase tracking-wide text-xs normal-case">-- Year --</option>
            {availableYears.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Submit Execution Action Trigger Button */}
        <button
          type="submit"
          disabled={!selectedBrand || !selectedModel || !selectedYear}
          className="w-full h-9 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray/20 text-deep-black disabled:text-muted-gray/40 font-heading font-black uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-gold-glow/5 disabled:shadow-none"
        >
          <Search size={12} />
          <span>Find My Gear</span>
        </button>

      </form>
    </div>
  );
};

export default ShopByBike;
import React, { useState, useEffect } from "react";
import { Wrench, Plus, Trash2, ShieldCheck, CheckCircle2, Bike, AlertCircle, Loader2 } from "lucide-react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const Garage = () => {
  const { user } = useAuth();

  // FIXED (Issue 2): Replaced hardcoded dataset shell with a dynamic state variable matrix
  const [bikesDatabase, setBikesDatabase] = useState({ brands: [] });
  const [savedBikes, setSavedBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Management Parameters for the Input Interface Controls
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // FIXED (Issue 2): Hydrate the brand dropdown catalog natively off step #22 of your Week 4 plan
  useEffect(() => {
    const fetchBikesCatalog = async () => {
      try {
        const res = await api.get("/bikes");
        setBikesDatabase(res.data || { brands: [] });
      } catch (err) {
        console.error("Indian bike infrastructure dictionary extraction error:", err);
      }
    };
    fetchBikesCatalog();
  }, []);

  // FIXED (Issue 1 & Issue 7): Erased all legacy localStorage hooks to rely wholly on authenticated streams
  useEffect(() => {
    if (user?.savedBikes) {
      setSavedBikes(user.savedBikes);
    }
    setLoading(false);
  }, [user]);

  // Sync available models dropdown selection frames dynamically when brand switches
  useEffect(() => {
    if (selectedBrand && bikesDatabase.brands.length > 0) {
      const brandData = bikesDatabase.brands.find((b) => b.brand === selectedBrand);
      setAvailableModels(brandData ? brandData.models : []);
    } else {
      setAvailableModels([]);
    }
    setSelectedModel("");
  }, [selectedBrand, bikesDatabase]);

  // FIXED (Issue 3 & Issue 7): Commits new additions straight into user database arrays asynchronously
  const handleAddBike = async (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !selectedYear) return;

    try {
      const res = await api.post("/auth/garage", {
        brand: selectedBrand,
        model: selectedModel,
        year: parseInt(selectedYear),
        // First motorcycle parked is automatically designated as primary sitewide filtering target
        isPrimary: savedBikes.length === 0 
      });

      // Synchronize interface hooks natively using newly returned arrays from user profile documents
      setSavedBikes(res.data.savedBikes || []);
      
      // Reset layout interface choices safely
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedYear("");
      setSuccessMessage(`${selectedModel} successfully parked in your virtual rider garage!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Garage transaction processing fault loop tripped:", err);
      setSuccessMessage(err.response?.data?.message || "Failed to add motorcycle profile. Try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // FIXED (Issue 4 & Issue 7): Updates active filter target token on the server layer dynamically
  const handleSetPrimary = async (bikeId) => {
    try {
      const res = await api.put(`/auth/garage/${bikeId}/primary`);
      setSavedBikes(res.data.savedBikes || []);
    } catch (err) {
      console.error("Primary motorcycle mutation trace error dropped:", err);
    }
  };

  // FIXED (Issue 5 & Issue 7): Evicts motorcycle document item references from user model collection arrays
  const handleDeleteBike = async (bikeId, e) => {
    e.stopPropagation(); // Shield interaction container to prevent parent layout click bubbles
    if (!window.confirm("Evict this vehicle profile matrix from your active fleet collection?")) return;

    try {
      const res = await api.delete(`/auth/garage/${bikeId}`);
      setSavedBikes(res.data.savedBikes || []);
    } catch (err) {
      console.error("Garage eviction endpoint resolution failure:", err);
    }
  };

  // Generate Year Range options (Last 10 production seasons)
  const currentYear = new Date().getFullYear();
  const modelYearsRange = Array.from({ length: 10 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Opening Garage Center Gate...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
            My <span className="text-primary-gold">Garage</span> Center
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Configure your active ride profiles to automate compatibility badging sitewide.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold animate-fade-in">
          <CheckCircle2 size={16} className="text-success-green" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= LEFT SIDE: ADD VEHICLE MODULE ================= */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4 border-b border-border-dark pb-3">
            <Plus size={18} className="text-primary-gold" />
            <h3 className="font-heading font-bold uppercase tracking-wider text-sm text-pure-white">Park New Motorcycle</h3>
          </div>

          <form onSubmit={handleAddBike} className="space-y-4">
            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Make Manufacturer</label>
              <select
                value={selectedBrand}
                required
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs tracking-wide focus:outline-none focus:border-primary-gold cursor-pointer"
              >
                <option value="">-- Choose Brand --</option>
                {bikesDatabase.brands && bikesDatabase.brands.map((b) => (
                  <option key={b.brand} value={b.brand}>{b.brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Model Profile Variant</label>
              <select
                value={selectedModel}
                required
                disabled={!selectedBrand}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs tracking-wide focus:outline-none focus:border-primary-gold disabled:opacity-40 cursor-pointer"
              >
                <option value="">-- Choose Model --</option>
                {availableModels.map((m) => (
                  // Model names inside sub-arrays act as secure unique keys locally
                  <option key={m.model || m} value={m.model || m}>{m.model || m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-gray mb-1">Production Batch Year</label>
              <select
                value={selectedYear}
                required
                disabled={!selectedModel}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-11 px-3 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs tracking-wide focus:outline-none focus:border-primary-gold disabled:opacity-40 cursor-pointer"
              >
                <option value="">-- Choose Year --</option>
                {modelYearsRange.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedYear}
              className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 shadow-md mt-2"
            >
              <Wrench size={14} />
              <span>Add Vehicle Entry</span>
            </button>
          </form>
        </div>

        {/* ================= RIGHT SIDE: SAVED BIKES INDEX STACK ================= */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-deep-black px-1 border-b border-border-dark pb-2">
            <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-muted-gray">Saved Inventory Stash ({savedBikes.length})</h3>
            <span className="text-[10px] text-primary-gold font-semibold uppercase hidden sm:inline">Click card to switch active machine</span>
          </div>

          {savedBikes.length === 0 ? (
            <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16">
              <Bike size={36} className="text-muted-gray mx-auto mb-2" />
              <h4 className="font-heading font-bold text-pure-white uppercase text-sm tracking-wide">Garage Registry Vacant</h4>
              <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1">Please configure your motorcycle profile parameters on the left option set.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* FIXED (Issue 6): Swapped fake variables out to process genuine schema properties natively */}
              {savedBikes.map((bike) => {
                const bikeId = bike._id;

                return (
                  <div
                    key={bikeId}
                    onClick={() => handleSetPrimary(bikeId)}
                    className={`border rounded-xl p-5 cursor-pointer relative transition-all group flex flex-col justify-between min-h-[140px] ${
                      bike.isPrimary
                        ? "bg-card-dark border-primary-gold shadow-gold-glow"
                        : "bg-card-dark/40 border-border-dark hover:border-muted-gray"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-primary-gold">
                          {bike.brand}
                        </span>
                        {/* FIXED (Issue 6): Pointed erasure parameter directly into schema identifiers */}
                        <button
                          onClick={(e) => handleDeleteBike(bikeId, e)}
                          className="text-muted-gray hover:text-error-red p-1.5 border border-transparent hover:border-error-red/20 hover:bg-error-red/10 rounded-lg transition-all"
                          title="Evict machine"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h4 className="text-base font-heading font-bold text-pure-white uppercase tracking-wide mt-1">
                        {bike.model}
                      </h4>
                      <span className="text-xs font-mono font-bold text-muted-gray tracking-widest block mt-0.5">
                        BATCH: {bike.year}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-dark/60 flex items-center justify-between">
                      {bike.isPrimary ? (
                        <span className="text-[10px] text-success-green font-heading font-extrabold uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Active Filter</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-gray group-hover:text-pure-white transition-colors uppercase tracking-widest font-bold">
                          Set as Active
                        </span>
                      )}

                      <Bike size={18} className={bike.isPrimary ? "text-primary-gold animate-pulse" : "text-border-dark"} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-4 bg-card-dark/40 border border-border-dark rounded-xl flex items-start gap-3 mt-4">
            <AlertCircle size={16} className="text-primary-gold mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-gray leading-relaxed">
              <strong>Ecosystem Integration Rule:</strong> Whichever machine is flagged as the <span className="text-pure-white font-semibold">Active Filter</span> dynamically coordinates with your sitewide catalog loops[cite: 29]. Misfitting guards, shields, or engine components will instantly generate amber restriction labels to safeguard against ordering errors[cite: 30].
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Garage;
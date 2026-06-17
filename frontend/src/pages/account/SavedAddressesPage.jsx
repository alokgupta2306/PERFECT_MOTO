import React, { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Home, Briefcase, CheckCircle2, Loader2, X } from "lucide-react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const SavedAddressesPage = () => {
  const { user } = useAuth();
  
  // FIXED (Issue 1): Replaced mockup hooks with real dynamic profile authentication listeners
  const [addressBook, setAddressBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState("");

  // FIXED (Issue 3): State vectors for inline creation sub-form handling
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Pull existing addresses from the user object model context on mounting
  useEffect(() => {
    if (user?.addresses) {
      setAddressBook(user.addresses);
    }
    setLoading(false);
  }, [user]);

  // FIXED (Issue 2): Substituted local filter sweeps with live API delete paths
  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address from your profile?")) {
      try {
        await api.delete(`/auth/addresses/${id}`);
        // Synchronize interface arrays immediately after server validation resolves
        setAddressBook((prev) => prev.filter((a) => a._id !== id));
        setSuccessBanner("Address deleted successfully.");
        setTimeout(() => setSuccessBanner(""), 3000);
      } catch (err) {
        console.error("Address erasure pipeline error:", err);
        setSuccessBanner("Failed to delete address. Please check connectivity logs.");
        setTimeout(() => setSuccessBanner(""), 3000);
      }
    }
  };

  // FIXED (Issue 3): Added address addition submit pipeline handler
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      // Direct POST payload execution to your secure registration endpoint matching Section 16 models
      const res = await api.post("/auth/addresses", newAddr);
      
      // Update local baseline book arrays with newly hydrated state array sent by backend
      setAddressBook(res.data.addresses || res.data.user?.addresses || []);
      setShowForm(false);
      
      // Reset form controls safely
      setNewAddr({ fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" });
      setSuccessBanner("Address added successfully to your rider profile registry.");
      setTimeout(() => setSuccessBanner(""), 3000);
    } catch (err) {
      console.error("Address addition terminal engine fault:", err);
      setSuccessBanner("Failed to add address. Verify field format guidelines.");
      setTimeout(() => setSuccessBanner(""), 3000);
    }
  };

  // FIXED (Issue 1): Custom loading barrier state block
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Reading address registry metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header Panel Option Grouping */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-dark pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
            Address <span className="text-primary-gold">Book</span> Registry
          </h1>
          <p className="text-xs text-muted-gray mt-1">Configure default destination endpoints to accelerate secure checkout processing.</p>
        </div>

        {/* FIXED (Issue 3): Connected state toggle handler directly to CTA container */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`h-9 px-4 border text-xs font-heading font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
            showForm 
              ? "bg-deep-black border-error-red text-error-red hover:bg-error-red/5" 
              : "bg-deep-black border-border-dark text-primary-gold hover:border-primary-gold"
          }`}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? "Cancel Add" : "Add New Address"}</span>
        </button>
      </div>

      {successBanner && (
        <div className="mb-6 p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg flex items-center gap-2 font-semibold animate-fade-in">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* FIXED (Issue 3): Form overlay template added before address grid rendering nodes */}
      {showForm && (
        <form onSubmit={handleAddAddress} className="mb-8 bg-card-dark border border-primary-gold/30 rounded-xl p-6 shadow-md animate-fade-in">
          <h3 className="font-heading font-bold uppercase tracking-wider text-xs text-pure-white mb-4 border-b border-border-dark pb-2">
            New Distribution Coordinates
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Full Consignee Name</label>
              <input required placeholder="e.g. Rahul Sharma" value={newAddr.fullName}
                onChange={e => setNewAddr({...newAddr, fullName: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Mobile Contact Number (10 digits)</label>
              <input required placeholder="e.g. 9876543210" type="tel" maxLength="10" value={newAddr.phone}
                onChange={e => setNewAddr({...newAddr, phone: e.target.value.replace(/\D/g, "")})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Street Address / Landmark Details</label>
              <input required placeholder="e.g. Flat 405, Tech Enclave, HSR Layout Sector 2" value={newAddr.addressLine1}
                onChange={e => setNewAddr({...newAddr, addressLine1: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">City</label>
              <input required placeholder="e.g. Bangalore" value={newAddr.city}
                onChange={e => setNewAddr({...newAddr, city: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">State</label>
              <input required placeholder="e.g. Karnataka" value={newAddr.state}
                onChange={e => setNewAddr({...newAddr, state: e.target.value})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray mb-1">Indian PIN Postal Token Code</label>
              <input required placeholder="e.g. 560102" type="text" maxLength="6" value={newAddr.pincode}
                onChange={e => setNewAddr({...newAddr, pincode: e.target.value.replace(/\D/g, "")})}
                className="w-full h-10 px-4 bg-deep-black text-pure-white border border-border-dark rounded-lg text-xs font-mono focus:outline-none focus:border-primary-gold transition-colors"
              />
            </div>
          </div>

          <button type="submit" className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase text-xs tracking-wider rounded-lg mt-6 transition-colors shadow-md transform hover:scale-[1.005]">
            Save Distribution Mapping
          </button>
        </form>
      )}

      {/* Dynamic Addresses Grid List */}
      {addressBook.length === 0 ? (
        <div className="border border-dashed border-border-dark p-12 rounded-xl bg-card-dark/20 text-center py-16">
          <MapPin size={36} className="text-muted-gray mx-auto mb-3" />
          <h4 className="font-heading font-bold uppercase text-pure-white tracking-wide text-sm">No Saved Destination Coordinates</h4>
          <p className="text-xs text-muted-gray max-w-xs mx-auto mt-1">Please populate an address mapping frame to optimize checkout speeds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* FIXED (Issue 4): Standardized variable iterations to parse precise User sub-document key strings */}
          {addressBook.map((addr) => {
            const addressId = addr._id;
            const addressLabel = addr.label || "Rider Station Base";

            return (
              <div 
                key={addressId} 
                className="bg-card-dark border border-border-dark rounded-xl p-5 relative group flex flex-col justify-between min-h-[160px] transition-all hover:border-muted-gray hover:shadow-gold-glow"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 border-b border-border-dark/30 pb-2">
                    <span className="text-[9px] font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-deep-black text-primary-gold border border-border-dark/60 flex items-center gap-1">
                      {addressLabel.toLowerCase().includes("work") || addressLabel.toLowerCase().includes("corporate") ? <Briefcase size={10} /> : <Home size={10} />}
                      <span>{addressLabel}</span>
                    </span>

                    {/* FIXED (Issue 4): Remapped deletion hook call parameters */}
                    <button
                      onClick={() => handleDeleteAddress(addressId)}
                      className="text-muted-gray hover:text-error-red p-1.5 rounded-lg border border-transparent hover:border-error-red/10 hover:bg-error-red/5 transition-all"
                      title="Delete address mapping"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 className="text-xs font-heading font-bold text-pure-white uppercase tracking-wide mt-4">
                    {addr.fullName}
                  </h4>
                  <p className="text-xs text-muted-gray mt-1 leading-relaxed">
                    {addr.addressLine1}
                  </p>
                  <p className="text-xs text-muted-gray font-semibold mt-0.5">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-dark/40 text-[11px] font-mono text-primary-gold font-medium">
                  Mobile Vector: +91 {addr.phone}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedAddressesPage;
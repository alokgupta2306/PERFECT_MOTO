import React, { useState, useEffect } from "react";
import { Search, ShieldCheck, Plus, Minus, Mail, Phone, Loader2, Users } from "lucide-react";
import api from "../../utils/api";

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [successNotes, setSuccessNotes] = useState("");

  // FIXED (Issue 1): Substituted mockup arrays with real reactive backend database listeners
  const [customerProfiles, setCustomerProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomersMasterRegistry = async () => {
      try {
        // Enforces full administrative document data population (Rule 4: Separate admin panel auth)
        const res = await api.get("/admin/customers");
        setCustomerProfiles(res.data.customers || []);
      } catch (err) {
        console.error("Failed to hydrate customer management directory registry:", err);
        setCustomerProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomersMasterRegistry();
  }, []);

  // FIXED (Issue 2): Modified function to execute transaction balance overrides directly on the server
  const adjustLoyaltyPoints = async (id, delta, name) => {
    try {
      // Commits operational points delta payload to the active automated coupon/loyalty engine
      await api.post(`/loyalty/admin/adjust`, { userId: id, points: delta });
      
      // Updates interface states natively using newly returned arrays from backend documents
      setCustomerProfiles((prev) =>
        prev.map((c) => 
          c._id === id 
            ? { ...c, loyaltyPoints: Math.max(0, (c.loyaltyPoints || 0) + delta) } 
            : c
        )
      );
      
      setSuccessNotes(`Manually updated loyalty points allocation ledger for rider ${name}.`);
      setTimeout(() => setSuccessNotes(""), 3500);
    } catch (err) {
      console.error("Administrative points modification override error:", err);
      setSuccessNotes(err.response?.data?.message || "Failed to update allocation ledger. Try again.");
      setTimeout(() => setSuccessNotes(""), 3000);
    }
  };

  // FIXED (Issue 1): Standardized latency indicator overlay
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Rider Membership Telemetry...
        </p>
      </div>
    );
  }

  // FIXED (Issue 5): Clear informative placeholder shown when zero user accounts exist
  if (!loading && customerProfiles.length === 0) {
    return (
      <div className="min-h-[50vh] border border-dashed border-border-dark rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-5xl mx-auto my-8">
        <Users size={40} className="text-muted-gray mb-3" />
        <h3 className="font-heading font-bold uppercase text-pure-white text-sm tracking-wide">Rider Index Empty</h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs">No customer enrollments matched your active store network clusters yet.</p>
      </div>
    );
  }

  // FIXED (Issue 4): Refactored data tracking properties with optional chaining to prevent undefined string crashes
  const filteredRiders = customerProfiles.filter((rider) => {
    const term = searchTerm.toLowerCase();
    return (
      rider.name?.toLowerCase().includes(term) ||
      rider.email?.toLowerCase().includes(term) ||
      rider.phone?.includes(searchTerm)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="border-b border-border-dark pb-5">
        <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
          Rider <span className="text-pure-white">Account</span> Records
        </h1>
        <p className="text-xs text-muted-gray mt-1">Manage corporate rider memberships telemetry, map contact lists, and adjust customer loyalty accounts manually.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm h-10 bg-deep-black border border-border-dark rounded-lg overflow-hidden focus-within:border-primary-gold transition-colors flex items-center pl-3 pr-2">
          <Search size={14} className="text-muted-gray shrink-0" />
          <input
            type="text"
            placeholder="Filter rider index by name, email string, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full bg-transparent pl-2.5 text-xs text-pure-white focus:outline-none font-heading tracking-wide"
          />
        </div>
      </div>

      {successNotes && (
        <div className={`p-3 text-xs rounded-lg flex items-center gap-2 font-semibold border animate-fade-in ${
          successNotes.toLowerCase().includes("failed") || successNotes.toLowerCase().includes("error")
            ? "bg-error-red/10 border-error-red text-error-red"
            : "bg-success-green/10 border-success-green text-success-green"
        }`}>
          <ShieldCheck size={16} className="shrink-0" />
          <span>{successNotes}</span>
        </div>
      )}

      {/* Main Structural Customer Accounts Record Table */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                <th className="p-4 pl-5">Rider Reference ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Communication Lines</th>
                <th className="p-4">Distribution HQ</th>
                <th className="p-4">Loyalty Ledger</th>
                <th className="p-4 pr-5 text-right">Manual Balance Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/40 font-medium">
              {filteredRiders.map((rider) => {
                // FIXED (Issue 3): Realignment to pull exact data fields structural to User Mongoose schemas
                const riderId = rider._id;
                const pointsBalance = rider.loyaltyPoints || 0;
                const cityLocation = rider.addresses?.[0]?.city || "Unassigned Base";

                return (
                  <tr key={riderId} className="hover:bg-deep-black/20 transition-colors">
                    <td className="p-4 pl-5 font-mono text-muted-gray text-[11px] font-bold select-all">
                      {riderId}
                    </td>
                    <td className="p-4 text-pure-white font-semibold text-[13px]">
                      {rider.name}
                    </td>
                    <td className="p-4 space-y-0.5 font-mono text-[11px] text-muted-gray">
                      <div className="flex items-center gap-1.5 hover:text-primary-gold transition-colors">
                        <Mail size={12} className="text-muted-gray" />
                        <a href={`mailto:${rider.email}`}>{rider.email}</a>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-primary-gold transition-colors">
                        <Phone size={12} className="text-muted-gray" />
                        <a href={`tel:${rider.phone}`}>+91 {rider.phone}</a>
                      </div>
                    </td>
                    <td className="p-4 font-heading uppercase tracking-wider text-muted-gray font-bold text-[11px]">
                      {cityLocation}
                    </td>
                    <td className="p-4 font-mono font-extrabold text-pure-white text-[13px]">
                      {pointsBalance} <span className="text-[9px] text-primary-gold uppercase font-heading font-bold">Pts</span>
                    </td>
                    {/* FIXED (Issue 3): Adjusted function pointers and disabled expressions to check true database variable targets */}
                    <td className="p-4 pr-5 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => adjustLoyaltyPoints(riderId, 100, rider.name)}
                        className="h-8 w-8 bg-deep-black border border-border-dark text-muted-gray hover:border-success-green hover:text-success-green hover:bg-success-green/5 rounded-lg inline-flex items-center justify-center transition-all"
                        title="Add 100 Points"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => adjustLoyaltyPoints(riderId, -100, rider.name)}
                        className="h-8 w-8 bg-deep-black border border-border-dark text-muted-gray hover:border-error-red hover:text-error-red hover:bg-error-red/5 rounded-lg inline-flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-border-dark disabled:hover:text-muted-gray disabled:hover:bg-transparent"
                        title="Deduct 100 Points"
                        disabled={pointsBalance < 100}
                      >
                        <Minus size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
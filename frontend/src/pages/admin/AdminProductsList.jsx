import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, AlertCircle, CheckCircle2, Search, Loader2 } from "lucide-react";
import api from "../../utils/api";

const AdminProductsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // FIXED (Issue 1): Substituted mockup arrays with real reactive backend data listeners
  const [inventoryStock, setInventoryStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        // Queries administrative product matrix bounds (Section 11, postman seq #15)
        const res = await api.get("/products?limit=100");
        setInventoryStock(res.data.products || []);
      } catch (err) {
        console.error("Back-office inventory ledger synchronizer error:", err);
        setInventoryStock([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProducts();
  }, []);

  // FIXED (Issue 2): Modified function to execute permanent DELETE operations on the DB
  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this product node from storefront indices?")) {
      try {
        await api.delete(`/products/${id}`);
        // Atomically updates layout state logs instantly upon successful back-end transaction resolution
        setInventoryStock((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Administrative product destruction intercept error:", err);
        alert(err.response?.data?.message || "Destruction pipeline rejected. Verify reference tokens.");
      }
    }
  };

  // FIXED (Issue 1): Appended standard latency loader state indicator block
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Extracting Inventory Ledger Logs...
        </p>
      </div>
    );
  }

  // FIXED (Issue 5): Added clear informative feedback placeholder when zero items exist
  if (!loading && inventoryStock.length === 0) {
    return (
      <div className="min-h-[50vh] border border-dashed border-border-dark rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-5xl mx-auto my-8">
        <AlertCircle size={40} className="text-muted-gray mb-3 animate-pulse" />
        <h3 className="font-heading font-bold uppercase text-pure-white text-sm tracking-wide">Catalog Core Vacant</h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs">No product allocations matched your active cluster registry yet.</p>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="h-9 px-4 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg mt-4 transition-colors"
        >
          Construct First Product Node
        </button>
      </div>
    );
  }

  // FIXED (Issue 4): Refactored data tracking properties to follow true Mongoose string schemas
  const filteredInventory = inventoryStock.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.slug?.toLowerCase().includes(term) ||
      item.brand?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top action controls management panel layer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-dark pb-5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Catalogue <span className="text-pure-white">Inventory</span> Ledger
          </h1>
          <p className="text-xs text-muted-gray mt-1">Manage global storefront items metadata configurations, variant listings, and machine boundaries.</p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="h-10 px-5 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Construct Product Node</span>
        </button>
      </div>

      {/* Filter and text match manipulation bar */}
      <div className="max-w-md">
        <div className="relative w-full h-10 bg-deep-black border border-border-dark rounded-lg overflow-hidden focus-within:border-primary-gold transition-colors flex items-center pl-3 pr-2">
          <Search size={14} className="text-muted-gray shrink-0" />
          <input
            type="text"
            placeholder="Search by Name, Slug key, or Manufacturer brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full bg-transparent pl-2.5 text-xs text-pure-white focus:outline-none font-heading tracking-wide"
          />
        </div>
      </div>

      {/* Main Structural Inventory Processing Ledger Table Grid */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                <th className="p-4 pl-5">Slug Reference</th>
                <th className="p-4">Product Title Specifications</th>
                <th className="p-4">Category</th>
                <th className="p-4">Retail Value</th>
                <th className="p-4">Quantities Remaining</th>
                <th className="p-4 pr-5 text-right">Action Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/40 font-medium">
              {filteredInventory.map((item) => {
                // FIXED (Issue 3): Standardized target property lookups natively off Mongoose keys
                const itemId = item._id;
                const itemPriceString = `₹${item.salePrice || item.price}`;
                const itemCategoryLabel = item.category?.name || item.category || "Unassigned";
                const isOutOfStock = item.stock === 0;
                
                // lowStockAlert acts as the structural safety buffer limit boundary parameter
                const isCriticalLimit = item.stock <= (item.lowStockAlert || 5) && !isOutOfStock;

                return (
                  <tr key={itemId} className="hover:bg-deep-black/20 transition-colors">
                    <td className="p-4 pl-5 font-mono text-primary-gold font-bold tracking-wide text-[11px] select-all">
                      {item.slug}
                    </td>
                    <td className="p-4">
                      <div className="text-pure-white font-semibold">{item.name}</div>
                      <div className="text-[10px] text-muted-gray uppercase font-bold tracking-wider mt-0.5">{item.brand}</div>
                    </td>
                    <td className="p-4 uppercase text-muted-gray text-[10px] font-bold tracking-widest">
                      {itemCategoryLabel}
                    </td>
                    <td className="p-4 font-mono text-pure-white font-bold">
                      {itemPriceString}
                    </td>
                    <td className="p-4">
                      {isOutOfStock && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-error-red/10 border border-error-red/20 text-error-red font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">
                          <AlertCircle size={10} />
                          <span>Sold Out</span>
                        </span>
                      )}
                      {isCriticalLimit && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-warning-amber/10 border border-warning-amber/20 text-warning-amber font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                          <AlertCircle size={10} />
                          <span>Restock ({item.stock} left)</span>
                        </span>
                      )}
                      {!isOutOfStock && !isCriticalLimit && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-success-green/10 border border-success-green/20 text-success-green font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                          <CheckCircle2 size={10} />
                          <span>Good ({item.stock})</span>
                        </span>
                      )}
                    </td>
                    {/* FIXED (Issue 3): Adjusted function pointers to dispatch precise _id metrics */}
                    <td className="p-4 pr-5 text-right space-x-1 shrink-0">
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${itemId}`)}
                        className="h-8 w-8 bg-deep-black border border-border-dark text-muted-gray hover:text-primary-gold hover:border-primary-gold rounded-lg inline-flex items-center justify-center transition-colors"
                        title="Edit entry fields"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(itemId)}
                        className="h-8 w-8 bg-deep-black border border-border-dark text-muted-gray hover:text-error-red hover:border-error-red/30 hover:bg-error-red/5 rounded-lg inline-flex items-center justify-center transition-colors"
                        title="Evict entry"
                      >
                        <Trash2 size={13} />
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

export default AdminProductsList;
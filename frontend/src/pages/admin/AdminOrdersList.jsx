import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ListFilter, AlertCircle, Loader2 } from "lucide-react";
import api from "../../utils/api";

const AdminOrdersList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  // FIXED (Issue 1): Removed hardcoded values and replaced with active server synchronization hooks
  const [masterOrders, setMasterOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalOrders = async () => {
      try {
        // Pulls full order collections (Section 11, folder sequence #18)
        const res = await api.get("/orders");
        setMasterOrders(res.data.orders || []);
      } catch (err) {
        console.error("Global transactions registry network hydration error:", err);
        setMasterOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalOrders();
  }, []);

  // FIXED (Issue 2): Modified function to update states directly via asynchronous PUT requests
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Commits status adjustment payload inline to match administrative override pipelines
      await api.put(`/orders/${id}/status`, { orderStatus: newStatus });
      
      // Updates interface records instantly upon successful back-end resolution
      setMasterOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, orderStatus: newStatus } : order))
      );
    } catch (err) {
      console.error("Fulfillment adjustment status sync error intercept:", err);
      alert(err.response?.data?.message || "Failed to finalize status adjustment on the server.");
    }
  };

  // FIXED (Issue 1): Latency loader placeholder state block
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Opening Global Transactions Registry...
        </p>
      </div>
    );
  }

  // FIXED (Issue 7): Empty state fallback view when zero checkout transactions are detected
  if (!loading && masterOrders.length === 0) {
    return (
      <div className="min-h-[50vh] border border-dashed border-border-dark rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-5xl mx-auto my-8">
        <AlertCircle size={40} className="text-muted-gray mb-3 animate-pulse" />
        <h3 className="font-heading font-bold uppercase text-pure-white text-sm tracking-wide">Registry Empty</h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs">No active incoming user order payloads have been tracked yet.</p>
      </div>
    );
  }

  // FIXED (Issue 6): Clean filter logic updated to monitor the Mongoose orderStatus attribute
  const filteredOrders = statusFilter === "all" 
    ? masterOrders 
    : masterOrders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top action controls management panel layer */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-border-dark pb-5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Global <span className="text-pure-white">Transactions</span> Registry
          </h1>
          <p className="text-xs text-muted-gray mt-1">Review live store incoming order payloads, monitor financial settlement fields, and update fulfillment flags.</p>
        </div>

        {/* FIXED (Issue 4): Filter tracking collection array rebuilt to reflect genuine backend enum lifecycle states */}
        <div className="flex flex-wrap gap-1.5 bg-deep-black p-1 rounded-lg border border-border-dark shrink-0 max-w-full">
          {[
            { label: "All Records", value: "all" },
            { label: "Placed", value: "placed" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Shipped", value: "shipped" },
            { label: "Out For Delivery", value: "out_for_delivery" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" }
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              className={`h-8 px-3 rounded text-[10px] font-heading uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                statusFilter === t.value ? "bg-primary-gold text-deep-black" : "text-muted-gray hover:text-pure-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Structural Transaction Processing Table Frame */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                <th className="p-4 pl-5">Reference ID</th>
                <th className="p-4">Rider Customer</th>
                <th className="p-4">Checkout Date</th>
                <th className="p-4">Settlement Value</th>
                <th className="p-4">Pipeline Milestone Status</th>
                <th className="p-4 pr-5 text-right">Fulfillment Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/40 font-medium">
              {filteredOrders.map((order) => {
                // FIXED (Issue 3): Standardized template properties mapped straight to backend keys
                const orderId = order._id;
                const customerName = order.user?.name || "Guest Rider";
                const displayPrice = `₹${order.totalAmount?.toLocaleString("en-IN") || 0}`;
                const localizedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                });

                return (
                  <tr key={orderId} className="hover:bg-deep-black/20 transition-colors">
                    <td className="p-4 pl-5 font-mono text-primary-gold font-bold tracking-wide text-[11px] select-all">
                      {order.orderNumber}
                    </td>
                    <td className="p-4 text-pure-white font-semibold">
                      {customerName}
                    </td>
                    <td className="p-4 text-muted-gray font-mono">
                      {localizedDate}
                    </td>
                    <td className="p-4 font-mono text-pure-white font-bold">
                      {displayPrice}
                    </td>
                    <td className="p-4">
                      {/* FIXED (Issue 5): Select block dropdown configurations refactored with proper schema states */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                        className={`h-8 px-2.5 bg-deep-black text-[10px] font-heading font-bold uppercase tracking-wider rounded-md border focus:outline-none focus:border-primary-gold cursor-pointer transition-colors ${
                          order.orderStatus === "placed" ? "text-info-blue border-info-blue/30" :
                          order.orderStatus === "confirmed" ? "text-warning-amber border-warning-amber/30" :
                          order.orderStatus === "shipped" ? "text-primary-gold border-primary-gold/30" :
                          order.orderStatus === "out_for_delivery" ? "text-primary-gold border-primary-gold/30" :
                          order.orderStatus === "delivered" ? "text-success-green border-success-green/30" : 
                          "text-error-red border-error-red/30"
                        }`}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="return_requested">Return Requested</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    {/* FIXED (Issue 3): Shifted function parameters and navigations to utilize actual _id keys */}
                    <td className="p-4 pr-5 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => navigate(`/admin/orders/${orderId}`)}
                        className="h-8 px-3 bg-deep-black border border-border-dark text-muted-gray hover:text-primary-gold hover:border-primary-gold rounded-lg inline-flex items-center gap-1 transition-colors text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm"
                        title="Inspect full logistics nodes"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
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

export default AdminOrdersList;
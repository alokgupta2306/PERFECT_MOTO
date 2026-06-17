import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Package, Eye, Clock, CheckCircle2, ShoppingBag, Loader2 } from "lucide-react";
import api from "../../utils/api";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  // FIXED (Issue 1): Replaced hardcoded dataset array with a live state management hook
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Enforces authenticated retrieval of user order histories per Postman folder sequence 04
        const res = await api.get("/orders/my");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Order engine historical ledger retrieval error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // FIXED (Issue 3): Color map variant assignments reflecting all 8 lifecycle states detailed in Section 03
  const statusColors = {
    placed: "text-info-blue bg-info-blue/10 border-info-blue/20",
    confirmed: "text-warning-amber bg-warning-amber/10 border-warning-amber/20",
    shipped: "text-primary-gold bg-primary-gold/10 border-primary-gold/20",
    out_for_delivery: "text-primary-gold bg-primary-gold/10 border-primary-gold/20",
    delivered: "text-success-green bg-success-green/10 border-success-green/20",
    cancelled: "text-error-red bg-error-red/10 border-error-red/20",
    return_requested: "text-warning-amber bg-warning-amber/10 border-warning-amber/20",
    returned: "text-muted-gray bg-deep-black border-border-dark",
  };

  // FIXED (Issue 5): Appended descriptive skeleton state markers to optimize perceived user latency
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Synchronizing Ledger Records...
        </p>
      </div>
    );
  }

  // FIXED (Issue 5): Fallback template display grid shown when no active history entries are present
  if (orders.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-hexagon-pattern animate-fade-in">
        <div className="p-4 bg-card-dark/50 rounded-full text-muted-gray mb-4 border border-border-dark">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-heading font-bold uppercase text-pure-white tracking-wide">No Orders Found</h2>
        <p className="text-xs text-muted-gray mt-1 max-w-xs mx-auto">
          You haven't checked out any premium moto gear or component arrays under this account yet.
        </p>
        <button 
          onClick={() => navigate("/shop")} 
          className="h-10 px-5 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg mt-5 transition-colors shadow-md"
        >
          Browse Gear Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-border-dark pb-6">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Order <span className="text-primary-gold">Ledger</span> Log
        </h1>
        <p className="text-xs text-muted-gray mt-1">Review historic checkout transactions, monitor dispatch workflows, and export invoice papers.</p>
      </div>

      <div className="space-y-4">
        {/* FIXED (Issue 2): Substituted fake loops to process genuine schema objects natively */}
        {orders.map((order) => {
          const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
          const primaryItemName = order.items?.[0]?.name || "Riding Accessory Package";

          return (
            <div 
              key={order._id}
              className="bg-card-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-muted-gray hover:shadow-gold-glow"
            >
              {/* Primary content info grouping alignment layout */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="font-mono text-sm font-extrabold text-primary-gold tracking-wide">
                    {order.orderNumber}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-gray font-medium">
                    <Calendar size={12} className="text-muted-gray" />
                    <span className="font-mono">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs text-pure-white font-heading font-bold uppercase tracking-wide truncate">
                    {primaryItemName}
                  </h4>
                  {itemCount > 1 && (
                    <span className="text-[10px] text-muted-gray block mt-0.5 font-medium">
                      + {itemCount - 1} additional riding accessory {itemCount - 1 === 1 ? "item" : "items"} inside bundle
                    </span>
                  )}
                </div>
              </div>

              {/* Financial allocation and status badge column */}
              <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 border-border-dark/60 pt-3 md:pt-0 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-muted-gray uppercase block font-semibold tracking-wider">Settled Cost</span>
                  <span className="font-mono text-sm font-bold text-pure-white">₹{order.totalAmount}</span>
                </div>

                {/* Status Badge Visual Block Frame */}
                <div className="min-w-[130px]">
                  <span className={`inline-flex items-center justify-center text-center w-full text-[10px] border font-heading font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${statusColors[order.orderStatus] || statusColors.placed}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />
                    {order.orderStatus?.replace(/_/g, " ")}
                  </span>
                </div>

                {/* FIXED (Issue 4): Rerouted detailed view tunnel maps directly into local secure directory pages */}
                <button
                  onClick={() => navigate(`/account/orders/${order._id}`)}
                  className="h-9 px-4 bg-deep-black border border-border-dark text-pure-white hover:text-primary-gold hover:border-primary-gold text-[11px] font-heading font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all w-full md:w-auto justify-center"
                >
                  <Eye size={13} />
                  <span>Inspect Details</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, ShoppingCart, Percent, ArrowUpRight, ArrowDownRight, Package, CheckCircle2, Clock, AlertTriangle, Loader2 } from "lucide-react";
import api from "../../utils/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Operational State Parameters
  const [timeframe, setTimeframe] = useState("7d");

  // FIXED (Issue 1 & Issue 2): Removed all hardcoded metric layers and initialized remote data fetching states
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // FIXED (Issue 1): Remote data aggregation mapping based on the active timeframe context state variable
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      setLoadingStats(true);
      try {
        const res = await api.get(`/admin/stats?timeframe=${timeframe}`);
        setStats(res.data);
      } catch (err) {
        console.error("Control terminal dashboard metric sync trace failure:", err);
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchDashboardMetrics();
  }, [timeframe]);

  // FIXED (Issue 2): Substituted local temporary collections with a live query pipeline feed for recent orders
  useEffect(() => {
    const fetchPipelineOrders = async () => {
      try {
        const res = await api.get("/orders?limit=5&sort=newest");
        setRecentOrders(res.data.orders || []);
      } catch (err) {
        console.error("Operations processing pipeline synchronized lookup error:", err);
        setRecentOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchPipelineOrders();
  }, []);

  // FIXED (Issue 3): Mapped all 6 structural e-commerce status variants exactly to match business metrics
  const statusMap = {
    placed: { label: "Placed", color: "text-info-blue bg-info-blue/10 border-info-blue/20" },
    confirmed: { label: "Confirmed", color: "text-warning-amber bg-warning-amber/10 border-warning-amber/20" },
    shipped: { label: "Shipped", color: "text-primary-gold bg-primary-gold/10 border-primary-gold/20" },
    out_for_delivery: { label: "Out for Delivery", color: "text-primary-gold bg-primary-gold/10 border-primary-gold/20" },
    delivered: { label: "Delivered", color: "text-success-green bg-success-green/10 border-success-green/20" },
    cancelled: { label: "Cancelled", color: "text-error-red bg-error-red/10 border-error-red/20" },
    return_requested: { label: "Return Requested", color: "text-warning-amber bg-warning-amber/10 border-warning-amber/20" },
    returned: { label: "Returned", color: "text-muted-gray bg-deep-black border-border-dark" }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Dashboard Banner controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Control <span className="text-pure-white">Terminal</span> Dashboard
          </h1>
          <p className="text-xs text-muted-gray mt-1">Global performance metrics tracker and transactional operations matrix.</p>
        </div>
        
        <div className="flex gap-1.5 bg-deep-black p-1 rounded-lg border border-border-dark shrink-0">
          {[
            { label: "24 Hours", value: "24h" },
            { label: "7 Days", value: "7d" },
            { label: "30 Days", value: "30d" }
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeframe(t.value)}
              className={`h-8 px-3 rounded text-xs font-heading uppercase tracking-wider font-bold transition-all ${
                timeframe === t.value ? "bg-primary-gold text-deep-black" : "text-muted-gray hover:text-pure-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SECTION 1: METRIC AGGREGATION CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric Node: Gross Revenue */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-gold-glow transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-gray font-heading font-bold uppercase tracking-widest block">Gross Revenue Ledger</span>
              <h3 className="text-2xl font-mono font-bold text-pure-white mt-1">
                {loadingStats ? "..." : `₹${stats?.revenue?.total?.toLocaleString("en-IN") || 0}`}
              </h3>
            </div>
            <div className="p-2.5 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {stats?.revenue?.change !== undefined && (
              <span className={`font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                stats?.revenue?.positive ? "text-success-green bg-success-green/5 border border-success-green/10" : "text-error-red bg-error-red/5 border border-error-red/10"
              }`}>
                {stats?.revenue?.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stats?.revenue?.change}
              </span>
            )}
            <span className="text-[10px] text-muted-gray uppercase tracking-wider font-medium">
              {stats?.revenue?.note || "vs previous timeframe segment"}
            </span>
          </div>
        </div>

        {/* Metric Node: Rider Enrolments */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-gold-glow transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-gray font-heading font-bold uppercase tracking-widest block">Rider Base Growth</span>
              <h3 className="text-2xl font-mono font-bold text-pure-white mt-1">
                {loadingStats ? "..." : (stats?.customers?.total || 0).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-2.5 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {stats?.customers?.change !== undefined && (
              <span className={`font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                stats?.customers?.positive ? "text-success-green bg-success-green/5 border border-success-green/10" : "text-error-red bg-error-red/5 border border-error-red/10"
              }`}>
                {stats?.customers?.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stats?.customers?.change}
              </span>
            )}
            <span className="text-[10px] text-muted-gray uppercase tracking-wider font-medium">
              {stats?.customers?.note || "new rider registrations"}
            </span>
          </div>
        </div>

        {/* Metric Node: Checkout Conversion */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-gold-glow transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-gray font-heading font-bold uppercase tracking-widest block">Conversion Efficiency</span>
              <h3 className="text-2xl font-mono font-bold text-pure-white mt-1">
                {loadingStats ? "..." : `${stats?.conversions?.rate || 0}%`}
              </h3>
            </div>
            <div className="p-2.5 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold rounded-lg">
              <ShoppingCart size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {stats?.conversions?.change !== undefined && (
              <span className={`font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                stats?.conversions?.positive ? "text-success-green bg-success-green/5 border border-success-green/10" : "text-error-red bg-error-red/5 border border-error-red/10"
              }`}>
                {stats?.conversions?.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stats?.conversions?.change}
              </span>
            )}
            <span className="text-[10px] text-muted-gray uppercase tracking-wider font-medium">
              {stats?.conversions?.note || "checkout drops monitored"}
            </span>
          </div>
        </div>

        {/* Metric Node: Affiliate Referral Yield */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-gold-glow transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-muted-gray font-heading font-bold uppercase tracking-widest block">Affiliate Referral Yield</span>
              <h3 className="text-2xl font-mono font-bold text-pure-white mt-1">
                {loadingStats ? "..." : `₹${stats?.referrals?.total?.toLocaleString("en-IN") || 0}`}
              </h3>
            </div>
            <div className="p-2.5 bg-primary-gold/10 border border-primary-gold/20 text-primary-gold rounded-lg">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {stats?.referrals?.change !== undefined && (
              <span className={`font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                stats?.referrals?.positive ? "text-success-green bg-success-green/5 border border-success-green/10" : "text-error-red bg-error-red/5 border border-error-red/10"
              }`}>
                {stats?.referrals?.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stats?.referrals?.change}
              </span>
            )}
            <span className="text-[10px] text-muted-gray uppercase tracking-wider font-medium">
              {stats?.referrals?.note || "referral network revenue"}
            </span>
          </div>
        </div>

      </div>

      {/* ================= SECTION 2: LIVE LOGISTICS PIPELINE TABLE ================= */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        
        <div className="bg-card-dark px-5 py-4 border-b border-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-pure-white">Live Operations Processing Pipeline</h3>
            <p className="text-[11px] text-muted-gray mt-0.5">Real-time incoming transactional data stream requiring fulfillment checks.</p>
          </div>
          {/* FIXED (Issue 4): Attached dynamic routing navigation to navigate into admin operations context lists */}
          <button 
            onClick={() => navigate("/admin/orders")}
            className="h-8 px-4 bg-deep-black border border-border-dark hover:border-primary-gold text-primary-gold text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg transition-colors"
          >
            View Global Orders Database
          </button>
        </div>

        {/* FIXED (Issue 5): Embedded highly descriptive async skeleton loading status frame for order updates */}
        {loadingOrders ? (
          <div className="p-12 text-center text-muted-gray text-xs flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 size={24} className="text-primary-gold animate-spin mb-3" />
            <span className="font-heading font-bold uppercase tracking-widest">Hydrating Transaction Feed...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-gray text-xs italic min-h-[200px] flex items-center justify-center">
            No active orders identified in the current processing pipeline segment.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                  <th className="p-4 pl-5">Reference ID</th>
                  <th className="p-4">Rider Customer</th>
                  <th className="p-4">Settlement Value</th>
                  <th className="p-4">Logistics Status</th>
                  <th className="p-4 pr-5 text-right">Activity Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark/40 font-medium">
                {/* FIXED (Issue 2): Substituted hardcoded items map block with dynamic database variables */}
                {recentOrders.map((order) => {
                  const s = statusMap[order.orderStatus] || statusMap.placed;
                  
                  return (
                    <tr key={order._id} className="hover:bg-deep-black/20 transition-colors">
                      <td className="p-4 pl-5 font-mono text-primary-gold font-bold tracking-wide">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 text-pure-white font-semibold">
                        {order.user?.name || "Guest Rider"}
                      </td>
                      <td className="p-4 font-mono text-pure-white font-bold">
                        ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                      </td>
                      <td className="p-4">
                        {/* FIXED (Issue 3): Dynamically prints colored tokens mapped straight from Mongoose outputs */}
                        <span className={`inline-flex items-center gap-1 text-[10px] border font-heading font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${s.color}`}>
                          <span className="w-1 h-1 rounded-full bg-current mr-0.5" />
                          {s.label}
                        </span>
                      </td>
                      <td className="p-4 pr-5 text-right font-mono text-muted-gray text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
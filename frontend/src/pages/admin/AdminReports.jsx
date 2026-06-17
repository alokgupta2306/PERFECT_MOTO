import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Percent, ArrowDownRight, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("30days");

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/reports/sales?timeframe=${timeframe}`);
        setData(res.data?.report || res.data);
      } catch (err) {
        setError("Telemetry fetch mismatch encountered across report parameters.");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>COMPILING CORPORATE SALES PERFORMANCE BLUEPRINTS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-dark pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
            Financial Analytics <span className="text-primary-gold">Terminal</span>
          </h1>
          <p className="text-xs text-muted-gray mt-1">Review checkout totals, discount usage parameters, and real-time revenue velocity metrics.</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="h-9 px-3 bg-card-dark text-pure-white border border-border-dark rounded-lg font-heading font-bold text-xs uppercase tracking-wider focus:outline-none focus:border-primary-gold"
        >
          <option value="7days">Past 7 Operational Days</option>
          <option value="30days">Past 30 Financial Days</option>
          <option value="90days">Past Fiscal Quarter Breakdown</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-medium">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Highlight Matrix Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card-dark border border-border-dark p-5 rounded-xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-primary-gold">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest">Gross Revenue Index</span>
            <DollarSign size={16} />
          </div>
          <h2 className="text-2xl font-mono font-bold text-pure-white">₹{Number(data?.grossRevenue || 0).toLocaleString("en-IN")}</h2>
          <span className="text-[10px] text-success-green flex items-center gap-1 font-heading font-bold tracking-wider"><TrendingUp size={10} /> +12.4% VS LAST PERIOD</span>
        </div>

        <div className="bg-card-dark border border-border-dark p-5 rounded-xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-primary-gold">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest">Consignments Dispatched</span>
            <ShoppingBag size={16} />
          </div>
          <h2 className="text-2xl font-mono font-bold text-pure-white">{data?.totalOrders || 0} Orders</h2>
          <span className="text-[10px] text-success-green flex items-center gap-1 font-heading font-bold tracking-wider"><TrendingUp size={10} /> Stable conversion volume</span>
        </div>

        <div className="bg-card-dark border border-border-dark p-5 rounded-xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-primary-gold">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest">Average Order Value</span>
            <BarChart3 size={16} />
          </div>
          <h2 className="text-2xl font-mono font-bold text-pure-white">₹{Number(data?.averageOrderValue || 0).toLocaleString("en-IN")}</h2>
          <span className="text-[10px] text-primary-gold flex items-center gap-1 font-heading font-bold tracking-wider">Premium hardware focus</span>
        </div>

        <div className="bg-card-dark border border-border-dark p-5 rounded-xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-primary-gold">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest">Coupon Deductions</span>
            <Percent size={16} />
          </div>
          <h2 className="text-2xl font-mono font-bold text-pure-white">₹{Number(data?.discountLoss || 0).toLocaleString("en-IN")}</h2>
          <span className="text-[10px] text-error-red flex items-center gap-1 font-heading font-bold tracking-wider"><ArrowDownRight size={10} /> Campaign burn pooling</span>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
        <div className="bg-deep-black px-4 py-3 border-b border-border-dark">
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">Historical Transaction Sequence Logs</h3>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-deep-black/40 border-b border-border-dark/60 font-heading font-bold uppercase text-[10px] tracking-wider text-muted-gray">
              <th className="p-3 pl-4">Timestamp</th>
              <th className="p-3">Reference ID</th>
              <th className="p-3">Method</th>
              <th className="p-3 text-right pr-4">Captured Amount</th>
            </tr>
          </thead>
          <tbody>
            {!data?.recentSales || data.recentSales.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-muted-gray/50 italic">No transactional records filed across this timeline.</td>
              </tr>
            ) : (
              data.recentSales.map((sale, i) => (
                <tr key={i} className="border-b border-border-dark/40 last:border-none hover:bg-deep-black/20 transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px] text-muted-gray/80">{new Date(sale.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-3 font-heading font-bold text-pure-white uppercase tracking-wide">{sale.orderNumber || sale._id}</td>
                  <td className="p-3 font-heading font-bold text-primary-gold tracking-widest uppercase text-[10px]">{sale.paymentMethod}</td>
                  <td className="p-3 text-right pr-4 font-mono font-bold text-pure-white">₹{sale.totalAmount?.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
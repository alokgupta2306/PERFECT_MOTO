import React, { useState, useEffect } from "react";
import { TrendingDown, Info, Loader2 } from "lucide-react";
import api from "../../utils/api";

// FIXED (Issue 1 & Issue 4): Signature updated to receive dynamic productId from parent detail sheets
const PriceHistory = ({ productId }) => {
  // FIXED (Issue 1): Swapped local mock constraints out for active telemetry state engines
  const [historicLogs, setHistoricLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLowest, setIsLowest] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProductPriceHistory = async () => {
      try {
        // Section 11: Queries chronological metrics logs for historical pricing fluctuations
        const res = await api.get(`/products/${productId}/price-history?days=90`);
        const data = res.data.history || [];
        setHistoricLogs(data);

        // FIXED (Issue 3): Algorithmic check evaluates whether the active rate matches the 90-day floor total
        if (data.length > 0) {
          const currentPrice = data[data.length - 1]?.price || 0;
          const pricesArray = data.map((d) => d.price || 0);
          const minimumObservedPrice = Math.min(...pricesArray);
          
          setIsLowest(currentPrice <= minimumObservedPrice);
        }
      } catch (err) {
        console.error("Back-office price telemetry extraction fault:", err);
        setHistoricLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductPriceHistory();
  }, [productId]);

  // FIXED (Issue 1): Safeguard loading locks to shield client compilation frames from shifting layout sizes
  if (loading) {
    return (
      <div className="bg-deep-black border border-border-dark p-6 rounded-xl flex items-center justify-center text-center">
        <Loader2 size={16} className="text-primary-gold animate-spin mr-2" />
        <span className="text-xs font-heading uppercase tracking-widest text-muted-gray">Loading Price Analytics...</span>
      </div>
    );
  }

  // Gracefully clear component out of the layout hierarchy tree if record vectors are empty
  if (historicLogs.length === 0) return null;

  // FIXED (Issue 2): Dynamic parsing metrics calculations to acquire max historical value for clean scaling maps
  const maximumObservedPrice = Math.max(...historicLogs.map((l) => l.price || 1));

  return (
    <div className="bg-deep-black border border-border-dark p-4 rounded-xl space-y-4 select-none animate-fade-in">
      {/* Top Meta Telemetry Row */}
      <div className="flex justify-between items-center text-[10px] font-heading font-bold uppercase tracking-widest text-muted-gray gap-2">
        <span className="flex items-center gap-1">
          <Info size={11} className="text-primary-gold" /> Price Analytics Ledger
        </span>
        
        {/* FIXED (Issue 3): Dynamic conditional block parsing matches current state flags */}
        {isLowest ? (
          <span className="text-success-green flex items-center gap-0.5 bg-success-green/5 border border-success-green/10 px-1.5 py-0.5 rounded animate-pulse">
            <TrendingDown size={11} /> Lowest price in 90 days!
          </span>
        ) : (
          <span className="text-warning-amber flex items-center gap-0.5 bg-warning-amber/5 border border-warning-amber/10 px-1.5 py-0.5 rounded">
            <Info size={11} /> Cost index shifted variant
          </span>
        )}
      </div>

      {/* Main Bar Chart Visualization Screen Wrapper Canvas */}
      <div className="flex justify-between items-end h-20 pt-4 px-2 border-b border-border-dark/60 font-mono text-[10px] gap-1 overflow-x-auto scrollbar-none">
        {historicLogs.map((log, idx) => {
          const logId = log._id || idx;
          const itemPrice = log.price || 0;
          const isLatestLogNode = idx === historicLogs.length - 1;

          // FIXED (Issue 2): Re-engineered dynamic dates formatting using Indian locale markers
          const formattedLogDate = log.recordedAt
            ? new Date(log.recordedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
            : "Recent";

          // FIXED (Issue 2): Re-calculated percentage allocations natively based on peak values
          const computedPercentHeight = maximumObservedPrice > 0 ? (itemPrice / maximumObservedPrice) * 100 : 0;

          return (
            <div key={logId} className="flex flex-col items-center gap-1.5 flex-1 group min-w-[40px] animate-fade-in">
              {/* Tooltip Hover Overlay Sizing Numbers Row */}
              <span className="text-muted-gray opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[9px] font-bold font-mono tracking-tighter">
                ₹{itemPrice.toLocaleString("en-IN")}
              </span>
              
              {/* Bar Metric Element */}
              <div 
                className={`w-5 sm:w-6 rounded-t transition-all duration-500 ease-out ${
                  isLatestLogNode 
                    ? "bg-primary-gold shadow-gold-glow-subtle border-t border-primary-gold/40" 
                    : "bg-muted-gray/20 group-hover:bg-muted-gray/40 border-t border-transparent"
                }`} 
                style={{ 
                  height: `${computedPercentHeight}%`, 
                  minHeight: "14px" 
                }}
              />
              
              {/* Dynamic Bottom Log Date Stamp Column */}
              <span className="text-[9px] text-muted-gray mt-1 uppercase tracking-tighter text-center whitespace-nowrap scale-90">
                {formattedLogDate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceHistory;
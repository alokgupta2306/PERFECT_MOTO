import React, { useState, useEffect } from "react";
import { Award, Percent, TrendingUp, ShieldCheck, Gift, History, Loader2, AwardIcon } from "lucide-react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const LoyaltyPointsPage = () => {
  const { user } = useAuth();

  // FIXED (Issue 1): Removed hardcoded values and injected server state tracking hooks
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState("");

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        // Targets the profile endpoints specified in folder 10 of your Postman suite
        const res = await api.get("/loyalty/my");
        setLoyaltyData(res.data);
      } catch (err) {
        console.error("Loyalty ledger retrieval handshake trace failure:", err);
        setLoyaltyData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  // FIXED (Issue 4): Added live asynchronous transaction converter for store points
  const handleConvert = async () => {
    if (pointsLedgerBalance < 500) return;
    
    try {
      // Fires redemption request payload directly into the active coupon generator engine
      await api.post("/loyalty/redeem", { points: 500 });
      
      // Updates interface records instantly on resolution to coordinate client arrays cleanly
      setLoyaltyData((prev) => ({
        ...prev,
        points: (prev?.points || pointsLedgerBalance) - 500,
        history: [
          {
            _id: `temp-${Date.now()}`,
            reason: "Redeemed 500 Points for Store Voucher",
            points: -500,
            createdAt: new Date().toISOString()
          },
          ...(prev?.history || [])
        ]
      }));
      
      setSuccessBanner("Successfully converted 500 points! Check your checkout screen to apply.");
      setTimeout(() => setSuccessBanner(""), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Points conversion terminal handshake refused.");
    }
  };

  // FIXED (Issue 1): Loader overlay execution block to manage perceived network lag
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Calculating Loyalty Records...
        </p>
      </div>
    );
  }

  // FIXED (Issue 1): Balanced math metrics to align precisely with Section 23 business limits
  // 100 points = ₹10, which scales uniformly as points / 10 per core site configuration guidelines
  const pointsLedgerBalance = loyaltyData?.points !== undefined ? loyaltyData.points : (user?.loyaltyPoints || 0);
  const estimatedMonetaryValue = Math.round(pointsLedgerBalance / 10); 

  // FIXED (Issue 2): Replaced mockup array reference loops with dynamic history parameters
  const microHistoricalLogs = loyaltyData?.history || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-border-dark pb-6">
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Rider <span className="text-primary-gold">Loyalty</span> Ledger
        </h1>
        <p className="text-xs text-muted-gray mt-1">Track reward points balance, convert points to vouchers, and view your transaction logs.</p>
      </div>

      {successBanner && (
        <div className="mb-6 p-3 bg-success-green/10 border border-success-green text-success-green text-xs rounded-lg font-semibold animate-fade-in">
          <span>{successBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-8">
        {/* Total Points Balance Display Card */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md flex flex-col justify-between min-h-[130px] md:col-span-1 hover:border-primary-gold/40 hover:shadow-gold-glow transition-all">
          <div>
            <span className="text-[9px] text-primary-gold font-heading font-bold uppercase tracking-widest block">Available Balance</span>
            <h3 className="text-3xl font-mono font-bold text-pure-white mt-1">
              {pointsLedgerBalance} <span className="text-xs text-muted-gray font-heading uppercase font-normal">Pts</span>
            </h3>
          </div>
          <div className="text-[11px] text-muted-gray mt-3 font-medium uppercase tracking-wide border-t border-border-dark/60 pt-2">
            Estimated Value: <span className="text-success-green font-mono font-bold">₹{estimatedMonetaryValue}</span>
          </div>
        </div>

        {/* Coupon Conversion Terminal Promo Card */}
        <div className="bg-card-dark border border-border-dark rounded-xl p-5 shadow-md md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[130px]">
          <div className="max-w-md">
            <h4 className="text-xs font-heading font-bold text-pure-white uppercase tracking-wide flex items-center gap-1">
              <Gift size={14} className="text-primary-gold"/> Claim Store Credit Voucher
            </h4>
            <p className="text-[11px] text-muted-gray mt-1 leading-relaxed">
              Convert your points into a secure store credit coupon. Vouchers apply instantly at the checkout screen to lower your total order cost[cite: 95].
            </p>
          </div>

          <button 
            onClick={handleConvert}
            disabled={pointsLedgerBalance < 500}
            className="h-10 px-4 bg-primary-gold hover:bg-gold-hover disabled:bg-muted-gray disabled:opacity-25 text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1 transition-all shadow-md shrink-0 whitespace-nowrap disabled:cursor-not-allowed transform active:scale-95"
          >
            <span>Convert 500 Pts</span>
          </button>
        </div>
      </div>

      {/* Historical Ledger Audit Stack */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="bg-card-dark px-4 py-3 border-b border-border-dark flex items-center gap-2">
          <History size={14} className="text-primary-gold" />
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">Points Transaction History</h3>
        </div>

        {/* FIXED (Issue 5): Appended clean, contextually styled state boundaries for empty logs */}
        {microHistoricalLogs.length === 0 ? (
          <div className="p-8 text-center text-muted-gray text-xs italic bg-deep-black/10">
            No loyalty log traces identified on this account network yet. Points accrue automatically upon product delivery[cite: 93].
          </div>
        ) : (
          <div className="divide-y divide-border-dark/40 font-medium text-xs bg-deep-black/10">
            {/* FIXED (Issue 3): Standardized item processing variables to avoid frontend breaks */}
            {microHistoricalLogs.map((log) => {
              const logId = log._id || log.id;
              const logReason = log.description || log.reason || "Loyalty Program Adjustment";
              const logPointsValue = Number(log.points) || 0;
              const isAccrual = logPointsValue > 0;

              return (
                <div key={logId} className="p-4 flex justify-between items-center hover:bg-deep-black/5 transition-colors">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-pure-white font-semibold uppercase tracking-wide text-[11px] truncate">
                      {logReason}
                    </p>
                    <span className="text-[10px] text-muted-gray font-mono block mt-0.5">
                      {new Date(log.createdAt || log.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {/* FIXED (Issue 3): Dynamically sets text-error-red or text-success-green contextually */}
                  <span className={`font-mono font-bold text-sm tracking-wide shrink-0 ${isAccrual ? "text-success-green" : "text-error-red"}`}>
                    {isAccrual ? `+${logPointsValue}` : logPointsValue}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default LoyaltyPointsPage;
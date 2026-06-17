import React, { useState, useEffect } from "react";
import { Ticket, Users, Award, DollarSign, Loader2, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        const res = await api.get("/admin/referrals");
        setReferrals(res.data?.referrals || []);
      } catch (err) {
        setError("Failed to parse and fetch viral loop affiliate network logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchReferralStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>PARSING VIRAL CAMPAIGN GROWTH METRICS...</span>
      </div>
    );
  }

  // Calculate aggregated ledger tracking configurations
  const totalConversionsCount = referrals.length;
  const netReferredPointsPayout = referrals.reduce((acc, curr) => acc + (curr.pointsIssued || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in font-body text-xs text-muted-gray select-none">
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Growth Tracking <span className="text-primary-gold">Terminal</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Audit onboarding links, track customer conversion rules, and monitor viral loop metrics.</p>
      </div>

      {error && (
        <div className="p-3 bg-error-red/10 border border-error-red text-error-red text-xs rounded-lg flex items-center gap-2 font-medium">
          <AlertCircle size={15} /> <span>{error}</span>
        </div>
      )}

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase text-muted-gray tracking-wider block">Total Link Conversions</span>
            <h2 className="text-2xl font-mono font-bold text-pure-white">{totalConversionsCount} Riders</h2>
          </div>
          <Users className="text-primary-gold" size={24} />
        </div>

        <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase text-muted-gray tracking-wider block">Bonus Points Issued</span>
            <h2 className="text-2xl font-mono font-bold text-pure-white">{netReferredPointsPayout} pts</h2>
          </div>
          <Award className="text-primary-gold" size={24} />
        </div>

        <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase text-muted-gray tracking-wider block">Intro Campaign Voucher</span>
            <h2 className="text-lg font-heading font-bold text-success-green uppercase tracking-wide">Flat 10% Off</h2>
          </div>
          <Ticket className="text-primary-gold" size={24} />
        </div>
      </div>

      {/* Affiliate Conversion Data Tree Table */}
      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-sm">
        <div className="bg-deep-black px-4 py-3 border-b border-border-dark">
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">Active Referral Distribution Mapping</h3>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-deep-black/40 border-b border-border-dark/60 font-heading font-bold uppercase text-[10px] tracking-wider text-muted-gray">
              <th className="p-3 pl-4">Advocate (referrer)</th>
              <th className="p-3">Invited Rider (referred)</th>
              <th className="p-3">Referral Status</th>
              <th className="p-3 text-right pr-4">Points Transferred</th>
            </tr>
          </thead>
          <tbody>
            {referrals.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-muted-gray/50 italic">Viral onboarding loops are blank. No links tracking currently.</td>
              </tr>
            ) : (
              referrals.map((ref, idx) => (
                <tr key={ref._id || idx} className="border-b border-border-dark/40 last:border-none hover:bg-deep-black/20 transition-colors">
                  <td className="p-3 pl-4 font-heading font-bold text-pure-white uppercase tracking-wide">
                    {ref.referrer?.name || "System Base Profile"}<br />
                    <span className="font-mono text-[9px] text-muted-gray/60 font-normal lowercase tracking-normal">{ref.referrer?.email}</span>
                  </td>
                  <td className="p-3 text-muted-gray normal-case font-medium">
                    <span className="font-heading font-bold uppercase tracking-wide text-pure-white">{ref.referredUser?.name || "New Recruit"}</span><br />
                    <span className="font-mono text-[9px] text-muted-gray/60 lowercase">{ref.referredUser?.email || "N/A"}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-heading font-extrabold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-success-green/10 text-success-green border border-success-green/20">
                      Converted & Cleared
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 font-mono font-bold text-pure-white">+{ref.pointsIssued || 100} pts</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReferrals;
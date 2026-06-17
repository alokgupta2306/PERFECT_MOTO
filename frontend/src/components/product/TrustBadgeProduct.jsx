import React, { useEffect, useState } from "react";
import { Shield, RotateCcw, Truck, Star, Loader2, X } from "lucide-react";
import api from "../../utils/api";

const TrustBadgeProduct = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Map dynamic icon keys matching Section 14 configurations to Lucide component tokens [cite: 411]
  const iconMap = {
    shield: Shield,
    return: RotateCcw,
    truck: Truck,
    star: Star,
  };

  useEffect(() => {
    const fetchTrustBadges = async () => {
      try {
        const res = await api.get("/settings/badges");
        // Pull active badges array or default safely if network lags [cite: 411, 414]
        const fetchedBadges = res.data?.trustBadges || res.data || [];
        setBadges(fetchedBadges.filter(b => b.isActive));
      } catch (err) {
        console.error("Failed to query central trust badges parameters:", err);
        
        // Hardcoded PRD fallback array matrix to preserve UX continuity if API bounds reset [cite: 404, 405, 406, 407, 412]
        setBadges([
          { icon: "shield", title: "100% Genuine", subtitle: "All products authentic", detailText: "Every accessory in our repository undergoes multi-stage metallurgical, alignment, and manufacturing testing frameworks before getting indexed. Zero fake components allowed." },
          { icon: "return", title: "7-Day Returns", subtitle: "Hassle-free guarantee", detailText: "If your component allocation encounters structural incompatibilities on your frame, file a return sequence from your account terminal within an open 7-day window." },
          { icon: "truck", title: "Free Delivery", subtitle: "Orders above ₹999", detailText: "Consignments totaling over ₹999 qualify for prioritized logistical path routing via premium couriers like DTDC at zero base dispatch cost." },
          { icon: "star", title: "Brand Warranty", subtitle: "Manufacturer backing", detailText: "Full operational manufacturer technical hardware backup coverage applies across all accessory SKUs where natively applicable." }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustBadges();
  }, []);

  if (loading) {
    return (
      <div className="py-4 flex items-center justify-center text-muted-gray gap-2 font-heading tracking-wider">
        <Loader2 size={14} className="animate-spin text-primary-gold" />
        <span>READING CONVERSION REASSURANCE PROFILE...</span>
      </div>
    );
  }

  return (
    <div className="w-full pt-2">
      {/* 2x2 Grid on Mobile viewport tracking, clean single horizontal row layout on Desktop screens  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch select-none">
        {badges.map((badge, index) => {
          // Dynamic assignment mapping fallback directly down to a safe icon token [cite: 403, 411]
          const IconComponent = iconMap[badge.icon] || Shield;
          return (
            <div
              key={badge._id || index}
              onClick={() => setSelectedBadge(badge)}
              className="bg-card-dark border border-border-dark/80 hover:border-primary-gold/30 rounded-xl p-3 flex flex-col items-center text-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:shadow-gold-glow/5 transform active:scale-98"
            >
              <div className="text-primary-gold shrink-0">
                <IconComponent size={24} className="animate-pulse duration-3000" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-pure-white text-[11px] md:text-xs font-heading font-bold uppercase tracking-wider leading-tight">
                  {badge.title}
                </h4>
                <p className="text-muted-gray text-[9px] md:text-[10px] font-medium leading-tight normal-case">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Overlay Specification Details Modal Framework Interceptor [cite: 408, 420] */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-card-dark border border-border-dark rounded-xl p-6 shadow-2xl animate-scale-up relative">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-muted-gray hover:text-pure-white transition-colors p-1"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 border-b border-border-dark/60 pb-3 mb-4">
              <div className="text-primary-gold">
                {(iconMap[selectedBadge.icon] && React.createElement(iconMap[selectedBadge.icon], { size: 20 })) || <Shield size={20} />}
              </div>
              <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wide">
                {selectedBadge.title} Overview
              </h3>
            </div>

            <p className="text-xs text-muted-gray leading-relaxed font-medium normal-case">
              {selectedBadge.detailText || "Premium verified service layer protection parameter committed natively over your order distribution sequence mapping arrays."}
            </p>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full h-9 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg transition-colors"
            >
              Dismiss Parameter Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustBadgeProduct;
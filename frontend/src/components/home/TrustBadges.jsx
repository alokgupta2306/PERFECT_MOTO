import React, { useState, useEffect } from "react";
import { ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";
import api from "../../utils/api";

const TrustBadges = () => {
  // FIXED (Issue 1): Retained original copy vectors as localized robust client fallbacks
  const [badgeMatrix, setBadgeMatrix] = useState([
    { title: "100% Genuine", subtitle: "All products authentic", icon: "ShieldCheck" },
    { title: "Free Delivery", subtitle: "Orders above ₹999", icon: "Truck" },
    { title: "7-Day Returns", subtitle: "Hassle-free returns", icon: "RefreshCw" },
    { title: "Manufacturer Warranty", subtitle: "Where applicable", icon: "Award" }
  ]);

  // FIXED (Issue 1): Remote data aggregation mapping off centralized system variables
  useEffect(() => {
    const fetchSystemTrustBadges = async () => {
      try {
        const res = await api.get("/settings/badges");
        // Filters active variables from the backend data matrix sequence automatically
        if (res.data?.badges && res.data.badges.length > 0) {
          setBadgeMatrix(res.data.badges.filter((b) => b.isActive));
        }
      } catch (err) {
        console.error("Platform trust badges telemetry hydration skipped, running client fallbacks:", err);
      }
    };
    fetchSystemTrustBadges();
  }, []);

  // Helper dictionary layout map to convert raw server string tokens into functional Lucide React nodes
  const iconLookupMap = {
    ShieldCheck: <ShieldCheck size={18} />,
    Truck: <Truck size={18} />,
    RefreshCw: <RefreshCw size={18} />,
    Award: <Award size={18} />
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-card-dark border border-border-dark p-5 rounded-xl select-none hover:shadow-gold-glow transition-all duration-300">
      {badgeMatrix.map((badge, idx) => {
        // FIXED (Issue 2): Resolves fallback rendering nodes elegantly whether raw strings or components are passed
        const renderedIcon = typeof badge.icon === "string" 
          ? (iconLookupMap[badge.icon] || iconLookupMap.ShieldCheck) 
          : (badge.icon || iconLookupMap.ShieldCheck);

        return (
          <div key={badge._id || idx} className="flex items-start gap-3 p-2 group">
            {/* Structural Icon Wrapper Canvas Layout */}
            <div className="text-primary-gold p-2 bg-deep-black border border-border-dark rounded-lg shrink-0 group-hover:border-primary-gold transition-colors duration-200">
              {renderedIcon}
            </div>
            
            {/* Metadata Text Columns */}
            <div className="min-w-0">
              <h4 className="font-heading font-bold uppercase text-[10px] text-pure-white tracking-wide group-hover:text-primary-gold transition-colors duration-200">
                {badge.title}
              </h4>
              {/* FIXED (Issue 2): Structured field parameters updated to look up the correct badge subtitle layout details */}
              <p className="text-[11px] text-muted-gray mt-0.5 leading-tight font-medium font-body normal-case">
                {badge.subtitle || badge.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, Users, Zap, Loader2 } from "lucide-react";
import api from "../../utils/api";

const LiveActivity = ({ productId }) => {
  const location = useLocation();
  
  // Real activity dataset state trackers
  const [activities, setActivities] = useState([]);
  const [activeActivity, setActiveActivity] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Structural Boundary Guard: Instantly hide toast popups on back-office administration and checkout lines
  const isAdminPath = location.pathname.startsWith("/admin");
  const isCheckoutPath = location.pathname === "/checkout" || location.pathname === "/order-confirmation";

  // 1. Telemetry Loop: Concurrent Live Activity Feeds & Real-time Viewer Counts (Feature 8)
  useEffect(() => {
    if (isAdminPath || isCheckoutPath) return;

    const fetchActivityFeed = async () => {
      try {
        // GET /api/activity/recent captures last 10 real activities, server-cached for 30s to reduce DB load
        const res = await api.get("/activity/recent");
        setActivities(res.data?.activities || res.data || []);
      } catch (err) {
        console.error("Non-blocking telemetry error pulling recent activity streams:", err);
      }
    };

    const fetchViewerMetrics = async () => {
      if (!productId) return;
      try {
        // GET /api/activity/viewers/:productId returns clean integer values mapped off active memory slots
        const res = await api.get(`/activity/viewers/${productId}`);
        setViewerCount(res.data?.viewers || res.data?.count || 0);
      } catch (err) {
        console.error("Failed to parse real-time active viewer maps:", err);
      }
    };

    fetchActivityFeed();
    fetchViewerMetrics();

    // Re-index ledger aggregates every 30 seconds to respect backend caching profiles
    const aggregateInterval = setInterval(fetchActivityFeed, 30000);
    return () => clearInterval(aggregateInterval);
  }, [isAdminPath, isCheckoutPath, productId]);

  // 2. Rotational Render Engine: Slides notifications up and down cleanly on strict intervals (PRD Rules)
  useEffect(() => {
    if (activities.length === 0 || isAdminPath || isCheckoutPath) {
      setIsVisible(false);
      return;
    }

    const triggerNotificationCycle = () => {
      // Step 1: Assign active activity target pointer
      setActiveActivity(activities[activityIndex]);
      setIsVisible(true);

      // Step 2: Slide notification down exactly after 5 seconds of active storefront exposure
      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      // Step 3: Advance array pointer index precisely on the 8-second mark to step into next notification loop
      const cycleTimeout = setTimeout(() => {
        setActivityIndex((prevIndex) => (prevIndex + 1) % activities.length);
      }, 8000);

      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(cycleTimeout);
      };
    };

    return triggerNotificationCycle();
  }, [activities, activityIndex, isAdminPath, isCheckoutPath]);

  // Return zero markup nodes if layout boundaries match restricted execution scopes
  if (isAdminPath || isCheckoutPath) return null;

  return (
    <>
      {/* MODULE COMPONENT A: PRODUCT PAGE LIVE CURRENT VIEWERS CHIP */}
      {productId && viewerCount > 0 && (
        <div className="mt-3 p-3 bg-primary-gold/10 border border-primary-gold/20 rounded-xl flex items-center gap-2 text-primary-gold font-heading text-xs font-bold uppercase tracking-wider max-w-sm animate-fade-in select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-gold"></span>
          </span>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{viewerCount} riding enthusiasts are inspecting this configuration</span>
          </div>
        </div>
      )}

      {/* MODULE COMPONENT B: OVERLAY RECENT CONSIGNMENT PURCHASE TOAST NOTIFICATION CARD */}
      {activeActivity && (
        <div 
          className={`fixed bottom-4 left-4 z-50 w-72 bg-card-dark border border-border-dark p-4 rounded-xl flex gap-3 shadow-gold-glow/5 transition-all duration-500 ease-in-out select-none ${
            isVisible 
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div className="h-9 w-9 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
            <Zap size={15} className="animate-pulse" />
          </div>
          
          <div className="flex-grow space-y-0.5 min-w-0">
            <h4 className="text-pure-white font-heading font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-error-red animate-ping" />
              Live Activity Dispatch
            </h4>
            <p className="text-muted-gray text-[11px] leading-tight font-medium font-sans normal-case">
              <span className="text-pure-white font-heading font-bold uppercase tracking-wide bg-deep-black/60 px-1 py-0.2 rounded border border-border-dark/40 mr-1">
                {activeActivity.customerName || "Rider"}
              </span> 
              from {activeActivity.customerCity || "India"} secured a{" "}
              <span className="text-primary-gold font-semibold italic">{activeActivity.productName || "Premium Gear Allocation"}</span>.
            </p>
            <span className="block font-mono text-[9px] text-muted-gray/50 tracking-normal pt-1">
              Verified transmission timeline pass
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveActivity;
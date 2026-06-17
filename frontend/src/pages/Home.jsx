// FIXED: Included missing useEffect hook import alongside standard state definitions
import React, { useEffect } from "react";
import AnnouncementBar from "../components/home/AnnouncementBar";
import HeroBanner from "../components/home/HeroBanner";
import ShopByBike from "../components/home/ShopByBike";
import LiveActivity from "../components/common/LiveActivity";

// High-conversion marketing, filtration, and layout component blocks
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BundleDeals from "../components/home/BundleDeals";
import CustomerPhotos from "../components/home/CustomerPhotos";
import TrustBadges from "../components/home/TrustBadges";
import Newsletter from "../components/home/Newsletter";

// FIXED: Sourced the verification utility script to execute telemetry diagnostics checks
import { runFrontendCheck } from "../utils/frontendCheck";

const Home = () => {
  
  // FIXED: Attached the runtime verification script inside an isolated mount-level lifecycle hook
  useEffect(() => {
    try {
      runFrontendCheck();
    } catch (err) {
      console.error("System Matrix Diagnostics Script runtime compilation error:", err);
    }
  }, []); // Empty dependency array ensures this execution fires exactly once on landing mount

  return (
    <div className="w-full min-h-screen bg-deep-black text-pure-white pb-12 animate-fade-in overflow-x-hidden">
      {/* Structural Announcement System Ticker Bar */}
      <AnnouncementBar />
      
      {/* Core Slideshow Hero Core Component Frame */}
      <HeroBanner />
      
      {/* Centralized Structural Layout Container Grid Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-8 sm:mt-12">
        
        {/* Core USP #1 Dropdown Finder Framework Selection Grid */}
        <ShopByBike />
        
        {/* Core Structural Category Nav Cards Section */}
        <CategoryGrid />
        
        {/* Dynamic Hydrated Items Section - Highlights Featured/NewArrival Toggles */}
        <FeaturedProducts />
        
        {/* Cross-Sell Combo Bundles Panel (Feature 2 Bundle System) */}
        <BundleDeals />
        
        {/* Premium Core Brand Verification Trust Badges Frame (Feature 14) */}
        <TrustBadges />
        
        {/* Social Proof Real Rider Photos Masonry Display Grid (Feature 7) */}
        <CustomerPhotos />
        
        {/* Customer Base Growth & Retention Capture Tunnel */}
        <Newsletter />
        
      </div>
      
      {/* Real-time Dynamic Social Proof Toast Popup (Feature 8) */}
      <LiveActivity />
    </div>
  );
};

export default Home;
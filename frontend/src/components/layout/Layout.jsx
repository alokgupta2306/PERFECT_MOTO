import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import LiveActivity from "../common/LiveActivity";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-deep-black font-body text-pure-white select-none relative">
      
      {/* 1. Global Navigation Architecture */}
      <Header />
      
      {/* 2. Core Operational Viewport Window */}
      {/* Dynamic bottom padding constraints guarantee full view visibility on mobile devices when BottomNav is active */}
      <main className="flex-grow pb-16 md:pb-8 animate-fade-in">
        {children}
      </main>
      
      {/* 3. Social Proof Conversion Engine Module Layer */}
      {/* Triggers subtle transaction popups transparently at the bottom left quadrant */}
      <LiveActivity />
      
      {/* 4. Global Brand Footer Closure */}
      <Footer />
      
      {/* 5. Mobile Dynamic App Navigation Footprint */}
      <BottomNav />
      
    </div>
  );
};

export default Layout;
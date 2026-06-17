import React, { useState, useEffect } from "react";
import api from "../../utils/api";

const AnnouncementBar = () => {
  // FIXED (Issue 1): Removed hardcoded strings and added server-driven state orchestration with fallback text
  const [text, setText] = useState("⚡ Welcome Rider! Use Code WELCOME10 to get 10% off your first order! ⚡");

  useEffect(() => {
    const fetchAnnouncementText = async () => {
      try {
        // Queries structural content maps corresponding to step #15 of your admin panel plans
        const res = await api.get("/homepage");
        if (res.data?.content?.announcementText) {
          setText(res.data.content.announcementText);
        }
      } catch (err) {
        console.error("Failed to synchronize live homepage announcement bar variables:", err);
        // Clean fallback preserves seamless client operation on temporary network dropouts
      }
    };
    fetchAnnouncementText();
  }, []);

  // FIXED (Issue 2): Removed missing tire tread class and applied native spacing grids to create the look
  return (
    <div className="w-full relative bg-primary-gold text-deep-black font-heading font-bold text-center py-2 px-4 text-xs md:text-sm tracking-widest uppercase border-b-2 border-black/20 select-none shadow-md">
      {/* Background Decorative Pattern Element - Subtle overlay simulation */}
      <div className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none mix-blend-overlay bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:8px_8px]" />
      
      {/* Main Server-Populated Alert Banner String Content Output Container */}
      <span className="relative z-10 select-all tracking-wider md:tracking-widest">
        {text}
      </span>
    </div>
  );
};

export default AnnouncementBar;
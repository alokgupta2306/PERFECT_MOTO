import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader"; // ✅ CONNECTED: Sourced the missing header frame component

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-deep-black overflow-hidden font-body text-xs text-muted-gray select-none">
      {/* Structural Left: Sidebar Cockpit Controller Navigation */}
      <AdminSidebar />
      
      {/* Structural Right: Top Header Dashboard Workspace Display Context */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        {/* Scrollable Core Active Operations Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 bg-deep-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
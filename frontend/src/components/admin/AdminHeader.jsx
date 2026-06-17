import React from "react";
import { User, Bell, ShieldCheck, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const AdminHeader = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header className="w-full h-16 bg-card-dark border-b border-border-dark flex items-center justify-between px-6 font-heading select-none shrink-0">
      
      {/* Cockpit Status Badge Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-success-green animate-pulse" />
        <span className="text-[10px] font-bold text-muted-gray uppercase tracking-widest flex items-center gap-1">
          System Secure Node: <span className="text-success-green font-mono">Live Sync Active</span>
        </span>
      </div>

      {/* Admin Operations Toolbar */}
      <div className="flex items-center gap-4">
        
        {/* Toggle Theme Chip */}
        <button
          onClick={toggleDarkMode}
          className="h-8 w-8 bg-deep-black border border-border-dark hover:border-primary-gold/40 text-muted-gray hover:text-primary-gold flex items-center justify-center rounded-lg transition-colors"
          title="Toggle Core System Theme"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Central Hub Notification Ticker */}
        <div className="h-8 w-8 bg-deep-black border border-border-dark text-muted-gray flex items-center justify-center rounded-lg relative cursor-pointer hover:text-pure-white transition-colors">
          <Bell size={14} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-error-red rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-error-red rounded-full" />
        </div>

        {/* Divider Vector */}
        <div className="h-6 w-px bg-border-dark" />

        {/* Profile Control Badge */}
        <div className="flex items-center gap-3 bg-deep-black/60 border border-border-dark pl-3 pr-4 py-1 rounded-xl">
          <div className="h-7 w-7 bg-primary-gold/10 border border-primary-gold/20 rounded-lg flex items-center justify-center text-primary-gold shrink-0">
            <User size={14} />
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-bold text-pure-white uppercase tracking-wider leading-none">
              {user?.name || "Root Admin"}
            </span>
            <span className="text-[9px] text-primary-gold font-mono font-bold tracking-widest uppercase flex items-center gap-0.5 mt-0.5 leading-none">
              <ShieldCheck size={9} /> Operational Security
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
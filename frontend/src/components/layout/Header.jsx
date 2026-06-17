import React, { useState } from "react";
// Added NavLink to route parameter trace definitions
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Sun, Moon, Warehouse, LogIn, UserPlus } from "lucide-react";

// Unified imports to utilize default custom hook setups consistently
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  // Extracted logoutUser from the useAuth hook instance
  const { isAuthenticated, user, logoutUser } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Corporate Branding Identity Link Frame */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src="/logo.png" 
            alt="Perfect Moto" 
            className="h-14 w-auto object-contain select-none"
          />
        </Link>

        {/* Embedded permanent primary site navigation links collection deck */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "Home", path: "/" },
            { label: "Shop", path: "/shop" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
            { label: "Track Order", path: "/track" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded-md transition-all duration-150 ${
                  isActive
                    ? "text-primary-gold border-b-2 border-primary-gold"
                    : "text-gray-700 hover:text-primary-gold"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Global Live Input Search Terminal */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search helmets, gloves, compatibility parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-5 pr-11 rounded-full bg-card-dark text-pure-white border border-border-dark focus:outline-none focus:border-primary-gold text-base transition-all"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-gray hover:text-primary-gold transition-colors">
            <Search size={20} />
          </button>
        </form>

        {/* Dynamic Navigation Action Grid Controls */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Day / Night Vision Toggle Switch Control */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Current: ${theme?.toUpperCase() ?? "DARK"} Mode. Click to cycle.`}
            // ✅ FIXED: Reconfigured hover background and added a soft gray structural border matrix
            className="p-2 rounded-full bg-gray-100 border border-gray-300 transition-all duration-200"
          >
            {/* ✅ FIXED: Bumped icons size up to 24 and set dark mode icon to gray-700 for optimal visibility */}
            {theme === "dark" && <Moon size={24} className="text-gray-700" />}
            {theme === "light" && <Sun size={24} className="text-amber-500" />}
            {theme === "samurai" && <span className="text-2xl leading-none">⚔️</span>}
          </button>

          {/* Garage Hub Route Shortcut Link */}
          <Link
            to="/account/garage"
            title="My Garage Management Center"
            className="p-2 text-gray-700 hover:text-primary-gold transition-colors hidden sm:block"
          >
            <div className="flex items-center gap-1">
              {/* ✅ FIXED: Set vector wheel base size to 24 and text color match mapping */}
              <Warehouse size={24} className="text-gray-700 hover:text-primary-gold transition-colors" />
              <span className="font-heading text-sm font-bold tracking-wider text-gray-700 hover:text-primary-gold transition-colors ml-0.5">GARAGE</span>
            </div>
          </Link>

          {/* CONDITIONAL AUTHENTICATION INTERFACE BLOCKS */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/account/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-gold transition-colors text-sm font-heading font-bold uppercase tracking-wider"
                title="Rider Dashboard Workspace"
              >
                {/* ✅ FIXED: Sourced uniform gray layout parameters */}
                <User size={24} className="text-gray-700 hover:text-primary-gold transition-colors" />
                <span className="hidden lg:inline max-w-[110px] truncate text-gray-700 font-semibold">
                  {user?.name ? user.name.split(" ")[0].toUpperCase() : "RIDER"}
                </span>
              </Link>
              <button 
                type="button"
                onClick={logoutUser}
                className="hidden sm:inline text-xs font-heading font-extrabold uppercase tracking-widest text-gray-700 hover:text-error-red transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-heading font-bold uppercase tracking-wider">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-gold transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-gray-100"
              >
                <LogIn size={16} className="text-primary-gold" />
                <span className="hidden xs:inline">Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="bg-primary-gold hover:bg-gold-hover text-deep-black h-9 px-4 flex items-center gap-1.5 rounded-md transition-colors shadow-sm"
              >
                <UserPlus size={16} />
                <span className="hidden xs:inline">Join</span>
              </Link>
            </div>
          )}

          {/* Core Master Dynamic Cart Drawer Trigger Link */}
          <Link to="/cart" className="p-2 text-gray-700 hover:text-primary-gold transition-colors relative" title="Shopping Cart">
            {/* ✅ FIXED: Standardized text token configurations to gray-700 with size 24 scale */}
            <ShoppingBag size={24} className="text-gray-700 hover:text-primary-gold transition-colors" />
            {totalCartUnits > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-primary-gold text-deep-black text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {totalCartUnits}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;
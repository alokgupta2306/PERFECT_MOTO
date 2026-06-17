import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, ShoppingCart, ShieldAlert, User, LogOut, Package, Heart } from "lucide-react";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logoutUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isActivePath = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logoutUser();
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <>
      {/* Account popup menu */}
      {showMenu && (
        <div className="md:hidden fixed bottom-16 right-2 z-50 bg-card-dark border border-border-dark rounded-2xl shadow-gold-glow overflow-hidden w-48">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-border-dark">
                <p className="text-xs text-muted-gray">Logged in as</p>
                <p className="text-sm font-bold text-pure-white truncate">{user.name}</p>
              </div>
              <Link to="/account/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-pure-white hover:text-primary-gold border-b border-border-dark">
                <User size={16} /> Profile
              </Link>
              <Link to="/account/orders" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-pure-white hover:text-primary-gold border-b border-border-dark">
                <Package size={16} /> My Orders
              </Link>
              <Link to="/account/wishlist" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-pure-white hover:text-primary-gold border-b border-border-dark">
                <Heart size={16} /> Wishlist
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-error-red w-full text-left">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-pure-white hover:text-primary-gold border-b border-border-dark">
                <User size={16} /> Login
              </Link>
              <Link to="/register" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-pure-white hover:text-primary-gold">
                <User size={16} /> Register
              </Link>
            </>
          )}
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}

      {/* Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-deep-black border-t border-border-dark flex items-center justify-around px-2 shadow-lg">

        <Link to="/" className={`flex flex-col items-center justify-center w-12 h-full gap-1 transition-all ${isActivePath("/") ? "text-primary-gold font-bold" : "text-muted-gray"}`}>
          <Home size={20} />
          <span className="text-[10px] uppercase font-heading tracking-wider">Home</span>
        </Link>

        <Link to="/shop" className={`flex flex-col items-center justify-center w-12 h-full gap-1 transition-all ${isActivePath("/shop") ? "text-primary-gold font-bold" : "text-muted-gray"}`}>
          <Compass size={20} />
          <span className="text-[10px] uppercase font-heading tracking-wider">Gear</span>
        </Link>

        <Link to="/cart" className={`flex flex-col items-center justify-center w-12 h-full gap-1 transition-all relative ${isActivePath("/cart") ? "text-primary-gold font-bold" : "text-muted-gray"}`}>
          <ShoppingCart size={20} />
          {totalCartUnits > 0 && (
            <span className="absolute top-2 right-2 h-4 w-4 bg-primary-gold text-deep-black text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalCartUnits}
            </span>
          )}
          <span className="text-[10px] uppercase font-heading tracking-wider">Cart</span>
        </Link>

        <Link to="/track" className={`flex flex-col items-center justify-center w-12 h-full gap-1 transition-all ${isActivePath("/track") ? "text-primary-gold font-bold" : "text-muted-gray"}`}>
          <ShieldAlert size={20} />
          <span className="text-[10px] uppercase font-heading tracking-wider">Track</span>
        </Link>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex flex-col items-center justify-center w-12 h-full gap-1 transition-all ${showMenu ? "text-primary-gold" : "text-muted-gray"}`}
        >
          <User size={20} />
          <span className="text-[10px] uppercase font-heading tracking-wider">
            {user ? "Account" : "Login"}
          </span>
        </button>

      </div>
    </>
  );
};

export default BottomNav;
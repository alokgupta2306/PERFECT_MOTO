import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, ShoppingCart, ShieldAlert } from "lucide-react";
import useCart from "../../hooks/useCart";

const BottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-deep-black border-t border-border-dark dark:bg-deep-black dark:border-border-dark light:bg-pure-white light:border-light-gray flex items-center justify-around px-2 shadow-lg transition-colors duration-300">
      
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

    </div>
  );
};

export default BottomNav;
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// ✅ Clean, lightweight hook consumer pointing directly to CartContext
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be consumed inside a CartProvider wrapper matrix.");
  }
  return context;
};

export default useCart;
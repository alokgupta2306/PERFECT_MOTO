import React from "react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { formatIndianCurrency } from "../../utils/formatter";

const MiniCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, getSubtotal, removeCartItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-deep-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm bg-card-dark border-l border-border-dark h-full flex flex-col justify-between p-6 shadow-2xl animate-fade-in">
        <div>
          <div className="flex justify-between items-center border-b border-border-dark pb-3 mb-4">
            <h3 className="font-heading font-bold uppercase text-sm text-pure-white flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary-gold"/> Active Kit Kit ({cart.length})
            </h3>
            <button onClick={onClose} className="text-muted-gray hover:text-pure-white p-1"><X size={18}/></button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            {cart.length === 0 ? (
              <p className="text-xs text-muted-gray text-center py-8">Your kit is completely vacant.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-xs border-b border-border-dark/40 pb-3">
                  <div>
                    <p className="text-pure-white font-bold uppercase tracking-wide">{item.title}</p>
                    <span className="text-[10px] text-muted-gray font-mono block mt-0.5">Qty: {item.quantity} × {formatIndianCurrency(item.price)}</span>
                  </div>
                  <button onClick={() => removeCartItem(item.id)} className="text-muted-gray hover:text-error-red text-[11px] self-start font-bold">Remove</button>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border-dark pt-4 space-y-4">
            <div className="flex justify-between text-xs font-heading font-bold text-pure-white uppercase">
              <span>Subtotal Cost:</span>
              <span className="font-mono text-primary-gold text-sm">{formatIndianCurrency(getSubtotal())}</span>
            </div>
            <button onClick={() => { onClose(); navigate("/cart"); }} className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1">
              <span>Open Ledger Basket</span> <ArrowRight size={14}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;
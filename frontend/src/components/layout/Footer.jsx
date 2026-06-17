import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    // ✅ FIXED: Forced background color strictly to #D3D3D3 (from image_264f7d.png) for dark/samurai states via inline style, while preserving white profile for light mode. Texts inverted to deep-black for clean legibility against the light gray.
    <footer 
      style={{ backgroundColor: document.documentElement.classList.contains("light") ? "" : "#D3D3D3" }}
      className="w-full text-deep-black border-t border-gray-300 light:bg-pure-white light:text-deep-black transition-colors duration-300 pt-12 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Mission Column */}
        <div className="flex flex-col gap-4">
          <img 
            src="/logo.png" 
            alt="Perfect Moto" 
            className="h-14 w-auto object-contain select-none align-middle self-start"
          />
          <p className="text-xs leading-relaxed max-w-xs font-medium text-deep-black/80">
            One-Stop Accessories Store for Indian Motorcycle Riders. Engineered with premium bike compatibility tracking algorithms.
          </p>
        </div>

        {/* Customer Utility Channels */}
        <div>
          <h4 className="font-heading font-bold text-deep-black tracking-widest text-sm uppercase mb-4">Store Navigation</h4>
          <ul className="flex flex-col gap-2 text-xs font-semibold">
            <li><Link to="/shop" className="hover:text-gold-dark transition-colors">Browse Riding Gear</Link></li>
            <li><Link to="/track" className="hover:text-gold-dark transition-colors">Track Order Without Login</Link></li>
            <li><Link to="/faq" className="hover:text-gold-dark transition-colors">Frequently Asked Questions</Link></li>
            <li><Link to="/about" className="hover:text-gold-dark transition-colors">Our Riding Story</Link></li>
          </ul>
        </div>

        {/* Compliance Legal Sub-pages */}
        <div>
          <h4 className="font-heading font-bold text-deep-black tracking-widest text-sm uppercase mb-4">Rider Safeguards</h4>
          <ul className="flex flex-col gap-2 text-xs font-semibold">
            <li><Link to="/privacy-policy" className="hover:text-gold-dark transition-colors">Privacy Statements</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-gold-dark transition-colors">Terms & Rules</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-gold-dark transition-colors">Shipping Operations</Link></li>
            <li><Link to="/return-refund-policy" className="hover:text-gold-dark transition-colors">7-Day Return Matrix</Link></li>
          </ul>
        </div>

        {/* Technical Support Helpdesk Contacts */}
        <div className="flex flex-col gap-3 text-xs font-semibold">
          <h4 className="font-heading font-bold text-deep-black tracking-widest text-sm uppercase mb-4">Helpdesk Terminal</h4>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gold-dark" />
            <a href="mailto:perfectmoto.accessories@gmail.com" className="hover:text-gold-dark transition-colors select-all">perfectmoto.accessories@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gold-dark" />
            <a href="tel:+918356968789" className="hover:text-gold-dark transition-colors select-all">+91 8356968789</a>
          </div>
          <div className="flex items-center gap-2 mt-2 border-t border-gray-400/40 pt-2">
            <ShieldCheck size={16} className="text-success-green" />
            <span className="text-[10px] tracking-wide uppercase font-bold text-deep-black">100% Secure Razorpay Checkout Gateway</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-400/40 pt-6 text-center text-[11px] tracking-wider uppercase font-heading font-bold text-deep-black/70">
        © {new Date().getFullYear()} Perfect Moto India. Built for Indian Riders. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
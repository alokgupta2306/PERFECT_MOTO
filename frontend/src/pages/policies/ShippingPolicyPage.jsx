import React from "react";
import { Truck, Clock, ShieldAlert, BadgeAlert } from "lucide-react";

const ShippingPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in font-body text-xs text-muted-gray select-none">
      
      {/* Page Header Layout Banner */}
      <div className="text-center mb-10 border-b border-border-dark pb-6">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
          <Truck size={22} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Shipping <span className="text-primary-gold">Logistics</span> Policy
        </h1>
        <p className="text-xs text-muted-gray mt-1">Fulfillment durations, delivery guarantees, and premium routing criteria.</p>
      </div>

      <div className="space-y-6 bg-card-dark border border-border-dark rounded-xl p-6 md:p-8 leading-relaxed font-medium uppercase font-heading">
        
        {/* 🔥 PATCH: Delivery Guarantee 7-Day Money-Back Policy Block Clause */}
        <section className="space-y-2 border-2 border-dashed border-primary-gold/40 bg-primary-gold/5 p-5 rounded-xl animate-fade-in">
          <h3 className="text-sm font-bold text-primary-gold tracking-wider flex items-center gap-2">
            <BadgeAlert size={16} className="animate-pulse shrink-0" />
            <span>Guaranteed 7-Day Express Delivery Promise</span>
          </h3>
          <p className="normal-case font-body font-light text-light-gray tracking-wide text-xs">
            Perfect Moto proudly operates on a strict delivery commitment structure. Every package is routed using expedited priority networks to hit your doorstep within 7 working days post-checkout. If your package is not successfully delivered within this 7-day threshold due to transport complications, you are automatically eligible to file for a full 100% money-back refund. Upon request, our financial desk returns your capital transaction straight to your original payment source within 3-5 business days.
          </p>
        </section>

        {/* Section 1: Dispatch Deadlines Layout */}
        <section className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-pure-white tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-primary-gold" />
            <span>1. Processing Matrix & Dispatch Timelines</span>
          </h3>
          <p className="normal-case font-body font-light text-muted-gray">
            Once Shiprocket's token infrastructure successfully authorizes payment logs, items pass an internal physical specification check before carrier hand-off. Standard warehouse processing takes 24 to 48 hours, after which live tracking references open for public tracing.
          </p>
        </section>

        {/* Section 2: Freight Charges Parameters Mapping */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-pure-white tracking-wider flex items-center gap-2">
            <Truck size={14} className="text-primary-gold" />
            <span>2. Regional Freight Charges Threshold</span>
          </h3>
          <p className="normal-case font-body font-light text-muted-gray">
            Perfect Moto channels all shipping through Shiprocket's premium express networks (including Delhivery, BlueDart, and DTDC). Orders exceeding a subtotal of ₹999 qualify for Free Shipping automatically. Transactions falling short of this baseline apply a flat ₹50 logistics and handling fee.
          </p>
        </section>

      </div>

      {/* Security Compliance Footer Ribbon */}
      <div className="flex items-center gap-2 text-[10px] text-muted-gray font-mono uppercase tracking-widest justify-center pt-8">
        <ShieldAlert size={12} className="text-primary-gold" /> 
        Verified Shiprocket Logistics Protection Clause Standard 2026
      </div>

    </div>
  );
};

export default ShippingPolicyPage;
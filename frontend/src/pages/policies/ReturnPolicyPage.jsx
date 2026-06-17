import React from "react";
import { RefreshCw, ClipboardCheck, ShieldAlert, AlertOctagon } from "lucide-react";

const ReturnPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in font-body text-xs text-muted-gray select-none">
      
      {/* Page Header Banner */}
      <div className="text-center mb-10 border-b border-border-dark pb-6">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
          <RefreshCw size={22} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Returns <span className="text-primary-gold">& Refunds</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Sizing verification workflows, non-delivery refund protections, and reversal windows.</p>
      </div>

      <div className="space-y-6 bg-card-dark border border-border-dark rounded-xl p-6 md:p-8 leading-relaxed font-medium uppercase font-heading">
        
        {/* 🔥 PATCH: Non-Delivery RTO Automatic Refund Policy Block Clause */}
        <section className="space-y-2 border-2 border-dashed border-error-red/40 bg-error-red/5 p-5 rounded-xl animate-fade-in">
          <h3 className="text-sm font-bold text-error-red tracking-wider flex items-center gap-2">
            <AlertOctagon size={16} className="animate-pulse shrink-0" />
            <span>Non-Delivery & RTO Auto-Refund Protection</span>
          </h3>
          <p className="normal-case font-body font-light text-light-gray tracking-wide text-xs">
            In transit scenarios where our logistics aggregator (Shiprocket) flags a package as permanently undelivered, lost in transit, or issues an automatic RTO (Return to Origin) due to unreachable shipping addresses, you are covered completely. The customer is entitled to an automatic full refund under our system rules. No password or login friction is required; your full prepaid transaction balance is reversed back to your initial payment route within 5 to 7 operational business days.
          </p>
        </section>

        {/* Section 1: Standard Returns Mapping */}
        <section className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-pure-white tracking-wider flex items-center gap-2">
            <RefreshCw size={14} className="text-primary-gold" />
            <span>1. 7-Day Mechanical Reversal Policy</span>
          </h3>
          <p className="normal-case font-body font-light text-muted-gray">
            We run a protective 7-day return and exchange window for helmets, touchscreen gloves, and slider guard configurations. This allows you to verify sizing fits and compatibility specs safely in your garage.
          </p>
        </section>

        {/* Section 2: Audit Criteria Mapping */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-pure-white tracking-wider flex items-center gap-2">
            <ClipboardCheck size={14} className="text-primary-gold" />
            <span>2. Inspection Criteria & Processing Windows</span>
          </h3>
          <p className="normal-case font-body font-light text-muted-gray">
            To clear return audits, items must be returned inside their original box templates with zero evidence of asphalt scuffs, impact stress patterns, or bolt mounting damage. Once passed, financial reversals settle back to your starting source route inside 5 to 7 operational days.
          </p>
        </section>

      </div>

      {/* Compliance Footer Ribbon */}
      <div className="flex items-center gap-2 text-[10px] text-muted-gray font-mono uppercase tracking-widest justify-center pt-8">
        <ShieldAlert size={12} className="text-primary-gold" /> 
        Verified Shiprocket Settlement Protection Clause Standard 2026
      </div>

    </div>
  );
};

export default ReturnPolicyPage;
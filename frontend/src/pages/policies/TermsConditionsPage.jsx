import React from "react";
import { Scale, AlertTriangle, AlertCircle } from "lucide-react";

const TermsConditionsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-10 border-b border-border-dark pb-6">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
          <Scale size={22} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Terms <span className="text-primary-gold">& Conditions</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">Operational governance, digital catalog parameters, and usage boundaries.</p>
      </div>

      <div className="space-y-6 bg-card-dark border border-border-dark rounded-xl p-6 md:p-8 text-xs text-muted-gray leading-relaxed font-medium">
        
        <section className="space-y-2">
          <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={14} className="text-primary-gold" />
            <span>1. Compatibility Matrix Boundary Disclaimer</span>
          </h3>
          <p>
            While our compatibility engine actively processes structural dimension metrics to evaluate hardware limits, fitment check badges act as high-probability verification guidelines. PerfectMoto is not responsible for installation mechanical updates executed without matching standard torque parameters or professional supervision.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={14} className="text-primary-gold" />
            <span>2. Promotional Voucher Applications Limit</span>
          </h3>
          <p>
            Promotional codes (such as introductory campaigns matching code 'WELCOME10') require a minimum checkout basket value of ₹999 to evaluate. Only single voucher redemptions apply per order stack; cross-stacking coupons with active loyalty voucher credits is restricted within our checkout calculations.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsConditionsPage;
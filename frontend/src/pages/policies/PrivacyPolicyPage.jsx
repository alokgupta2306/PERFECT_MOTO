import React from "react";
import { ShieldCheck, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in font-body">
      <div className="text-center mb-10 border-b border-border-dark pb-6">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide">
          Privacy <span className="text-primary-gold">Policy</span>
        </h1>
        <p className="text-xs text-muted-gray mt-1">
          Effective Date: June 11, 2026. Review our operational security protocols and encryption data boundaries.
        </p>
      </div>

      <div className="space-y-6 bg-card-dark border border-border-dark rounded-xl p-6 md:p-8 text-xs text-muted-gray leading-relaxed font-medium">
        
        <section className="space-y-2">
          <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wider flex items-center gap-2">
            <Eye size={14} className="text-primary-gold" />
            <span>1. Telemetry & Ride Data Harvest Profile</span>
          </h3>
          <p>
            When you interact with the PerfectMoto platform, we process specific hardware parameters to optimize safety. This includes storing your bike's manufacturer make, variant variant model profiles, and manufacturing batch years inside local persistent storage clusters to compute automated "100% Fit" fitment check badges.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wider flex items-center gap-2">
            <Lock size={14} className="text-primary-gold" />
            <span>2. Encryption & Financial Gateway Security</span>
          </h3>
          <p>
            All checkout financial settlement pipelines route directly through secure token networks managed via verified Razorpay AES-256 bit payment encryption protocol. PerfectMoto never retains, caches, or logs credit card metrics, net banking identifiers, or pin tokens within our backend database stacks.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-heading font-bold text-pure-white uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-primary-gold" />
            <span>3. Automated Notification Broadcast Channels</span>
          </h3>
          <p>
            By entering your mobile digits inside the checkout panel address registry or variants tracking waitlist modals, you authorize PerfectMoto to trigger automated transactional notification dispatches via WhatsApp networks regarding tracking references, restock updates, or receipt balances.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
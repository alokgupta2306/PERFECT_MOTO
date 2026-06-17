import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Wrench, Truck, Ticket, RefreshCw, Loader2 } from "lucide-react";
// FIXED: Sourced the central API network integration hub instance
import api from "../utils/api";

const FAQPage = () => {
  // FIXED: Set up dynamic array state structures to fetch FAQ collections directly off the server
  const [faqDatabase, setFaqDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local state tracking which atomic FAQ node is expanded using dynamic matrix coordinates
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get("/settings/faqs");
        if (res.data?.success && res.data?.faqs) {
          setFaqDatabase(res.data.faqs);
        }
      } catch (err) {
        console.error("Documentation server database fetch execution error:", err);
        setFaqDatabase([]); // Graceful fallback isolates component blocks from hard compilation crashes
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleAccordion = (indexToken) => {
    setExpandedIndex(expandedIndex === indexToken ? null : indexToken);
  };

  // Icon selector utility assigns brand iconography models safely according to dynamic category string tags
  const getCategoryIcon = (categoryName = "") => {
    const term = categoryName.toLowerCase();
    if (term.includes("fitment") || term.includes("garage")) return <Wrench size={14} className="text-primary-gold" />;
    if (term.includes("shipping") || term.includes("logistics")) return <Truck size={14} className="text-primary-gold" />;
    if (term.includes("voucher") || term.includes("referral") || term.includes("coupon")) return <Ticket size={14} className="text-primary-gold" />;
    return <RefreshCw size={14} className="text-primary-gold" />;
  };

  // FIXED: Integrated clean async rendering shields to prevent viewport flicker steps
  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>SYNCHRONIZING KNOWLEDGE BASE BLUEPRINTS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-10 animate-fade-in font-body text-xs text-muted-gray select-none">

      {/* Decorative Header Banner Section */}
      <div className="text-center mb-10">
        <div className="mx-auto h-12 w-12 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <HelpCircle size={22} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-pure-white uppercase tracking-wide leading-tight">
          Rider Support <span className="text-primary-gold">Knowledge</span> Base
        </h1>
        <p className="text-xs text-muted-gray mt-1 max-w-sm mx-auto font-medium">
          Review dynamic documentation breakdowns covering fitment guarantees, transaction safety, and return procedures.
        </p>
      </div>

      {/* Accordion Core Container Loop */}
      <div className="space-y-8">
        {faqDatabase.map((section, catIdx) => (
          <div key={catIdx} className="space-y-4">

            {/* Category Section Group Label Row */}
            <div className="flex items-center gap-2 px-1 border-b border-border-dark/40 pb-2 bg-deep-black/10">
              {getCategoryIcon(section.category)}
              <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-pure-white">
                {section.category}
              </h3>
            </div>

            {/* Questions Array Sub-Loop Rendering Layout */}
            <div className="space-y-3">
              {section.questions?.map((item, qIdx) => {
                // FIXED: Resolved dynamic mutation loops anti-pattern by assigning deterministic composite identity string coordinates keys
                const uniqueElementKey = `${catIdx}-${qIdx}`;
                const isExpanded = expandedIndex === uniqueElementKey;

                return (
                  <div
                    key={uniqueElementKey}
                    className={`bg-card-dark border rounded-xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? "border-primary-gold/40 shadow-gold-glow" : "border-border-dark hover:border-muted-gray"
                    }`}
                  >

                    {/* Expand Trigger Bar Button */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(uniqueElementKey)}
                      className="w-full p-4 flex justify-between items-center text-left gap-4 focus:outline-none select-none"
                    >
                      <h4 className={`text-xs font-heading font-bold uppercase tracking-wide transition-colors leading-relaxed ${
                        isExpanded ? "text-primary-gold" : "text-pure-white"
                      }`}>
                        {item.q}
                      </h4>
                      <span className="text-muted-gray shrink-0 transition-transform duration-200">
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </span>
                    </button>

                    {/* Content Body: Controlled Height Transition */}
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? "max-h-[300px] border-t border-border-dark/40 bg-deep-black/20" : "max-h-0"
                      }`}
                    >
                      <p className="p-4 text-xs text-muted-gray leading-relaxed font-medium normal-case">
                        {item.a}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQPage;
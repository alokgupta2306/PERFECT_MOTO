import React, { useState, useEffect } from "react";
import { ShieldCheck, Target, Award, Wrench, Loader2 } from "lucide-react";
// FIXED: Sourced the central API network utility handler instance
import api from "../utils/api";

const About = () => {
  // FIXED: Replaced static title text strings with dynamic server state hooks
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.success && res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("About page settings data pool synchronization failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-gray font-heading text-xs tracking-widest gap-3 select-none">
        <Loader2 size={24} className="animate-spin text-primary-gold" />
        <span>SYNCHRONIZING BRAND CONFIGURATIONS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-12 space-y-12 animate-fade-in text-xs font-body text-muted-gray select-none">
      
      {/* Hero Header Node */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-primary-gold bg-primary-gold/10 border border-primary-gold/20 px-2.5 py-1 rounded-md w-fit mx-auto block">
          Chassis-Aligned Performance Gear
        </span>
        {/* FIXED: Substituted hardcoded brand titles with dynamic settings parameters from the server */}
        <h1 className="text-2xl md:text-4xl font-heading font-bold text-pure-white uppercase tracking-wide leading-tight">
          {settings?.siteName || "The PerfectMoto Project"}
        </h1>
        <p className="text-xs leading-relaxed font-medium normal-case max-w-xl mx-auto">
          {settings?.tagline || "We are motorcycle hardware specialists building the bridge between premium defensive equipment and precise Indian chassis mechanical layouts."}
        </p>
      </div>

      <hr className="border-border-dark/60" />

      {/* Corporate Philosophy Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3 shadow-md">
          <div className="h-9 w-9 bg-deep-black border border-border-dark text-primary-gold flex items-center justify-center rounded-lg shadow-inner">
            <Target size={16} />
          </div>
          <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-pure-white">
            Our Mission Matrix
          </h3>
          <p className="leading-relaxed font-medium normal-case">
            To eliminate standard aftermarket gear guessing games entirely. By pairing custom equipment indexes directly with algorithmic fitment databases, we guarantee every impact slider, helmet shell, and engine panel matches your motorcycle’s structural variables on arrival.
          </p>
        </div>

        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3 shadow-md">
          <div className="h-9 w-9 bg-deep-black border border-border-dark text-primary-gold flex items-center justify-center rounded-lg shadow-inner">
            <ShieldCheck size={16} />
          </div>
          <h3 className="font-heading font-bold uppercase tracking-wide text-xs text-pure-white">
            Compliance Standards
          </h3>
          <p className="leading-relaxed font-medium normal-case">
            Every safety asset loaded onto our platform passes independent testing constraints. We track real-world telemetry and structural impact limits to ensure your gear carries certified ISI, ECE, or DOT compliance parameters before leaving the warehouse.
          </p>
        </div>
      </div>

      {/* Core Operational Pillar Highlights */}
      <div className="bg-deep-black border border-border-dark p-6 rounded-xl space-y-4 shadow-sm">
        <h3 className="font-heading font-bold uppercase tracking-wider text-xs text-primary-gold text-center">
          Our Operational Benchmarks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 border border-border-dark/40 bg-card-dark/20 rounded-lg transition-colors hover:border-border-dark">
            <Wrench size={16} className="text-muted-gray mx-auto mb-1.5" />
            <span className="font-heading font-bold uppercase text-[10px] text-pure-white block">Precision Testing</span>
            <span className="text-[11px] text-muted-gray/70 block mt-0.5 normal-case font-medium">Chassis-mapped integration indexes</span>
          </div>
          <div className="p-3 border border-border-dark/40 bg-card-dark/20 rounded-lg transition-colors hover:border-border-dark">
            <Award size={16} className="text-muted-gray mx-auto mb-1.5" />
            <span className="font-heading font-bold uppercase text-[10px] text-pure-white block">Genuine Sourcing</span>
            <span className="text-[11px] text-muted-gray/70 block mt-0.5 normal-case font-medium">100% verified OEM components</span>
          </div>
          <div className="p-3 border border-border-dark/40 bg-card-dark/20 rounded-lg transition-colors hover:border-border-dark">
            <ShieldCheck size={16} className="text-muted-gray mx-auto mb-1.5" />
            <span className="font-heading font-bold uppercase text-[10px] text-pure-white block">Secure Logistics</span>
            <span className="text-[11px] text-muted-gray/70 block mt-0.5 normal-case font-medium">Insured freight protection filters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
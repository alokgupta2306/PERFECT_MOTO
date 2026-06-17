import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const BikeCompatibility = ({ productCompatibleBikes = [], activeGarageBike = null }) => {
  
  // Handlers state block: Inform user to pin an item if active filtration machine is empty
  if (!activeGarageBike) {
    return (
      <div className="bg-deep-black border border-border-dark p-4 rounded-xl flex items-start gap-3 select-none animate-fade-in">
        <AlertCircle size={16} className="text-primary-gold shrink-0 mt-0.5" />
        <div className="text-[11px] leading-tight">
          <span className="text-pure-white font-heading font-bold uppercase tracking-wide block">
            Fitment Checking Dormant
          </span>
          <p className="text-muted-gray mt-0.5 normal-case font-medium">
            Please map a motorcycle inside your Garage profile hub to automate sitewide component verification checks.
          </p>
        </div>
      </div>
    );
  }

  // FIXED: Upgraded match evaluation parameters to strictly analyze calendar production threshold boundaries (yearFrom / yearTo)
  const matches = productCompatibleBikes.some((bike) => {
    const isBrandMatch = bike.brand?.toLowerCase() === activeGarageBike.brand?.toLowerCase();
    const isModelMatch = bike.model?.toLowerCase() === activeGarageBike.model?.toLowerCase();
    
    // Algorithmic fallback evaluation metrics: If database constraints are unbound, trust the general model pairing
    const bikeYear = Number(activeGarageBike.year);
    const minProductionYear = bike.yearFrom ? Number(bike.yearFrom) : null;
    const maxProductionYear = bike.yearTo ? Number(bike.yearTo) : null;

    const isWithinYearRange = 
      (!minProductionYear || bikeYear >= minProductionYear) && 
      (!maxProductionYear || bikeYear <= maxProductionYear);

    return isBrandMatch && isModelMatch && isWithinYearRange;
  });

  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 transition-all duration-300 select-none animate-fade-in ${
      matches 
        ? "bg-success-green/5 border-success-green/20 hover:border-success-green/40 shadow-sm" 
        : "bg-error-red/5 border-error-red/20 hover:border-error-red/40"
    }`}>
      {matches ? (
        <>
          <CheckCircle2 size={16} className="text-success-green shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="text-success-green font-heading font-bold uppercase tracking-wide block">
              100% Fit Verified
            </span>
            <p className="text-muted-gray mt-0.5 normal-case font-medium leading-relaxed">
              This accessory matches the mounting chassis variables for your active{" "}
              <span className="text-pure-white font-semibold font-mono bg-deep-black border border-border-dark/60 px-1.5 py-0.5 rounded text-[10px]">
                {activeGarageBike.brand} {activeGarageBike.model} ({activeGarageBike.year})
              </span>.
            </p>
          </div>
        </>
      ) : (
        <>
          <XCircle size={16} className="text-error-red shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="text-error-red font-heading font-bold uppercase tracking-wide block">
              Chassis Mismatch Alert
            </span>
            <p className="text-muted-gray mt-0.5 normal-case font-medium leading-relaxed">
              Physical dimensions differ from your active{" "}
              <span className="text-pure-white font-semibold font-mono bg-deep-black border border-border-dark/60 px-1.5 py-0.5 rounded text-[10px]">
                {activeGarageBike.brand} {activeGarageBike.model} ({activeGarageBike.year})
              </span> parameters. Installation may require modification.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BikeCompatibility;
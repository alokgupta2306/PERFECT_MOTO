import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, increment, isPositive = true, icon }) => {
  return (
    <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center justify-between shadow-md relative overflow-hidden">
      <div className="space-y-2">
        <span className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-muted-gray block">{title}</span>
        <h3 className="text-xl font-mono font-bold text-pure-white tracking-tight">{value}</h3>
        
        <div className={`flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider ${
          isPositive ? "text-success-green" : "text-error-red"
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{increment} <span className="text-muted-gray font-normal lowercase">vs prev index</span></span>
        </div>
      </div>

      <div className="h-11 w-11 bg-deep-black border border-border-dark/60 rounded-xl flex items-center justify-center text-primary-gold shrink-0">
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
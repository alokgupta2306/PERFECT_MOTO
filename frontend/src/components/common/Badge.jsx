import React from "react";

const Badge = ({ children, variant = "neutral", className = "" }) => {
  const baseStyles = "inline-flex items-center gap-1 text-[9px] font-heading font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border font-bold";
  
  const styles = {
    neutral: "bg-deep-black border-border-dark text-muted-gray",
    gold: "bg-primary-gold/10 border-primary-gold/20 text-primary-gold",
    success: "bg-success-green/10 border-success-green/20 text-success-green",
    warning: "bg-warning-amber/10 border-warning-amber/20 text-warning-amber",
    danger: "bg-error-red/10 border-error-red/20 text-error-red"
  };

  return (
    <span className={`${baseStyles} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
import React from "react";
import Loader from "./Loader";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  disabled = false, 
  className = "", 
  iconBefore, 
  iconAfter, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider rounded-lg transition-all duration-200 select-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary-gold hover:bg-gold-hover text-deep-black shadow-md shadow-primary-gold/10",
    secondary: "bg-card-dark hover:bg-deep-black text-pure-white border border-border-dark hover:border-muted-gray",
    danger: "bg-error-red/10 hover:bg-error-red text-error-red hover:text-pure-white border border-error-red/20",
    ghost: "bg-transparent hover:bg-card-dark text-muted-gray hover:text-pure-white"
  };

  const sizes = {
    sm: "h-8 px-3 text-[10px]",
    md: "h-11 px-5 text-xs",
    lg: "h-13 px-7 text-sm"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader size="sm" className="mr-2 text-current" />
      ) : iconBefore ? (
        <span className="mr-1.5 shrink-0">{iconBefore}</span>
      ) : null}
      
      <span className="pt-0.5">{children}</span>
      
      {!isLoading && iconAfter && <span className="ml-1.5 shrink-0">{iconAfter}</span>}
    </button>
  );
};

export default Button;
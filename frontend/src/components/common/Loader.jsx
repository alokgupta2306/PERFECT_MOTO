import React from "react";

const Loader = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-primary-gold border-r-transparent border-b-border-dark border-l-transparent ${sizeClasses[size]}`} 
        style={{ animationDuration: '0.6s' }}
      />
    </div>
  );
};

export default Loader;
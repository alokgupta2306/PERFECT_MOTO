import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-card-dark border border-border-dark rounded-xl text-center space-y-5 shadow-2xl animate-fade-in text-xs font-body text-muted-gray">
      <div className="h-12 w-12 bg-error-red/10 text-error-red border border-error-red/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <ShieldAlert size={22} />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-lg font-heading font-bold text-pure-white uppercase tracking-wider">
          Route Out of Bounds
        </h2>
        <p className="text-xs leading-relaxed font-medium normal-case">
          The tracking URL string context link you input points to an unallocated frontend node directory location.
        </p>
      </div>

      <hr className="border-border-dark/40" />

      <button
        onClick={() => navigate("/")}
        className="w-full h-11 bg-primary-gold hover:bg-gold-hover text-deep-black font-heading font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
      >
        <ArrowLeft size={14} />
        <span>Return To Home Terminal</span>
      </button>
    </div>
  );
};

export default NotFound;